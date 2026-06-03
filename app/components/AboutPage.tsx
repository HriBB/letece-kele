import type { AboutPageData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

/**
 * About page layout: title + lead intro, a supporting hero photo, then the merged
 * company story (about / vision / quality / alpinist credibility) as one coherent
 * narrative. Mirrors the service detail layout.
 */
export function AboutPage({ data }: { data: AboutPageData }) {
  const { title, intro, heroImage, body } = data

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>
        ) : null}
      </header>

      {heroImage ? (
        <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            image={heroImage}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={heroImage.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {body && body.length > 0 ? (
        <PortableText value={body} className="mt-12 max-w-3xl text-ink-soft" />
      ) : null}
    </article>
  )
}

export default AboutPage
