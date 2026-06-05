import type { AboutPageData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

/**
 * About (Swiss technical): title + intro in the left column, full-width photo
 * beneath (no rounding), then the body text in a narrow reading column bordered on
 * the left with the orange accent rule — reads like a technical brief or company
 * report.
 */
export function About({ data }: { data: AboutPageData }) {
  const { title, intro, heroImage, body } = data

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="border-b border-ink/10 pb-8">
        <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
          O podjetju
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {intro && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">{intro}</p>
        )}
      </header>

      {heroImage && (
        <div className="mt-10 aspect-[21/9] overflow-hidden">
          <Image
            image={heroImage}
            sizes={SIZES.fullBleed}
            aspectRatio={21 / 9}
            alt={heroImage.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {body && body.length > 0 && (
        <div className="mt-12 border-l-2 border-orange pl-6">
          <PortableText
            value={body}
            className="max-w-3xl text-base leading-relaxed text-ink/70"
          />
        </div>
      )}
    </article>
  )
}

export default About
