import { ArrowRight, Phone } from 'lucide-react'

import type { ProjectData, SiteData } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Gallery } from '~/components/Gallery'
import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project detail (construction rugged; ADR 0003 + ADR 0007): lead photo in a
 * heavy-bordered frame (not full-bleed) to signal construction craftsmanship.
 * Meta in a bold bordered box below; remaining gallery images in Gallery component;
 * case-study body (ADR 0007) in a reading zone. CTA strip with thick left border.
 * Distinct from alpine (full-bleed hero), swiss (data-bar header), wc (side CTA).
 */
export function ProjectDetail({ data, site }: { data: ProjectData; site: SiteData }) {
  const { title, location, year, summary, gallery, body } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta
  const meta = projectMeta({ location, year })
  const photos = (gallery ?? []).filter(Boolean)

  const hasProse = (body ?? []).some(
    (b) =>
      (b as { _type?: string })._type === 'block' &&
      Array.isArray((b as { children?: unknown[] }).children) &&
      (b as { children: { text?: unknown }[] }).children.some(
        (c) => typeof c.text === 'string' && c.text.trim() !== '',
      ),
  )

  const [leadPhoto, ...restPhotos] = photos

  return (
    <article className="container-page py-16 sm:py-24">
      {/* Heavy-framed lead photo */}
      {leadPhoto && (
        <div className="mb-10 border-4 border-ink/15 overflow-hidden aspect-[16/9]">
          <Image
            image={leadPhoto}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={leadPhoto.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Meta + title in bordered box */}
      <div className="mb-10 border-l-4 border-orange pl-6">
        {meta && (
          <div className="font-manrope mb-2 text-xs font-black tabular-nums text-orange">
            {meta}
          </div>
        )}
        <h1 className="font-manrope text-4xl font-black leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {summary && (
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink/60">
            {summary}
          </p>
        )}
      </div>

      {/* Remaining gallery photos */}
      {restPhotos.length > 0 && (
        <div className="mb-10 border-2 border-ink/10 bg-bone p-4 sm:p-6">
          <Gallery images={restPhotos} title={title} />
        </div>
      )}

      {/* Case-study body (ADR 0007) */}
      {hasProse && (
        <div className="mb-10 max-w-3xl">
          <PortableText
            value={body}
            className="text-base leading-relaxed text-ink/70"
          />
        </div>
      )}

      {/* CTA strip */}
      <div className="border-l-4 border-orange bg-bone p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <p className="text-base font-semibold text-ink/70">
          Potrebujete podobno rešitev? Stopite v stik z nami.
        </p>
        <div className="flex flex-wrap items-center gap-4">
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className="inline-flex items-center gap-2 bg-orange px-6 py-3.5 font-manrope text-sm font-black tracking-wide uppercase text-paper transition-colors hover:bg-orange-dark"
            >
              {cta.label ?? 'Povprašajte po ponudbi'}
              <ArrowRight size={15} />
            </SmartLink>
          )}
          {contact?.phone && contact?.phoneHref && (
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2 border-2 border-ink/20 px-5 py-3 text-sm font-bold tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
            >
              <Phone size={14} />
              {contact.phone}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProjectDetail
