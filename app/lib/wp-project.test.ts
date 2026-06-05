import { describe, expect, it } from 'vitest'

import type { PortableTextBlock, PortableTextNode } from './wp-body'

import { wpPostToProject } from './wp-project'

const isBlock = (b: PortableTextNode): b is PortableTextBlock => b._type === 'block'

/** Flatten body text/list blocks back to plain text (inline figures ignored). */
const text = (blocks: PortableTextNode[]) =>
  blocks
    .filter(isBlock)
    .map((b) => b.children.map((c) => c.text).join(''))
    .join('\n')

// A 2012-era WordPress "projekti" post as the REST API returns it: a published
// date (→ year), entity-encoded title, an excerpt with a "[…]" read-more tail,
// and a body carrying inline <style>, a [gallery] shortcode and embedded upload
// <img>s — a full case-study post.
const wpPost = {
  slug: 'preglov-trg-10',
  date: '2013-06-18T10:00:00',
  title: { rendered: 'Preglov trg 10 &amp; okolica' },
  excerpt: {
    rendered: '<p>Sanacija fasade večstanovanjskega bloka. [&hellip;]</p>',
  },
  content: {
    rendered: [
      '<style type="text/css">.gallery { margin: 0 auto; }</style>',
      '<h2>Preglov trg 10</h2>',
      '<p>Sredi Fužin — sanacija betonske fasade s pomočjo vrvne tehnike.</p>',
      '[gallery ids="11,12"]',
      '<p><img src="https://letecekele.si/wp-content/uploads/2013/06/preglov1.jpg" alt="Preglov trg" /></p>',
      '<p>Delo je potekalo brez gradbenih odrov.</p>',
    ].join('\n'),
  },
}

describe('wpPostToProject', () => {
  it('maps a WordPress projekti post to a stable, seedable project document', () => {
    const doc = wpPostToProject(wpPost, 3)

    expect(doc._id).toBe('project.preglov-trg-10')
    expect(doc._type).toBe('project')
    expect(doc.slug).toEqual({ _type: 'slug', current: 'preglov-trg-10' })
    expect(doc.order).toBe(3)
  })

  it('decodes the entity-encoded title', () => {
    expect(wpPostToProject(wpPost, 0).title).toBe('Preglov trg 10 & okolica')
  })

  // WP titles are ALL CAPS; the site wants sentence-case Slovenian (CONTEXT.md).
  it('sentence-cases an ALL-CAPS title', () => {
    const post = { ...wpPost, title: { rendered: 'PREGLOV TRG 10' } }
    expect(wpPostToProject(post, 0).title).toBe('Preglov trg 10')
  })

  it('leaves a mixed-case title untouched', () => {
    const post = { ...wpPost, title: { rendered: 'Preglov trg 10' } }
    expect(wpPostToProject(post, 0).title).toBe('Preglov trg 10')
  })

  it('uses the proper-noun override instead of naive sentence-casing', () => {
    const post = {
      ...wpPost,
      slug: 'terme-olimia',
      title: { rendered: 'TERME OLIMIA' },
    }
    // naive sentence-casing would produce "Terme olimia" — the brand keeps its cap
    expect(wpPostToProject(post, 0).title).toBe('Terme Olimia')
  })

  it('keeps the surname capitalised via the override (Ulica bratov Učakar)', () => {
    const post = {
      ...wpPost,
      slug: 'ul-bratov-ucakar',
      title: { rendered: 'ULICA BRATOV UČAKAR 44–46' },
    }
    expect(wpPostToProject(post, 0).title).toBe('Ulica bratov Učakar 44–46')
  })

  it('derives the year from the post publication date', () => {
    expect(wpPostToProject(wpPost, 0).year).toBe(2013)
  })

  it('derives the short summary from the excerpt, dropping the read-more tail', () => {
    expect(wpPostToProject(wpPost, 0).summary).toBe(
      'Sanacija fasade večstanovanjskega bloka.',
    )
  })

  it('keeps the Slovenian case-study prose verbatim as the body, dropping 2012 junk', () => {
    const { body } = wpPostToProject(wpPost, 0)

    expect(text(body)).toBe(
      [
        'Preglov trg 10',
        'Sredi Fužin — sanacija betonske fasade s pomočjo vrvne tehnike.',
        'Delo je potekalo brez gradbenih odrov.',
      ].join('\n'),
    )
    const head = body[0]
    expect(head._type === 'block' && head.style).toBe('h2') // heading stays a heading block
    const json = JSON.stringify(body)
    expect(json).not.toContain('gallery')
    expect(json).not.toContain('margin')
    expect(json).not.toContain('<img')
  })

  it('lifts [gallery] and embedded images into the gallery, leaving none inline in the body', () => {
    expect(wpPostToProject(wpPost, 0).galleryUrls).toEqual([
      {
        src: 'https://letecekele.si/wp-content/uploads/2013/06/preglov1.jpg',
        alt: 'Preglov trg',
      },
    ])
  })

  it('falls back to the first body paragraph (skipping a leading heading) when there is no excerpt', () => {
    const noExcerpt = { ...wpPost, excerpt: undefined }
    // Body opens with an <h2>; the summary must skip it and use the first paragraph,
    // not repeat the project title as both heading and summary.
    expect(wpPostToProject(noExcerpt, 0).summary).toBe(
      'Sredi Fužin — sanacija betonske fasade s pomočjo vrvne tehnike.',
    )
  })

  // ADR 0003 — one type, two depths: a caption-only "Reference"-style post has no
  // case-study prose, so it seeds a project with an empty body but a full gallery,
  // which the detail route renders as a reference card rather than a case study.
  it('seeds a gallery-only post with an empty body and a populated gallery', () => {
    const galleryOnly = {
      slug: 'ulica-bratov-ucakar',
      date: '2012-09-01T08:00:00',
      title: { rendered: 'Ulica bratov Učakar' },
      excerpt: { rendered: '' },
      content: {
        rendered: [
          '<p><img src="https://letecekele.si/wp-content/uploads/2012/09/ucakar1.jpg" alt="Ulica bratov Učakar" /></p>',
          '<p><img src="https://letecekele.si/wp-content/uploads/2012/09/ucakar2.jpg" alt="" /></p>',
        ].join('\n'),
      },
    }

    const doc = wpPostToProject(galleryOnly, 0)

    // ADR 0003 — gallery-only: the body carries no prose, only inline figure nodes,
    // so the detail route renders it as a reference card (not a case study).
    expect(doc.body.filter(isBlock)).toEqual([])
    expect(doc.body.every((b) => b._type === 'figure')).toBe(true)
    expect(doc.galleryUrls).toEqual([
      {
        src: 'https://letecekele.si/wp-content/uploads/2012/09/ucakar1.jpg',
        alt: 'Ulica bratov Učakar',
      },
      {
        src: 'https://letecekele.si/wp-content/uploads/2012/09/ucakar2.jpg',
        alt: '',
      },
    ])
  })
})
