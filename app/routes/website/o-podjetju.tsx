import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/o-podjetju'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { aboutQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'

export const loader = ({ request }: Route.LoaderArgs) =>
  loadSanity(request, aboutQuery)

export const meta: Route.MetaFunction = ({ data }) => {
  const about = data?.initial?.data
  return pageMeta({
    title: `${about?.title ?? 'O podjetju'} — Leteče Kele`,
    description:
      about?.intro ??
      'Spoznajte Leteče Kele — ekipo alpinistov za višinska dela: naša vizija, kvaliteta in zakaj delamo na višini.',
    ogTitle: about?.title ?? 'O podjetju',
    ogType: 'article',
  })
}

export default function AboutRoute() {
  const about = useSanity(aboutQuery, useLoaderData<typeof loader>())
  const { variant } = useOutletContext<WebsiteOutletContext>()
  if (!about) return null
  const { About } = variant.pages
  return <About data={about} />
}
