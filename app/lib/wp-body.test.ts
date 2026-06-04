import { describe, expect, it } from 'vitest'

import type { PortableTextBlock, PortableTextNode } from './wp-body'

import { cleanWpBody } from './wp-body'

const isBlock = (b: PortableTextNode): b is PortableTextBlock => b._type === 'block'

/** Flatten text/list blocks back to plain prose (inline figures contribute nothing). */
const text = (blocks: PortableTextNode[]) =>
  blocks
    .filter(isBlock)
    .map((b) => b.children.map((c) => c.text).join(''))
    .join('\n')

describe('cleanWpBody — strips 2012 formatting junk', () => {
  it('drops inline <style> blocks but keeps the surrounding Slovenian prose verbatim', () => {
    const html = [
      '<style type="text/css">.gallery { margin: 0 auto; } p { color: red; }</style>',
      '<p>Sanacija betonske fasade na zahtevni lokaciji.</p>',
    ].join('\n')

    const { portableText } = cleanWpBody(html)

    expect(text(portableText)).toBe(
      'Sanacija betonske fasade na zahtevni lokaciji.',
    )
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
      {
        src: 'https://letecekele.si/wp-content/uploads/2013/06/jez1.jpg',
        alt: 'Jez Sveta Petka',
      },
      { src: 'https://letecekele.si/wp-content/uploads/2013/06/jez2.jpg', alt: '' },
    ])
    // prose survives, and no raw <img> markup leaks anywhere
    expect(text(portableText)).toBe('Uvod.\nMed projektom.')
    expect(JSON.stringify(portableText)).not.toContain('<img')
  })

  it('also keeps each image inline as a figure node, in document order', () => {
    const html = [
      '<p>Uvod.</p>',
      '<p><img src="https://letecekele.si/wp-content/uploads/2013/06/jez1.jpg" alt="Jez" /></p>',
      '<p>Med projektom.</p>',
    ].join('\n')

    const { portableText } = cleanWpBody(html)

    expect(portableText.map((b) => b._type)).toEqual(['block', 'figure', 'block'])
    expect(portableText[1]).toEqual({
      _type: 'figure',
      _key: 'b1',
      url: 'https://letecekele.si/wp-content/uploads/2013/06/jez1.jpg',
      alt: 'Jez',
    })
  })

  it('returns an empty gallery when the body has no images', () => {
    expect(cleanWpBody('<p>Brez slik.</p>').gallery).toEqual([])
  })

  it('lifts [gallery] thumbnails to the full-size original, leaving full-size srcs untouched', () => {
    const html = [
      // classic [gallery] expansion: a -120x120 / -150x150 thumbnail (any extension)
      '<a href="https://letecekele.si/2018/03/01/terme-olimia/visinska-dela/"><img class="attachment-thumbnail size-thumbnail" src="https://letecekele.si/wp-content/uploads/2018/03/Višinska-dela-120x120.jpg" alt="" /></a>',
      '<img src="https://letecekele.si/wp-content/uploads/2013/06/100_4541-150x150.JPG" alt="Sanacija" />',
      // Gutenberg full-size src — no suffix, must pass through unchanged
      '<img src="https://letecekele.si/wp-content/uploads/2021/01/Samsung-2021-2243.jpg" alt="Blok" />',
    ].join('\n')

    expect(cleanWpBody(html).gallery).toEqual([
      {
        src: 'https://letecekele.si/wp-content/uploads/2018/03/Višinska-dela.jpg',
        alt: '',
      },
      {
        src: 'https://letecekele.si/wp-content/uploads/2013/06/100_4541.JPG',
        alt: 'Sanacija',
      },
      {
        src: 'https://letecekele.si/wp-content/uploads/2021/01/Samsung-2021-2243.jpg',
        alt: 'Blok',
      },
    ])
  })
})

