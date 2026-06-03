import { describe, expect, it } from 'vitest'

import { localBusinessJsonLd } from './jsonLd'

import type { SiteSettings } from './types'

const settings: SiteSettings = {
  title: 'Leteče Kele',
  legal: { companyName: 'Leteče Kele Višinska dela d.o.o.', vat: 'SI12345678' },
  contact: {
    phone: '+386 40 123 456',
    email: 'info@letecekele.si',
    address: 'Bašelj 37a, 4205 Preddvor',
    mapUrl: 'https://maps.google.com/?q=Baselj+37a',
  },
}

describe('localBusinessJsonLd', () => {
  it('describes the company as a LocalBusiness rooted at the site origin', () => {
    const ld = localBusinessJsonLd({
      settings,
      services: [],
      origin: 'https://letecekele.si',
    })

    expect(ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Leteče Kele Višinska dela d.o.o.',
      url: 'https://letecekele.si',
      telephone: '+386 40 123 456',
      email: 'info@letecekele.si',
      address: { '@type': 'PostalAddress', streetAddress: 'Bašelj 37a, 4205 Preddvor' },
      vatID: 'SI12345678',
      hasMap: 'https://maps.google.com/?q=Baselj+37a',
    })
  })

  it('lists each service as an Offer pointing at its absolute detail URL', () => {
    const ld = localBusinessJsonLd({
      settings,
      services: [
        { title: 'Sanacija betona', slug: 'sanacija-betona' },
        { title: 'Izolacijska fasada', slug: 'izolacijska-fasada' },
      ],
      origin: 'https://letecekele.si',
    })

    expect(ld.makesOffer).toEqual([
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Sanacija betona',
          url: 'https://letecekele.si/storitve/sanacija-betona',
        },
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Izolacijska fasada',
          url: 'https://letecekele.si/storitve/izolacijska-fasada',
        },
      },
    ])
  })

  it('falls back to the brand title and omits keys whose source data is missing', () => {
    const ld = localBusinessJsonLd({
      settings: { title: 'Leteče Kele' },
      services: [],
      origin: 'https://letecekele.si',
    })

    expect(ld.name).toBe('Leteče Kele')
    expect(ld).not.toHaveProperty('telephone')
    expect(ld).not.toHaveProperty('email')
    expect(ld).not.toHaveProperty('address')
    expect(ld).not.toHaveProperty('makesOffer')
  })
})
