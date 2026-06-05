import { ArrowRight } from 'lucide-react'

import type { HomeStory } from '~/lib/types'

import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Story / about teaser: the alpinist "why we work at height" narrative in brief, with
 * a link out to the full story on /o-podjetju. Renders nothing without a heading.
 */
export function StoryTeaser({ data }: { data?: HomeStory }) {
  if (!data?.heading) return null
  const { eyebrow, heading, paragraphs, cta } = data

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="max-w-3xl">
        {eyebrow ? (
          <span className="text-xs font-bold uppercase tracking-widest text-orange">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="mt-3 font-manrope text-3xl font-extrabold leading-tight text-ink sm:text-4xl">
          {heading}
        </h2>
        <PortableText value={paragraphs} className="mt-6 text-lg text-ink-soft" />
        {cta?.href ? (
          <SmartLink
            href={cta.href}
            className="mt-8 inline-flex items-center gap-2 text-base font-bold text-orange transition-colors hover:text-orange-dark"
          >
            {cta.label ?? 'Spoznajte ekipo'}
            <ArrowRight size={18} />
          </SmartLink>
        ) : null}
      </div>
    </section>
  )
}

export default StoryTeaser
