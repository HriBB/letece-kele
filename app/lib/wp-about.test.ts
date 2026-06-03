import { describe, expect, it } from 'vitest'

import type { PortableTextBlock } from './wp-body'

import { wpPagesToAbout } from './wp-about'

/** Flatten body blocks back to plain text — to assert the prose is kept verbatim. */
const text = (blocks: PortableTextBlock[]) =>
  blocks.map((b) => b.children.map((c) => c.text).join('')).join('\n')

// The old site spread the company story across thin stub pages. These are 2012-era
// WordPress pages as the REST API returns it: the o-podjetju lead (entity-encoded
// title, an excerpt with a "[…]" read-more tail, a body with inline <style> and an
// embedded upload <img>), plus the vizija and kvaliteta stubs.
const oPodjetju = {
  slug: 'o-podjetju',
  title: { rendered: 'O podjetju &amp; ekipi' },
  excerpt: { rendered: '<p>Smo ekipa alpinistov za višinska dela. [&hellip;]</p>' },
  content: {
    rendered: [
      '<style type="text/css">.gallery { margin: 0 auto; }</style>',
      '<p>Leteče Kele izvajamo višinska dela z alpinistično vrvno tehniko.</p>',
      '<p><img src="https://letecekele.si/wp-content/uploads/2012/01/ekipa.jpg" alt="Ekipa" /></p>',
    ].join('\n'),
  },
}

const vizija = {
  slug: 'vizija',
  title: { rendered: 'Vizija' },
  excerpt: { rendered: '' },
  content: { rendered: '<p>Naša vizija je kakovostna izvedba na višini.</p>' },
}

const kvaliteta = {
  slug: 'kvaliteta',
  title: { rendered: 'Kvaliteta' },
  excerpt: { rendered: '' },
  content: { rendered: '<p>Delo opravimo natančno in varno.</p>' },
}

// The alpinist "why we work at height" credibility story — a capability framing the
// seed authors and folds in (the personal climbing trip reports are NOT migrated).
const alpinizem = {
  slug: 'alpinizem',
  title: { rendered: 'Zakaj delamo na višini' },
  excerpt: { rendered: '' },
  content: {
    rendered:
      '<p>Smo izurjeni alpinisti, zato dostopamo do težko dostopnih mest brez gradbenih odrov.</p>',
  },
}

const pages = [oPodjetju, vizija, kvaliteta, alpinizem]

describe('wpPagesToAbout', () => {
  it('merges the pages into the stable aboutPage singleton', () => {
    const doc = wpPagesToAbout(pages)

    expect(doc._id).toBe('aboutPage')
    expect(doc._type).toBe('aboutPage')
  })

  it('takes the page title from the first (o-podjetju) page, entity-decoded', () => {
    expect(wpPagesToAbout(pages).title).toBe('O podjetju & ekipi')
  })

  it('derives the intro from the first page excerpt, dropping the read-more tail', () => {
    expect(wpPagesToAbout(pages).intro).toBe(
      'Smo ekipa alpinistov za višinska dela.',
    )
  })

  it('merges every page into one coherent body, Slovenian prose verbatim, 2012 junk dropped', () => {
    const { body } = wpPagesToAbout(pages)

    // The first page is the lead (its title is the H1, so no injected heading); each
    // later stub page opens with its title as a section heading.
    expect(text(body)).toBe(
      [
        'Leteče Kele izvajamo višinska dela z alpinistično vrvno tehniko.',
        'Vizija',
        'Naša vizija je kakovostna izvedba na višini.',
        'Kvaliteta',
        'Delo opravimo natančno in varno.',
        'Zakaj delamo na višini',
        'Smo izurjeni alpinisti, zato dostopamo do težko dostopnih mest brez gradbenih odrov.',
      ].join('\n'),
    )

    const json = JSON.stringify(body)
    expect(json).not.toContain('gallery')
    expect(json).not.toContain('margin')
    expect(json).not.toContain('<img')
    expect(json).not.toContain('<style')
  })

  it('delineates the merged stub pages with section headings, but never the lead page', () => {
    const { body } = wpPagesToAbout(pages)

    // The lead opens with prose, not an injected "O podjetju" heading.
    expect(body[0].style).toBe('normal')

    const sectionHeadings = body
      .filter((b) => b.style === 'h2')
      .map((b) => b.children.map((c) => c.text).join(''))
    expect(sectionHeadings).toEqual([
      'Vizija',
      'Kvaliteta',
      'Zakaj delamo na višini',
    ])
  })

  it('folds in the alpinist credibility story as a section', () => {
    const { body } = wpPagesToAbout(pages)
    expect(text(body)).toContain('Smo izurjeni alpinisti')
  })

  it('merges only the pages it is given — no personal trip reports leak in', () => {
    // Drop the alpinist section: its content must disappear, proving the merge is a
    // pure function of its inputs (the seed, not this mapper, decides what is sourced).
    const { body } = wpPagesToAbout([oPodjetju, vizija, kvaliteta])
    expect(text(body)).not.toContain('Smo izurjeni alpinisti')
    const sectionHeadings = body
      .filter((b) => b.style === 'h2')
      .map((b) => b.children.map((c) => c.text).join(''))
    expect(sectionHeadings).toEqual(['Vizija', 'Kvaliteta'])
  })

  it('lifts the first embedded image across the pages as the hero photo URL', () => {
    expect(wpPagesToAbout(pages).heroUrl).toBe(
      'https://letecekele.si/wp-content/uploads/2012/01/ekipa.jpg',
    )
  })

  it('re-keys the merged blocks so every _key is unique (Sanity array invariant)', () => {
    const { body } = wpPagesToAbout(pages)

    const keys = [
      ...body.map((b) => b._key),
      ...body.flatMap((b) => b.children.map((c) => c._key)),
    ]
    expect(new Set(keys).size).toBe(keys.length)
  })
})
