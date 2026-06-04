import { defineArrayMember, defineField, defineType } from 'sanity'

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

// Members for a rich case-study / process body (ADR 0003 — full case-study depth):
// a Portable Text block carrying inline link/strong/em marks + bullet/number lists,
// plus an inline `figure` so an embedded photo keeps its place in the narrative. The
// cleaner (app/lib/wp-body.ts) emits exactly these shapes from the old WordPress HTML;
// shared so project.body, service.steps and aboutPage.body can't drift apart.
export const richBodyMembers = [
  defineArrayMember({
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading', value: 'h2' },
      { title: 'Subheading', value: 'h3' },
      { title: 'Quote', value: 'blockquote' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
      ],
      annotations: [
        defineArrayMember({
          name: 'link',
          type: 'object',
          title: 'Link',
          fields: [
            defineField({
              name: 'href',
              title: 'URL',
              type: 'url',
              validation: (R) =>
                R.uri({
                  allowRelative: true,
                  scheme: ['http', 'https', 'tel', 'mailto'],
                }),
            }),
          ],
        }),
      ],
    },
  }),
  defineArrayMember({ type: 'figure' }),
]
