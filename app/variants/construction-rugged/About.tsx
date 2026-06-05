import type { AboutPageData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

/**
 * About (construction rugged): bold statement header with thick left-border accent,
 * hero image in a heavy border frame (not full-bleed, not sidebar), then a reading
 * zone for the body. Distinct from alpine (full-bleed first), swiss (framed photo
 * in container with orange left-border body), wc (two-col image+text split).
 */
export function About({ data }: { data: AboutPageData }) {
  const { title, intro, heroImage, body } = data

  return (
    <article>
      {/* Bold statement header */}
      <div className="bg-paper border-b-2 border-ink/8">
        <div className="container-page py-14 sm:py-20">
          <span className="font-manrope text-[10px] font-black tracking-[0.2em] uppercase text-orange">
            O podjetju
          </span>
          <h1 className="font-manrope mt-3 border-l-4 border-orange pl-6 text-4xl font-black leading-tight text-ink sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink/60">{intro}</p>
          )}
        </div>
      </div>

      {/* Heavy-framed hero image */}
      {heroImage && (
        <div className="bg-bone border-b-2 border-ink/8">
          <div className="container-page py-10 sm:py-14">
            <div className="border-4 border-ink/15 overflow-hidden aspect-[16/9]">
              <Image
                image={heroImage}
                sizes={SIZES.fullBleed}
                aspectRatio={16 / 9}
                alt={heroImage.alt ?? title}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      {/* Reading zone */}
      {body && body.length > 0 && (
        <div className="bg-paper">
          <div className="container-page py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <PortableText
                value={body}
                className="text-base leading-relaxed text-ink/70"
              />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default About
