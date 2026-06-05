import { useEffect } from 'react'
import { useFetcher } from 'react-router'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import type { Variant } from '~/variants'

import { variants } from '~/variants'

/**
 * The floating design picker (ADR 0008) — `← n/5 · Ime →`, fixed bottom-center on
 * every website route, staging only. Each arrow POSTs the next variant number to the
 * `/resource/design` action; React Router revalidates the loaders in place (the layout
 * re-reads the cookie and re-resolves the variant) so the picker stays on the same URL
 * with no full reload. Wraps around (5 → 1, 1 → 5). A viewing control only — the pick
 * is never recorded; the client tells the owner their choice directly. Scaffolding,
 * deleted once the client picks.
 */
export function Picker({ current }: { current: Variant }) {
  const fetcher = useFetcher()
  const total = variants.length
  const idx = variants.findIndex((v) => v.number === current.number)
  const prev = variants[(idx - 1 + total) % total]
  const next = variants[(idx + 1) % total]

  const go = (n: number) =>
    fetcher.submit({ n: String(n) }, { method: 'post', action: '/resource/design' })

  // Optional nicety: ←/→ cycle variants, but never while typing in a field.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      const typing =
        el &&
        (el.tagName === 'INPUT' ||
          el.tagName === 'TEXTAREA' ||
          el.tagName === 'SELECT' ||
          el.isContentEditable)
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft') go(prev.number)
      else if (e.key === 'ArrowRight') go(next.number)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prev.number, next.number])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex justify-center px-4">
      <div
        role="group"
        aria-label="Izbira dizajna"
        className="border-line bg-paper/95 text-ink pointer-events-auto flex items-center gap-1 rounded-full border py-1.5 pr-2 pl-1.5 shadow-lg backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={() => go(prev.number)}
          aria-label={`Prejšnji dizajn: ${prev.name}`}
          className="hover:bg-orange hover:text-paper grid size-8 place-items-center rounded-full transition-colors"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="flex items-baseline gap-1.5 px-1 text-sm font-bold whitespace-nowrap">
          <span className="text-orange tabular-nums">
            {current.number}/{total}
          </span>
          <span className="text-ink-soft font-semibold">·</span>
          <span>{current.name}</span>
        </span>

        <button
          type="button"
          onClick={() => go(next.number)}
          aria-label={`Naslednji dizajn: ${next.name}`}
          className="hover:bg-orange hover:text-paper grid size-8 place-items-center rounded-full transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}

export default Picker
