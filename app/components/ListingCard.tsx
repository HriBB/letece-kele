import type { SanityImage } from '~/lib/image'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

/** True when the image actually resolves to a Sanity asset (else we show a fallback). */
function hasAsset(image: SanityImage | null): boolean {
  return Boolean(image?.asset?._ref ?? image?.asset?._id)
}

/**
 * Shared listing card for /storitve and /reference: a 4:3 photo over a title with an
 * optional meta line (location · year, projects only) and summary, linking to the
 * detail page. One card so the two listings (and their hover/ratio/CTA affordances)
 * can't drift apart. When a doc has no photo (e.g. a service/project that carried no
 * usable image in the WP source) the photo slot shows a branded fallback rather than
 * an empty box.
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
      className="group border-line bg-paper flex flex-col overflow-hidden rounded-2xl border transition-shadow hover:shadow-lg"
    >
      <div className="aspect-4/3 overflow-hidden">
        {hasAsset(image) ? (
          <Image
            image={image}
            sizes={SIZES.card}
            aspectRatio={4 / 3}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="from-bone-2 to-orange/15 flex h-full w-full items-center justify-center bg-linear-to-br">
            <Logo className="h-10 w-auto opacity-30 transition-transform duration-300 group-hover:scale-105" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-ink text-xl font-bold">{title}</h2>
        {meta ? <p className="text-orange mt-2 font-bold">{meta}</p> : null}
        {summary ? <p className="text-ink-soft mt-3">{summary}</p> : null}
        <span className="text-orange mt-6 inline-flex font-bold">
          Preberi več →
        </span>
      </div>
    </SmartLink>
  )
}

export default ListingCard
