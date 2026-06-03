import { describe, expect, it } from 'vitest'

import type { PortableTextBlock } from './wp-body'

import { wpPageToService } from './wp-service'

/** Flatten step blocks back to plain text — to assert the prose is kept verbatim. */
const text = (blocks: PortableTextBlock[]) =>
  blocks.map((b) => b.children.map((c) => c.text).join('')).join('\n')

// A 2012-era WordPress service page as the REST API returns it: entity-encoded
// title, an excerpt with a "[…]" read-more tail, and a body carrying inline
// <style>, a [gallery] shortcode and an embedded upload <img>.
const wpPage = {
  slug: 'sanacija-betona',
  // WP returns raw UTF-8 for Slovenian letters; only a few specials are entity-encoded.
  title: { rendered: 'Sanacija betona &amp; čiščenje' },
  excerpt: {
    rendered: '<p>Sanacija betonskih površin z vrvno tehniko. [&hellip;]</p>',
  },
  content: {
    rendered: [
      '<style type="text/css">.gallery { margin: 0 auto; }</style>',
      '<h2>Postopek sanacije</h2>',
      '<p>Najprej pregledamo betonsko površino in odstranimo nevezane delce.</p>',
      '[gallery ids="11,12"]',
      '<p><img src="https://letecekele.si/wp-content/uploads/2013/06/beton.jpg" alt="Sanacija betona" /></p>',
      '<p>Nato nanesemo zaščitni premaz.</p>',
    ].join('\n'),
  },
}

describe('wpPageToService', () => {
  it('maps a WordPress service page to a stable, seedable service document', () => {
    const doc = wpPageToService(wpPage, 2)

    expect(doc._id).toBe('service.sanacija-betona')
    expect(doc._type).toBe('service')
    expect(doc.slug).toEqual({ _type: 'slug', current: 'sanacija-betona' })
    expect(doc.order).toBe(2)
  })

  it('decodes the entity-encoded title', () => {
    // Note: &scaron; is "š" — Slovenian copy must survive entity-decoding intact.
    expect(wpPageToService(wpPage, 0).title).toBe('Sanacija betona & čiščenje')
  })

  it('derives the short description from the excerpt, dropping the read-more tail', () => {
    expect(wpPageToService(wpPage, 0).description).toBe(
      'Sanacija betonskih površin z vrvno tehniko.',
    )
  })

  it('keeps the Slovenian process prose verbatim as ordered steps, dropping 2012 junk', () => {
    const { steps } = wpPageToService(wpPage, 0)

    expect(text(steps)).toBe(
      [
        'Postopek sanacije',
        'Najprej pregledamo betonsko površino in odstranimo nevezane delce.',
        'Nato nanesemo zaščitni premaz.',
      ].join('\n'),
    )
    expect(steps[0].style).toBe('h2') // heading stays a heading block
    const json = JSON.stringify(steps)
    expect(json).not.toContain('gallery')
    expect(json).not.toContain('margin')
    expect(json).not.toContain('<img')
  })

  it('lifts the first embedded upload as the representative photo URL', () => {
    expect(wpPageToService(wpPage, 0).photoUrl).toBe(
      'https://letecekele.si/wp-content/uploads/2013/06/beton.jpg',
    )
  })

  it('falls back to the first body paragraph (skipping a leading heading) when there is no excerpt', () => {
    const noExcerpt = { ...wpPage, excerpt: undefined }
    // The body opens with an <h2>; the card description must skip the heading and use
    // the first real paragraph rather than echoing the section title.
    expect(wpPageToService(noExcerpt, 0).description).toBe(
      'Najprej pregledamo betonsko površino in odstranimo nevezane delce.',
    )
  })
})
