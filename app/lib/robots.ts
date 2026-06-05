/**
 * Builds the robots.txt body (issue #9). Pure so the route loader stays a thin wrapper.
 * Crawlers are welcome on the public site but kept off the embedded Studio (`/studio`) and
 * the Visual Editing resource routes (`/resource`); the sitemap is advertised absolutely so
 * search engines and AI answer surfaces can discover every public route.
 *
 * On staging (`disallowAll: true`) the entire site is blocked — the unlisted URL is the
 * only gate (ADR 0008). On production the normal allow/disallow rules apply.
 */
export function buildRobotsTxt(origin: string, { disallowAll = false } = {}): string {
  if (disallowAll) {
    return `User-agent: *\nDisallow: /\n`
  }

  return `User-agent: *
Allow: /
Disallow: /studio
Disallow: /resource

Sitemap: ${origin}/sitemap.xml
`
}
