import { Building2, Mail, MapPin, Phone } from 'lucide-react'

import type { HomeContactCopy, SiteSettings } from '~/lib/types'

import { SmartLink } from '~/components/SmartLink'

/**
 * Home contact CTA: a dark conversion panel with a huge tap-to-call phone CTA and a
 * company-data card (*osnovni podatki* from siteSettings). The phone is a plain `tel:`
 * anchor; email a `mailto:`. Conversion copy comes from the home singleton; the phone
 * and legal data come from Site settings (no second source of truth).
 */
export function HomeContact({
  data,
  settings,
}: {
  data?: HomeContactCopy
  settings: SiteSettings | null
}) {
  const contact = settings?.contact
  const legal = settings?.legal

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="overflow-hidden rounded-[2rem] bg-ink text-paper">
        <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <div>
            {data?.eyebrow ? (
              <span className="text-xs font-bold uppercase tracking-widest text-orange">
                {data.eyebrow}
              </span>
            ) : null}
            <h2 className="mt-3 font-manrope text-3xl font-extrabold leading-tight sm:text-4xl">
              {data?.heading ?? 'Povprašajte po ponudbi'}
            </h2>
            {data?.text ? (
              <p className="mt-4 text-lg text-paper/70">{data.text}</p>
            ) : null}

            {contact?.phone && contact?.phoneHref ? (
              <a
                href={contact.phoneHref}
                className="mt-8 inline-flex items-center gap-3 rounded-full bg-orange px-7 py-4 font-manrope text-xl font-extrabold text-paper transition-colors hover:bg-orange-dark"
              >
                <Phone size={22} />
                {contact.phone}
              </a>
            ) : null}

            <div className="mt-6 space-y-2 text-paper/80">
              {contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-2 hover:text-orange"
                >
                  <Mail size={15} className="text-orange" />
                  {contact.email}
                </a>
              ) : null}
              {contact?.address ? (
                <div className="flex items-start gap-2">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-orange" />
                  {contact.address}
                </div>
              ) : null}
            </div>
          </div>

          {/* Company-data card — *osnovni podatki* (CONTEXT.md). */}
          {legal ? (
            <div className="rounded-3xl bg-paper/5 p-7 ring-1 ring-paper/10 sm:p-9">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-paper/50">
                <Building2 size={16} className="text-orange" />
                Osnovni podatki
              </h3>
              <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
                {legal.companyName ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-paper/50">Podjetje</dt>
                    <dd className="font-semibold">{legal.companyName}</dd>
                  </div>
                ) : null}
                {legal.vat ? (
                  <div>
                    <dt className="text-xs text-paper/50">Davčna št.</dt>
                    <dd className="font-semibold">{legal.vat}</dd>
                  </div>
                ) : null}
                {legal.reg ? (
                  <div>
                    <dt className="text-xs text-paper/50">Matična št.</dt>
                    <dd className="font-semibold">{legal.reg}</dd>
                  </div>
                ) : null}
                {legal.bankIban ? (
                  <div className="sm:col-span-2">
                    <dt className="text-xs text-paper/50">{legal.bankName ?? 'Banka'}</dt>
                    <dd className="font-semibold">{legal.bankIban}</dd>
                  </div>
                ) : null}
              </dl>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default HomeContact
