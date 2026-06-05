import { Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

/**
 * Footer (photo-led alpine): bone band with orange top-border accent. Three
 * columns: brand tagline, nav, contact — simpler than swiss but the orange top
 * rule and bone bg give it a warm editorial feel distinct from the ruled footer.
 */
export function Footer({ site }: { site: SiteData }) {
  const s = site.settings
  const contact = s?.contact
  const legal = s?.legal
  const nav = s?.nav ?? []
  const footer = s?.footer

  return (
    <footer className="border-t-4 border-orange bg-bone pt-12 pb-8">
      <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo className="h-10" />
          {footer?.tagline && (
            <p className="text-sm leading-relaxed text-ink/60">{footer.tagline}</p>
          )}
        </div>

        {nav.length > 0 && (
          <nav className="space-y-3">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-ink/40">
              Navigacija
            </h2>
            {nav.map((item) => (
              <SmartLink
                key={item.href}
                href={item.href}
                className="block text-sm text-ink/60 transition-colors hover:text-ink"
              >
                {item.label}
              </SmartLink>
            ))}
          </nav>
        )}

        <div className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-widest uppercase text-ink/40">
            Kontakt
          </h2>
          <div className="space-y-2 text-sm text-ink/60">
            {contact?.phone && (
              <a
                href={contact.phoneHref}
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <Phone size={12} className="shrink-0 text-orange" />
                {contact.phone}
              </a>
            )}
            {contact?.email && (
              <a
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 transition-colors hover:text-ink"
              >
                <Mail size={12} className="shrink-0 text-orange" />
                {contact.email}
              </a>
            )}
            {contact?.address && (
              <div className="flex items-start gap-2">
                <MapPin size={12} className="mt-0.5 shrink-0 text-orange" />
                {contact.address}
              </div>
            )}
          </div>
        </div>

        {legal && (
          <div className="space-y-3">
            <h2 className="text-[11px] font-bold tracking-widest uppercase text-ink/40">
              Podatki
            </h2>
            <div className="space-y-1 text-xs text-ink/50">
              {legal.vat && (
                <div>
                  Davčna št.{' '}
                  <span className="font-semibold tabular-nums text-ink">{legal.vat}</span>
                </div>
              )}
              {legal.reg && (
                <div>
                  Matična{' '}
                  <span className="font-semibold tabular-nums text-ink">{legal.reg}</span>
                </div>
              )}
              {legal.bankIban && (
                <div className="pt-1">
                  {legal.bankName}
                  <div className="font-semibold tabular-nums text-ink">{legal.bankIban}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {footer?.copyright && (
        <div className="container-page mt-10 border-t border-ink/10 pt-5 text-center">
          <span className="text-xs text-ink/30">{footer.copyright}</span>
        </div>
      )}
    </footer>
  )
}

export default Footer
