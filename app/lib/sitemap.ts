import { projectHref, serviceHref } from '~/lib/link'

/** A dynamic sitemap entry: a slug plus its content `_updatedAt` for `<lastmod>`. */
export type SitemapEntry = { slug: string; updatedAt?: string }

/** The static public routes, owned here so the sitemap can't drift from the real site map. */
const STATIC_PATHS = ['/', '/storitve', '/reference', '/o-podjetju', '/kontakt']

type SitemapUrl = { loc: string; lastmod?: string }

/** Escape the five XML predefined entities so a `&`/`<` in a host or slug can't break the doc. */
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function urlTag({ loc, lastmod }: SitemapUrl): string {
  const lm = lastmod ? `<lastmod>${xmlEscape(lastmod)}</lastmod>` : ''
  return `  <url><loc>${xmlEscape(loc)}</loc>${lm}</url>`
}

/**
 * Builds the sitemap.xml body from the runtime origin plus the live service + project
 * slugs (issue #9). Pure so the route loader stays a thin fetch-and-respond wrapper; the
 * detail paths come from the same `serviceHref`/`projectHref` rules the nav and listings
 * use, so the sitemap can't list a path the app doesn't serve.
 */
export function buildSitemapXml({
  origin,
  services,
  projects,
}: {
  origin: string
  services: SitemapEntry[]
  projects: SitemapEntry[]
}): string {
  const urls: SitemapUrl[] = [
    ...STATIC_PATHS.map((p) => ({ loc: `${origin}${p}` })),
    ...services.map((s) => ({ loc: `${origin}${serviceHref(s.slug)}`, lastmod: s.updatedAt })),
    ...projects.map((p) => ({ loc: `${origin}${projectHref(p.slug)}`, lastmod: p.updatedAt })),
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlTag).join('\n')}
</urlset>`
}
