import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { ArrowRight, Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

/**
 * Header (photo-led alpine): white bar, logo left, nav centre, CTA pill +
 * phone right. Taller than Swiss (h-16); orange CTA is rectangular, no pill
 * rounding — editorial magazine feel. Mobile: same slide-down nav panel.
 */
export function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const nav = site.settings?.nav ?? []
  const logo = site.settings?.logo
  const phone = site.settings?.contact?.phone
  const phoneHref = site.settings?.contact?.phoneHref
  const cta = site.settings?.headerCta

  useEffect(() => setOpen(false), [location.pathname])

  return (
    <header className="border-b border-ink/10 bg-paper">
      <div className="container-page flex h-16 items-center gap-6">
        <SmartLink
          href="/"
          aria-label={site.settings?.title ?? 'Leteče Kele'}
          className="shrink-0"
        >
          {logo ? (
            <Image
              image={logo}
              sizes="180px"
              alt={site.settings?.title ?? 'Leteče Kele'}
              priority
              blurUp={false}
              className="h-9 w-auto"
            />
          ) : (
            <Logo className="h-10" />
          )}
        </SmartLink>

        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink/60 tracking-wide transition-colors hover:text-ink"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {phone && phoneHref && (
            <a
              href={phoneHref}
              className="font-grotesk hidden items-center gap-1.5 text-sm font-semibold tabular-nums text-ink/70 transition-colors hover:text-ink sm:flex"
            >
              <Phone size={13} className="text-orange" />
              {phone}
            </a>
          )}
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className="bg-orange text-paper hover:bg-orange-dark hidden items-center gap-1.5 px-4 py-2 text-sm font-bold transition-colors sm:flex"
            >
              {cta.label ?? 'Ponudba'}
              <ArrowRight size={14} />
            </SmartLink>
          )}
          {nav.length > 0 && (
            <button
              type="button"
              aria-label={open ? 'Zapri meni' : 'Odpri meni'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-8 place-items-center text-ink/50 hover:text-ink lg:hidden"
            >
              <span className="relative block size-4">
                <span
                  className={`bg-ink absolute inset-x-0 block h-[1.5px] transition-all ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[4px]'}`}
                />
                <span
                  className={`bg-ink absolute inset-x-0 block h-[1.5px] transition-all ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[10px]'}`}
                />
              </span>
            </button>
          )}
        </div>
      </div>

      {open && nav.length > 0 && (
        <nav className="border-t border-ink/10 bg-paper">
          <ul className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  className="block py-2.5 text-sm font-medium text-ink/70"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
            {phone && phoneHref && (
              <li className="mt-1 border-t border-ink/10 pt-3">
                <a
                  href={phoneHref}
                  className="font-grotesk flex items-center gap-2 py-2 text-sm font-semibold text-ink"
                >
                  <Phone size={13} className="text-orange" />
                  {phone}
                </a>
              </li>
            )}
            {cta?.href && (
              <li className="pt-3 pb-2">
                <SmartLink
                  href={cta.href}
                  className="bg-orange text-paper flex items-center justify-center gap-2 py-3 text-sm font-bold"
                >
                  {cta.label ?? 'Ponudba'}
                  <ArrowRight size={14} />
                </SmartLink>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
