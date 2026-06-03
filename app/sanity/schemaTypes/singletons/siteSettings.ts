import { CogIcon } from '@sanity/icons'
import { defineField, defineType } from 'sanity'

// Global header / footer / contact / legal data shared across every page.
// Legal block = *osnovni podatki* (CONTEXT.md): address, VAT, registration, bank.
export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'header', title: 'Header', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'legal', title: 'Legal (osnovni podatki)' },
    { name: 'footer', title: 'Footer' },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Leteče Kele', group: 'header' }),
    defineField({
      name: 'nav',
      title: 'Navigation',
      type: 'array',
      of: [{ type: 'navLink' }],
      group: 'header',
    }),
    defineField({ name: 'headerCta', title: 'Header CTA', type: 'ctaLink', group: 'header' }),

    defineField({
      name: 'contact',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'phone', type: 'string' }),
        defineField({ name: 'phoneHref', title: 'Phone link (tel:)', type: 'string' }),
        defineField({ name: 'email', type: 'string' }),
        defineField({ name: 'address', type: 'string' }),
        defineField({ name: 'mapUrl', title: 'Google Maps URL', type: 'url' }),
      ],
    }),

    defineField({
      name: 'legal',
      title: 'Legal / company data',
      type: 'object',
      group: 'legal',
      fields: [
        defineField({ name: 'companyName', type: 'string' }),
        defineField({ name: 'vat', title: 'VAT (davčna št.)', type: 'string' }),
        defineField({ name: 'reg', title: 'Registration (matična št.)', type: 'string' }),
        defineField({ name: 'bankName', type: 'string' }),
        defineField({ name: 'bankIban', title: 'Bank IBAN', type: 'string' }),
      ],
    }),

    defineField({
      name: 'footer',
      type: 'object',
      group: 'footer',
      fields: [
        defineField({ name: 'tagline', type: 'string' }),
        defineField({ name: 'links', type: 'array', of: [{ type: 'ctaLink' }] }),
        defineField({ name: 'copyright', type: 'string' }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
