import type { MetaDescriptor } from 'react-router'

/**
 * Expands a page's title + description into the full title / description / og:* tag set.
 * Routes hand it plain strings; the Open Graph scaffold lives here once, so no route reaches
 * into loader-data shape to assemble tags by hand. SEO slice (#9) extends this.
 */
export function pageMeta({
  title,
  description,
  ogTitle = title,
  ogType = 'website',
}: {
  title: string
  description: string
  /** Shorter/brand title for sharing, when it differs from the document title. */
  ogTitle?: string
  ogType?: 'website' | 'article'
}): MetaDescriptor[] {
  return [
    { title },
    { name: 'description', content: description },
    { property: 'og:title', content: ogTitle },
    { property: 'og:description', content: description },
    { property: 'og:type', content: ogType },
  ]
}
