import { Link } from 'react-router'

export function NotFound() {
  return (
    <main className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <div className="font-grotesk mb-6 text-[10px] font-bold tracking-[0.25em] uppercase text-orange">
        Napaka 404
      </div>
      <h1 className="text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
        Strani ni mogoče najti
      </h1>
      <p className="mt-5 max-w-md text-base leading-relaxed text-ink/60">
        Stran, ki jo iščete, ne obstaja ali pa je bila premaknjena.
      </p>
      <Link
        to="/"
        className="bg-orange text-paper hover:bg-orange-dark mt-8 inline-flex items-center gap-2 px-6 py-3 text-sm font-bold transition-colors"
      >
        Nazaj na domačo stran
      </Link>
    </main>
  )
}

export default NotFound
