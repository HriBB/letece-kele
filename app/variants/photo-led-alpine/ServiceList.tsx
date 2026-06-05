import { ArrowRight } from 'lucide-react'

import type { ServiceListItem } from '~/lib/types'

import { serviceHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service listing (photo-led alpine): each service is an editorial card — the
 * photo fills the top half (aspect 3:2), the white panel below carries the
 * title, description and a text link. Structurally distinct from warm
 * craftsman (shadow cards) and Swiss (numbered rule list): the photo *is* the
 * card, text is secondary.
 */
export function ServiceList({ services }: { services: ServiceListItem[] }) {
  return (
    <section className="bg-paper">
      <div className="container-page py-16 sm:py-24">
        <header className="mb-12">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
            Ponudba
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Storitve
          </h1>
        </header>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <SmartLink
              key={s._id}
              href={serviceHref(s.slug)}
              className="group block overflow-hidden bg-bone"
            >
              {s.photo && (
                <div className="aspect-[3/2] overflow-hidden">
                  <Image
                    image={s.photo}
                    sizes={SIZES.grid3}
                    aspectRatio={3 / 2}
                    alt={s.photo.alt ?? s.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                  {s.title}
                </h2>
                {s.description && (
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink/60">
                    {s.description}
                  </p>
                )}
                <div className="mt-5 flex items-center gap-1.5 text-sm font-bold text-orange">
                  Izvedi več <ArrowRight size={14} />
                </div>
              </div>
            </SmartLink>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServiceList
