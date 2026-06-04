/**
 * Pure WordPress-post → `project`-document mapper for the seed (ADR 0003 + 0005,
 * issue #5).
 *
 * The seed pulls the `projekti`-category posts (category id 5, ~14 posts) from the
 * live WordPress REST API and hands each raw post object here. This turns one post
 * into the seedable shape of a `project` document: stable `_id`, decoded title,
 * publication `year`, short `summary`, the optional case-study `body` (Slovenian
 * prose kept verbatim, 2012 cruft dropped), and the `[gallery]`/embedded images
 * lifted into `gallery` (each an upload URL the seed turns into a Sanity asset).
 *
 * Render depth follows the data (ADR 0003): a post with a rich body seeds a project
 * that reads as a full case study; a caption-only post seeds one that reads as a
 * gallery reference card — one type, two depths.
 *
 * Personal blog posts (`filmi`/`reportaže`/`utrinki`) are NOT migrated (ADR 0002);
 * the seed only fetches the `projekti` category, so this mapper only ever sees a
 * project post.
 *
 * Asset upload + the final `createOrReplace` are network side effects and stay in
 * the seed script; everything here is a deterministic, network-free transform so it
 * is fully unit-testable against committed fixtures. Cleaning reuses the shared
 * `cleanWpBody`. Imported with an explicit `.ts` path so the seed can run it under
 * `node --experimental-strip-types` (no path-alias resolver there).
 */
import type { GalleryImage, PortableTextNode } from './wp-body.ts'

import { cleanWpBody } from './wp-body.ts'
import { decodeInline, excerptText, firstParagraph } from './wp-text.ts'

/** The slice of the WordPress REST post shape the mapper reads. */
export type WpPost = {
  slug: string
  date: string
  title: { rendered: string }
  excerpt?: { rendered: string } | null
  content: { rendered: string }
}

/** Seedable `project` content — pure data; the seed uploads each gallery image. */
export type ProjectSeedDoc = {
  _id: string
  _type: 'project'
  title: string
  slug: { _type: 'slug'; current: string }
  year?: number
  summary: string
  body: PortableTextNode[]
  /** Remote WordPress upload URLs for the gallery (seed uploads each as an asset). */
  galleryUrls: GalleryImage[]
  featured: boolean
  order: number
}

// WP project titles are ALL CAPS ("PREGLOV TRG 10"); the site wants sentence-case
// Slovenian ("Preglov trg 10" — see CONTEXT.md, project). Naive sentence-casing
// lowercases proper nouns, so the titles that contain one carry an explicit override
// (capitalisation confirmed by the owner). Future posts without an override get the
// generic transform; mixed-case titles pass through untouched.
const TITLE_OVERRIDES: Record<string, string> = {
  'terme-olimia': 'Terme Olimia',
  'ul-bratov-ucakar': 'Ulica bratov Učakar 44–46',
  'ulica-bratov': 'Ulica bratov Učakar 40–42',
  'p-slavija': 'Poslovni center Slavija',
  'makedonija-jez-sveta-petka-2': 'Makedonija – jez Sveta Petka',
  'soncna-elektrarna-2': 'Sončna elektrarna Valjavec',
  'cerkev-na-visokem': 'Cerkev na Visokem',
}

/** Sentence-case an ALL-CAPS title; anything already mixed-case is left alone. */
function sentenceCase(title: string): string {
  const isAllCaps = title === title.toUpperCase() && title !== title.toLowerCase()
  if (!isAllCaps) return title
  const lower = title.toLowerCase()
  return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export function wpPostToProject(post: WpPost, order: number): ProjectSeedDoc {
  // Publication year from the post date (e.g. "2013-06-18T10:00:00" → 2013).
  const parsedYear = Number(post.date?.slice(0, 4))
  const year = Number.isFinite(parsedYear) ? parsedYear : undefined

  const { portableText: body, gallery: galleryUrls } = cleanWpBody(
    post.content.rendered,
  )

  // Short summary: prefer the excerpt, falling back to the first real paragraph.
  const summary = excerptText(post.excerpt?.rendered) || firstParagraph(body)

  return {
    _id: `project.${post.slug}`,
    _type: 'project',
    title:
      TITLE_OVERRIDES[post.slug] ?? sentenceCase(decodeInline(post.title.rendered)),
    slug: { _type: 'slug', current: post.slug },
    year,
    summary,
    body,
    galleryUrls,
    featured: false,
    order,
  }
}
