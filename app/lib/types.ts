// Front-end result shapes for the Sanity descriptor seam. Each later slice adds
// its own types (service, project, homePage, aboutPage); this file currently holds
// the site-wide settings consumed by the shared layout (Header / Footer / contact).

import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImage } from '~/lib/image'

export type NavLink = { label: string; href: string }
export type CtaLink = { label: string; href: string } | null
export type LinkItem = { label: string; href: string }

/** Company legal data — *osnovni podatki* — rendered in footer + contact (CONTEXT.md). */
export type Legal = {
  companyName?: string
  vat?: string
  reg?: string
  bankName?: string
  bankIban?: string
}

export type Contact = {
  phone?: string
  phoneHref?: string
  email?: string
  address?: string
  mapUrl?: string
}

export type SiteSettings = {
  title?: string
  logo?: SanityImage | null
  nav?: NavLink[]
  headerCta?: CtaLink
  contact?: Contact
  legal?: Legal
  footer?: {
    tagline?: string
    copyright?: string
    links?: LinkItem[]
  }
}

/** Minimal service reference (title + slug) the site-wide JSON-LD offer catalog needs. */
export type SiteServiceRef = { title: string; slug: string }

export type SiteData = {
  settings: SiteSettings | null
  /** Service catalog (title + slug) for the LocalBusiness JSON-LD (issue #9). */
  services: SiteServiceRef[]
}

/** A service (sl: storitev) as shown on the /storitve listing card. */
export type ServiceListItem = {
  _id: string
  title: string
  description?: string
  slug: string
  photo: SanityImage | null
  /** Process steps — only queried for the home services teaser checklist (issue #8). */
  steps?: PortableTextBlock[] | null
}

/** A single service for the /storitve/:slug detail page — same shape as the listing item. */
export type ServiceData = ServiceListItem

/** A project (sl: reference) as shown on the /reference listing card. */
export type ProjectListItem = {
  _id: string
  title: string
  location?: string
  year?: number
  summary?: string
  slug: string
  /** Lead photo: the first gallery image. */
  photo: SanityImage | null
  /** Editor flag surfacing this project in the home featured strip (issue #8). */
  featured?: boolean
}

/**
 * The About page (singleton at /o-podjetju) — the merged company story (CONTEXT.md):
 * about + vision + quality + the alpinist credibility story as one coherent narrative.
 */
export type AboutPageData = {
  title: string
  intro?: string
  heroImage: SanityImage | null
  body?: PortableTextBlock[] | null
}

/**
 * A single project for the /reference/:slug detail page. A non-empty `body` reads
 * as a full case study; an empty one reads as a gallery reference card (ADR 0003).
 */
export type ProjectData = {
  _id: string
  title: string
  location?: string
  year?: number
  summary?: string
  slug: string
  gallery?: SanityImage[] | null
  body?: PortableTextBlock[] | null
}

// ── Home page (singleton at `/`) — the variant-5 "Warm craftsman" fold-in (issue #8).
// The singleton carries the section copy; the services teaser and featured strip are
// backed by the same `service` / `project` documents as /storitve and /reference.

/** A value + label pair: a hero stat badge or a stats-strip entry. */
export type Stat = { value?: string; label?: string }

/** A why-us point: an icon row in the rounded panel. */
export type Feature = { title?: string; body?: string }

export type HomeHero = {
  eyebrow?: string
  heading?: string
  lead?: string
  /** Primary "Povprašajte po ponudbi" CTA. */
  cta?: CtaLink
  image: SanityImage | null
  /** Floating stat badges over the hero image. */
  badges?: Stat[]
}

export type HomeStory = {
  eyebrow?: string
  heading?: string
  paragraphs?: PortableTextBlock[] | null
  cta?: CtaLink
}

/** Section heading copy; the cards/slider below come from collection documents. */
export type HomeSectionCopy = { eyebrow?: string; heading?: string; intro?: string }

export type HomeWhyUs = HomeSectionCopy & { items?: Feature[] }

export type HomeContactCopy = { eyebrow?: string; heading?: string; text?: string }

/** The home singleton's authored copy (sections in render order). */
export type HomePage = {
  hero?: HomeHero
  stats?: Stat[]
  story?: HomeStory
  servicesSection?: HomeSectionCopy
  whyUs?: HomeWhyUs
  featuredSection?: HomeSectionCopy
  contact?: HomeContactCopy
}

/** What the home route loads: the singleton plus the documents its sections render. */
export type HomeData = {
  home: HomePage | null
  services: ServiceListItem[]
  projects: ProjectListItem[]
}
