import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { mapLink } from '~/lib/maps'

import { LegalDetails } from '~/components/LegalDetails'
import { SmartLink } from '~/components/SmartLink'

/**
 * Contact (construction rugged): bold heading with left-accent bar, then each
 * contact channel in its own heavy-bordered tile with orange top accent — like
 * construction information boards. Legal data in a bordered box below. Distinct
 * from alpine (editorial two-col), swiss (spec-sheet ruled rows), wc (icon card grid).
 */
export function Contact({ site }: { site: SiteData }) {
  const contact = site.settings?.contact
  const legal = site.settings?.legal
  const map = mapLink(contact)

  return (
    <article className="bg-paper">
      {/* Header with left-accent bar */}
      <div className="border-b-2 border-ink/8">
        <div className="container-page py-16 sm:py-24">
          <span className="font-manrope text-[10px] font-black tracking-[0.2em] uppercase text-orange">
            Kontakt
          </span>
          <h1 className="font-manrope mt-3 border-l-4 border-orange pl-6 text-4xl font-black leading-tight text-ink sm:text-5xl">
            Stopite v stik
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/60">
            Za ponudbo ali vprašanje nas pokličite oziroma nam pišite — svetujemo brezplačno.
          </p>
        </div>
      </div>

      {/* Contact channel tiles — heavy-bordered, top orange accent */}
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {contact?.phone && contact?.phoneHref && (
            <div className="border-2 border-ink/10 border-t-4 border-t-orange bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <Phone size={16} className="text-orange" />
                <span className="font-manrope text-[10px] font-black tracking-[0.18em] uppercase text-ink/40">
                  Telefon
                </span>
              </div>
              <a
                href={contact.phoneHref}
                className="font-manrope text-2xl font-black tabular-nums text-ink transition-colors hover:text-orange"
              >
                {contact.phone}
              </a>
            </div>
          )}

          {contact?.email && (
            <div className="border-2 border-ink/10 border-t-4 border-t-orange bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <Mail size={16} className="text-orange" />
                <span className="font-manrope text-[10px] font-black tracking-[0.18em] uppercase text-ink/40">
                  E-pošta
                </span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="font-manrope text-xl font-black text-ink transition-colors hover:text-orange break-all"
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact?.address && (
            <div className="border-2 border-ink/10 border-t-4 border-t-orange bg-bone p-6">
              <div className="mb-3 flex items-center gap-2">
                <MapPin size={16} className="text-orange" />
                <span className="font-manrope text-[10px] font-black tracking-[0.18em] uppercase text-ink/40">
                  Naslov
                </span>
              </div>
              <p className="font-manrope text-xl font-black leading-snug text-ink">
                {contact.address}
              </p>
              {map && (
                <SmartLink
                  href={map}
                  className="mt-4 inline-flex items-center gap-1.5 font-manrope text-sm font-black text-orange transition-colors hover:text-orange-dark"
                >
                  Poglej na zemljevidu →
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Legal data in bordered box */}
      {legal && (
        <div className="bg-bone border-y-2 border-ink/8">
          <div className="container-page py-12">
            <div className="border-l-4 border-orange pl-6">
              <h2 className="font-manrope mb-5 flex items-center gap-2 text-[10px] font-black tracking-[0.2em] uppercase text-ink/30">
                <Building2 size={14} className="text-orange" />
                Osnovni podatki
              </h2>
              <LegalDetails legal={legal} tone="ink" />
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default Contact
