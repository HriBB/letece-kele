import groq from 'groq'

import type {
  AboutPageData,
  ProjectData,
  ProjectListItem,
  ServiceData,
  ServiceListItem,
  SiteData,
} from '~/lib/types'

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

// All projects for the /reference listing, in editor-defined order. The lead photo
// is the first gallery image (ADR 0003 — one type backs listing + detail + home).
export const PROJECTS_QUERY = groq`*[_type == "project" && defined(slug.current)] | order(order asc, year desc, title asc){
  _id,
  title,
  location,
  year,
  summary,
  "slug": slug.current,
  "photo": gallery[0]${FIGURE}
}`

// A single project by slug for the /reference/:slug detail page. A non-empty `body`
// renders as a case study; an empty one renders as a gallery reference card.
export const PROJECT_BY_SLUG_QUERY = groq`*[_type == "project" && slug.current == $slug][0]{
  _id,
  title,
  location,
  year,
  summary,
  "slug": slug.current,
  "gallery": gallery[]${FIGURE},
  body
}`

// The About page singleton for /o-podjetju — the merged company story.
export const ABOUT_QUERY = groq`*[_type == "aboutPage"][0]{
  title,
  intro,
  "heroImage": heroImage${FIGURE},
  body
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
export const projectsQuery = defineSanityQuery<ProjectListItem[]>(PROJECTS_QUERY)
export const projectQuery = defineSanityQuery<ProjectData, { slug: string }>(
  PROJECT_BY_SLUG_QUERY,
)
export const aboutQuery = defineSanityQuery<AboutPageData>(ABOUT_QUERY)
