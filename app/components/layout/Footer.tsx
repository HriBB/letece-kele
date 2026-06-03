import { Mail, MapPin, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

export function Footer({ site }: { site: SiteData }) {
  const s = site.settings
  const contact = s?.contact
  const legal = s?.legal
  const footer = s?.footer
  const nav = s?.nav ?? []

  return (
    <footer className="border-t border-ink/8 bg-bone-2 py-14">
      <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand */}
        <div className="col-span-1 space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo showSub className="h-10" />
          {footer?.tagline && (
            <p className="max-w-xs text-sm leading-relaxed text-ink-soft">{footer.tagline}</p>
          )}
          {contact?.phoneHref && contact?.phone && (
            <SmartLink
              href={contact.phoneHref}
              className="inline-flex items-center gap-2 rounded-full bg-orange px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-orange-dark"
            >
              <Phone size={14} />
              {contact.phone}
            </SmartLink>
          )}
        </div>

        {/* Navigation */}
        {nav.length > 0 && (
          <nav className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink/50">Navigacija</h2>
            {nav.map((item) => (
              <SmartLink
                key={item.href}
                href={item.href}
                className="block text-sm font-medium text-ink-soft transition-colors hover:text-orange"
              >
                {item.label}
              </SmartLink>
            ))}
          </nav>
        )}

        {/* Contact */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-widest text-ink/50">Kontakt</h2>
          <div className="space-y-2 text-sm text-ink-soft">
            {contact?.phone && (
              <SmartLink
                href={contact.phoneHref}
                className="flex items-center gap-2 hover:text-orange"
              >
                <Phone size={13} className="text-orange" />
                {contact.phone}
              </SmartLink>
            )}
            {contact?.email && (
              <SmartLink
                href={`mailto:${contact.email}`}
                className="flex items-center gap-2 hover:text-orange"
              >
                <Mail size={13} className="text-orange" />
                {contact.email}
              </SmartLink>
            )}
            {contact?.address && (
              <div className="flex items-start gap-2">
                <MapPin size={13} className="mt-0.5 shrink-0 text-orange" />
                {contact.address}
              </div>
            )}
          </div>
        </div>

        {/* Legal (osnovni podatki) */}
        {legal && (
          <div className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-ink/50">Podatki</h2>
            <div className="space-y-1.5 text-xs text-ink-soft">
              {legal.vat && (
                <div>
                  Davčna št. <span className="font-semibold text-ink">{legal.vat}</span>
                </div>
              )}
              {legal.reg && (
                <div>
                  Matična <span className="font-semibold text-ink">{legal.reg}</span>
                </div>
              )}
              {legal.bankIban && (
                <div className="pt-1">
                  {legal.bankName}
                  <div className="font-semibold text-ink">{legal.bankIban}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {footer?.copyright && (
        <div className="container-page mt-12 border-t border-ink/8 pt-6 text-center text-xs text-ink-soft">
          {footer.copyright}
        </div>
      )}
    </footer>
  )
}

export default Footer
