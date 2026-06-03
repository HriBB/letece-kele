/**
 * Seed the Sanity dataset. Run: pnpm seed
 *   (node --experimental-strip-types --env-file=.env scripts/seed.ts)
 *
 * Idempotent: documents use stable _ids + createOrReplace.
 *
 * Slice #2 seeds the `siteSettings` singleton from the known company data
 * (*osnovni podatki* — verbatim from letecekele.si, see CONTEXT.md / ADR 0005).
 * Slice #4 adds the five WordPress `service` pages, cleaned via the shared cleaner.
 * Slice #5 adds the `projekti`-category posts as `project` documents, lifting the
 * `[gallery]`/embedded images into `project.gallery`.
 * Slice #6 merges the o-podjetju / vizija / kvaliteta WordPress pages (plus the
 * authored alpinist credibility story) into the single `aboutPage` singleton.
 * Slice #8 composes the `homePage` singleton (authored section copy — the variant-5
 * fold-in) and flags the first few projects for the home featured strip.
 */
import { randomUUID } from 'node:crypto'

import { createClient } from '@sanity/client'

// Pure WP → document mappers (clean bodies via the shared cleaner). Imported with
// explicit .ts paths so they run under `node --experimental-strip-types`.
import { wpPageToService } from '../app/lib/wp-service.ts'
import { wpPostToProject } from '../app/lib/wp-project.ts'
import { wpPagesToAbout } from '../app/lib/wp-about.ts'

import type { WpPost } from '../app/lib/wp-project.ts'
import type { WpPage } from '../app/lib/wp-text.ts'

const projectId = process.env.SANITY_PROJECT_ID
const dataset = process.env.SANITY_DATASET ?? 'production'
const apiVersion = process.env.SANITY_API_VERSION ?? '2024-10-01'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId || !token) {
  throw new Error('Missing SANITY_PROJECT_ID or SANITY_WRITE_TOKEN in .env')
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// Authored singletons (homePage + aboutPage section copy) are createIfNotExists so a
// re-seed never clobbers wording a human refined in Studio (ADR 0005: "one-off content
// fixes happen in the Studio afterwards"). Migrated docs (service/project) stay
// createOrReplace so re-running re-migrates them. Set SEED_FORCE=1 to overwrite anyway.
const FORCE_AUTHORED = process.env.SEED_FORCE === '1'

// ---- WordPress source (ADR 0005) ----
// The five service pages: parent id 30 → child ids, in display order.
const WP_BASE = process.env.WP_BASE_URL ?? 'https://letecekele.si'
const SERVICE_PAGE_IDS = [177, 179, 181, 183, 218]
// The "projekti" blog category (id 5). Personal blog posts (filmi/reportaže/
// utrinki) live under other categories and are NOT migrated (ADR 0002) — fetching
// only this category is what keeps them out of the dataset.
const PROJEKTI_CATEGORY_ID = 5
// The three about stub pages, in narrative order: o-podjetju, vizija, kvaliteta.
const ABOUT_PAGE_IDS = [159, 52, 172]
// How many of the (date-desc ordered) projects to flag for the home featured strip.
// A sensible default the editor can curate in Studio; the home falls back to the
// first N anyway (selectFeaturedProjects), so an unflagged dataset still renders.
const FEATURED_COUNT = 3

// The alpinist "why we work at height" credibility story — a capability framing
// folded into the About page (issue #6). This is NOT a migrated page: the personal
// climbing trip reports (filmi/reportaže/utrinki) are deliberately left out (ADR
// 0002). Authored placeholder copy — a human finalises the exact wording with the
// live seed.
const ALPINIST_STORY: WpPage = {
  slug: 'alpinizem',
  title: { rendered: 'Zakaj delamo na višini' },
  content: {
    rendered:
      '<p>Ekipa Letečih Kel so izurjeni alpinisti z večletnimi izkušnjami v gorah. ' +
      'Prav znanje vrvne tehnike nam omogoča varen dostop do najtežje dostopnih mest — ' +
      'fasad, dimnikov, mostov in jeklenih konstrukcij — brez gradbenih odrov. Delo na ' +
      'višini ni naš konjiček, ampak poklicna prednost: hitreje, ceneje in z manj posegi v okolico.</p>',
  },
}

async function fetchWpPage(id: number): Promise<WpPage> {
  const res = await fetch(`${WP_BASE}/wp-json/wp/v2/pages/${id}`)
  if (!res.ok) throw new Error(`WP page ${id}: HTTP ${res.status}`)
  return (await res.json()) as WpPage
}

/** Fetch every post in a WordPress category (one page is plenty for ~14 posts). */
async function fetchWpPostsByCategory(categoryId: number): Promise<WpPost[]> {
  const res = await fetch(
    `${WP_BASE}/wp-json/wp/v2/posts?categories=${categoryId}&per_page=100&orderby=date&order=desc`,
  )
  if (!res.ok) throw new Error(`WP posts (cat ${categoryId}): HTTP ${res.status}`)
  return (await res.json()) as WpPost[]
}

// One download+upload per distinct source URL within a seed run — a WP image reused
// across posts (shared hero/category shots) resolves to one Sanity asset, not N.
const assetByUrl = new Map<string, string>()

/** Upload a remote WordPress image (memoised by URL) and return a `figure` ref. */
async function uploadFigure(
  url: string | undefined,
  alt: string,
): Promise<Record<string, unknown> | undefined> {
  if (!url) return undefined
  let assetId = assetByUrl.get(url)
  if (!assetId) {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`image ${url}: HTTP ${res.status}`)
    const filename = decodeURIComponent(url.split('/').pop() ?? 'photo.jpg')
    const buffer = Buffer.from(await res.arrayBuffer())
    const asset = await client.assets.upload('image', buffer, { filename })
    assetId = asset._id
    assetByUrl.set(url, assetId)
  }
  return {
    _type: 'figure',
    asset: { _type: 'reference', _ref: assetId },
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
    console.log(`  ✓ service.${doc.slug.current} ("${doc.title}")`)
  }
}

