// Front-end result shapes for the Sanity descriptor seam. Each later slice adds
// its own types (service, project, homePage, aboutPage); this file currently holds
// the site-wide settings consumed by the shared layout (Header / Footer / contact).

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

export type SiteData = {
  settings: SiteSettings | null
}
