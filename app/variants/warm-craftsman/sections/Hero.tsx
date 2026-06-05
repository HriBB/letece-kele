import { ArrowRight, Phone } from 'lucide-react'

import type { HomeHero } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

/**
 * Home hero (variant 5 "Warm craftsman"): the value message leads, with a primary
 * "Povprašajte po ponudbi" CTA and a tap-to-call phone button beside it, and a lead
 * photo carrying floating stat badges. The phone is a plain `tel:` anchor; the CTA is
 * an in-app path via SmartLink. Renders nothing without a heading.
 */
export function Hero({
  data,
  phone,
  phoneHref,
}: {
  data?: HomeHero
  phone?: string
  phoneHref?: string
}) {
  if (!data?.heading) return null
  const { eyebrow, heading, lead, cta, image, badges } = data

  return (
    <section className="bg-bone">
      <div className="container-page grid items-center gap-10 py-16 sm:py-24 lg:grid-cols-2 lg:gap-16">
        <div className="max-w-xl">
          {eyebrow ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-orange/12 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange">
              {eyebrow}
            </span>
          ) : null}
          <h1 className="mt-6 font-manrope text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {heading}
          </h1>
          {lead ? (
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">{lead}</p>
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-4">
            {cta?.href ? (
              <SmartLink
                href={cta.href}
                className="inline-flex items-center gap-2 rounded-full bg-orange px-7 py-3.5 text-base font-bold text-paper shadow-sm transition-colors hover:bg-orange-dark"
              >
                {cta.label ?? 'Povprašajte po ponudbi'}
                <ArrowRight size={18} />
              </SmartLink>
            ) : null}
            {phone && phoneHref ? (
              <a
                href={phoneHref}
                className="inline-flex items-center gap-2 rounded-full border-2 border-ink px-6 py-3 text-base font-bold text-ink transition-colors hover:bg-ink hover:text-paper"
              >
                <Phone size={17} />
                {phone}
              </a>
            ) : null}
          </div>
        </div>

        {image ? (
          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl shadow-lg">
              <Image
                image={image}
                sizes={SIZES.halfSplit}
                aspectRatio={4 / 3}
                alt={image.alt ?? heading}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            {badges && badges.length > 0 ? (
              <ul className="absolute -bottom-5 left-4 right-4 flex flex-wrap justify-center gap-3">
                {badges.map((b, i) => (
                  <li
                    key={`${b.value}-${i}`}
                    className="rounded-2xl bg-paper px-5 py-3 text-center shadow-lg ring-1 ring-line"
                  >
                    <div className="font-manrope text-2xl font-extrabold leading-none text-orange">
                      {b.value}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-wide text-ink-soft">
                      {b.label}
                    </div>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export default Hero