/** Upload each lifted gallery image as a keyed `figure` for `project.gallery`. */
async function uploadGallery(
  images: { src: string; alt: string }[],
): Promise<Record<string, unknown>[]> {
  const figures: Record<string, unknown>[] = []
  for (const img of images) {
    const figure = await uploadFigure(img.src, img.alt)
    if (figure) figures.push({ ...figure, _key: key() })
  }
  return figures
}

async function seedProjects() {
  const posts = await fetchWpPostsByCategory(PROJEKTI_CATEGORY_ID)
  console.log(`Fetching ${posts.length} WordPress projekti posts…`)
  for (const [i, post] of posts.entries()) {
    const { galleryUrls, ...doc } = wpPostToProject(post, i)
    const gallery = await uploadGallery(galleryUrls)
    // Flag the first few as featured for the home strip (editor curates in Studio).
    await client.createOrReplace({ ...doc, gallery, featured: i < FEATURED_COUNT })
    console.log(`  ✓ project.${doc.slug.current} ("${doc.title}")`)
  }
}

async function seedAbout() {
  console.log(`Fetching ${ABOUT_PAGE_IDS.length} WordPress about pages…`)
  const pages: WpPage[] = []
  for (const id of ABOUT_PAGE_IDS) pages.push(await fetchWpPage(id))
  // Merge the about pages + the authored alpinist story into the one singleton.
  const { heroUrl, ...doc } = wpPagesToAbout([...pages, ALPINIST_STORY])
  const heroImage = await uploadFigure(heroUrl, doc.title)
  const about = { ...doc, heroImage }
  await (FORCE_AUTHORED ? client.createOrReplace(about) : client.createIfNotExists(about))
  console.log(`  ✓ aboutPage ("${doc.title}")${FORCE_AUTHORED ? '' : ' (createIfNotExists)'}`)
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

// A `normal` Portable Text paragraph block (keyed) for authored prose fields.
const block = (text: string) => ({
  _key: key(),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{ _key: key(), _type: 'span', text, marks: [] }],
})
const stat = (value: string, label: string) => ({ _key: key(), _type: 'stat', value, label })
const feature = (title: string, body: string) => ({ _key: key(), _type: 'feature', title, body })

