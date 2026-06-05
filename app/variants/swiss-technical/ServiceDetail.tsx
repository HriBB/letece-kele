import { ArrowRight, Phone } from 'lucide-react'

import type { ServiceData, SiteData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service detail (Swiss technical): photo at full width (no rounding), then title +
 * description, then process steps rendered in a ruled left-bordered block for a spec-
 * sheet feel. CTA strip at the foot: orange action + phone as a tabular link.
 */
export function ServiceDetail({ data, site }: { data: ServiceData; site: SiteData }) {
  const { title, description, photo, steps } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <article className="container-page py-16 sm:py-24">
      {photo && (
        <div className="mb-12 aspect-[21/9] overflow-hidden">
          <Image
            image={photo}
            sizes={SIZES.fullBleed}
            aspectRatio={21 / 9}
            alt={photo.alt ?? title}
            priority
            className="h-full w-full object-cover"
          />
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_320px] lg:items-start">
        <div>
          <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
            Storitev
          </span>
          <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            {title}
          </h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
              {description}
            </p>
          )}

          {steps && steps.length > 0 && (
            <section className="mt-12 border-l-2 border-orange pl-6">
              <h2 className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
                Postopek
              </h2>
              <PortableText
                value={steps}
                className="mt-4 text-base leading-relaxed text-ink/70"
              />
            </section>
          )}
        </div>

        {/* Sidebar CTA panel */}
        <aside className="border border-ink/10 p-6">
          <h2 className="font-grotesk text-[10px] font-bold tracking-[0.18em] uppercase text-ink/30">
            Zainteresirani?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">
            Pokličite nas ali povprašajte po ponudbi — svetujemo brezplačno.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            {cta?.href && (
              <SmartLink
                href={cta.href}
                className="bg-orange text-paper hover:bg-orange-dark flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold transition-colors"
              >
                {cta.label ?? 'Povprašajte po ponudbi'}
                <ArrowRight size={15} />
              </SmartLink>
            )}
            {contact?.phone && contact?.phoneHref && (
              <a
                href={contact.phoneHref}
                className="font-grotesk flex items-center justify-center gap-2 border border-ink/15 px-5 py-3 text-sm font-semibold text-ink tabular-nums transition-colors hover:border-orange hover:text-orange"
              >
                <Phone size={14} />
                {contact.phone}
              </a>
            )}
          </div>
        </aside>
      </div>
    </article>
  )
}

export default ServiceDetail
