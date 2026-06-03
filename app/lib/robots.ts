/**
 * Builds the robots.txt body (issue #9). Pure so the route loader stays a thin wrapper.
 * Crawlers are welcome on the public site but kept off the embedded Studio (`/studio`) and
 * the Visual Editing resource routes (`/resource`); the sitemap is advertised absolutely so
 * search engines and AI answer surfaces can discover every public route.
 */
export function buildRobotsTxt(origin: string): string {
  return `User-agent: *
Allow: /
Disallow: /studio
Disallow: /resource

Sitemap: ${origin}/sitemap.xml
`
}