// The home page singleton — the variant-5 "Warm craftsman" fold-in (issue #8). Only
// authored section copy lives here; the services teaser and featured strip render the
// same `service` / `project` documents seeded above (ADR 0003). The hero photo is
// attached by a human in Studio with the live seed (deferred).
const homePage = {
  _id: 'homePage',
  _type: 'homePage',
  hero: {
    eyebrow: 'Alpinistična višinska dela · Slovenija',
    heading: 'Sanacije na višini, brez odrov.',
    lead:
      'S pomočjo alpinističnega znanja in vrvne tehnike saniramo fasade, betonske površine in ' +
      'jeklene konstrukcije tudi tam, kjer uporaba zidarskih odrov ni smotrna.',
    cta: { _type: 'ctaLink', label: 'Povprašajte po ponudbi', href: '/kontakt' },
    badges: [
      stat('15+', 'let na višini'),
      stat('140', 'enot na enem bloku'),
      stat('100%', 'brez odrov'),
    ],
  },
  stats: [
    stat('2012', 'aktivni od'),
    stat('15+', 'let na višini'),
    stat('140', 'enot na enem bloku'),
    stat('100%', 'brez gradbenih odrov'),
  ],
  story: {
    eyebrow: 'O podjetju',
    heading: 'Iz strasti do gora v poklic na višini',
    paragraphs: [
      block(
        'Pred petnajstimi leti je štiri mlade fante začela družiti strast do gora, sčasoma pa ' +
          'smo svoje alpinistične izkušnje začeli uporabljati tudi pri delu na višini.',
      ),
      block(
        'S pomočjo alpinističnega znanja in opreme izpeljemo projekte, kjer uporaba zidarskih ' +
          'odrov ni smotrna. Večina dela poteka z vrvno tehniko in visečimi odri.',
      ),
    ],
    cta: { _type: 'ctaLink', label: 'Spoznajte ekipo', href: '/o-podjetju' },
  },
  servicesSection: {
    eyebrow: 'Kaj delamo',
    heading: 'Storitve',
    intro:
      'Od sanacije betona in fasad do jeklenih konstrukcij in sončnih elektrarn — vse z vrvno ' +
      'tehniko, brez gradbenih odrov.',
  },
  whyUs: {
    eyebrow: 'Zakaj mi',
    heading: 'Kvaliteta na višini',
    intro: 'Štiri prednosti, ki jih prinese alpinistični pristop k delu na višini.',
    items: [
      feature(
        'Brez odrov',
        'Z vrvno tehniko in visečimi odri pridemo tja, kjer postavljanje zidarskih odrov ni smotrno.',
      ),
      feature(
        'Krajši rok izvedbe',
        'Delo po sklopih pomeni manj motenj za stanovalce in hitrejši zaključek projekta.',
      ),
      feature(
        'Najkvalitetnejši materiali',
        'Skrbno izbrani materiali, ki ustrezajo ekološkim standardom — že iz naših alpinističnih let.',
      ),
      feature(
        'Vrhunsko usposobljena ekipa',
        'Vsi delavci smo usposobljeni za delo na višini in pripravljeni na največje izzive.',
      ),
    ],
  },
  featuredSection: {
    eyebrow: 'Izbrane reference',
    heading: 'Naši projekti',
    intro:
      'Nekaj zaključenih projektov — od stanovanjskih blokov do specialnih višinskih del doma in v tujini.',
  },
  contact: {
    eyebrow: 'Kontakt',
    heading: 'Povprašajte po ponudbi',
    text: 'Pokličite nas ali pišite — svetujemo brezplačno in pripravimo ponudbo brez obveznosti.',
  },
}

async function main() {
  await client.createOrReplace(siteSettings)
  console.log('✓ seeded siteSettings')

  await seedServices()
  console.log('✓ seeded services')

  await seedProjects()
  console.log('✓ seeded projects')

  await seedAbout()
  console.log('✓ seeded aboutPage')

  await (FORCE_AUTHORED ? client.createOrReplace(homePage) : client.createIfNotExists(homePage))
  console.log(`✓ seeded homePage${FORCE_AUTHORED ? '' : ' (createIfNotExists)'}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
