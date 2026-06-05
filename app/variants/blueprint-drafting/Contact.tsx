import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { mapLink } from '~/lib/maps'

import { LegalDetails } from '~/components/LegalDetails'
import { SmartLink } from '~/components/SmartLink'

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

/**
 * Contact (blueprint/drafting): spec-sheet layout — each contact channel in a
 * thin-ruled row with label column and value column; annotation-style header block;
 * legal data in a bordered specification section. Distinct from rugged (top-accent
 * tiles), swiss (ruled spec-sheet rows without the grid texture), alpine (editorial
 * two-col), and wc (icon card grid).
 */
export function Contact({ site }: { site: SiteData }) {
  const contact = site.settings?.contact
  const legal = site.settings?.legal
  const map = mapLink(contact)

  return (
    <article className="bg-bone" style={gridBg}>
      {/* Annotation header */}
      <div className="border-b border-ink/10 bg-paper">
        <div className="container-page py-16 sm:py-20">
          <div className="border border-ink/20">
            <div className="flex items-center gap-4 border-b border-ink/15 bg-bone px-6 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-orange">
                § KONTAKT
              </span>
              <span className="ml-auto font-mono text-[9px] uppercase tracking-[0.2em] text-ink/25">
                REV A
              </span>
            </div>
            <div className="p-8 sm:p-10">
              <h1 className="text-4xl font-bold leading-tight text-ink sm:text-5xl">
                Stopite v stik
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60">
                Za ponudbo ali vprašanje nas pokličite oziroma nam pišite — svetujemo brezplačno.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact spec-sheet — thin-ruled label/value rows */}
      <div className="container-page py-12 sm:py-16">
        <div className="border border-ink/15 divide-y divide-ink/10 bg-paper">
          {/* Table header */}
          <div className="grid grid-cols-[8rem_1fr] bg-bone px-6 py-2">
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/30">KANAL</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/30">VREDNOST</span>
          </div>

          {contact?.phone && contact?.phoneHref && (
            <div className="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-5">
              <div className="flex items-center gap-2">
                <Phone size={12} className="shrink-0 text-orange" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  Telefon
                </span>
              </div>
              <a
                href={contact.phoneHref}
                className="text-lg font-bold tabular-nums text-ink transition-colors hover:text-orange"
              >
                {contact.phone}
              </a>
            </div>
          )}

          {contact?.email && (
            <div className="grid grid-cols-[8rem_1fr] items-center gap-4 px-6 py-5">
              <div className="flex items-center gap-2">
                <Mail size={12} className="shrink-0 text-orange" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  E-pošta
                </span>
              </div>
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-semibold text-ink transition-colors hover:text-orange break-all"
              >
                {contact.email}
              </a>
            </div>
          )}

          {contact?.address && (
            <div className="grid grid-cols-[8rem_1fr] items-start gap-4 px-6 py-5">
              <div className="flex items-center gap-2 pt-0.5">
                <MapPin size={12} className="shrink-0 text-orange" />
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink/40">
                  Naslov
                </span>
              </div>
              <div>
                <p className="text-base font-semibold leading-snug text-ink">{contact.address}</p>
                {map && (
                  <SmartLink
                    href={map}
                    className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest text-orange transition-colors hover:text-orange-dark"
                  >
                    Poglej na zemljevidu →
                  </SmartLink>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legal data — specification section */}
      {legal && (
        <div className="bg-paper border-t border-ink/10">
          <div className="container-page py-12">
            <div className="border border-ink/20">
              <div className="flex items-center gap-3 border-b border-ink/15 bg-bone px-6 py-3">
                <Building2 size={12} className="text-orange" />
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-ink/40">
                  § OSNOVNI PODATKI
                </span>
              </div>
              <div className="p-6 sm:p-8">
                <LegalDetails legal={legal} tone="ink" />
              </div>
            </div>
          </div>
        </div>
      )}
    </article>
  )
}

export default Contact
