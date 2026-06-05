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
    <footer className="border-ink/8 bg-bone-2 border-t py-14">
      <div className="container-page grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {/* Brand */}
        <div className="col-span-1 space-y-4 sm:col-span-2 lg:col-span-1">
          <Logo className="h-12" />
          {footer?.tagline && (
            <p className="text-ink-soft max-w-xs text-sm leading-relaxed">
              {footer.tagline}
            </p>
          )}
          {contact?.phoneHref && contact?.phone && (
            <SmartLink
              href={contact.phoneHref}
              className="bg-orange text-paper hover:bg-orange-dark inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors"
            >
              <Phone size={14} />
              {contact.phone}
            </SmartLink>
          )}
        </div>

        {/* Navigation */}
        {nav.length > 0 && (
          <nav className="space-y-3">
            <h2 className="text-ink/50 text-xs font-bold tracking-widest uppercase">
              Navigacija
            </h2>
            {nav.map((item) => (
              <SmartLink
                key={item.href}
                href={item.href}
                className="text-ink-soft hover:text-orange block text-sm font-medium transition-colors"
              >
                {item.label}
              </SmartLink>
            ))}
          </nav>
        )}

        {/* Contact */}
        <div className="space-y-3">
          <h2 className="text-ink/50 text-xs font-bold tracking-widest uppercase">
            Kontakt
          </h2>
          <div className="text-ink-soft space-y-2 text-sm">
            {contact?.phone && (
              <SmartLink
                href={contact.phoneHref}
                className="hover:text-orange flex items-center gap-2"
              >
                <Phone size={13} className="text-orange" />
                {contact.phone}
              </SmartLink>
            )}
            {contact?.email && (
              <SmartLink
                href={`mailto:${contact.email}`}
                className="hover:text-orange flex items-center gap-2"
              >
                <Mail size={13} className="text-orange" />
                {contact.email}
              </SmartLink>
            )}
            {contact?.address && (
              <div className="flex items-start gap-2">
                <MapPin size={13} className="text-orange mt-0.5 shrink-0" />
                {contact.address}
              </div>
            )}
          </div>
        </div>

        {/* Legal (osnovni podatki) */}
        {legal && (
          <div className="space-y-3">
            <h2 className="text-ink/50 text-xs font-bold tracking-widest uppercase">
              Podatki
            </h2>
            <div className="text-ink-soft space-y-1.5 text-xs">
              {legal.vat && (
                <div>
                  Davčna št.{' '}
                  <span className="text-ink font-semibold">{legal.vat}</span>
                </div>
              )}
              {legal.reg && (
                <div>
                  Matična{' '}
                  <span className="text-ink font-semibold">{legal.reg}</span>
                </div>
              )}
              {legal.bankIban && (
                <div className="pt-1">
                  {legal.bankName}
                  <div className="text-ink font-semibold">{legal.bankIban}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {footer?.copyright && (
        <div className="container-page border-ink/8 text-ink-soft mt-12 border-t pt-6 text-center text-xs">
          {footer.copyright}
        </div>
      )}
    </footer>
  )
}

export default Footer
