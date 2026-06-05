/**
 * Pure WordPress-body cleaner for the seed (ADR 0005). The live letecekele.si
 * REST API returns 2012-era `content.rendered`: inline `<style>` blocks,
 * `[gallery]` shortcodes, embedded `<img>` uploads, inline links and lists mixed
 * into the prose.
 *
 * `cleanWpBody` strips the cruft and returns rich Portable Text (ADR 0003 — full
 * case-study depth):
 *   - `portableText` — the prose as Portable Text nodes, Slovenian copy verbatim
 *     (only formatting junk dropped): paragraphs/headings/blockquotes with inline
 *     `link`/`strong`/`em` marks, bullet/number list items, and any embedded image
 *     kept *in document order* as an inline `figure` node (so a case-study photo
 *     stays where the author put it in the narrative),
 *   - `gallery` — every embedded image *also* lifted out in document order, for the
 *     listing-card thumbnail and the gallery-only (caption-only) render path. The
 *     seed's per-URL upload dedupe means an image referenced both inline and in the
 *     gallery resolves to one Sanity asset.
 *
 * Gutenberg gallery blocks (`<ul class="blocks-gallery-grid">` of `<li><figure>
 * <img/><figcaption>` items) follow the same invariant (ADR 0007): each item lands
 * in `gallery` *and* stays inline as a figure node in document order — with its
 * `<figcaption>` as the visible `caption` and the `data-full-url` original
 * preferred over the (possibly cropped) `src`. What it must NOT do is degrade
 * into a caption-only text list.
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

/** A `link` annotation referenced by a span's `marks` (ADR 0005 — keep outbound links). */
export type LinkMarkDef = {
  _key: string
  _type: 'link'
  href: string
}

export type PortableTextBlock = {
  _type: 'block'
  _key: string
  style: string
  markDefs: LinkMarkDef[]
  children: PortableTextSpan[]
  /** Set on list items: the kind of list this block belongs to. */
  listItem?: 'bullet' | 'number'
  /** List nesting depth (1-based); only meaningful with `listItem`. */
  level?: number
}

/** An embedded image kept inline in body order (asset uploaded from `url` by the seed). */
export type PortableTextFigure = {
  _type: 'figure'
  _key: string
  url: string
  alt: string
  /** Visible label (from a gallery `<figcaption>`); distinct from the alt text. */
  caption?: string
}

/** A node in the cleaned body: a text/list block or an inline figure. */
export type PortableTextNode = PortableTextBlock | PortableTextFigure

export type GalleryImage = {
  src: string
  alt: string
  /** Visible label (from a gallery `<figcaption>`); distinct from the alt text. */
  caption?: string
}

