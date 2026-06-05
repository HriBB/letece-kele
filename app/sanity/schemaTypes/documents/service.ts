import { WrenchIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

import { richBodyMembers } from '../objects/shared'

// A service (sl: storitev) — one offering the company performs (concrete
// restoration, dilatation joints, insulation facade, steel-structure restoration,
// solar-plant install). Collection: list at /storitve, detail at /storitve/:slug.
// Seeded from the WordPress service pages via the shared cleaner (ADR 0005).
export const serviceType = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: WrenchIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Service name shown in the listing and as the page title (e.g. "Sanacija betona").',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'description',
      title: 'Short description',
      type: 'text',
      rows: 3,
      description: 'One- or two-line summary shown on the /storitve listing card.',
    }),
    defineField({
      name: 'photo',
      title: 'Representative photo',
      type: 'figure',
      description: 'Lead photo shown on the listing card and the detail page.',
    }),
    defineField({
      name: 'steps',
      title: 'Process steps',
      type: 'array',
      of: richBodyMembers,
      description: 'The ordered process, in the words from the old site (formatting junk dropped).',
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Sort order in the /storitve listing.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', media: 'photo' },
  },
})
