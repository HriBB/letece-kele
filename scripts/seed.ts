/**
 * Seed the Sanity dataset. Run: pnpm seed
 *   (node --experimental-strip-types --env-file=.env scripts/seed.ts)
 *
 * Idempotent: documents use stable _ids + createOrReplace.
 *
 * Slice #2 seeds the `siteSettings` singleton from the known company data
 * (*osnovni podatki* — verbatim from letecekele.si, see CONTEXT.md / ADR 0005).
 * Slice #4 adds the five WordPress `service` pages, cleaned via the shared cleaner.
 * Later slices extend this script: project / aboutPage from the WP REST API.
 */
import { randomUUID } from 'node:crypto'

import { createClient } from '@sanity/client'

// Pure WP-page → service mapper (cleans bodies via the shared cleaner). Imported
// with an explicit .ts path so it runs under `node --experimental-strip-types`.
import { wpPageToService } from '../app/lib/wp-service.ts'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? 'production'
const apiVersion = process.env.SANITY_API_VERSION ?? '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env')
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ---- WordPress source (ADR 0005) ----
// The five service pages: parent id 30 → child ids, in display order.
const WP_BASE = process.env.WP_BASE_URL ?? 'https://letecekele.si'
const SERVICE_PAGE_IDS = [177, 179, 181, 183, 218]

type WpPage = {
  slug: string
  title: { rendered: string }
  excerpt?: { rendered: string } | null
  content: { rendered: string }
}

async function fetchWpPage(id: number): Promise<WpPage> {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${id}`)
  if (!res.ok) throw new Error(`WP page ${id}: HTTP ${res.status}`)
  return (await res.json()) as WpPage
}

/** Upload a remote WordPress image and return a `figure` referencing the asset. */
async function uploadFigure(
  url: string | undefined,
  alt: string,
): Promise<Record<string, unknown> | undefined> {
  if (!url) return undefined
  const res = await fetch(url)
  if (!res.ok) throw new Error(`image ${url}: HTTP ${res.status}`)
  const filename = decodeURIComponent(url.split('/').pop() ?? 'photo.jpg')
  const buffer = Buffer.from(await res.arrayBuffer())
  const asset = await client.assets.upload('image', buffer, { filename })
  return {
    _type: 'figure',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  }
}

async function seedServices() {
  console.log(`Fetching ${SERVICE_PAGE_IDS.length} WordPress service pages…`)
  for (const [i, id] of SERVICE_PAGE_IDS.entries()) {
    const page = await fetchWpPage(id)
    const { photoUrl, ...doc } = wpPageToService(page, i)
    const photo = await uploadFigure(photoUrl, doc.title)
    await client.createOrReplace({ ...doc, photo })
    console.log(`  ✓ service.${doc.slug} ("${doc.title}")`)
  }
}

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

  await seedServices()
  console.log('✓ seeded services')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
