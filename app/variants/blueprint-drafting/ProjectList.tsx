import type { ProjectListItem } from '~/lib/types'

import { projectHref } from '~/lib/link'
import { projectMeta } from '~/lib/format'
import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

function CornerMarks() {
  return (
    <>
      <span className="pointer-events-none absolute left-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute right-0 top-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 left-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
      <span className="pointer-events-none absolute bottom-0 right-0 z-10 size-5">
        <span className="absolute inset-x-0 top-1/2 block h-px -translate-y-1/2 bg-ink/25" />
        <span className="absolute inset-y-0 left-1/2 block w-px -translate-x-1/2 bg-ink/25" />
      </span>
    </>
  )
}

/**
 * Project list (blueprint/drafting): thin-ruled photo grid with corner registration
 * marks on every card. First project at full 16:9 width as lead "drawing"; rest in
 * uniform 3-col grid. Metadata as annotation label. Distinct from rugged (heavy 4px
 * borders), alpine (asymmetric editorial hero), swiss (metadata-heavy gap-px grid),
 * and wc (shadow cards).
 */
export function ProjectList({ projects }: { projects: ProjectListItem[] }) {
  const [first, ...rest] = projects

  return (
    <div className="bg-bone min-h-screen" style={gridBg}>
      <div className="container-page py-16 sm:py-24">
        {/* Page header */}
        <div className="mb-10 border border-ink/20 bg-paper px-8 py-6">
          <p className="font-mono mb-3 text-[9px] uppercase tracking-[0.25em] text-orange">
            § ARHIV PROJEKTOV
          </p>
          <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">Reference</h1>
        </div>

        <div className="space-y-5">
          {/* Lead project — full-width 16:9 */}
          {first && (
            <SmartLink
              href={projectHref(first.slug)}
              className="group block border border-ink/15 bg-paper transition-colors hover:border-orange"
            >
              {first.photo && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <CornerMarks />
                  <Image
                    image={first.photo}
                    sizes={SIZES.fullBleed}
                    aspectRatio={16 / 9}
                    alt={first.photo.alt ?? first.title}
                    priority
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                  {/* Fig label */}
                  <div className="absolute bottom-3 left-3 z-10 border border-ink/20 bg-paper/90 px-2 py-1">
                    <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                      FIG. 1
                    </span>
                  </div>
                </div>
              )}
              <div className="border-t border-ink/10 p-6">
                {projectMeta(first) && (
                  <p className="font-mono mb-2 text-[9px] uppercase tracking-[0.2em] text-orange">
                    {projectMeta(first)}
                  </p>
                )}
                <h2 className="text-2xl font-bold leading-snug text-ink">{first.title}</h2>
                {first.summary && (
                  <p className="mt-2 line-clamp-2 max-w-2xl font-mono text-[10px] leading-relaxed text-ink/50">
                    {first.summary}
                  </p>
                )}
              </div>
            </SmartLink>
          )}

          {/* Remaining projects — 3-col grid */}
          {rest.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p, i) => {
                const meta = projectMeta(p)
                return (
                  <SmartLink
                    key={p._id}
                    href={projectHref(p.slug)}
                    className="group border border-ink/15 bg-paper transition-colors hover:border-orange"
                  >
                    {p.photo && (
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <CornerMarks />
                        <Image
                          image={p.photo}
                          sizes={SIZES.grid3}
                          aspectRatio={4 / 3}
                          alt={p.photo.alt ?? p.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute bottom-2 left-2 z-10 border border-ink/20 bg-paper/90 px-1.5 py-0.5">
                          <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink/40">
                            FIG. {i + 2}
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="border-t border-ink/10 p-4">
                      {meta && (
                        <p className="font-mono mb-1 text-[9px] uppercase tracking-[0.2em] text-orange">
                          {meta}
                        </p>
                      )}
                      <h2 className="text-sm font-semibold leading-snug text-ink">{p.title}</h2>
                    </div>
                  </SmartLink>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer stamp */}
        <div className="mt-5 flex items-center justify-between">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">
            SKUPAJ: {projects.length} PROJEKTOV
          </p>
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/20">REV A</p>
        </div>
      </div>
    </div>
  )
}

export default ProjectList
