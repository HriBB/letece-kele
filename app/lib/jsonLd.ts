import { serviceHref } from '~/lib/link'

import type { SiteSettings } from '~/lib/types'

/** The minimal service shape the LocalBusiness offer catalog needs. */
export type ServiceRef = { title: string; slug: string }

/**
 * Builds the site-wide LocalBusiness JSON-LD (schema.org) from siteSettings + the
 * service catalog, so search engines and AI answer surfaces understand the company,
 * how to reach it, and what it offers (issue #9). Pure: the layout renders the result
 * as a single `<script type="application/ld+json">`. Optional fields are emitted only
 * when their source data exists, so the document never carries empty/placeholder keys.
 */
export function localBusinessJsonLd({
  settings,
  services,
  origin,
}: {
  settings: SiteSettings | null
  services: ServiceRef[]
  origin: string
}): Record<string, unknown> {
  const contact = settings?.contact
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: settings?.legal?.companyName ?? settings?.title,
    url: origin,
    ...(contact?.phone ? { telephone: contact.phone } : {}),
    ...(contact?.email ? { email: contact.email } : {}),
    ...(contact?.address
      ? { address: { '@type': 'PostalAddress', streetAddress: contact.address } }
      : {}),
    ...(settings?.legal?.vat ? { vatID: settings.legal.vat } : {}),
    ...(contact?.mapUrl ? { hasMap: contact.mapUrl } : {}),
    ...(services.length
      ? {
          makesOffer: services.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              url: `${origin}${serviceHref(s.slug)}`,
            },
          })),
        }
      : {}),
  }
}
