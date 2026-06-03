import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { cn } from '~/lib/utils'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

export function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const nav = site.settings?.nav ?? []
  const cta = site.settings?.headerCta
  const phoneHref = site.settings?.contact?.phoneHref
  const phone = site.settings?.contact?.phone

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <header className="sticky top-0 z-50 border-b border-ink/8 bg-paper/95 shadow-sm backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <SmartLink href="/" className="shrink-0" aria-label={site.settings?.title ?? 'Leteče Kele'}>
          <Logo showSub className="h-9" />
        </SmartLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-ink-soft transition-colors hover:text-orange"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {phoneHref && phone && (
            <SmartLink
              href={phoneHref}
              className="flex items-center gap-2 rounded-full bg-orange px-4 py-2.5 text-sm font-bold text-paper transition-colors hover:bg-orange-dark"
            >
              <Phone size={15} />
              <span>{phone}</span>
            </SmartLink>
          )}

          {nav.length > 0 && (
            <button
              type="button"
              aria-label={open ? 'Zapri meni' : 'Odpri meni'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-ink/15 lg:hidden"
            >
              <span className="relative block size-4">
                <span
                  className={cn(
                    'absolute inset-x-0 mx-auto block h-[1.5px] w-4 bg-ink transition-all',
                    open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]',
                  )}
                />
                <span
                  className={cn(
                    'absolute inset-x-0 mx-auto block h-[1.5px] w-4 bg-ink transition-all',
                    open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[9px]',
                  )}
                />
              </span>
            </button>
          )}
        </div>
      </div>

      {open && nav.length > 0 && (
        <nav className="border-t border-ink/8 bg-paper lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink href={item.href} className="block py-2 text-base text-ink">
                  {item.label}
                </SmartLink>
              </li>
            ))}
            {cta && (
              <li className="pt-2">
                <SmartLink
                  href={cta.href}
                  className="block rounded-full bg-orange px-4 py-2.5 text-center text-sm font-bold text-paper"
                >
                  {cta.label}
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
