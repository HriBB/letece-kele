/**
 * Seed the Sanity dataset. Run: pnpm seed
 *   (node --experimental-strip-types --env-file=.env scripts/seed.ts)
 *
 * Idempotent: documents use stable _ids + createOrReplace.
 *
 * Slice #2 seeds the `siteSettings` singleton from the known company data
 * (*osnovni podatki* — verbatim from letecekele.si, see CONTEXT.md / ADR 0005).
 * Later slices extend this script: service / project / aboutPage from the WP REST API.
 */
import { randomUUID } from 'node:crypto'

import { createClient } from '@sanity/client'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? 'production'
const apiVersion = process.env.SANITY_API_VERSION ?? '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env')
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

const NAV = [
  { label: 'Storitve', href: '/storitve' },
  { label: 'Reference', href: '/reference' },
  { label: 'O podjetju', href: '/o-podjetju' },
  { label: 'Kontakt', href: '/kontakt' },
]

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: 'Leteče Kele',
  nav: NAV.map((n) => ({ _key: key(), _type: 'navLink', ...n })),
  headerCta: { _type: 'ctaLink', label: 'Povprašajte po ponudbi', href: '/kontakt' },
  contact: {
    phone: '040 465 749',
    phoneHref: 'tel:+38640465749',
    email: 'info@letecekele.si',
    address: 'Bašelj 37a, 4205 Preddvor',
    mapUrl: 'https://maps.google.com/?q=Ba%C5%A1elj+37a,+4205+Preddvor',
  },
  legal: {
    companyName: 'Leteče kele d.o.o.',
    vat: 'SI66125235',
    reg: '3564533000',
    bankName: 'Gorenjska banka',
    bankIban: 'SI56 0700 0000 1099 973',
  },
  footer: {
    tagline:
      'Kvaliteta na višini — alpinistična vrvna tehnika za sanacijo fasad, betona in jekla.',
    links: NAV.map((n) => ({ _key: key(), _type: 'ctaLink', ...n })),
    copyright: '© 2026 Leteče kele d.o.o. — Vse pravice pridržane.',
  },
}

async function main() {
  await client.createOrReplace(siteSettings)
  console.log('✓ seeded siteSettings')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
