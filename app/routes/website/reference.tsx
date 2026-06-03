import { useLoaderData } from 'react-router'

import type { Route } from './+types/reference'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { projectsQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'
import { projectHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'

import { ListingCard } from '~/components/ListingCard'

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

  return (
    <section className="container-page py-16 sm:py-24">
      <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
        Reference
      </h1>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ListingCard
            key={p._id}
            href={projectHref(p.slug)}
            image={p.photo}
            title={p.title}
            meta={projectMeta(p)}
            summary={p.summary ?? undefined}
          />
        ))}
      </div>
    </section>
  )
}
