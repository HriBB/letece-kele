import { useLoaderData } from 'react-router'

import type { Route } from './+types/storitve'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { servicesQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'
import { serviceHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

export const loader = ({ request }: Route.LoaderArgs) =>
  loadSanity(request, servicesQuery)

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Storitve — Leteče Kele',
    description:
      'Sanacija fasad, betona in jeklenih konstrukcij z alpinistično vrvno tehniko, dilatacije in montaža sončnih elektrarn — brez gradbenih odrov.',
  })

export default function ServicesPage() {
  const services = useSanity(servicesQuery, useLoaderData<typeof loader>()) ?? []

  return (
    <section className="container-page py-16 sm:py-24">
      <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
        Storitve
      </h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <SmartLink
            key={s._id}
            href={serviceHref(s.slug)}
            className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-lg"
          >
            <div className="aspect-[4/3] overflow-hidden">
              <Image
                image={s.photo}
                sizes={SIZES.card}
                aspectRatio={4 / 3}
                alt={s.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h2 className="text-xl font-bold text-ink">{s.title}</h2>
              {s.description ? (
                <p className="mt-3 text-ink-soft">{s.description}</p>
              ) : null}
              <span className="mt-6 inline-flex font-bold text-orange">
                Preberi več →
              </span>
            </div>
          </SmartLink>
        ))}
      </div>
    </section>
  )
}
