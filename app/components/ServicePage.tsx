import type { ServiceData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { ContactCta } from '~/components/ContactCta'
import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'

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
        <h1 className="text-ink text-4xl leading-tight font-extrabold sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="text-ink-soft mt-5 text-lg leading-relaxed">
            {description}
          </p>
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
          <h2 className="text-ink text-2xl font-bold">Postopek</h2>
          <PortableText value={steps} className="text-ink-soft mt-5 max-w-3xl" />
        </section>
      ) : null}

      <ContactCta
        heading="Potrebujete to storitev?"
        phone={phone}
        phoneHref={phoneHref}
        quoteHref={quoteHref}
        quoteLabel={quoteLabel}
      />
    </article>
  )
}

export default ServicePage
