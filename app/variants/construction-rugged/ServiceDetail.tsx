import { ArrowRight, Phone } from 'lucide-react'

import type { ServiceData, SiteData } from '~/lib/types'

import { SIZES } from '~/lib/image'

import { Image } from '~/components/Image'
import { PortableText } from '~/components/PortableText'
import { SmartLink } from '~/components/SmartLink'

/**
 * Service detail (construction rugged): wide 16:9 photo at full container width
 * in a heavy frame border. Title + description in a bold block below. Process
 * steps in a bordered callout box with orange top accent. Full-width CTA band
 * at foot with thick orange left border. Distinct from swiss (thin-rule aside
 * spec-block + sidebar) and alpine (full-bleed → reading zone).
 */
export function ServiceDetail({ data, site }: { data: ServiceData; site: SiteData }) {
  const { title, description, photo, steps } = data
  const contact = site.settings?.contact
  const cta = site.settings?.headerCta

  return (
    <article className="container-page py-16 sm:py-24">
      {/* Heavy-framed photo */}
      {photo && (
        <div className="mb-12 border-4 border-ink/15 overflow-hidden aspect-[16/9]">
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

      {/* Title block with left accent */}
      <div className="mb-10 border-l-4 border-orange pl-6">
        <span className="font-manrope text-[10px] font-black tracking-[0.2em] uppercase text-orange">
          Storitev
        </span>
        <h1 className="font-manrope mt-2 text-4xl font-black leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink/60">
            {description}
          </p>
        )}
      </div>

      {/* Process steps in bordered callout */}
      {steps && steps.length > 0 && (
        <div className="mb-12 border-2 border-ink/10 border-t-4 border-t-orange bg-bone p-6 sm:p-8">
          <h2 className="font-manrope mb-4 text-xs font-black tracking-[0.2em] uppercase text-orange">
            Postopek
          </h2>
          <PortableText
            value={steps}
            className="text-base leading-relaxed text-ink/70"
          />
        </div>
      )}

      {/* Full-width CTA band */}
      <div className="border-l-4 border-orange bg-bone p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-manrope text-sm font-black uppercase tracking-wide text-ink/40 mb-1">
            Zainteresirani?
          </p>
          <p className="text-base font-semibold text-ink">
            Pokličite nas ali povprašajte po ponudbi — svetujemo brezplačno.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className="inline-flex items-center gap-2 bg-orange px-6 py-3.5 font-manrope text-sm font-black tracking-wide uppercase text-paper transition-colors hover:bg-orange-dark"
            >
              {cta.label ?? 'Povprašajte po ponudbi'}
              <ArrowRight size={15} />
            </SmartLink>
          )}
          {contact?.phone && contact?.phoneHref && (
            <a
              href={contact.phoneHref}
              className="inline-flex items-center gap-2 border-2 border-ink/20 px-5 py-3 text-sm font-bold tabular-nums text-ink transition-colors hover:border-orange hover:text-orange"
            >
              <Phone size={14} />
              {contact.phone}
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default ServiceDetail