export type CleanedWpBody = {
  portableText: PortableTextNode[]
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
  // š is the one Slovenian letter with a named HTML entity (č/ž arrive numeric)
  '&scaron;': 'š',
  '&Scaron;': 'Š',
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

const HEADINGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'])

function styleFor(tag: string): string {
  const t = tag.toLowerCase()
  if (HEADINGS.has(t)) return t
  if (t === 'blockquote') return 'blockquote'
  return 'normal'
}

/**
 * Parse one block's inner HTML into Portable Text spans + link markDefs. Inline
 * `<a href>` becomes a `link` markDef + mark; `<strong>/<b>` → `strong`;
 * `<em>/<i>` → `em`. Unknown inline tags are dropped but their words kept; entities
 * are decoded and whitespace collapsed. Returns no spans for empty/whitespace inner.
 */
function parseInline(
  inner: string,
  blockKey: string,
): {
  children: PortableTextSpan[]
  markDefs: LinkMarkDef[]
} {
  const children: PortableTextSpan[] = []
  const markDefs: LinkMarkDef[] = []
  const stack: string[] = []
  let linkCount = 0
  let spanCount = 0

  const pushText = (raw: string) => {
    const text = decodeEntities(raw).replace(/\s+/g, ' ')
    if (!text) return
    children.push({
      _type: 'span',
      _key: `${blockKey}s${spanCount++}`,
      text,
      marks: [...stack],
    })
  }

  const TAG_RE = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b([^>]*?)\/?>/g
  let last = 0
  let m: RegExpExecArray | null
  while ((m = TAG_RE.exec(inner))) {
    pushText(inner.slice(last, m.index))
    last = TAG_RE.lastIndex
    const closing = m[1] === '/'
    const tag = m[2].toLowerCase()

    if (tag === 'br') {
      pushText(' ')
      continue
    }

    const decorator =
      tag === 'strong' || tag === 'b'
        ? 'strong'
        : tag === 'em' || tag === 'i'
          ? 'em'
          : null

    if (decorator) {
      if (closing) {
        const i = stack.lastIndexOf(decorator)
        if (i >= 0) stack.splice(i, 1)
      } else {
        stack.push(decorator)
      }
    } else if (tag === 'a') {
      if (closing) {
        for (let i = stack.length - 1; i >= 0; i--) {
          if (stack[i].startsWith(`${blockKey}l`)) {
            stack.splice(i, 1)
            break
          }
        }
      } else {
        const href = attr(m[0], 'href')
        if (href) {
          const k = `${blockKey}l${linkCount++}`
          markDefs.push({ _key: k, _type: 'link', href: decodeEntities(href) })
          stack.push(k)
        }
      }
    }
    // any other tag: dropped, words kept
  }
  pushText(inner.slice(last))

  // Trim the block's leading/trailing whitespace (spaces *between* spans stay).
  if (children.length > 0) {
    children[0].text = children[0].text.replace(/^\s+/, '')
    children[children.length - 1].text = children[children.length - 1].text.replace(
      /\s+$/,
      '',
    )
  }
  const kept = children.filter((c) => c.text !== '')
  const used = new Set(kept.flatMap((c) => c.marks))
  return { children: kept, markDefs: markDefs.filter((d) => used.has(d._key)) }
}

const IMG_RE = /<img\b[^>]*>/gi

/** Should this image be kept? WP leaves a /wp-includes/ tinymce placeholder behind. */
function realImage(src: string | undefined): src is string {
  return Boolean(src) && !src!.includes('/wp-includes/')
}

/**
 * WordPress generates crops named `name-WIDTHxHEIGHT.ext`; the upload original is the
 * same path without that suffix. The classic `[gallery]` shortcode expands to 120/150px
 * thumbnails (`class="size-thumbnail"`) whose wrapping `<a href>` points to the
 * attachment *page*, not the file — so lift the `src` to the full-size original instead,
 * otherwise the seed uploads an unusably small image. No-op on Gutenberg full-size srcs
 * (which carry no suffix).
 */
function fullSizeImage(src: string): string {
  return src.replace(/-\d+x\d+(\.[a-zA-Z0-9]+)$/, '$1')
}

/**
 * The upload-original URL for an `<img>` tag: Gutenberg images carry the original in
 * `data-full-url` — prefer it outright; otherwise fall back to suffix-stripping the
 * (possibly cropped) `src`. Returns undefined for placeholder/non-upload images.
 */
function imageSrc(tag: string): string | undefined {
  const full = attr(tag, 'data-full-url')
  if (realImage(full)) return full
  const src = attr(tag, 'src')
  return realImage(src) ? fullSizeImage(src) : undefined
}

const FIGCAPTION_RE = /<figcaption\b[^>]*>([\s\S]*?)<\/figcaption>/i

/** The visible label of a gallery item: its `<figcaption>`, tags stripped. */
function captionOf(liInner: string): string | undefined {
  const m = liInner.match(FIGCAPTION_RE)
  if (!m) return undefined
  const text = decodeEntities(m[1].replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim()
  return text || undefined
}

const NODE_RE =
  /<(h[1-6]|p|blockquote|ul|ol)\b[^>]*>([\s\S]*?)<\/\1>|<img\b[^>]*>/gi

const LI_RE = /<li\b[^>]*>([\s\S]*?)<\/li>/gi

export function cleanWpBody(html: string | null | undefined): CleanedWpBody {
  const gallery: GalleryImage[] = []
  const blocks: PortableTextNode[] = []
  if (!html) return { portableText: blocks, gallery }

  const s = html
    // 1. inline <style> blocks (content and all)
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    // 2. [gallery] / [gallery ids="…"] shortcodes
    .replace(/\[gallery\b[^\]]*\]/gi, '')

  // An embedded <img>: lift to the gallery *and* keep an inline figure in body order.
  // Gallery items pass their figcaption along as the visible caption.
  const emitFigure = (tag: string, caption?: string) => {
    const src = imageSrc(tag)
    if (!src) return
    const alt = attr(tag, 'alt') ?? ''
    gallery.push({ src, alt, ...(caption ? { caption } : {}) })
    blocks.push({
      _type: 'figure',
      _key: `b${blocks.length}`,
      url: src,
      alt,
      ...(caption ? { caption } : {}),
    })
  }

  // A text/heading/blockquote block — split on inline <img>s so figures interleave
  // with the prose in document order.
  const emitProse = (style: string, inner: string) => {
    IMG_RE.lastIndex = 0
    let last = 0
    let m: RegExpExecArray | null
    const emitText = (raw: string) => {
      const blockKey = `b${blocks.length}`
      const { children, markDefs } = parseInline(raw, blockKey)
      if (children.length > 0) {
        blocks.push({ _type: 'block', _key: blockKey, style, markDefs, children })
      }
    }
    while ((m = IMG_RE.exec(inner))) {
      emitText(inner.slice(last, m.index))
      emitFigure(m[0])
      last = IMG_RE.lastIndex
    }
    emitText(inner.slice(last))
  }

  const emitList = (listItem: 'bullet' | 'number', inner: string) => {
    LI_RE.lastIndex = 0
    let m: RegExpExecArray | null
    while ((m = LI_RE.exec(inner))) {
      const li = m[1]
      // A list item carrying an <img> is a gallery item (Gutenberg gallery blocks
      // render as <ul class="blocks-gallery-grid"> of <li><figure><img/><figcaption>
      // items — ADR 0007): it follows the embedded-image invariant (gallery + inline
      // figure, with its figcaption as the visible caption) instead of degrading
      // into a caption-only text list item. Detection is content-based, not
      // class-based, so any gallery markup variant is covered.
      const imgs = li.match(IMG_RE)
      if (imgs) {
        const caption = captionOf(li)
        for (const tag of imgs) emitFigure(tag, caption)
        continue
      }
      const blockKey = `b${blocks.length}`
      const { children, markDefs } = parseInline(li, blockKey)
      if (children.length > 0) {
        blocks.push({
          _type: 'block',
          _key: blockKey,
          style: 'normal',
          listItem,
          level: 1,
          markDefs,
          children,
        })
      }
    }
  }

  const matches = [...s.matchAll(NODE_RE)]
  if (matches.length > 0) {
    for (const m of matches) {
      if (m[1] === undefined) {
        // the `<img>` alternative (a loose image outside any block)
        emitFigure(m[0])
        continue
      }
      const tag = m[1].toLowerCase()
      const inner = m[2]
      if (tag === 'ul') emitList('bullet', inner)
      else if (tag === 'ol') emitList('number', inner)
      else emitProse(styleFor(tag), inner)
    }
  } else {
    // No block tags (e.g. wpautop-flattened text): split on blank lines.
    for (const chunk of s.split(/\n\s*\n/)) emitProse('normal', chunk)
  }

  return { portableText: blocks, gallery }
}
