import { ArrowRight } from 'lucide-react'

import type { ServiceListItem } from '~/lib/types'

import { serviceHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

/**
 * Service list (blueprint/drafting): annotated spec-table layout. Page header uses
 * annotation-label style; each service is a numbered row in a bordered spec table
 * with thumbnail on right for wider viewports. Distinct from rugged (thick borders,
 * Manrope black), swiss (thin rule editorial list), alpine (photo-card editorial),
 * and wc (shadow cards).
 */
export function ServiceList({ services }: { services: ServiceListItem[] }) {
  return (
    <div className="min-h-screen bg-bone" style={gridBg}>
      <div className="container-page py-16 sm:py-24">
        {/* Page header — annotation style */}
        <div className="mb-10 border border-ink/20 bg-paper px-8 py-6">
          <p className="font-mono mb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
            § KATALOG STORITEV
          </p>
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">Storitve</h1>
        </div>

        {/* Spec table */}
        <div className="border border-ink/15 divide-y divide-ink/10">
          {services.map((s, i) => (
            <SmartLink
              key={s._id}
              href={serviceHref(s.slug)}
              className="group grid items-center gap-4 bg-paper px-5 py-5 transition-colors hover:bg-bone-2 sm:grid-cols-[3rem_1fr_auto]"
            >
              <span className="font-mono text-lg tabular-nums text-orange/30 transition-colors group-hover:text-orange">
                {String(i + 1).padStart(2, '0')}.
              </span>

              <div className="min-w-0">
                <h2 className="text-base font-semibold leading-snug text-ink transition-colors group-hover:text-orange">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="mt-1 line-clamp-2 font-mono text-[10px] leading-relaxed text-ink/40">
                    {s.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4">
                {s.photo && (
                  <div className="relative hidden aspect-[4/3] w-20 overflow-hidden border border-ink/15 sm:block">
                    <Image
                      image={s.photo}
                      sizes="80px"
                      aspectRatio={4 / 3}
                      alt={s.photo.alt ?? s.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <ArrowRight
                  size={16}
                  className="shrink-0 text-ink/20 transition-colors group-hover:text-orange"
                />
              </div>
            </SmartLink>
          ))}
        </div>

        {/* Table footer — revision note */}
        <div className="mt-3 flex items-center justify-between border-t-0">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">
            SKUPAJ: {services.length} STORITEV
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/20">REV A</p>
        </div>
      </div>
    </div>
  )
}

export default ServiceList
