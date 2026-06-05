import type { ProjectData, SiteData } from '~/lib/types'

import { projectMeta } from '~/lib/format'

import { ContactCta } from '~/components/ContactCta'
import { Gallery } from '~/components/Gallery'
import { PortableText } from '~/components/PortableText'

/**
 * Project detail (warm craftsman; ADR 0003 — one type, two depths): a title with a
 * location · year meta line, the summary, the photo gallery (pure-CSS scroll-snap
 * slider), and — when present — the case-study `body`. A project with a rich body
 * reads as a full case study; a gallery-only project reads as a reference card.
 * Closes with a quote/contact CTA. Tap-to-call is a plain `tel:` anchor; the quote
 * link is an in-app path via SmartLink. Phone + quote CTA come from siteSettings.
 */
export function ProjectDetail({ data, site }: { data: ProjectData; site: SiteData }) {
  const { title, location, year, summary, gallery, body } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta
  const meta = projectMeta({ location, year })
  const photos = (gallery ?? []).filter(Boolean)
  const nodes = body ?? []

  // ADR 0003 — one type, two depths. A body with real prose reads as a full case
  // study (render it inline); a body with no prose reads as a reference card.
  const hasProse = nodes.some(
    (b) =>
      (b as { _type?: string })._type === 'block' &&
      Array.isArray((b as { children?: unknown[] }).children) &&
      (b as { children: { text?: unknown }[] }).children.some(
        (c) => typeof c.text === 'string' && c.text.trim() !== '',
      ),
  )
  // The gallery strip shows whenever the project has photos (ADR 0007): the strip
  // is the at-a-glance overview, the inline body figures the narrative placement —
  // the two showing the same photos is accepted.
  const showGallery = photos.length > 0

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="mx-auto max-w-3xl">
        <h1 className="text-ink text-4xl leading-tight font-extrabold sm:text-5xl">
          {title}
        </h1>
        {meta ? <p className="text-orange mt-4 font-bold">{meta}</p> : null}
        {summary ? (
          <p className="text-ink-soft mt-5 text-lg leading-relaxed">{summary}</p>
        ) : null}
      </header>

      {showGallery ? (
        <div className="mt-10">
          <Gallery images={photos} title={title} />
        </div>
      ) : null}

      {hasProse ? (
        <section className="mt-12">
          <PortableText
            value={body}
            className="text-ink-soft mx-auto mt-5 max-w-3xl"
          />
        </section>
      ) : null}

      <ContactCta
        heading="Potrebujete podobno rešitev?"
        phone={contact?.phone}
        phoneHref={contact?.phoneHref}
        quoteHref={cta?.href ?? '/kontakt'}
        quoteLabel={cta?.label ?? 'Povprašajte po ponudbi'}
      />
    </article>
  )
}

export default ProjectDetail
