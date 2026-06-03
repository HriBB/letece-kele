import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { SiteSettings } from '~/lib/types'

import { mapLink } from '~/lib/maps'

import { LegalDetails } from '~/components/LegalDetails'
import { SmartLink } from '~/components/SmartLink'

/**
 * Info-only contact page (issue #7, ADR 0002): a B2B visitor reaches the company by
 * phone or email and can copy its legal/company data. No form, no server action, no
 * spam surface. Phone is a tappable `tel:` anchor, email a `mailto:` anchor; the
 * address has a static location reference (an external map link, no interactive map).
 * Everything renders from `siteSettings` — nothing here is hardcoded.
 */
export function ContactPage({ settings }: { settings: SiteSettings | null }) {
  const contact = settings?.contact
  const legal = settings?.legal
  const map = mapLink(contact)

  return (
    <article className="container-page py-16 sm:py-24">
      <header className="max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-orange/12 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange">
          Kontakt
        </span>
        <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          Pokličite ali pišite
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-soft">
          Za ponudbo ali vprašanje nas pokličite oziroma nam pišite — svetujemo brezplačno.
        </p>
      </header>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:gap-8">
        {/* Phone — tappable tel: anchor (plain <a>; tel: is not client-routed). */}
        {contact?.phone && contact?.phoneHref && (
          <a
            href={contact.phoneHref}
            className="flex items-start gap-4 rounded-2xl bg-bone p-7 transition-colors hover:bg-bone-2"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-paper">
              <Phone size={18} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-ink/50">
                Telefon
              </span>
              <span className="mt-1 block text-xl font-bold text-ink">{contact.phone}</span>
            </span>
          </a>
        )}

        {/* Email — mailto: anchor (plain <a>). */}
        {contact?.email && (
          <a
            href={`mailto:${contact.email}`}
            className="flex items-start gap-4 rounded-2xl bg-bone p-7 transition-colors hover:bg-bone-2"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-paper">
              <Mail size={18} />
            </span>
            <span>
              <span className="block text-xs font-bold uppercase tracking-widest text-ink/50">
                E-pošta
              </span>
              <span className="mt-1 block text-xl font-bold text-ink">{contact.email}</span>
            </span>
          </a>
        )}
      </div>

      {/* Address + static location reference (external map link, no interactive map). */}
      {contact?.address && (
        <section className="mt-6 rounded-2xl bg-bone p-7 lg:mt-8">
          <div className="flex items-start gap-4">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-paper">
              <MapPin size={18} />
            </span>
            <div>
              <span className="block text-xs font-bold uppercase tracking-widest text-ink/50">
                Naslov
              </span>
              <span className="mt-1 block text-xl font-bold text-ink">{contact.address}</span>
              {map && (
                <SmartLink
                  href={map}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-orange hover:text-orange-dark"
                >
                  <MapPin size={14} />
                  Poglej na zemljevidu
                </SmartLink>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Legal / company data — *osnovni podatki* (CONTEXT.md). */}
      {legal && (
        <section className="mt-12 rounded-2xl border border-ink/8 p-7 sm:p-9">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-ink/50">
            <Building2 size={16} className="text-orange" />
            Osnovni podatki
          </h2>
          <LegalDetails legal={legal} tone="ink" />
        </section>
      )}
    </article>
  )
}

export default ContactPage
