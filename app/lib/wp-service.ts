/**
 * Pure WordPress-page → `service`-document mapper for the seed (ADR 0005, issue #4).
 *
 * The seed pulls the five WordPress service pages (parent id 30 → 177, 179, 181,
 * 183, 218) from the live REST API and hands each raw page object here. This turns
 * one page into the seedable shape of a `service` document: stable `_id`, decoded
 * title, short `description`, the ordered process `steps` (Slovenian prose kept
 * verbatim, 2012 cruft dropped), and the URL of the representative `photo` to upload.
 *
 * Asset upload + the final `createOrReplace` are network side effects and stay in
 * the seed script; everything here is a deterministic, network-free transform so it
 * is fully unit-testable against committed fixtures. Cleaning reuses the shared
 * `cleanWpBody`. Imported with an explicit `.ts` path so the seed can run it under
 * `node --experimental-strip-types` (no path-alias resolver there).
 */
import type { PortableTextBlock } from './wp-body.ts'
import type { WpPage } from './wp-text.ts'

import { cleanWpBody } from './wp-body.ts'
import { decodeInline, excerptText, firstParagraph } from './wp-text.ts'

export type { WpPage }

/** Seedable `service` content — pure data; the seed adds the uploaded `photo` ref. */
export type ServiceSeedDoc = {
  _id: string
  _type: 'service'
  title: string
  slug: { _type: 'slug'; current: string }
  description: string
  steps: PortableTextBlock[]
  /** Remote WordPress upload URL for the representative photo (seed uploads it). */
  photoUrl?: string
  order: number
}

export function wpPageToService(page: WpPage, order: number): ServiceSeedDoc {
  const { portableText: steps, gallery } = cleanWpBody(page.content.rendered)

  // Short description: prefer the excerpt, falling back to the first real paragraph.
  const description = excerptText(page.excerpt?.rendered) || firstParagraph(steps)

  return {
    _id: `service.${page.slug}`,
    _type: 'service',
    title: decodeInline(page.title.rendered),
    slug: { _type: 'slug', current: page.slug },
    description,
    steps,
    photoUrl: gallery[0]?.src,
    order,
  }
}
