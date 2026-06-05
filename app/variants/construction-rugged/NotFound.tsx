import { SmartLink } from '~/components/SmartLink'

export function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-start justify-center py-24">
      <span className="font-manrope text-[120px] font-black leading-none text-orange/20 sm:text-[180px]">
        404
      </span>
      <div className="mt-2 border-l-4 border-orange pl-6">
        <h1 className="font-manrope text-3xl font-black leading-tight text-ink sm:text-4xl">
          Strani ni mogoče najti
        </h1>
        <p className="mt-3 max-w-md text-base leading-relaxed text-ink/60">
          Iskana stran ne obstaja ali je bila premaknjena.
        </p>
        <SmartLink
          href="/"
          className="mt-6 inline-flex items-center gap-2 bg-orange px-6 py-3.5 font-manrope text-sm font-black tracking-wide uppercase text-paper transition-colors hover:bg-orange-dark"
        >
          Nazaj na začetek
        </SmartLink>
      </div>
    </div>
  )
}

export default NotFound
