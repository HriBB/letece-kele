import { HomeIcon } from '@sanity/icons'
import { defineArrayMember, defineField, defineType } from 'sanity'

// The home page (singleton at `/`) — the variant-5 "Warm craftsman" fold-in (issue #8).
// This singleton holds only the authored section copy; the services teaser and the
// featured-projects strip are backed by the same `service` / `project` documents that
// /storitve and /reference render (ADR 0003 — no second source of truth). Section order
// (the structure the prototype settled): hero → stats → story → services → why-us →
// featured projects → contact.

/** A value + label badge / stat — reused by the hero badges and the stats strip. */
const statMember = defineArrayMember({
  type: 'object',
  name: 'stat',
  fields: [
    defineField({ name: 'value', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'label', type: 'string', validation: (R) => R.required() }),
  ],
  preview: { select: { title: 'value', subtitle: 'label' } },
})

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home page',
  type: 'document',
  icon: HomeIcon,
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'story', title: 'Story & stats' },
    { name: 'sections', title: 'Sections' },
    { name: 'contact', title: 'Contact CTA' },
  ],
  fields: [
    // Hero — value message, primary CTA, lead photo, floating stat badges.
    defineField({
      name: 'hero',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string', validation: (R) => R.required() }),
        defineField({ name: 'lead', type: 'text', rows: 3 }),
        defineField({
          name: 'cta',
          title: 'Primary CTA',
          type: 'ctaLink',
          description: 'The primary call to action, e.g. "Povprašajte po ponudbi" → /kontakt.',
        }),
        defineField({
          name: 'image',
          type: 'figure',
          description: 'Lead photo. Rendered responsively with an LQIP (no CLS).',
        }),
        defineField({
          name: 'badges',
          title: 'Floating stat badges',
          type: 'array',
          of: [statMember],
          validation: (R) => R.max(3),
          description: 'Small value + label badges floated over the hero image.',
        }),
      ],
    }),

    // Stats strip.
    defineField({
      name: 'stats',
      title: 'Stats strip',
      type: 'array',
      of: [statMember],
      group: 'story',
    }),

    // Story / about teaser.
    defineField({
      name: 'story',
      title: 'Story teaser',
      type: 'object',
      group: 'story',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string' }),
        defineField({
          name: 'paragraphs',
          type: 'array',
          of: [defineArrayMember({ type: 'block' })],
          description: 'The alpinist story teaser, in the words from the old site.',
        }),
        defineField({
          name: 'cta',
          title: 'Story CTA',
          type: 'ctaLink',
          description: 'Link to the full story, e.g. "Spoznajte ekipo" → /o-podjetju.',
        }),
      ],
    }),

    // Services teaser — copy only; the cards come from `service` documents.
    defineField({
      name: 'servicesSection',
      title: 'Services teaser',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
      ],
      description: 'Heading copy. The cards are the `service` documents (checklist, 2-up).',
    }),

    // Why us — icon rows in the rounded panel.
    defineField({
      name: 'whyUs',
      title: 'Why us',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
        defineField({
          name: 'items',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'object',
              name: 'feature',
              fields: [
                defineField({ name: 'title', type: 'string' }),
                defineField({ name: 'body', type: 'text', rows: 2 }),
              ],
              preview: { select: { title: 'title', subtitle: 'body' } },
            }),
          ],
        }),
      ],
    }),

    // Featured projects — copy only; the slider comes from `project` documents.
    defineField({
      name: 'featuredSection',
      title: 'Featured projects',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'intro', type: 'text', rows: 2 }),
      ],
      description:
        'Heading copy. The slider shows `project` documents flagged "featured" (scroll-snap).',
    }),

    // Contact CTA — copy only; phone + company data come from siteSettings.
    defineField({
      name: 'contact',
      title: 'Contact CTA',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'eyebrow', type: 'string' }),
        defineField({ name: 'heading', type: 'string' }),
        defineField({ name: 'text', type: 'text', rows: 2 }),
      ],
      description: 'Conversion copy. The phone CTA + company-data card come from Site settings.',
    }),
  ],
  preview: { prepare: () => ({ title: 'Home page' }) },
})
