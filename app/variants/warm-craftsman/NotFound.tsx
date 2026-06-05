import { Link } from 'react-router'

export function NotFound() {
  return (
    <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-orange font-manrope text-sm font-extrabold tracking-widest uppercase">
        404
      </p>
      <h1 className="text-ink mt-4 text-4xl leading-tight font-extrabold sm:text-5xl">
        Strani ni mogoče najti
      </h1>
      <p className="text-ink-soft mt-5 max-w-xl text-lg leading-relaxed">
        Stran, ki jo iščete, ne obstaja ali pa je bila premaknjena. Vrnite se na domačo stran.
      </p>
      <Link
        to="/"
        className="bg-orange text-paper hover:bg-orange-dark font-manrope mt-8 inline-flex items-center gap-3 rounded-full px-7 py-4 text-lg font-extrabold transition-colors"
      >
        Nazaj na domačo stran
      </Link>
    </main>
  )
}

export default NotFound
