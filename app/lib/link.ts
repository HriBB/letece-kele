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
  // `https://`, `http://`, or scheme-relative `//host` — all leave the site.
  const external = /^(https?:)?\/\//.test(resolved)
  return external
    ? { href: resolved, internal: false, target: '_blank', rel: 'noreferrer' }
    : { href: resolved, internal: true }
}
