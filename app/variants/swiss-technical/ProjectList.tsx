import type { ProjectListItem } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { projectHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project listing (Swiss technical): gap-px grid where metadata (location · year)
 * sits prominently above the title in orange grotesk — making each card read like a
 * project data sheet entry. No card shadows or rounding; the grid lines are the
 * structure.
 */
export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  return (
    <section className="container-page py-16 sm:py-24">
      <header className="mb-10 border-b border-ink/10 pb-8">
        <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
          Izvedeni projekti
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Reference
        </h1>
      </header>

      <div className="grid gap-px bg-ink/8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => {
          const meta = projectMeta(p)
          return (
            <SmartLink
              key={p._id}
              href={projectHref(p.slug)}
              className="group overflow-hidden bg-paper"
            >
              {p.photo && (
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    image={p.photo}
                    sizes={SIZES.grid3}
                    aspectRatio={4 / 3}
                    alt={p.photo.alt ?? p.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-5">
                {meta && (
                  <div className="font-grotesk mb-1.5 text-xs font-bold tabular-nums text-orange">
                    {meta}
                  </div>
                )}
                <h2 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                  {p.title}
                </h2>
                {p.summary && (
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-ink/50">
                    {p.summary}
                  </p>
                )}
              </div>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

export default ProjectList
