import type { AboutPageData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

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

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

/**
 * About (blueprint/drafting): annotation header block with drawing label; hero image
 * in a thin ruled frame with corner registration marks; reading zone for the body.
 * Distinct from rugged (heavy 4px frame, bold statement header), alpine (full-bleed
 * first), swiss (framed photo with orange left-border body), and wc (two-col split).
 */
export function About({ data }: { data: AboutPageData }) {
  const { title, intro, heroImage, body } = data

  return (
    <article>
      {/* Annotation header block */}
      <div className="bg-paper border-b border-ink/10">
        <div className="container-page py-14 sm:py-20">
          <div className="border border-ink/20">
            <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-orange">
                § O PODJETJU
              </span>
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">
                REV A
              </span>
            </div>
            <div className="p-8 sm:p-10">
              <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              {intro && (
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/60">{intro}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hero image — thin-ruled frame with registration marks */}
      {heroImage && (
        <div className="bg-bone border-b border-ink/10" style={gridBg}>
          <div className="container-page py-10 sm:py-14">
            <div className="relative aspect-[16/9] overflow-hidden border border-ink/20">
              <CornerMarks />
              <Image
                image={heroImage}
                sizes={SIZES.fullBleed}
                aspectRatio={16 / 9}
                alt={heroImage.alt ?? title}
                priority
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-3 right-3 z-10 border border-ink/20 bg-paper/90 px-2 py-1">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/50">
                  FIG. 1 — O PODJETJU
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading zone */}
      {body && body.length > 0 && (
        <div className="bg-paper">
          <div className="container-page py-12 sm:py-16 lg:py-20">
            <div className="max-w-3xl">
              <p className="font-mono mb-8 text-[9px] uppercase tracking-[0.25em] text-orange">
                § OPIS
              </p>
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
