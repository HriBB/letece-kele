import groq from 'groq'

import type { SiteData } from '~/lib/types'

import { defineSanityQuery } from '~/sanity/data'

// Expand an image asset with the metadata needed for responsive rendering + LQIP
// (ADR 0005). Shared infra: every content slice reuses this on its image fields.
export const FIGURE = /* groq */ `{
  _type,
  alt,
  hotspot,
  crop,
  asset->{ _id, metadata { lqip, dimensions } }
}`

// Site-wide settings (header nav, footer, contact, legal) wrapping every route.
export const SITE_SETTINGS_QUERY = groq`{
  "settings": *[_type == "siteSettings"][0]{
    title,
    "logo": logo${FIGURE},
    nav[]{ label, href },
    headerCta,
    contact,
    legal,
    footer
  }
}`

// Descriptor — binds the query string to its result type. The route names this
// once; loadSanity + useSanity reference the same value, so query/params can't
// drift between server and client. See app/sanity/data.ts.
export const siteQuery = defineSanityQuery<SiteData>(SITE_SETTINGS_QUERY)
