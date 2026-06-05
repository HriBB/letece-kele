import type { ProjectListItem } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { projectHref } from '~/lib/link'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project listing (photo-led alpine): an asymmetric photo grid — the first
 * item spans the full width at 16:9 (the hero reference), the rest are 2-up
 * at 4:3. Photos dominate; only the title and meta appear below each image.
 * Structurally distinct from Swiss (gap-px metadata grid) and warm craftsman
 * (equal-weight card grid with summary text).
 */
export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  const [hero, ...rest] = projects

  return (
    <section className="bg-paper">
      <div className="container-page py-16 sm:py-24">
        <header className="mb-10">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
            Izvedeni projekti
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Reference
          </h1>
        </header>

        {/* Lead photo: full-width 16:9 */}
        {hero && (
          <SmartLink
            href={projectHref(hero.slug)}
            className="group mb-6 block overflow-hidden bg-bone"
          >
            {hero.photo && (
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  image={hero.photo}
                  sizes={SIZES.fullBleed}
                  aspectRatio={16 / 9}
                  alt={hero.photo.alt ?? hero.title}
                  priority
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
            )}
            <div className="p-5">
              {projectMeta(hero) && (
                <div className="mb-1.5 text-xs font-bold tabular-nums text-orange">
                  {projectMeta(hero)}
                </div>
              )}
              <h2 className="text-xl font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                {hero.title}
              </h2>
              {hero.summary && (
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink/55">
                  {hero.summary}
                </p>
              )}
            </div>
          </SmartLink>
        )}

        {/* Remaining projects: 2-col photo grid */}
        {rest.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => {
              const meta = projectMeta(p)
              return (
                <SmartLink
                  key={p._id}
                  href={projectHref(p.slug)}
                  className="group block overflow-hidden bg-bone"
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
                  <div className="p-4">
                    {meta && (
                      <div className="mb-1 text-xs font-bold tabular-nums text-orange">
                        {meta}
                      </div>
                    )}
                    <h2 className="text-base font-bold leading-snug text-ink transition-colors group-hover:text-orange">
                      {p.title}
                    </h2>
                  </div>
                </SmartLink>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProjectList
