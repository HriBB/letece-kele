import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/referenca'
import type { WebsiteOutletContext } from './layout'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { projectQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'

import { ProjectPage } from '~/components/ProjectPage'

export const loader = ({ params, request }: Route.LoaderArgs) =>
  loadSanity(request, projectQuery, {
    params: { slug: params.slug },
    notFoundIfEmpty: true,
  })

export const meta: Route.MetaFunction = ({ data }) => {
  const p = data?.initial?.data
  if (!p)
    return pageMeta({
      title: 'Referenca — Leteče Kele',
      description: 'Referenca podjetja Leteče Kele.',
    })
  const where = [p.location, p.year].filter(Boolean).join(', ')
  return pageMeta({
    title: `${p.title} — Leteče Kele`,
    description: p.summary ?? (where ? `${p.title} — ${where}` : `${p.title} — Leteče Kele`),
    ogTitle: p.title,
    ogType: 'article',
  })
}

export default function ProjectDetailPage() {
  const project = useSanity(projectQuery, useLoaderData<typeof loader>())
  const { site } = useOutletContext<WebsiteOutletContext>()
  if (!project) return null

  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <ProjectPage
      data={project}
      phone={contact?.phone}
      phoneHref={contact?.phoneHref}
      quoteHref={cta?.href ?? '/kontakt'}
      quoteLabel={cta?.label ?? 'Povprašajte po ponudbi'}
    />
  )
}
