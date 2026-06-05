import { ArrowRight, Phone } from 'lucide-react'

import type { ServiceData, SiteData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service detail (photo-led alpine): the service photo bleeds full-width at
 * 16:9, with no text overlaid on the image. Below: a clean white reading zone
 * — title, description, process steps — followed by a full-width orange CTA
 * band. Structurally distinct from warm craftsman (image in container, right-
 * side checklist) and Swiss (aside panel, left-border spec block).
 */
export function ServiceDetail({ data, site }: { data: ServiceData; site: SiteData }) {
  const { title, description, photo, steps } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <article>
      {/* Full-bleed photo */}
      {photo && (
        <div className="aspect-[3/2] w-full overflow-hidden sm:aspect-[16/9]">
          <Image
            image={photo}
            sizes={SIZES.fullBleed}
            aspectRatio={16 / 9}
            alt={photo.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}

      {/* Reading zone */}
      <div className="bg-paper">
        <div className="container-page py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
              Storitev
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 text-xl leading-relaxed text-ink/60">{description}</p>
            )}

            {steps && steps.length > 0 && (
              <section className="mt-12">
                <h2 className="mb-5 text-xs font-bold tracking-[0.2em] uppercase text-orange">
                  Postopek
                </h2>
                <PortableText
                  value={steps}
                  className="text-base leading-relaxed text-ink/70"
                />
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Full-width CTA band */}
      <div className="bg-bone">
        <div className="container-page flex flex-wrap items-center justify-between gap-6 py-10">
          <p className="text-base font-semibold text-ink/70">
            Zanima vas ta storitev? Pokličite ali povprašajte po ponudbi — svetujemo brezplačno.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {cta?.href && (
              <SmartLink
                href={cta.href}
                className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors"
              >
                {cta.label ?? 'Povprašajte po ponudbi'}
                <ArrowRight size={15} />
              </SmartLink>
            )}
            {contact?.phone && contact?.phoneHref && (
              <a
                href={contact.phoneHref}
                className="font-grotesk inline-flex items-center gap-2 text-sm font-semibold tabular-nums text-ink transition-colors hover:text-orange"
              >
                <Phone size={14} className="text-orange" />
                {contact.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default ServiceDetail
