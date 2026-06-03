import type { ServiceData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service detail layout: lead photo + title, the ordered process steps, and a
 * tap-to-call / quote CTA. Tap-to-call is a plain `tel:` anchor (SmartLink routes
 * `tel:` as an internal path); the quote link is an in-app path via SmartLink.
 */
export function ServicePage({
  data,
  phone,
  phoneHref,
  quoteHref,
  quoteLabel,
}: {
  data: ServiceData
  phone?: string
  phoneHref?: string
  quoteHref: string
  quoteLabel: string
}) {
  const { title, description, photo, steps } = data

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{description}</p>
        ) : null}
      </header>

      {photo ? (
        <div className="mt-10 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            image={photo}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={photo.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      {steps && steps.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-ink">Postopek</h2>
          <PortableText value={steps} className="mt-5 max-w-3xl text-ink-soft" />
        </section>
      ) : null}

      {/* Tap-to-call / quote CTA */}
      <section className="mt-16 rounded-2xl bg-bone p-8 text-center sm:p-12">
        <h2 className="text-2xl font-bold text-ink">Potrebujete to storitev?</h2>
        <p className="mt-3 text-ink-soft">
          Pokličite nas ali povprašajte po ponudbi — svetujemo brezplačno.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-4">
          {phoneHref ? (
            <a
              href={phoneHref}
              className="inline-flex items-center justify-center rounded-full bg-orange px-6 py-3 font-bold text-white transition-colors hover:bg-orange-dark"
            >
              {phone ? `Pokličite ${phone}` : 'Pokličite nas'}
            </a>
          ) : null}
          <SmartLink
            href={quoteHref}
            className="inline-flex items-center justify-center rounded-full border-2 border-ink px-6 py-3 font-bold text-ink transition-colors hover:bg-ink hover:text-white"
          >
            {quoteLabel}
          </SmartLink>
        </div>
      </section>
    </article>
  )
}

export default ServicePage
