import { PortableText as BasePortableText } from '@portabletext/react'

import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'
import type { SanityImage } from '~/lib/image'

import { SIZES } from '~/lib/image'
import { cn } from '~/lib/utils'

import { Image } from '~/components/Image'
import { SmartLink } from '~/components/SmartLink'

const components: PortableTextComponents = {
  types: {
    // An inline case-study photo kept in body order (ADR 0003). The asset is
    // expanded by the body[] FIGURE projection in app/sanity/queries.ts.
    figure: ({ value }) => {
      const figure = value as SanityImage
      const caption = figure.caption ?? figure.alt
      return (
        <figure className="my-6 overflow-hidden rounded-2xl">
          <Image
            image={figure}
            sizes={SIZES.prose}
            alt={figure.alt}
            className="h-auto w-full object-cover"
          />
          {caption ? (
            <figcaption className="text-ink-soft mt-2 text-sm">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      )
    },
  },
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-ink text-xl font-bold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-ink text-lg font-bold">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-orange border-l-2 pl-4 italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    link: ({ children, value }) => (
      <SmartLink
        href={(value as { href?: string })?.href}
        className="text-orange underline underline-offset-2"
      >
        {children}
      </SmartLink>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-5">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-5">{children}</ol>,
  },
}

/** Renders Portable Text with the site's link + heading styling. Null when empty. */
export function PortableText({
  value,
  className,
}: {
  value?: PortableTextBlock[] | null
  className?: string
}) {
  if (!value || value.length === 0) return null
  return (
    <div className={cn('space-y-4 leading-relaxed', className)}>
      <BasePortableText value={value} components={components} />
    </div>
  )
}

export default PortableText
