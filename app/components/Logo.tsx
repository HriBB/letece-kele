import { site } from '~/lib/site-data'
import { cn } from '~/lib/utils'

/**
 * Brand logo — the real letecekele.si wordmark PNG (black "Leteče kele" + orange
 * crossed-trowel emblem, transparent bg). Two files:
 *   /images/logo.png        → full colour, for LIGHT surfaces
 *   /images/logo-white.png  → white knockout, for DARK surfaces (pass onDark)
 * Size it by height via className (e.g. "h-9", "h-12"); width auto-derives from
 * the 249×107 intrinsic ratio so no layout shift.
 *
 * `font` / `accent` are accepted-and-ignored for back-compat with variants that
 * predate the image logo.
 */
export function Logo({
  className,
  onDark = false,
  showSub = false,
  subClassName,
  font: _font,
  accent: _accent,
}: {
  className?: string
  onDark?: boolean
  showSub?: boolean
  subClassName?: string
  font?: 'grotesk' | 'manrope' | 'sans'
  accent?: string
}) {
  const img = (
    <img
      src={onDark ? '/images/logo-white.png' : '/images/logo.png'}
      alt={`${site.name} — ${site.wordmarkSub}`}
      width={249}
      height={107}
      className={cn('h-9 w-auto', className)}
    />
  )

  if (!showSub) return img

  return (
    <span className="inline-flex flex-col leading-none">
      {img}
      <span
        className={cn(
          'mt-1 text-[0.62rem] font-semibold uppercase tracking-[0.22em] opacity-70',
          subClassName,
        )}
      >
        {site.wordmarkSub}
      </span>
    </span>
  )
}
