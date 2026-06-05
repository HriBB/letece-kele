import type { ComponentType } from 'react'

import type {
  AboutPageData,
  HomeData,
  ProjectData,
  ProjectListItem,
  ServiceData,
  ServiceListItem,
  SiteData,
} from '~/lib/types'

// ── Variant page contract (ADR 0008) ────────────────────────────────────────
// A variant is a full page-component tree (header, footer, the seven route-group
// pages, and a 404). Every variant implements the SAME prop contract — same
// content/loaders/queries reach every variant, only the presentation differs —
// so the route can pick a variant's page by key and hand it identical props. This
// is what keeps the variants honest: a variant can restyle, never re-source.

export type VariantPages = {
  Header: ComponentType<{ site: SiteData }>
  Footer: ComponentType<{ site: SiteData }>
  /** Home (`/`): the homePage singleton + the service/project docs its sections show. */
  Home: ComponentType<{ data: HomeData; site: SiteData }>
  /** Service listing (`/storitve`). */
  ServiceList: ComponentType<{ services: ServiceListItem[] }>
  /** Service detail (`/storitve/:slug`). Derives phone + quote CTA from `site`. */
  ServiceDetail: ComponentType<{ data: ServiceData; site: SiteData }>
  /** Project listing (`/reference`). */
  ProjectList: ComponentType<{ projects: ProjectListItem[] }>
  /** Project detail (`/reference/:slug`). Derives phone + quote CTA from `site`. */
  ProjectDetail: ComponentType<{ data: ProjectData; site: SiteData }>
  /** About (`/o-podjetju`). */
  About: ComponentType<{ data: AboutPageData }>
  /** Contact (`/kontakt`) — info-only, reads `site.settings`. */
  Contact: ComponentType<{ site: SiteData }>
  /** 404 page for this variant. */
  NotFound: ComponentType
}

/** One of the five site-wide design directions the client cycles between (ADR 0008). */
export type Variant = {
  /** 1–5, the picker's position + the `?design=n` value. */
  number: number
  /** Stable kebab slug; the variant's folder name under `app/variants/`. */
  slug: string
  /** Slovenian display name shown in the picker pill (staging scaffolding, not CMS content). */
  name: string
  /** The variant's page-component tree. */
  pages: VariantPages
}
