import { Award, Clock, Layers, Mountain, ShieldCheck } from 'lucide-react'

import type { HomeWhyUs } from '~/lib/types'

// A small icon rotation so each why-us row reads distinctly without the editor
// having to choose icons. Purely decorative (rows are keyed by index).
const ICONS = [Mountain, Clock, Layers, ShieldCheck, Award]

/**
 * Why-us strip: icon rows in a rounded panel — the company's edge (no scaffolds,
 * faster delivery, top materials, trained team). Renders nothing without items.
 */
export function WhyUs({ data }: { data?: HomeWhyUs }) {
  const items = data?.items ?? []
  if (items.length === 0) return null

  return (
    <section className="container-page py-16 sm:py-24">
      <div className="rounded-[2rem] bg-ink px-6 py-12 text-paper sm:px-12 sm:py-16">
        <div className="max-w-2xl">
          {data?.eyebrow ? (
            <span className="text-xs font-bold uppercase tracking-widest text-orange">
              {data.eyebrow}
            </span>
          ) : null}
          <h2 className="mt-3 font-manrope text-3xl font-extrabold leading-tight sm:text-4xl">
            {data?.heading ?? 'Zakaj Leteče Kele'}
          </h2>
          {data?.intro ? (
            <p className="mt-4 text-lg text-paper/70">{data.intro}</p>
          ) : null}
        </div>

        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <li key={i} className="flex items-start gap-4">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-orange text-paper">
                  <Icon size={20} />
                </span>
                <div>
                  {item.title ? (
                    <h3 className="font-manrope text-lg font-bold">{item.title}</h3>
                  ) : null}
                  {item.body ? (
                    <p className="mt-1 leading-relaxed text-paper/70">{item.body}</p>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default WhyUs
