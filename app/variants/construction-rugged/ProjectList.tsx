import type { ProjectListItem } from '~/lib/types'

import { projectHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Project list (construction rugged): heavy-frame photo grid with bold bottom
 * bar for title + location. First item spans full width at 16:9 (reference hero);
 * rest in 2-col / 3-col 4:3 grid. Heavy border frames hover to orange. Distinct
 * from swiss metadata-heavy gap-px, alpine asymmetric editorial, wc shadow cards.
 */
export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  const [first, ...rest] = projects

  return (
    <div className="container-page py-16 sm:py-24">
      <div className="mb-10 border-l-4 border-orange pl-5">
        <h1 className="font-manrope text-4xl font-black leading-tight text-ink sm:text-5xl">
          Reference
        </h1>
      </div>

      <div className="space-y-4">
        {/* Hero reference — full-width 16:9 */}
        {first && (
          <SmartLink
            href={projectHref(first.slug)}
            className="group block border-4 border-ink/10 bg-paper transition-colors hover:border-orange"
          >
            {first.photo && (
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  image={first.photo}
                  sizes={SIZES.fullBleed}
                  aspectRatio={16 / 9}
                  alt={first.photo.alt ?? first.title}
                  priority
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </div>
            )}
            <div className="border-t-4 border-ink/8 p-6 group-hover:border-orange/30">
              {projectMeta(first) && (
                <div className="font-manrope mb-1 text-xs font-black tabular-nums text-orange">
                  {projectMeta(first)}
                </div>
              )}
              <h2 className="font-manrope text-2xl font-black leading-snug text-ink">
                {first.title}
              </h2>
              {first.summary && (
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink/50">
                  {first.summary}
                </p>
              )}
            </div>
          </SmartLink>
        )}

        {/* Remaining projects grid */}
        {rest.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => {
              const meta = projectMeta(p)
              return (
                <SmartLink
                  key={p._id}
                  href={projectHref(p.slug)}
                  className="group border-2 border-ink/10 bg-paper transition-colors hover:border-orange"
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
                  <div className="border-t-2 border-ink/8 p-5 group-hover:border-orange/30">
                    {meta && (
                      <div className="font-manrope mb-1 text-xs font-black tabular-nums text-orange">
                        {meta}
                      </div>
                    )}
                    <h2 className="font-manrope text-base font-black leading-snug text-ink">
                      {p.title}
                    </h2>
                  </div>
                </SmartLink>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectList
