import { ArrowRight } from 'lucide-react'

import type { HomeSectionCopy, ProjectListItem } from '~/lib/types'

import { projectMeta } from '~/lib/format'
import { projectHref } from '~/lib/link'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Featured-projects strip: a pure-CSS scroll-snap slider (no carousel library —
 * `.snap-row` + `.snap-start` + `.no-scrollbar` from app.css), backed by the same
 * `project` documents /reference renders (ADR 0003). Null without projects.
 */
export function FeaturedProjects({
  data,
  projects,
}: {
  data?: HomeSectionCopy
  projects: ProjectListItem[]
}) {
  if (!projects || projects.length === 0) return null

  return (
    <section className="bg-bone">
      <div className="container-page py-16 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {data?.eyebrow ? (
              <span className="text-xs font-bold uppercase tracking-widest text-orange">
                {data.eyebrow}
              </span>
            ) : null}
            <h2 className="mt-3 font-manrope text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
              {data?.heading ?? 'Reference'}
            </h2>
            {data?.intro ? <p className="mt-4 text-lg text-ink-soft">{data.intro}</p> : null}
          </div>
          <SmartLink
            href="/reference"
            className="inline-flex items-center gap-2 font-bold text-orange transition-colors hover:text-orange-dark"
          >
            Vse reference <ArrowRight size={16} />
          </SmartLink>
        </div>
      </div>

      {/* Full-bleed scroll-snap row; cards snap to the page gutter. */}
      <div className="snap-row no-scrollbar flex gap-6 overflow-x-auto px-5 pb-16 sm:px-8 lg:px-12">
        {projects.map((p) => {
          const meta = projectMeta(p)
          return (
            <SmartLink
              key={p._id}
              href={projectHref(p.slug)}
              className="snap-start group flex w-[82vw] shrink-0 flex-col overflow-hidden rounded-3xl bg-paper shadow-sm ring-1 ring-line transition-shadow hover:shadow-lg sm:w-[58vw] lg:w-[28rem]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <Image
                  image={p.photo}
                  sizes="(min-width: 1024px) 28rem, 82vw"
                  aspectRatio={4 / 3}
                  alt={p.photo?.alt ?? p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-7">
                <h3 className="font-manrope text-xl font-bold text-ink">{p.title}</h3>
                {meta ? <p className="mt-2 font-bold text-orange">{meta}</p> : null}
                {p.summary ? (
                  <p className="mt-3 line-clamp-3 text-ink-soft">{p.summary}</p>
                ) : null}
                <span className="mt-auto inline-flex items-center gap-2 pt-6 font-bold text-orange">
                  Preberi več <ArrowRight size={16} />
                </span>
              </div>
            </SmartLink>
          )
        })}
      </div>
    </section>
  )
}

export default FeaturedProjects
