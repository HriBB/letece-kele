import { ArrowRight } from 'lucide-react'

import type { ServiceListItem } from '~/lib/types'

import { serviceHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service list (construction rugged): bold numbered rows with thick orange
 * left borders. Each row shows a heavy-framed thumbnail to the right on wider
 * screens. Distinct from swiss ruled list, alpine photo-cards, wc shadow cards.
 */
export function ServiceList({ services }: { services: ServiceListItem[] }) {
  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mb-10 border-l-4 border-orange pl-5">
        <h1 className="font-manrope text-4xl font-black leading-tight text-ink sm:text-5xl">
          Storitve
        </h1>
      </div>

      <div className="space-y-3">
        {services.map((s, i) => (
          <SmartLink
            key={s._id}
            href={serviceHref(s.slug)}
            className="group grid items-center gap-6 border-2 border-ink/10 bg-paper p-6 transition-colors hover:border-orange sm:grid-cols-[auto_1fr_auto]"
          >
            <span className="font-manrope text-4xl font-black tabular-nums leading-none text-orange/20 transition-colors group-hover:text-orange/40">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="min-w-0">
              <h2 className="font-manrope text-lg font-black leading-snug text-ink transition-colors group-hover:text-orange">
                {s.title}
              </h2>
              {s.description && (
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/50">
                  {s.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">
              {s.photo && (
                <div className="hidden aspect-[4/3] w-24 overflow-hidden border-2 border-ink/10 sm:block">
                  <Image
                    image={s.photo}
                    sizes={SIZES.grid3}
                    aspectRatio={4 / 3}
                    alt={s.photo.alt ?? s.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <ArrowRight
                size={20}
                className="shrink-0 text-ink/20 transition-colors group-hover:text-orange"
              />
            </div>
          </SmartLink>
        ))}
      </div>
    </div>
  )
}

export default ServiceList
