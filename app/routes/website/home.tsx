import type { Route } from './+types/home'

// Placeholder home. The variant 5 ("Warm craftsman") fold-in lands in issue #8;
// this stub only proves the shared layout (Header + Footer from siteSettings) renders.
export const meta: Route.MetaFunction = () => [
  { title: 'Leteče Kele — Kvaliteta na višini' },
  {
    name: 'description',
    content:
      'Alpinistična višinska dela — sanacija fasad, betona in jeklenih konstrukcij brez gradbenih odrov.',
  },
]

export default function HomePage() {
  return (
    <section className="container-page py-24">
      <span className="inline-flex items-center gap-2 rounded-full bg-orange/12 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange">
        Kvaliteta na višini
      </span>
      <h1 className="mt-6 text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
        Leteče Kele
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-soft">
        Skeleton stran. Glava in noga se izrišeta iz <code>siteSettings</code>; vsebino ureja{' '}
        embedded Studio na <code>/studio</code>. Domača stran (variant 5) pride v nalogi #8.
      </p>
    </section>
  )
}
