import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/storitve'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { servicesQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'

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
  const { variant } = useOutletContext<WebsiteOutletContext>()
  const { ServiceList } = variant.pages
  return <ServiceList services={services} />
}
