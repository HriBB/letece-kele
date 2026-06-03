import { useLoaderData } from 'react-router'

import type { Route } from './+types/reference'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { projectsQuery } from '~/sanity/queries'
import { pageMeta } from '~/lib/meta'
import { projectHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

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
        {projects.map((p) => {
          const meta = projectMeta(p)
          return (
            <SmartLink
              key={p._id}
              href={projectHref(p.slug)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  image={p.photo}
                  sizes={SIZES.card}
                  aspectRatio={4 / 3}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="text-xl font-bold text-ink">{p.title}</h2>
                {meta ? <p className="mt-2 font-bold text-orange">{meta}</p> : null}
                {p.summary ? (
                  <p className="mt-3 text-ink-soft">{p.summary}</p>
                ) : null}
                <span className="mt-6 inline-flex font-bold text-orange">
                  Preberi več →
                </span>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}
