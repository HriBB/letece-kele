/**
 * Shared text utilities for the WordPress → Sanity seed mappers (wp-service,
 * wp-project, wp-about). Each mapper turns a cleaned WP body (see wp-body.ts) into
 * the small bits of plain prose a document needs — title, short summary, intro — so
 * these live here once instead of being re-implemented (and silently drifting) per
 * mapper. Imported with an explicit `.ts` path so the seed can run them under
 * `node --experimental-strip-types`.
 */
import type { PortableTextBlock } from './wp-body.ts'

import { cleanWpBody } from './wp-body.ts'

/** The slice of the WordPress REST page/post shape the mappers read. */
export type WpPage = {
  slug: string
  title: { rendered: string }
  excerpt?: { rendered: string } | null
  content: { rendered: string }
}

/** Flatten Portable Text blocks back to plain prose. */
export function plainText(blocks: PortableTextBlock[]): string {
  return blocks.map((b) => b.children.map((c) => c.text).join('')).join(' ')
}

/** Decode a short inline string (e.g. a title) by routing it through the cleaner. */
export function decodeInline(html: string): string {
  return plainText(cleanWpBody(`<p>${html}</p>`).portableText)
}

/**
 * Text of the first real paragraph — skips a leading heading block so a card
 * summary never just echoes the section title (the body's first <h2>).
 */
export function firstParagraph(blocks: PortableTextBlock[]): string {
  const para = blocks.find((b) => b.style === 'normal') ?? blocks[0]
  return para ? para.children.map((c) => c.text).join('') : ''
}

/**
 * Short summary/intro from a WP excerpt: cleaned to plain text with WordPress's
 * "[…]" read-more tail dropped (formatting junk, not copy).
 */
export function excerptText(excerptHtml: string | null | undefined): string {
  return plainText(cleanWpBody(excerptHtml).portableText)
    .replace(/\s*\[…\]\s*$/, '')
    .trim()
}
