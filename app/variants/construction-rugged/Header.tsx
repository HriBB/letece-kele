import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { Phone } from 'lucide-react'

import type { SiteData } from '~/lib/types'

import { Image } from '~/components/Image'
import { Logo } from '~/components/Logo'
import { SmartLink } from '~/components/SmartLink'

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
    <header className="bg-paper border-b-4 border-orange">
      <div className="container-page flex h-20 items-center gap-8">
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
            <Logo className="h-11" />
          )}
        </SmartLink>

        <nav className="hidden flex-1 items-center gap-6 lg:flex">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              href={item.href}
              className="font-manrope text-sm font-bold tracking-wide uppercase text-ink/60 transition-colors hover:text-ink"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-4">
          {phone && phoneHref && (
            <a
              href={phoneHref}
              className="hidden items-center gap-2 text-sm font-bold tabular-nums text-ink sm:flex"
            >
              <Phone size={14} className="text-orange" />
              {phone}
            </a>
          )}
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className="hidden items-center gap-2 border-2 border-orange px-4 py-2 text-xs font-bold tracking-wider uppercase text-orange transition-colors hover:bg-orange hover:text-paper lg:flex"
            >
              {cta.label ?? 'Ponudba'}
            </SmartLink>
          )}
          {nav.length > 0 && (
            <button
              type="button"
              aria-label={open ? 'Zapri meni' : 'Odpri meni'}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="grid size-9 place-items-center border-2 border-ink/20 text-ink/60 hover:border-orange hover:text-orange lg:hidden"
            >
              <span className="relative block size-4">
                <span
                  className={`bg-current absolute inset-x-0 block h-[2px] transition-all ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[3px]'}`}
                />
                <span
                  className={`bg-current absolute inset-x-0 block h-[2px] transition-all ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[9px]'}`}
                />
              </span>
            </button>
          )}
        </div>
      </div>

      {open && nav.length > 0 && (
        <nav className="border-t-2 border-ink/10 bg-bone">
          <ul className="container-page flex flex-col py-3">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-ink/8 last:border-0">
                <SmartLink
                  href={item.href}
                  className="font-manrope block py-3.5 text-sm font-bold uppercase tracking-wide text-ink/70 hover:text-orange"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
            {phone && phoneHref && (
              <li className="mt-2 pt-2">
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 py-2 text-sm font-bold tabular-nums text-ink"
                >
                  <Phone size={14} className="text-orange" />
                  {phone}
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header
