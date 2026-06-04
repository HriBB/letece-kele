import { getImageDimensions } from '@sanity/asset-utils'

import type { SanityImageSource } from '@sanity/asset-utils'

import { imageUrlBuilder } from '~/sanity/image'

/** Minimal shape of a Sanity image with optional alt/caption + asset metadata (lqip). */
export type SanityImage = {
  _type?: 'image' | 'figure'
  asset?: { _ref?: string; _id?: string; metadata?: { lqip?: string } }
  alt?: string
  /** Visible label shown under the photo; distinct from the alt text (ADR 0007). */
  caption?: string
  hotspot?: unknown
  crop?: unknown
  lqip?: string
}

/** Width ladder for responsive `srcSet` (ADR 0005). */
export const DEFAULT_WIDTHS = [400, 600, 800, 1000, 1200, 1600] as const

/** `sizes` presets per layout. */
export const SIZES = {
  fullBleed: '100vw',
  halfSplit: '(min-width: 1024px) 50vw, 100vw',
  grid2: '(min-width: 640px) 50vw, 100vw',
  grid3: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  grid4: '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
  card: '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  prose: '(min-width: 768px) 768px, 100vw',
} as const

export type ImageInput =
  | SanityImage
  | SanityImageSource
  | { asset?: { _ref?: string; _id?: string } }
  | string
  | null
  | undefined

export type BuildImageOptions = {
  sizes: string
  /** Crop to a fixed width/height ratio. Omit to preserve the asset's natural aspect. */
  aspectRatio?: number
  widths?: readonly number[]
  quality?: number
  baseWidth?: number
}

export type ImageProps = {
  src: string
  srcSet: string
  sizes: string
  width: number
  height: number
}

function resolveRef(image: ImageInput): string | undefined {
  if (!image) return undefined
  if (typeof image === 'string') return image
  const obj = image as {
    asset?: { _ref?: string; _id?: string }
    _ref?: string
    _id?: string
  }
  return obj.asset?._ref ?? obj.asset?._id ?? obj._ref ?? obj._id
}

/** Read the lqip data-URI from an image's asset metadata, if it was queried. */
export function lqipOf(image: ImageInput): string | undefined {
  if (!image || typeof image === 'string') return undefined
  const obj = image as SanityImage
  return obj.asset?.metadata?.lqip ?? obj.lqip
}

/**
 * Build responsive `<img>` attributes for a Sanity image. Returns `null` when
 * the asset is missing. Pass `aspectRatio` to crop to a fixed ratio; omit to
 * preserve the asset's natural aspect. Always returns explicit width/height so
 * the layout reserves space up front (no CLS).
 */
export function buildImageProps(
  image: ImageInput,
  opts: BuildImageOptions,
): ImageProps | null {
  const ref = resolveRef(image)
  if (!ref || !image) return null

  const {
    sizes,
    aspectRatio,
    widths = DEFAULT_WIDTHS,
    quality = 75,
    baseWidth = 800,
  } = opts

  const source = image as SanityImageSource

  let aspect: number
  let width: number
  let height: number

  if (aspectRatio) {
    aspect = aspectRatio
    width = baseWidth
    height = Math.round(baseWidth / aspect)
  } else {
    let dims: { width: number; height: number } | null = null
    try {
      dims = getImageDimensions(ref)
    } catch {
      dims = null
    }
    aspect = dims ? dims.width / dims.height : 4 / 3
    width = dims?.width ?? baseWidth
    height = dims?.height ?? Math.round(baseWidth / aspect)
  }

  const fit = aspectRatio ? 'crop' : 'max'
  const url = (w: number) =>
    imageUrlBuilder
      .image(source)
      .width(w)
      .height(Math.round(w / aspect))
      .fit(fit)
      .auto('format')
      .quality(quality)
      .url()

  return {
    src: url(baseWidth),
    srcSet: widths.map((w) => `${url(w)} ${w}w`).join(', '),
    sizes,
    width,
    height,
  }
}

/**
 * Build `src` + DPR `srcSet` for a fixed-size raster (logo, avatar). Omit
 * `displayWidth` to pin by height only. Returns `null` when the asset is missing.
 */
export function buildFixedImageProps(
  image: ImageInput,
  opts: {
    displayWidth?: number
    displayHeight: number
    fit?: 'max' | 'crop'
    quality?: number
    dpr?: readonly number[]
  },
): { src: string; srcSet: string; width?: number; height: number } | null {
  const ref = resolveRef(image)
  if (!ref || !image) return null

  const {
    displayWidth,
    displayHeight,
    fit = 'max',
    quality = 80,
    dpr = [1, 2],
  } = opts
  const source = image as SanityImageSource

  const url = (scale: number) => {
    let builder = imageUrlBuilder
      .image(source)
      .height(Math.round(displayHeight * scale))
    if (displayWidth) builder = builder.width(Math.round(displayWidth * scale))
    return builder.fit(fit).auto('format').quality(quality).url()
  }

  return {
    src: url(1),
    srcSet: dpr.map((d) => `${url(d)} ${d}x`).join(', '),
    width: displayWidth,
    height: displayHeight,
  }
}
