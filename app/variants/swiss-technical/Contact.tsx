import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { mapLink } from '~/lib/maps'

import { LegalDetails } from '~/components/LegalDetails'
import { SmartLink } from '~/components/SmartLink'

/**
 * Contact (Swiss technical): spec-sheet layout — each channel is a row with a
 * ruled separator, channel type labelled in grotesk small-caps, value in bold.
 * The legal section is a bordered block. Structured like a technical data sheet,
 * not a marketing card grid.
 */
export function Contact({ site }: { site: SiteData }) {
  const contact = site.settings?.contact
  const legal = site.settings?.legal
  const map = mapLink(contact)

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="border-b border-ink/10 pb-8">
        <span className="font-grotesk text-xs font-bold tracking-[0.2em] uppercase text-orange">
          Kontakt
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Pokličite ali pišite
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink/60">
          Za ponudbo ali vprašanje nas pokličite oziroma nam pišite — svetujemo
          brezplačno.
        </p>
      </header>

      <div className="mt-10 max-w-2xl divide-y divide-ink/8">
        {contact?.phone && contact?.phoneHref && (
          <div className="flex items-center gap-6 py-5">
            <span className="font-grotesk w-20 shrink-0 text-[10px] font-bold tracking-[0.18em] uppercase text-ink/30">
              Telefon
            </span>
            <a
              href={contact.phoneHref}
              className="font-grotesk flex items-center gap-2 text-xl font-bold tabular-nums text-ink transition-colors hover:text-orange"
            >
              <Phone size={16} className="text-orange shrink-0" />
              {contact.phone}
            </a>
          </div>
        )}

        {contact?.email && (
          <div className="flex items-center gap-6 py-5">
            <span className="font-grotesk w-20 shrink-0 text-[10px] font-bold tracking-[0.18em] uppercase text-ink/30">
              E-pošta
            </span>
            <a
              href={`mailto:${contact.email}`}
              className="font-grotesk flex items-center gap-2 text-xl font-bold text-ink transition-colors hover:text-orange"
            >
              <Mail size={16} className="text-orange shrink-0" />
              {contact.email}
            </a>
          </div>
        )}

        {contact?.address && (
          <div className="flex items-start gap-6 py-5">
            <span className="font-grotesk w-20 shrink-0 pt-0.5 text-[10px] font-bold tracking-[0.18em] uppercase text-ink/30">
              Naslov
            </span>
            <div>
              <div className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-orange" />
                <span className="font-grotesk text-xl font-bold text-ink">
                  {contact.address}
                </span>
              </div>
              {map && (
                <SmartLink
                  href={map}
                  className="mt-3 inline-flex items-center gap-1.5 border-b border-orange/30 text-sm font-bold text-orange transition-colors hover:border-orange"
                >
                  Poglej na zemljevidu
                </SmartLink>
              )}
            </div>
          </div>
        )}
      </div>

      {legal && (
        <section className="mt-12 border border-ink/10 p-7">
          <h2 className="font-grotesk flex items-center gap-2 text-[10px] font-bold tracking-[0.18em] uppercase text-ink/30">
            <Building2 size={14} className="text-orange" />
            Osnovni podatki
          </h2>
          <LegalDetails legal={legal} tone="ink" />
        </section>
      )}
    </article>
  )
}

export default Contact
