import { CaseIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// A project (sl label + route: "reference") — one completed job the company
// showcases (ADR 0003). Collection: list at /reference, detail at /reference/:slug.
// One type, two render depths: a project with a rich `body` reads as a full case
// study; a gallery-only project reads as a reference card. Seeded from the WordPress
// `projekti`-category posts via the shared cleaner (ADR 0005); the same documents
// back both /reference and the home featured strip (no second source of truth).
export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Project name shown in the listing and as the page title (e.g. "Preglov trg 10").',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      description: 'Where the job was done (e.g. "Ljubljana, Fužine"). Shown on the listing card.',
    }),
    defineField({
      name: 'year',
      type: 'number',
      description: 'Year the job was completed. Shown on the listing card.',
    }),
    defineField({
      name: 'summary',
      title: 'Short summary',
      type: 'text',
      rows: 3,
      description: 'One- or two-line summary shown on the /reference listing card.',
    }),
    defineField({
      name: 'gallery',
      title: 'Photo gallery',
      type: 'array',
      of: [defineArrayMember({ type: 'figure' })],
      description:
        'Captioned photos of the job. Rendered as a pure-CSS scroll-snap slider; the first photo is the listing card image.',
    }),
    defineField({
      name: 'body',
      title: 'Case-study body',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description:
        'Optional case-study narrative (Slovenian prose from the old site, formatting junk dropped). Present → reads as a full case study; empty → reads as a reference card.',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      description: 'Surface this project in the home featured strip.',
      initialValue: false,
    }),
    defineField({
      name: 'order',
      type: 'number',
      description: 'Sort order in the /reference listing and the home featured strip.',
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'gallery.0' },
  },
})
