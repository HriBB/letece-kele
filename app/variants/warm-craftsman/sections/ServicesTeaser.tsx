import { ArrowRight, Check } from 'lucide-react'

import type { HomeSectionCopy, ServiceListItem } from '~/lib/types'

import { SIZES } from '~/lib/image'
import { serviceChecklist } from '~/lib/home'
import { serviceHref } from '~/lib/link'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Services teaser: 2-up checklist cards, one per `service` document (the same docs
 * /storitve lists). Each card distils the service's process steps into a short
 * checklist (serviceChecklist) and links to the detail page. Null without services.
 */
export function ServicesTeaser({
  data,
  services,
}: {
  data?: HomeSectionCopy
  services: ServiceListItem[]
}) {
  if (!services || services.length === 0) return null

  return (
    <section className="bg-bone">
      <div className="container-page py-16 sm:py-24">
        <SectionHead data={data} />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {services.map((s) => {
            const checklist = serviceChecklist(s.steps)
            return (
              <SmartLink
                key={s._id}
                href={serviceHref(s.slug)}
                className="group flex flex-col overflow-hidden rounded-3xl bg-paper shadow-sm ring-1 ring-line transition-shadow hover:shadow-lg"
              >
                {s.photo ? (
                  <div className="aspect-[16/9] overflow-hidden">
                    <Image
                      image={s.photo}
                      sizes={SIZES.grid2}
                      aspectRatio={16 / 9}
                      alt={s.photo.alt ?? s.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-manrope text-2xl font-bold text-ink">{s.title}</h3>
                  {s.description ? (
                    <p className="mt-3 text-ink-soft">{s.description}</p>
                  ) : null}
                  {checklist.length > 0 ? (
                    <ul className="mt-5 space-y-2">
                      {checklist.map((line, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-ink-soft">
                          <Check size={16} className="mt-0.5 shrink-0 text-orange" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-bold text-orange">
                    Preberi več <ArrowRight size={16} />
                  </span>
                </div>
              </SmartLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SectionHead({ data }: { data?: HomeSectionCopy }) {
  return (
    <div className="max-w-2xl">
      {data?.eyebrow ? (
        <span className="text-xs font-bold uppercase tracking-widest text-orange">
          {data.eyebrow}
        </span>
      ) : null}
      <h2 className="mt-3 font-manrope text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
        {data?.heading ?? 'Storitve'}
      </h2>
      {data?.intro ? <p className="mt-4 text-lg text-ink-soft">{data.intro}</p> : null}
    </div>
  )
}

export default ServicesTeaser
