import { SmartLink } from '~/components/SmartLink'

/**
 * Shared tap-to-call + quote CTA that closes the service and project detail pages.
 * Only the heading differs between the two; the rest (tel: dialer link + quote
 * SmartLink + styling) is one rule. Tap-to-call is a plain `tel:` anchor; the quote
 * link is an in-app path via SmartLink.
 */
export function ContactCta({
  heading,
  text = 'Pokličite nas ali povprašajte po ponudbi — svetujemo brezplačno.',
  phone,
  phoneHref,
  quoteHref,
  quoteLabel,
}: {
  heading: string
  text?: string
  phone?: string
  phoneHref?: string
  quoteHref: string
  quoteLabel: string
}) {
  return (
    <section className="mt-16 rounded-2xl bg-bone p-8 text-center sm:p-12">
      <h2 className="text-2xl font-bold text-ink">{heading}</h2>
      <p className="mt-3 text-ink-soft">{text}</p>
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
  )
}

export default ContactCta
