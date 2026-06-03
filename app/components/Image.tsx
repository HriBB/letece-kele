import { buildImageProps, lqipOf } from '~/lib/image'

import type { ImageInput } from '~/lib/image'

type ImageProps = {
  image: ImageInput
  sizes: string
  /** Crop to a fixed ratio (width/height). Omit to preserve natural aspect. */
  aspectRatio?: number
  alt?: string
  className?: string
  /** Above-the-fold images: eager load + high priority. */
  priority?: boolean
  widths?: readonly number[]
  quality?: number
}

/**
 * Responsive Sanity image (ADR 0005): explicit width/height to avoid CLS,
 * srcSet + sizes for responsive delivery, and an LQIP blurred background that
 * the full image paints over once decoded. Returns null when the asset is
 * missing. Replaces the prototype static-jpg Image.
 */
export function Image({
  image,
  sizes,
  aspectRatio,
  alt,
  className,
  priority = false,
  widths,
  quality,
}: ImageProps) {
  const props = buildImageProps(image, { sizes, aspectRatio, widths, quality })
  if (!props) return null

  const lqip = lqipOf(image)
  const fallbackAlt =
    typeof image === 'object' && image && 'alt' in image
      ? (image as { alt?: string }).alt
      : undefined
  const altText = alt ?? fallbackAlt ?? ''

  return (
    <>
      {/* React 19 hoists this into <head>; preloads the LCP image early. */}
      {priority && (
        <link
          rel="preload"
          as="image"
          href={props.src}
          imageSrcSet={props.srcSet}
          imageSizes={props.sizes}
          fetchPriority="high"
        />
      )}
      <img
        {...props}
        alt={altText}
        className={className}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        style={
          lqip
            ? {
                backgroundImage: `url(${lqip})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
    </>
  )
}

export default Image
