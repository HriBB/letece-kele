import type { SiteData } from '~/lib/types'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

const gridBg = {
  backgroundImage:
    'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px), repeating-linear-gradient(90deg, transparent, transparent 23px, rgba(22,24,29,0.04) 23px, rgba(22,24,29,0.04) 24px)',
}

export function Footer({ site }: { site: SiteData }) {
  const nav = site.settings?.nav ?? []
  const logo = site.settings?.logo
  const contact = site.settings?.contact
  const legal = site.settings?.legal

  return (
    <footer className="bg-bone border-t border-orange" style={gridBg}>
      <div className="container-page py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
          {/* Brand */}
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
              <p className="mt-4 font-mono text-[10px] leading-relaxed text-ink/50">
                {site.settings.footer.tagline}
              </p>
            )}
          </div>

          {/* Navigation */}
          {nav.length > 0 && (
            <div>
              <h3 className="font-mono mb-5 text-[9px] uppercase tracking-[0.25em] text-ink/30">
                — Navigacija
              </h3>
              <ul className="space-y-2.5">
                {nav.map((item) => (
                  <li key={item.href}>
                    <SmartLink
                      href={item.href}
                      className="font-mono text-[11px] uppercase tracking-widest text-ink/50 transition-colors hover:text-orange"
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
              <h3 className="font-mono mb-5 text-[9px] uppercase tracking-[0.25em] text-ink/30">
                — Kontakt
              </h3>
              <ul className="space-y-2">
                {contact.phone && contact.phoneHref && (
                  <li>
                    <a
                      href={contact.phoneHref}
                      className="font-mono text-xs tabular-nums text-ink/60 transition-colors hover:text-orange"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-mono text-xs text-ink/60 transition-colors hover:text-orange"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.address && (
                  <li className="font-mono text-[10px] leading-snug text-ink/40">
                    {contact.address}
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar — revision stamp */}
        <div className="mt-10 border-t border-ink/10 pt-6 flex flex-wrap items-center justify-between gap-4">
          {legal?.companyName && (
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/30">
              {legal.companyName}
            </p>
          )}
          <p className="font-mono text-[9px] uppercase tracking-widest text-ink/20">
            © {new Date().getFullYear()} — REV 1
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
