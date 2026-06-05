import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/home'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { homeQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'

export const loader = ({ request }: Route.LoaderArgs) => loadSanity(request, homeQuery)

export const meta: Route.MetaFunction = ({ data }) =>
  pageMeta({
    title: 'Leteče Kele — Kvaliteta na višini',
    description:
      data?.initial?.data?.home?.hero?.lead ??
      'Alpinistična višinska dela — sanacija fasad, betona in jeklenih konstrukcij brez gradbenih odrov.',
    ogTitle: 'Leteče Kele',
  })

export default function HomePage() {
  const data = useSanity(homeQuery, useLoaderData<typeof loader>())
  const { site, variant } = useOutletContext<WebsiteOutletContext>()
  if (!data) return null
  const { Home } = variant.pages
  return <Home data={data} site={site} />
}
