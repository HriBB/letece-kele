import { SmartLink } from '~/components/SmartLink'

export function NotFound() {
  return (
    <div className="container-page flex min-h-[60vh] flex-col items-center justify-center py-24">
      {/* Blueprint stamp */}
      <div className="border border-ink/20 px-12 py-10 text-center">
        <p className="font-mono mb-4 text-[9px] uppercase tracking-[0.3em] text-orange">
          § NAPAKA — STATUS KODE
        </p>
        <div className="font-mono text-[120px] font-bold leading-none tabular-nums text-ink/10 sm:text-[180px]">
          404
        </div>
        <div className="mt-0 border-t border-ink/15 pt-6">
          <h1 className="text-2xl font-bold leading-tight text-ink sm:text-3xl">
            Strani ni mogoče najti
          </h1>
          <p className="mt-3 max-w-sm font-mono text-[11px] leading-relaxed text-ink/50">
            Iskana stran ne obstaja ali je bila premaknjena. Preverite URL in poskusite znova.
          </p>
          <SmartLink
            href="/"
            className="mt-6 inline-flex items-center gap-2 bg-orange px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-paper transition-colors hover:bg-orange-dark"
          >
            ← Nazaj na začetek
          </SmartLink>
        </div>
        {/* Drawing revision stamp */}
        <div className="mt-6 flex items-center justify-center gap-4 border-t border-ink/10 pt-4">
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/20">ERR-404</span>
          <span className="font-mono text-[9px] text-ink/15">·</span>
          <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink/20">REV A</span>
        </div>
      </div>
    </div>
  )
}

export default NotFound
