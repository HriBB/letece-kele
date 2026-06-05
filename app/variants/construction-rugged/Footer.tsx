import type { SiteData } from '~/lib/types'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

export function Footer({ site }: { site: SiteData }) {
  const nav = site.settings?.nav ?? []
  const logo = site.settings?.logo
  const contact = site.settings?.contact
  const legal = site.settings?.legal

  return (
    <footer className="bg-bone border-t-4 border-orange">
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* Brand column */}
          <div>
            {logo ? (
              <Image
                image={logo}
                sizes="160px"
                alt={site.settings?.title ?? 'Leteče Kele'}
                blurUp={false}
                className="h-9 w-auto"
              />
            ) : (
              <Logo className="h-10" />
            )}
            {site.settings?.footer?.tagline && (
              <p className="mt-4 text-sm leading-relaxed text-ink/60">
                {site.settings.footer.tagline}
              </p>
            )}
          </div>

          {/* Navigation */}
          {nav.length > 0 && (
            <div>
              <h3 className="font-manrope mb-4 text-xs font-black tracking-[0.2em] uppercase text-ink/30">
                Navigacija
              </h3>
              <ul className="space-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <SmartLink
                      href={item.href}
                      className="font-manrope border-l-2 border-transparent pl-3 text-sm font-bold text-ink/60 transition-all hover:border-orange hover:text-ink"
                    >
                      {item.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact */}
          {contact && (
            <div>
              <h3 className="font-manrope mb-4 text-xs font-black tracking-[0.2em] uppercase text-ink/30">
                Kontakt
              </h3>
              <ul className="space-y-2 text-sm text-ink/60">
                {contact.phone && contact.phoneHref && (
                  <li>
                    <a
                      href={contact.phoneHref}
                      className="font-bold tabular-nums text-ink transition-colors hover:text-orange"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="transition-colors hover:text-orange"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="leading-snug">{contact.address}</li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t-2 border-ink/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          {legal?.companyName && (
            <p className="font-manrope text-xs font-bold text-ink/30 uppercase tracking-wide">
              {legal.companyName}
            </p>
          )}
          <p className="text-xs text-ink/30">
            &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
