import type { AboutPageData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

/**
 * About (photo-led alpine): the hero image comes first at full-bleed 16:9 —
 * the company's rope-access work speaks visually before a word is read. Then
 * a clean white panel: title, intro, and body text in a comfortable reading
 * column. No dark surfaces, no scrims on the image. Structurally distinct from
 * Swiss (framed photo in container, orange left-border body) and warm craftsman
 * (image right in a two-col grid).
 */
export function About({ data }: { data: AboutPageData }) {
  const { title, intro, heroImage, body } = data

  return (
    <article>
      {/* Full-bleed hero photo */}
      {heroImage && (
        <div className="aspect-[3/2] w-full overflow-hidden sm:aspect-[16/9]">
          <Image
            image={heroImage}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={heroImage.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* White reading zone */}
      <div className="bg-paper">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
            O podjetju
          </span>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-xl leading-relaxed text-ink/60">{intro}</p>
          )}

          {body && body.length > 0 && (
            <div className="mt-10 max-w-3xl">
              <PortableText
                value={body}
                className="text-base leading-relaxed text-ink/70"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default About
