/**
 * Pure WordPress-body cleaner for the seed (ADR 0005). The live letecekele.si
 * REST API returns 2012-era `content.rendered`: inline `<style>` blocks,
 * `[gallery]` shortcodes, and embedded `<img>` uploads mixed into the prose.
 *
 * `cleanWpBody` strips that cruft and returns:
 *   - `portableText` — the prose as Portable Text blocks, Slovenian copy kept
 *     verbatim (only formatting junk dropped),
 *   - `gallery` — every embedded image lifted out of the prose, in document order,
 *     for the seed to upload as Sanity assets and reference from `project.gallery`.
 *
 * No network, no DOM: small, deterministic string transforms so it is fully
 * unit-testable against committed fixtures.
 */

export type PortableTextSpan = {
  _type: 'span'
  _key: string
  text: string
  marks: string[]
}

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: string
  markDefs: never[]
  children: PortableTextSpan[]
}

export type GalleryImage = {
  src: string
  alt: string
}

export type CleanedWpBody = {
  portableText: PortableTextBlock[]
  gallery: GalleryImage[]
}

const ENTITIES: Record<string, string> = {
  '&amp;': '&',
  '&lt;': '<',
  '&gt;': '>',
  '&quot;': '"',
  '&apos;': "'",
  '&nbsp;': ' ',
  '&hellip;': '…',
  '&ndash;': '–',
  '&mdash;': '—',
}

function decodeEntities(text: string): string {
  return (
    text
      // numeric entities (decimal &#8212; and hex &#x2014;) → their codepoint
      .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, h) =>
        String.fromCodePoint(parseInt(h, 16)),
      )
      // common named entities
      .replace(/&[a-zA-Z]+;/g, (m) => ENTITIES[m] ?? m)
  )
}

/** Pull an attribute value (single- or double-quoted) out of a raw tag string. */
function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, 'i'))
  return m ? (m[2] ?? m[3]) : undefined
}

/** Strip remaining inline tags, decode entities, collapse whitespace → clean prose. */
function toText(inner: string): string {
  const stripped = inner.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '')
  return decodeEntities(stripped).replace(/\s+/g, ' ').trim()
}

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

function styleFor(tag: string): string {
  const t = tag.toLowerCase()
  if (HEADINGS.has(t)) return t
  if (t === 'blockquote') return 'blockquote'
  return 'normal'
}

function block(style: string, text: string, i: number): PortableTextBlock {
  return {
    _type: 'block',
    _key: `b${i}`,
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: `s${i}`, text, marks: [] }],
  }
}

const BLOCK_RE = /<(h[1-6]|p|blockquote)\b[^>]*>([\s\S]*?)<\/\1>/gi

export function cleanWpBody(html: string | null | undefined): CleanedWpBody {
  const gallery: GalleryImage[] = []
  if (!html) return { portableText: [], gallery }

  let s = html
    // 1. inline <style> blocks (content and all)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // 2. [gallery] / [gallery ids="…"] shortcodes
    .replace(/\[gallery\b[^\]]*\]/gi, '')

  // 3. lift embedded <img> out of the prose, in document order. Skip WordPress
  // system images under /wp-includes/ (the classic `[gallery]` shortcode leaves a
  // tinymce placeholder `t.gif` in the rendered HTML) — real uploads live under
  // /wp-content/uploads/, these are editor chrome and 404 on fetch.
  s = s.replace(/<img\b[^>]*>/gi, (tag) => {
    const src = attr(tag, 'src')
    if (src && !src.includes('/wp-includes/')) {
      gallery.push({ src, alt: attr(tag, 'alt') ?? '' })
    }
    return ''
  })

  // 4. convert prose to Portable Text blocks
  const blocks: PortableTextBlock[] = []
  const matches = [...s.matchAll(BLOCK_RE)]

  if (matches.length > 0) {
    for (const m of matches) {
      const text = toText(m[2])
      if (text) blocks.push(block(styleFor(m[1]), text, blocks.length))
    }
  } else {
    // No block tags (e.g. wpautop-flattened text): split on blank lines.
    for (const chunk of s.split(/\n\s*\n/)) {
      const text = toText(chunk)
      if (text) blocks.push(block('normal', text, blocks.length))
    }
  }

  return { portableText: blocks, gallery }
}
