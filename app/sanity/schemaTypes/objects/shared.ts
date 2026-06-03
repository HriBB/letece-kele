import { defineField, defineType } from 'sanity'

// A label + URL pair (nav items, footer links, CTAs).
export const ctaLinkType = defineType({
  name: 'ctaLink',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})

// Header navigation entry.
export const navLinkType = defineType({
  name: 'navLink',
  title: 'Nav item',
  type: 'object',
  fields: [
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'href', title: 'URL', type: 'string', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
})
