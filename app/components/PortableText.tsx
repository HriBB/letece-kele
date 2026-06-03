import { PortableText as BasePortableText } from '@portabletext/react'

import type { PortableTextComponents } from '@portabletext/react'
import type { PortableTextBlock } from '@portabletext/types'

import { SmartLink } from '~/components/SmartLink'
import { cn } from '~/lib/utils'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => (
      <h2 className="text-xl font-bold text-ink">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-lg font-bold text-ink">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-orange pl-4 italic">
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
