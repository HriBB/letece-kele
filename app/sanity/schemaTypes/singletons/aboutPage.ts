import { InfoOutlineIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// The About page (singleton at /o-podjetju). Merges the old o-podjetju, vizija and
// kvaliteta stub pages plus the alpinist "why we work at height" credibility story
// into one coherent company narrative (CONTEXT.md). Seeded by merging the WordPress
// pages via the shared cleaner (ADR 0005); Slovenian copy kept verbatim.
export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'About page',
  type: 'document',
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Page heading (e.g. "O podjetju").',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Short intro',
      type: 'text',
      rows: 3,
      description: 'Lead paragraph shown under the title.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero image',
      type: 'figure',
      description: 'Supporting lead photo shown below the intro.',
    }),
    defineField({
      name: 'body',
      title: 'Company story',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
      description:
        'The merged narrative — about, vision, quality and the alpinist credibility ' +
        'story as one coherent story, in the words from the old site (formatting junk dropped).',
    }),
  ],
  preview: { prepare: () => ({ title: 'About page' }) },
})
