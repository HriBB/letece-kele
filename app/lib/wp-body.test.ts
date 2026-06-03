import { describe, expect, it } from 'vitest'

import { cleanWpBody } from './wp-body'

import type { PortableTextBlock } from './wp-body'

/** Flatten a block's spans back to plain text — for asserting prose is verbatim. */
const text = (blocks: PortableTextBlock[]) =>
  blocks.map((b) => b.children.map((c) => c.text).join('')).join('\n')

describe('cleanWpBody — strips 2012 formatting junk', () => {
  it('drops inline <style> blocks but keeps the surrounding Slovenian prose verbatim', () => {
    const html = [
      '<style type="text/css">.gallery { margin: 0 auto; } p { color: red; }</style>',
      '<p>Sanacija betonske fasade na zahtevni lokaciji.</p>',
    ].join('\n')

    const { portableText } = cleanWpBody(html)

    expect(text(portableText)).toBe('Sanacija betonske fasade na zahtevni lokaciji.')
    // no CSS leaked into the prose
    expect(JSON.stringify(portableText)).not.toContain('margin')
    expect(JSON.stringify(portableText)).not.toContain('color: red')
  })

  it('drops [gallery] shortcodes (bare and with attributes) without touching the prose', () => {
    const html = [
      '<p>Pred sanacijo.</p>',
      '[gallery ids="12,34,56" columns="3"]',
      '<p>Po sanaciji.</p>',
      '[gallery]',
    ].join('\n')

    const { portableText } = cleanWpBody(html)

    expect(text(portableText)).toBe('Pred sanacijo.\nPo sanaciji.')
    expect(JSON.stringify(portableText)).not.toContain('gallery')
    expect(JSON.stringify(portableText)).not.toContain('ids=')
  })
})

describe('cleanWpBody — lifts embedded images into the gallery', () => {
  it('moves every <img> into the gallery (src + alt) in document order, leaving none inline', () => {
    const html = [
      '<p>Uvod.</p>',
      '<p><img src="https://letecekele.si/wp-content/uploads/2013/06/jez1.jpg" alt="Jez Sveta Petka" /></p>',
      '<p>Med projektom.</p>',
      '<img class="size-full" src="https://letecekele.si/wp-content/uploads/2013/06/jez2.jpg" alt="" />',
    ].join('\n')

    const { portableText, gallery } = cleanWpBody(html)

    expect(gallery).toEqual([
      { src: 'https://letecekele.si/wp-content/uploads/2013/06/jez1.jpg', alt: 'Jez Sveta Petka' },
      { src: 'https://letecekele.si/wp-content/uploads/2013/06/jez2.jpg', alt: '' },
    ])
    // prose survives, but no image markup leaks into it
    expect(text(portableText)).toBe('Uvod.\nMed projektom.')
    expect(JSON.stringify(portableText)).not.toContain('<img')
    expect(JSON.stringify(portableText)).not.toContain('uploads')
  })

  it('returns an empty gallery when the body has no images', () => {
    expect(cleanWpBody('<p>Brez slik.</p>').gallery).toEqual([])
  })
})

describe('cleanWpBody — converts prose to Portable Text, Slovenian verbatim', () => {
  it('keeps headings as heading blocks and paragraphs as normal blocks, preserving the č/š/ž copy', () => {
    const html = [
      '<h2>Sanacija betonske fasade</h2>',
      '<p>Sredi Ljubljane, natančneje v Prulah — sanacija večstanovanjskega bloka.</p>',
      '<p>Delo je potekalo s pomočjo vrvne tehnike in visečih odrov.</p>',
    ].join('\n')

    const { portableText } = cleanWpBody(html)

    expect(portableText).toEqual([
      {
        _type: 'block',
        _key: 'b0',
        style: 'h2',
        markDefs: [],
        children: [{ _type: 'span', _key: 's0', text: 'Sanacija betonske fasade', marks: [] }],
      },
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 's1',
            text: 'Sredi Ljubljane, natančneje v Prulah — sanacija večstanovanjskega bloka.',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'b2',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 's2',
            text: 'Delo je potekalo s pomočjo vrvne tehnike in visečih odrov.',
            marks: [],
          },
        ],
      },
    ])
  })

  it('strips inline formatting tags but keeps their words, and decodes entities', () => {
    const html =
      '<p>Projekt <strong>Preglov trg&nbsp;10</strong> &#8212; beton &amp; fasada, <em>140 enot</em>.</p>'

    const { portableText } = cleanWpBody(html)

    expect(portableText[0].children[0].text).toBe('Projekt Preglov trg 10 — beton & fasada, 140 enot.')
    // no inline markup leaked
    expect(portableText[0].children[0].text).not.toContain('<strong>')
  })

  it('handles the whole 2012 mess at once — style + gallery + images + prose', () => {
    const html = [
      '<style>.gallery-item { float: left; }</style>',
      '<h2>Jez Sveta Petka</h2>',
      '<p>Nenavaden klic sredi dopusta — specialna višinska dela na jezu.</p>',
      '[gallery ids="101,102"]',
      '<p><img src="https://letecekele.si/wp-content/uploads/2013/06/jez.jpg" alt="Jez" /></p>',
      '<p>Vrnili smo se domov zadovoljni.</p>',
    ].join('\n')

    const { portableText, gallery } = cleanWpBody(html)

    expect(text(portableText)).toBe(
      'Jez Sveta Petka\nNenavaden klic sredi dopusta — specialna višinska dela na jezu.\nVrnili smo se domov zadovoljni.',
    )
    expect(portableText[0].style).toBe('h2')
    expect(gallery).toEqual([
      { src: 'https://letecekele.si/wp-content/uploads/2013/06/jez.jpg', alt: 'Jez' },
    ])
  })

  it('returns empty output for empty / nullish input', () => {
    expect(cleanWpBody('')).toEqual({ portableText: [], gallery: [] })
    expect(cleanWpBody(null)).toEqual({ portableText: [], gallery: [] })
    expect(cleanWpBody(undefined)).toEqual({ portableText: [], gallery: [] })
  })
})
