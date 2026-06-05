/**
 * Pure WordPress-pages → `aboutPage`-singleton merger for the seed (ADR 0005, issue #6).
 *
 * The old site spread the company story across thin stub pages — o-podjetju (159),
 * vizija (52) and kvaliteta (172) — and buried the alpinist "why we work at height"
 * angle in a personal blog. This merges the about pages (and an authored alpinist
 * *capability* section — NOT the personal climbing trip reports, ADR 0002) into one
 * coherent `aboutPage`: a single title, a lead intro, and one body where each former
 * page becomes a section. Slovenian prose kept verbatim, 2012 cruft dropped.
 *
 * The seed fetches the about pages from the live REST API and passes them here in
 * order; asset upload + `createOrReplace` stay in the seed. Everything here is a
 * deterministic, network-free transform, fully unit-testable against committed
 * fixtures. Cleaning reuses the shared `cleanWpBody`. Imported with an explicit `.ts`
 * path so the seed can run it under `node --experimental-strip-types` (no path-alias
 * resolver there).
 */
import type {
  GalleryImage,
  PortableTextBlock,
  PortableTextNode,
} from './wp-body.ts'
import type { WpPage } from './wp-text.ts'

import { cleanWpBody } from './wp-body.ts'
import { decodeInline, excerptText } from './wp-text.ts'

export type { WpPage }

/** Seedable `aboutPage` content — pure data; the seed uploads the hero image. */
export type AboutSeedDoc = {
  _id: 'aboutPage'
  _type: 'aboutPage'
  title: string
  intro: string
  body: PortableTextNode[]
  /** Remote WordPress upload URL for the hero (seed uploads it as an asset). */
  heroUrl?: string
}

/** An h2 section heading delineating one former stub page within the merged body. */
function headingBlock(text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: 'section',
    style: 'h2',
    markDefs: [],
    children: [{ _type: 'span', _key: 'sectionspan', text, marks: [] }],
  }
}

export function wpPagesToAbout(pages: WpPage[]): AboutSeedDoc {
  const first = pages[0]

  // Merge every page into one body. The first page is the lead — its title is the
  // page H1, so its prose opens the narrative with no injected heading. Each later
  // stub page (vizija / kvaliteta / the alpinist story) opens with its title as an
  // h2, turning separate stub pages into sections of one coherent story. Embedded
  // images are lifted out of the prose, in document order, for the hero photo.
  const merged: PortableTextNode[] = []
  const gallery: GalleryImage[] = []
  pages.forEach((page, i) => {
    const cleaned = cleanWpBody(page.content.rendered)
    if (i > 0) merged.push(headingBlock(decodeInline(page.title.rendered)))
    merged.push(...cleaned.portableText)
    gallery.push(...cleaned.gallery)
  })

  // Re-key after merge: each cleanWpBody call numbers its blocks from 0, so plain
  // concatenation collides keys — Sanity requires unique _keys within an array.
  // Inline figures have no children; only text blocks re-key their spans.
  const body: PortableTextNode[] = merged.map((b, i) =>
    b._type === 'figure'
      ? { ...b, _key: `b${i}` }
      : {
          ...b,
          _key: `b${i}`,
          children: b.children.map((c, j) => ({ ...c, _key: `b${i}s${j}` })),
        },
  )

  // Short intro: the first page's excerpt (read-more tail dropped by the shared helper).
  const intro = excerptText(first?.excerpt?.rendered)

  return {
    _id: 'aboutPage',
    _type: 'aboutPage',
    title: decodeInline(first?.title.rendered ?? ''),
    intro,
    body,
    heroUrl: gallery[0]?.src,
  }
}
