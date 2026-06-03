import type { Legal } from '~/lib/types'

import { cn } from '~/lib/utils'

/**
 * The *osnovni podatki* field list (CONTEXT.md) — company name, VAT, registration,
 * bank — shown on the home contact panel and the contact page. One definition of the
 * fields, labels and order so the two surfaces can't list different company data.
 * Each caller supplies its own panel + heading; `tone` switches the palette.
 */
export function LegalDetails({ legal, tone = 'ink' }: { legal: Legal; tone?: 'ink' | 'paper' }) {
  const dtClass = tone === 'paper' ? 'text-paper/50' : 'text-ink-soft'
  const ddClass = tone === 'paper' ? 'font-semibold' : 'font-semibold text-ink'

  const rows = [
    legal.companyName && { label: 'Podjetje', value: legal.companyName, wide: true },
    legal.vat && { label: 'Davčna št.', value: legal.vat },
    legal.reg && { label: 'Matična št.', value: legal.reg },
    legal.bankIban && { label: legal.bankName ?? 'Banka', value: legal.bankIban, wide: true },
  ].filter(Boolean) as { label: string; value: string; wide?: boolean }[]

  return (
    <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
      {rows.map((r) => (
        <div key={r.label} className={r.wide ? 'sm:col-span-2' : undefined}>
          <dt className={cn('text-xs', dtClass)}>{r.label}</dt>
          <dd className={ddClass}>{r.value}</dd>
        </div>
      ))}
    </dl>
  )
}

export default LegalDetails
