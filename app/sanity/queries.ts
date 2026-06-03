import groq from 'groq'

import type { ServiceData, ServiceListItem, SiteData } from '~/lib/types'

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

// All services for the /storitve listing, in editor-defined order.
export const SERVICES_QUERY = groq`*[_type == "service" && defined(slug.current)] | order(order asc, title asc){
  _id,
  title,
  description,
  "slug": slug.current,
  "photo": photo${FIGURE}
}`

// A single service by slug for the /storitve/:slug detail page.
export const SERVICE_BY_SLUG_QUERY = groq`*[_type == "service" && slug.current == $slug][0]{
  _id,
  title,
  description,
  "slug": slug.current,
  "photo": photo${FIGURE},
  steps
}`

// Descriptors — each binds a query string to its result type (and params type,
// where parameterised). The route names one once; loadSanity + useSanity reference
// the same value, so query/params can't drift between server and client. See
// app/sanity/data.ts.
export const siteQuery = defineSanityQuery<SiteData>(SITE_SETTINGS_QUERY)
export const servicesQuery = defineSanityQuery<ServiceListItem[]>(SERVICES_QUERY)
export const serviceQuery = defineSanityQuery<ServiceData, { slug: string }>(
  SERVICE_BY_SLUG_QUERY,
)
