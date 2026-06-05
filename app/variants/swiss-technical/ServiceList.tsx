import { ArrowRight } from 'lucide-react'

import type { ServiceListItem } from '~/lib/types'

import { serviceHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service listing (Swiss technical): numbered rule list with a lead photo on each
 * row. Thin horizontal rules separate items; the index number is an orange accent;
 * the photo is tight (4:3) with no rounding. Structurally distinct from warm
 * craftsman's 3-up card grid.
 */
export function ServiceList({ services }: { services: ServiceListItem[] }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <header className="border-b border-ink/10 pb-8">
        <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
          Ponudba
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Storitve
        </h1>
      </header>

      <div className="divide-y divide-ink/8">
        {services.map((s, i) => (
          <SmartLink
            key={s._id}
            href={serviceHref(s.slug)}
            className="group grid items-start gap-6 py-8 sm:grid-cols-[auto_1fr_auto] sm:items-center"
          >
            <span className="font-grotesk hidden w-8 shrink-0 text-sm font-bold tabular-nums text-orange sm:block">
              {String(i + 1).padStart(2, '0')}
            </span>

            <div className="flex items-start gap-5">
              {s.photo && (
                <div className="aspect-[4/3] w-24 shrink-0 overflow-hidden sm:w-32">
                  <Image
                    image={s.photo}
                    sizes={SIZES.grid4}
                    aspectRatio={4 / 3}
                    alt={s.photo.alt ?? s.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div>
                <h2 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/60">
                    {s.description}
                  </p>
                )}
              </div>
            </div>

            <ArrowRight
              size={18}
              className="hidden shrink-0 text-ink/20 transition-colors group-hover:text-orange sm:block"
            />
          </SmartLink>
        ))}
      </div>
    </section>
  )
}

export default ServiceList
