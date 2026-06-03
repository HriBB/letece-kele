import { useLoaderData } from 'react-router'

import type { Route } from './+types/storitve'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { servicesQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'
import { serviceHref } from '~/lib/link'

import { ListingCard } from '~/components/ListingCard'

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
          <ListingCard
            key={s._id}
            href={serviceHref(s.slug)}
            image={s.photo}
            title={s.title}
            summary={s.description ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}
