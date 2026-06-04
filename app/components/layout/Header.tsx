import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { cn } from '~/lib/utils'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

export function Header({ site }: { site: SiteData }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const nav = site.settings?.nav ?? []
  const cta = site.settings?.headerCta
  const logo = site.settings?.logo
  const phoneHref = site.settings?.contact?.phoneHref
  const phone = site.settings?.contact?.phone

  // Close the mobile menu on navigation.
  useEffect(() => setOpen(false), [location.pathname, location.hash])

  return (
    <header className="border-ink/8 bg-paper/95 sticky top-0 z-50 border-b shadow-sm backdrop-blur-sm">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <SmartLink
          href="/"
          className="shrink-0"
          aria-label={site.settings?.title ?? 'Leteče Kele'}
        >
          {logo ? (
            <Image
              image={logo}
              sizes="220px"
              alt={site.settings?.title ?? 'Leteče Kele'}
              priority
              blurUp={false}
              className="h-9 w-auto"
            />
          ) : (
            <Logo className="h-12" />
          )}
        </SmartLink>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              href={item.href}
              className="text-ink-soft hover:text-orange text-sm font-semibold transition-colors"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          {phoneHref && phone && (
            <SmartLink
              href={phoneHref}
              className="bg-orange text-paper hover:bg-orange-dark flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors"
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
              className="border-ink/15 grid size-9 shrink-0 place-items-center rounded-full border lg:hidden"
            >
              <span className="relative block size-4">
                <span
                  className={cn(
                    'bg-ink absolute inset-x-0 mx-auto block h-[1.5px] w-4 transition-all',
                    open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[5px]',
                  )}
                />
                <span
                  className={cn(
                    'bg-ink absolute inset-x-0 mx-auto block h-[1.5px] w-4 transition-all',
                    open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[9px]',
                  )}
                />
              </span>
            </button>
          )}
        </div>
      </div>

      {open && nav.length > 0 && (
        <nav className="border-ink/8 bg-paper border-t lg:hidden">
          <ul className="container-page flex flex-col gap-1 py-4">
            {nav.map((item) => (
              <li key={item.href}>
                <SmartLink
                  href={item.href}
                  className="text-ink block py-2 text-base"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
            {cta && (
              <li className="pt-2">
                <SmartLink
                  href={cta.href}
                  className="bg-orange text-paper block rounded-full px-4 py-2.5 text-center text-sm font-bold"
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
