import type { SanityImage } from '~/lib/image'

import { Image } from '~/components/Image'

/**
 * Photo gallery as a pure-CSS `scroll-snap` slider (ADR 0005, issue #5): a
 * horizontally-scrollable track where each photo snaps into place. No carousel
 * library and no animation — scrolling is the browser's, navigation is native
 * (drag, trackpad, arrow keys on focus). A single photo renders as a plain figure.
 */
export function Gallery({
  images,
  title,
}: {
  images: SanityImage[]
  title: string
}) {
  const photos = (images ?? []).filter(Boolean)
  if (photos.length === 0) return null

  if (photos.length === 1) {
    const only = photos[0]
    return (
      <figure className="overflow-hidden">
        <div className="aspect-video">
          <Image
            image={only}
            sizes={SIZES_FULL}
            aspectRatio={16 / 9}
            alt={only.alt ?? title}
            className="h-full w-full rounded-2xl object-cover"
          />
        </div>
        {(only.caption ?? only.alt) ? (
          <figcaption className="text-ink-soft mt-2 text-sm">
            {only.caption ?? only.alt}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  return (
    <ul className="no-scrollbar snap-row flex gap-4 overflow-x-auto pb-4">
      {photos.map((photo, i) => (
        <li
          key={photo.asset?._id ?? photo.asset?._ref ?? i}
          className="shrink-0 snap-start"
        >
          <figure className="w-[85vw] max-w-2xl overflow-hidden sm:w-[70vw]">
            <div className="aspect-4/3">
              <Image
                image={photo}
                sizes="(min-width: 640px) 70vw, 85vw"
                aspectRatio={4 / 3}
                alt={photo.alt ?? `${title} — fotografija ${i + 1}`}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
            {(photo.caption ?? photo.alt) ? (
              <figcaption className="text-ink-soft mt-2 text-sm">
                {photo.caption ?? photo.alt}
              </figcaption>
            ) : null}
          </figure>
        </li>
      ))}
    </ul>
  )
}

const SIZES_FULL = '100vw'

export default Gallery
