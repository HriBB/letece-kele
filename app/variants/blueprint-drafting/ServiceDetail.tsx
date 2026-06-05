import { ArrowRight, Phone } from 'lucide-react'

import type { ServiceData, SiteData } from '~/lib/types'

import { SIZES } from '~/lib/image'

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
 * Service detail (blueprint/drafting): photo in a thin-ruled frame with corner
 * registration marks; title in a bordered annotation block with drawing labels;
 * process steps as a numbered spec entries list; CTA in a bordered notes box.
 * Distinct from rugged (heavy 4px frame, Manrope black), swiss (aside spec-block
 * + sidebar), alpine (full-bleed reading zone), and wc (shadow cards + side CTA).
 */
export function ServiceDetail({ data, site }: { data: ServiceData; site: SiteData }) {
  const { title, description, photo, steps } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <article className="container-page py-16 sm:py-24">
      {/* Photo with corner registration marks */}
      {photo && (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden border border-ink/20">
          <CornerMarks />
          <Image
            image={photo}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={photo.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
          {/* Drawing label */}
          <div className="absolute bottom-3 right-3 z-10 border border-ink/20 bg-paper/90 px-2 py-1">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
              FIG. 1 — STORITEV
            </span>
          </div>
        </div>
      )}

      {/* Annotation title block */}
      <div className="mb-10 border border-ink/20">
        <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-orange">
            § OPIS STORITVE
          </span>
        </div>
        <div className="p-6 sm:p-8">
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/60">{description}</p>
          )}
        </div>
      </div>

      {/* Process steps — numbered spec entries */}
      {steps && steps.length > 0 && (
        <div className="mb-10 border border-ink/15">
          <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
            <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-orange">
              § POSTOPEK
            </span>
          </div>
          <div className="p-6 sm:p-8">
            <PortableText
              value={steps}
              className="text-sm leading-relaxed text-ink/70"
            />
          </div>
        </div>
      )}

      {/* CTA — general notes box */}
      <div className="border border-ink/20">
        <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
          <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
            KONTAKT
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-6 p-6 sm:p-8">
          <p className="font-mono text-xs text-ink/60">
            Za ponudbo ali vprašanje nas pokličite — svetujemo brezplačno.
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

export default ServiceDetail
