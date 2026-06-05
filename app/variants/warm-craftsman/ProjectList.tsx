import type { ProjectListItem } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { projectHref } from '~/lib/link'

import { ListingCard } from '~/components/ListingCard'

/** Project listing (warm craftsman): a 3-up grid of project cards (sl: reference). */
export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <h1 className="text-ink text-4xl leading-tight font-extrabold sm:text-5xl">
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

export default ProjectList
