import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { mapLink } from '~/lib/maps'

import { LegalDetails } from '~/components/LegalDetails'
import { SmartLink } from '~/components/SmartLink'

/**
 * Contact (photo-led alpine): editorial two-column layout — left column holds
 * the headline + sub-copy (large, generous type), right column has the contact
 * channels. Below: legal data in a bone panel. Structurally distinct from Swiss
 * (spec-sheet ruled rows) and warm craftsman (card grid with icons).
 */
export function Contact({ site }: { site: SiteData }) {
  const contact = site.settings?.contact
  const legal = site.settings?.legal
  const map = mapLink(contact)

  return (
    <article className="bg-paper">
      {/* Header band: large editorial heading */}
      <div className="border-b border-ink/10">
        <div className="container-page py-16 sm:py-24">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-orange">
            Kontakt
          </span>
          <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Pokličite ali pišite
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
            Za ponudbo ali vprašanje nas pokličite oziroma nam pišite — svetujemo brezplačno.
          </p>
        </div>
      </div>

      {/* Contact channels: two-col at desktop */}
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contact?.phone && contact?.phoneHref && (
            <div className="bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <Phone size={16} className="text-orange" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-ink/50">
                  Telefon
                </span>
              </div>
              <a
                href={contact.phoneHref}
                className="text-2xl font-extrabold tabular-nums text-ink transition-colors hover:text-orange"
              >
                {contact.phone}
              </a>
            </div>
          )}

          {contact?.email && (
            <div className="bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <Mail size={16} className="text-orange" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-ink/50">
                  E-pošta
                </span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-xl font-extrabold text-ink transition-colors hover:text-orange"
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact?.address && (
            <div className="bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-orange" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-ink/50">
                  Naslov
                </span>
              </div>
              <p className="text-xl font-extrabold text-ink">{contact.address}</p>
              {map && (
                <SmartLink
                  href={map}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-orange transition-colors hover:text-orange-dark"
                >
                  Poglej na zemljevidu →
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal data panel */}
      {legal && (
        <div className="bg-bone">
          <div className="container-page py-12">
            <h2 className="mb-6 flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-ink/40">
              <Building2 size={14} className="text-orange" />
              Osnovni podatki
            </h2>
            <LegalDetails legal={legal} tone="ink" />
          </div>
        </div>
      )}
    </article>
  )
}

export default Contact
