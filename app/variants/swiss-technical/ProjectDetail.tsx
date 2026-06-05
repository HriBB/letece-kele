import { ArrowRight, Phone } from 'lucide-react'

import type { ProjectData, SiteData } from '~/lib/types'

import { projectMeta } from '~/lib/format'

import { ContactCta } from '~/components/ContactCta'
import { Gallery } from '~/components/Gallery'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project detail (Swiss technical; ADR 0003 — one type, two depths): an opening
 * data bar (location · year as tabular grotesk), then the summary, gallery, and
 * optional case-study body. The metadata reads like a technical project header;
 * the gallery strip shows without rounding. CTA at foot. Rich body (ADR 0007) uses
 * the shared PortableText with marks, lists, and in-order inline figures.
 */
export function ProjectDetail({ data, site }: { data: ProjectData; site: SiteData }) {
  const { title, location, year, summary, gallery, body } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta
  const meta = projectMeta({ location, year })
  const photos = (gallery ?? []).filter(Boolean)
  const nodes = body ?? []

  const hasProse = nodes.some(
    (b) =>
      (b as { _type?: string })._type === 'block' &&
      Array.isArray((b as { children?: unknown[] }).children) &&
      (b as { children: { text?: unknown }[] }).children.some(
        (c) => typeof c.text === 'string' && c.text.trim() !== '',
      ),
  )
  const showGallery = photos.length > 0

  return (
    <article className="container-page py-16 sm:py-24">
      {/* Data header */}
      <header className="border-b border-ink/10 pb-8">
        {meta && (
          <div className="font-grotesk mb-3 text-sm font-bold tabular-nums text-orange">
            {meta}
          </div>
        )}
        <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {summary && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">{summary}</p>
        )}
      </header>

      {showGallery && (
        <div className="mt-10">
          <Gallery images={photos} title={title} />
        </div>
      )}

      {hasProse && (
        <section className="mt-12 border-l-2 border-orange pl-6">
          <PortableText
            value={body}
            className="mx-auto mt-2 max-w-3xl text-base leading-relaxed text-ink/70"
          />
        </section>
      )}

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
