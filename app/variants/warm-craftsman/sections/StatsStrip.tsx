import type { Stat } from '~/lib/types'

/** Stats strip: a row of value + label figures under the hero. Null when empty. */
export function StatsStrip({ stats }: { stats?: Stat[] }) {
  if (!stats || stats.length === 0) return null

  return (
    <section className="border-y border-line bg-bone-2">
      <dl className="container-page grid grid-cols-2 gap-8 py-12 sm:py-14 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={`${s.value}-${i}`} className="text-center">
            <dt className="font-manrope text-4xl font-extrabold leading-none text-ink sm:text-5xl">
              {s.value}
            </dt>
            <dd className="mt-2 text-sm font-semibold uppercase tracking-wide text-ink-soft">
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default StatsStrip
