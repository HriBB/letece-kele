import { ArrowRight, Phone } from 'lucide-react'

import type { ProjectData, SiteData } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Gallery } from '~/components/Gallery'
import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute right-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 right-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
    </>
  )
}

/**
 * Project detail (blueprint/drafting; ADR 0003 + ADR 0007): lead photo in thin-ruled
 * frame with registration marks + fig label; metadata in annotation header block with
 * datum labels (location, year); gallery in a bordered section; case-study body in
 * reading zone; CTA in notes box. Distinct from rugged (heavy frames), alpine
 * (full-bleed), swiss (data-bar header), and wc (shadow cards + side CTA).
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
      {/* Lead photo with registration marks + fig label */}
      {leadPhoto && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-ink/20">
          <CornerMarks />
          <Image
            image={leadPhoto}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={leadPhoto.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-3 right-3 z-10 border border-ink/20 bg-paper/90 px-2 py-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
              FIG. 1 — REFERENCA
            </span>
          </div>
        </div>
      )}

      {/* Annotation header block — datum labels */}
      <div className="mb-10 border border-ink/20">
        <div className="flex flex-wrap items-center gap-6 border-b border-ink/15 bg-bone px-6 py-3">
          {location && (
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
              LOC: {location}
            </span>
          )}
          {year && (
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
              LETO: {year}
            </span>
          )}
          {meta && (
            <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-orange">
              {meta}
            </span>
          )}
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
          {summary && (
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink/60">{summary}</p>
          )}
        </div>
      </div>

      {/* Remaining gallery photos */}
      {restPhotos.length > 0 && (
        <div className="mb-10 border border-ink/15 bg-bone p-4 sm:p-6">
          <p className="font-mono mb-4 text-[9px] uppercase tracking-[0.25em] text-orange">
            § GALERIJA
          </p>
          <Gallery images={restPhotos} title={title} />
        </div>
      )}

      {/* Case-study body (ADR 0007) */}
      {hasProse && (
        <div className="mb-10 border border-ink/15">
          <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-orange">
              § OPIS PROJEKTA
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <div className="max-w-3xl">
              <PortableText
                value={body}
                className="text-sm leading-relaxed text-ink/70"
              />
            </div>
          </div>
        </div>
      )}

      {/* CTA notes box */}
      <div className="border border-ink/20">
        <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
            KONTAKT
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
          <p className="font-mono text-xs text-ink/60">
            Potrebujete podobno rešitev? Stopite v stik z nami.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {cta?.href && (
              <SmartLink
                href={cta.href}
                className="inline-flex items-center gap-2 bg-orange px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-paper transition-colors hover:bg-orange-dark"
              >
                {cta.label ?? 'Povprašajte po ponudbi'}
                <ArrowRight size={14} />
              </SmartLink>
            )}
            {contact?.phone && contact?.phoneHref && (
              <a
                href={contact.phoneHref}
                className="inline-flex items-center gap-2 border border-ink/20 px-5 py-3 font-mono text-xs tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
              >
                <Phone size={12} className="text-orange" />
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
