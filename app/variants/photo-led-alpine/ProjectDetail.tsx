import { ArrowRight, Phone } from 'lucide-react'

import type { ProjectData, SiteData } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Gallery } from '~/components/Gallery'
import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project detail (photo-led alpine; ADR 0003 + ADR 0007): lead gallery image
 * at full-bleed 16:9 — the project announces itself photographically. Meta +
 * title in a white panel below; the remaining gallery photos follow in a
 * scroll-snap slider; the case-study body (when present) in a clean reading
 * column. No dark scrims. Structurally distinct from Swiss (data-bar header,
 * orange left-border body) and warm craftsman (in-container photo, side CTA).
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
    <article>
      {/* Full-bleed lead photo */}
      {leadPhoto && (
        <div className="aspect-[3/2] w-full overflow-hidden sm:aspect-[16/9]">
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

      {/* Title + meta panel */}
      <div className="bg-paper">
        <div className="container-page py-10 sm:py-14">
          {meta && (
            <div className="mb-3 text-sm font-bold tabular-nums text-orange">{meta}</div>
          )}
          <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {summary && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">{summary}</p>
          )}
        </div>
      </div>

      {/* Remaining gallery photos */}
      {restPhotos.length > 0 && (
        <div className="bg-bone">
          <div className="container-page py-10 sm:py-14">
            <Gallery images={restPhotos} title={title} />
          </div>
        </div>
      )}

      {/* Case-study body (ADR 0007) */}
      {hasProse && (
        <div className="bg-paper">
          <div className="container-page py-12 sm:py-16">
            <div className="max-w-3xl">
              <PortableText
                value={body}
                className="text-base leading-relaxed text-ink/70"
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA band */}
      <div className="bg-bone">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-10">
          <p className="text-base font-semibold text-ink/70">
            Potrebujete podobno rešitev? Stopite v stik z nami.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {cta?.href && (
              <SmartLink
                href={cta.href}
                className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors"
              >
                {cta.label ?? 'Povprašajte po ponudbi'}
                <ArrowRight size={15} />
              </SmartLink>
            )}
            {contact?.phone && contact?.phoneHref && (
              <a
                href={contact.phoneHref}
                className="font-grotesk inline-flex items-center gap-2 text-sm font-semibold tabular-nums text-ink transition-colors hover:text-orange"
              >
                <Phone size={14} className="text-orange" />
                {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ProjectDetail
