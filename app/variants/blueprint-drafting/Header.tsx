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
    <header className="bg-paper border-b border-ink/20">
      <div className="container-page flex h-16 items-center gap-8">
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

        <nav className="hidden flex-1 items-center gap-8 lg:flex">
          {nav.map((item) => (
            <SmartLink
              key={item.href}
              href={item.href}
              className="font-mono text-[11px] uppercase tracking-widest text-ink/50 transition-colors hover:text-orange"
            >
              {item.label}
            </SmartLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-5">
          {phone && phoneHref && (
            <a
              href={phoneHref}
              className="hidden items-center gap-2 font-mono text-xs tabular-nums text-ink/60 transition-colors hover:text-ink sm:flex"
            >
              <Phone size={12} className="text-orange" />
              {phone}
            </a>
          )}
          {cta?.href && (
            <SmartLink
              href={cta.href}
              className="hidden items-center gap-1.5 border border-orange px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-orange transition-colors hover:bg-orange hover:text-paper lg:flex"
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
              className="grid size-8 place-items-center border border-ink/20 text-ink/50 hover:border-orange hover:text-orange lg:hidden"
            >
              <span className="relative block size-4">
                <span
                  className={`bg-current absolute inset-x-0 block h-px transition-all ${open ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-[4px]'}`}
                />
                <span
                  className={`bg-current absolute inset-x-0 block h-px transition-all ${open ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'top-[10px]'}`}
                />
              </span>
            </button>
          )}
        </div>
      </div>

      {open && nav.length > 0 && (
        <nav className="border-t border-ink/10 bg-bone">
          <ul className="container-page flex flex-col py-2">
            {nav.map((item) => (
              <li key={item.href} className="border-b border-ink/8 last:border-0">
                <SmartLink
                  href={item.href}
                  className="font-mono block py-3 text-[11px] uppercase tracking-widest text-ink/60 hover:text-orange"
                >
                  {item.label}
                </SmartLink>
              </li>
            ))}
            {phone && phoneHref && (
              <li className="mt-1.5 pt-1.5">
                <a
                  href={phoneHref}
                  className="flex items-center gap-2 py-2 font-mono text-xs tabular-nums text-ink/70"
                >
                  <Phone size={12} className="text-orange" />
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
