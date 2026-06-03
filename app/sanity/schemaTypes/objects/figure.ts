import { ImageIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// Image with optional alt text. Asset metadata (lqip, dimensions) is queried in
// GROQ (the FIGURE fragment) for responsive rendering + LQIP blur placeholders.
// Shared infra reused by every content slice's image field (ADR 0005).
export const figureType = defineType({
  name: 'figure',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: { hotspot: true },
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description: 'Describes the image for screen readers and SEO.',
    }),
  ],
})
