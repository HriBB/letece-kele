import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/storitev'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { serviceQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'

import { ServicePage } from '~/components/ServicePage'

export const loader = ({ params, request }: Route.LoaderArgs) =>
  loadSanity(request, serviceQuery, {
    params: { slug: params.slug },
    notFoundIfEmpty: true,
  })

export const meta: Route.MetaFunction = ({ data }) => {
  const s = data?.initial?.data
  if (!s)
    return pageMeta({
      title: 'Storitev — Leteče Kele',
      description: 'Storitev podjetja Leteče Kele.',
    })
  return pageMeta({
    title: `${s.title} — Leteče Kele`,
    description: s.description ?? `${s.title} — Leteče Kele`,
    ogTitle: s.title,
    ogType: 'article',
  })
}

export default function ServiceDetailPage() {
  const service = useSanity(serviceQuery, useLoaderData<typeof loader>())
  const { site } = useOutletContext<WebsiteOutletContext>()
  if (!service) return null

  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <ServicePage
      data={service}
      phone={contact?.phone}
      phoneHref={contact?.phoneHref}
      quoteHref={cta?.href ?? '/kontakt'}
      quoteLabel={cta?.label ?? 'Povprašajte po ponudbi'}
    />
  )
}
