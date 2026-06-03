import { imageDims } from '~/lib/site-data'
import { cn } from '~/lib/utils'

import lqip from '~/lib/lqip.json'

const LQIP = lqip as Record<string, string>

type Props = {
  /** image basename, e.g. "preglov-trg-10" (file lives at /images/<name>.jpg) */
  name: string
  alt: string
  className?: string
  /** override the wrapper aspect-ratio (e.g. "16 / 9"); defaults to natural */
  ratio?: string
  /** eager-load above-the-fold (hero) images */
  priority?: boolean
  sizes?: string
}

/**
 * Prototype image: blurred LQIP placeholder behind the real jpg, explicit
 * width/height + aspect-ratio so layout space is reserved (no CLS), lazy by
 * default. Real build swaps this for the Sanity image pipeline (ADR 0005).
 */
export function Image({ name, alt, className, ratio, priority, sizes }: Props) {
  const dims = imageDims[name] ?? { w: 1280, h: 960 }
  const placeholder = LQIP[name]
  const aspect = ratio ?? `${dims.w} / ${dims.h}`

  return (
    <div
      className={cn('relative overflow-hidden bg-bone-2', className)}
      style={{
        aspectRatio: aspect,
        backgroundImage: placeholder ? `url(${placeholder})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <img
        src={`/images/${name}.jpg`}
        alt={alt}
        width={dims.w}
        height={dims.h}
        sizes={sizes}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}
