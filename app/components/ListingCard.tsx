import type { SanityImage } from '~/lib/image'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Shared listing card for /storitve and /reference: a 4:3 photo over a title with an
 * optional meta line (location · year, projects only) and summary, linking to the
 * detail page. One card so the two listings (and their hover/ratio/CTA affordances)
 * can't drift apart.
 */
export function ListingCard({
  href,
  image,
  title,
  meta,
  summary,
}: {
  href: string
  image: SanityImage | null
  title: string
  meta?: string
  summary?: string
}) {
  return (
    <SmartLink
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-paper transition-shadow hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <Image
          image={image}
          sizes={SIZES.card}
          aspectRatio={4 / 3}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-bold text-ink">{title}</h2>
        {meta ? <p className="mt-2 font-bold text-orange">{meta}</p> : null}
        {summary ? <p className="mt-3 text-ink-soft">{summary}</p> : null}
        <span className="mt-6 inline-flex font-bold text-orange">Preberi več →</span>
      </div>
    </SmartLink>
  )
}

export default ListingCard
