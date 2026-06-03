export type ResolvedLink = {
  href: string
  internal: boolean
  target?: '_blank'
  rel?: 'noreferrer'
}

// The route literal lives here only; nav, listing, and sitemap all call these so the
// path can't drift across copies. Concept `project` lives at `/reference` (ADR 0003).
/** The one rule mapping a service slug to its detail path. */
export const serviceHref = (slug: string) => `/storitve/${slug}`

/** The one rule mapping a project slug to its reference detail path. */
export const projectHref = (slug: string) => `/reference/${slug}`

export function resolveLink(href: string | undefined): ResolvedLink {
  const resolved = href ?? '#'
  // `https://`, `http://`, or scheme-relative `//host` — leave the site, open in a new tab.
  if (/^(https?:)?\/\//.test(resolved)) {
    return { href: resolved, internal: false, target: '_blank', rel: 'noreferrer' }
  }
  // `tel:`, `mailto:`, and any other URL scheme — a plain, same-tab <a>. Client-side
  // routing can't handle these, so they must not be rendered as a <Link>.
  if (/^[a-z][a-z0-9+.-]*:/i.test(resolved)) {
    return { href: resolved, internal: false }
  }
  // App-absolute path (or an in-page `#…` anchor) — client-side <Link>.
  return { href: resolved, internal: true }
}
