import { useLoaderData, useOutletContext } from 'react-router'

import type { Route } from './+types/reference'
import type { WebsiteOutletContext } from './layout'

import { pageMeta } from '~/lib/meta'
import { useSanity } from '~/sanity/data'
import { loadSanity } from '~/sanity/data.server'
import { projectsQuery } from '~/sanity/queries'

export const loader = ({ request }: Route.LoaderArgs) =>
  loadSanity(request, projectsQuery)

export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Reference — Leteče Kele',
    description:
      'Izbrane reference: sanacije fasad, betonskih in jeklenih konstrukcij ter montaže sončnih elektrarn z alpinistično vrvno tehniko.',
  })

export default function ReferencesPage() {
  const projects = useSanity(projectsQuery, useLoaderData<typeof loader>()) ?? []
  const { variant } = useOutletContext<WebsiteOutletContext>()
  const { ProjectList } = variant.pages
  return <ProjectList projects={projects} />
}