// ADR 0007 — a Gutenberg gallery block follows the embedded-image invariant: each
// item lands in `gallery` *and* stays inline as a figure node (figcaption → visible
// caption, data-full-url preferred). It must NOT degrade into a caption-only list.
describe('cleanWpBody — Gutenberg gallery blocks', () => {
  const galleryHtml = [
    '<p>Anže Marenče</p>',
    '<figure class="wp-block-gallery columns-3 is-cropped"><ul class="blocks-gallery-grid">',
    '<li class="blocks-gallery-item"><figure><img loading="lazy" width="960" height="1280" src="http://letecekele.si/wp-content/uploads/2021/01/IMG_085811-600x800.jpg" alt="" data-id="1137" data-full-url="http://letecekele.si/wp-content/uploads/2021/01/IMG_085811.jpg" data-link="http://letecekele.si/?attachment_id=1137" class="wp-image-1137" /><figcaption class="blocks-gallery-item__caption">Vi&scaron;inska pavza</figcaption></figure></li>',
    '<li class="blocks-gallery-item"><figure><img src="http://letecekele.si/wp-content/uploads/2021/01/Samsung-2243.jpg" alt="Blok" data-full-url="http://letecekele.si/wp-content/uploads/2021/01/Samsung-2243.jpg" /><figcaption class="blocks-gallery-item__caption">Montaža cevi</figcaption></figure></li>',
    '</ul></figure>',
  ].join('')

  it('lifts gallery items into the gallery with their figcaption as the caption', () => {
    expect(cleanWpBody(galleryHtml).gallery).toEqual([
      {
        src: 'http://letecekele.si/wp-content/uploads/2021/01/IMG_085811.jpg',
        alt: '',
        caption: 'Višinska pavza',
      },
      {
        src: 'http://letecekele.si/wp-content/uploads/2021/01/Samsung-2243.jpg',
        alt: 'Blok',
        caption: 'Montaža cevi',
      },
    ])
  })

  it('prefers the data-full-url original over a cropped src', () => {
    const { gallery } = cleanWpBody(galleryHtml)
    expect(gallery[0].src).toBe(
      'http://letecekele.si/wp-content/uploads/2021/01/IMG_085811.jpg',
    )
  })

  it('keeps gallery items inline as captioned figures, with no caption-only list items', () => {
    const { portableText } = cleanWpBody(galleryHtml)
    // the photos stay in the body in document order (after the prose), and the
    // captions must NOT degrade into a text bullet list
    expect(portableText.map((b) => b._type)).toEqual(['block', 'figure', 'figure'])
    expect(text(portableText)).toBe('Anže Marenče')
    expect(portableText[1]).toMatchObject({
      _type: 'figure',
      url: 'http://letecekele.si/wp-content/uploads/2021/01/IMG_085811.jpg',
      alt: '',
      caption: 'Višinska pavza',
    })
  })

  it('omits the caption when a gallery item has no figcaption', () => {
    const html =
      '<ul class="blocks-gallery-grid"><li><figure><img src="http://letecekele.si/wp-content/uploads/2021/01/a.jpg" alt="" /></figure></li></ul>'
    expect(cleanWpBody(html).gallery).toEqual([
      {
        src: 'http://letecekele.si/wp-content/uploads/2021/01/a.jpg',
        alt: '',
        caption: undefined,
      },
    ])
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
        children: [
          {
            _type: 'span',
            _key: 'b0s0',
            text: 'Sanacija betonske fasade',
            marks: [],
          },
        ],
      },
      {
        _type: 'block',
        _key: 'b1',
        style: 'normal',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: 'b1s0',
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
            _key: 'b2s0',
            text: 'Delo je potekalo s pomočjo vrvne tehnike in visečih odrov.',
            marks: [],
          },
        ],
      },
    ])
  })

  it('keeps inline strong/em as marks (words verbatim) and decodes entities', () => {
    const html =
      '<p>Projekt <strong>Preglov trg&nbsp;10</strong> &#8212; beton &amp; fasada, <em>140 enot</em>.</p>'

    const { portableText } = cleanWpBody(html)
    const block = portableText[0]
    if (block._type !== 'block') throw new Error('expected a text block')

    // flattened prose is verbatim (no tag markup leaks)
    expect(block.children.map((c) => c.text).join('')).toBe(
      'Projekt Preglov trg 10 — beton & fasada, 140 enot.',
    )
    // the bold + italic runs carry the right decorator marks
    const strong = block.children.find((c) => c.text === 'Preglov trg 10')
    expect(strong?.marks).toEqual(['strong'])
    const em = block.children.find((c) => c.text === '140 enot')
    expect(em?.marks).toEqual(['em'])
  })

  it('keeps inline <a href> as a link mark + markDef, verbatim copy', () => {
    const html =
      '<p>Več na <a href="https://example.si/projekt">strani projekta</a> spletu.</p>'

    const { portableText } = cleanWpBody(html)
    const block = portableText[0]
    if (block._type !== 'block') throw new Error('expected a text block')

    expect(block.children.map((c) => c.text).join('')).toBe(
      'Več na strani projekta spletu.',
    )
    const linked = block.children.find((c) => c.text === 'strani projekta')
    expect(linked?.marks).toHaveLength(1)
    const linkKey = linked!.marks[0]
    expect(block.markDefs).toEqual([
      { _key: linkKey, _type: 'link', href: 'https://example.si/projekt' },
    ])
  })

  it('converts <ul>/<ol> into list-item blocks, words verbatim', () => {
    const html = [
      '<p>Postopek:</p>',
      '<ul><li>Pregled površine.</li><li>Odstranitev delcev.</li></ul>',
      '<ol><li>Nanos premaza.</li></ol>',
    ].join('\n')

    const { portableText } = cleanWpBody(html)
    const lists = portableText.filter(
      (b): b is Extract<typeof b, { _type: 'block' }> =>
        b._type === 'block' && Boolean(b.listItem),
    )

    expect(lists.map((b) => [b.listItem, b.children[0].text])).toEqual([
      ['bullet', 'Pregled površine.'],
      ['bullet', 'Odstranitev delcev.'],
      ['number', 'Nanos premaza.'],
    ])
    expect(lists.every((b) => b.level === 1)).toBe(true)
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
    const lead = portableText[0]
    expect(lead._type === 'block' && lead.style).toBe('h2')
    // the embedded upload also survives inline as a figure, between the prose blocks
    expect(portableText.map((b) => b._type)).toEqual([
      'block',
      'block',
      'figure',
      'block',
    ])
    expect(gallery).toEqual([
      {
        src: 'https://letecekele.si/wp-content/uploads/2013/06/jez.jpg',
        alt: 'Jez',
      },
    ])
  })

  it('returns empty output for empty / nullish input', () => {
    expect(cleanWpBody('')).toEqual({ portableText: [], gallery: [] })
    expect(cleanWpBody(null)).toEqual({ portableText: [], gallery: [] })
    expect(cleanWpBody(undefined)).toEqual({ portableText: [], gallery: [] })
  })
})
