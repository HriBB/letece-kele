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
    <section className="bg-bone mt-16 rounded-2xl p-8 text-center sm:p-12">
      <h2 className="text-ink text-2xl font-bold">{heading}</h2>
      <p className="text-ink-soft mt-3">{text}</p>
      <div className="mt-7 flex flex-wrap justify-center gap-4">
        {phoneHref ? (
          <a
            href={phoneHref}
            className="bg-orange hover:bg-orange-dark inline-flex items-center justify-center rounded-full px-6 py-3 font-bold text-white transition-colors"
          >
            {phone ? `Pokličite ${phone}` : 'Pokličite nas'}
          </a>
        ) : null}
        <SmartLink
          href={quoteHref}
          className="border-ink text-ink hover:bg-ink inline-flex items-center justify-center rounded-full border-2 px-6 py-3 font-bold transition-colors hover:text-white"
        >
          {quoteLabel}
        </SmartLink>
      </div>
    </section>
  )
}

export default ContactCta
