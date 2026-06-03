import { describe, expect, it } from 'vitest'

import { mapLink } from './maps'

describe('mapLink', () => {
  it('prefers the editor-set Google Maps URL when present', () => {
    expect(mapLink({ mapUrl: 'https://maps.google.com/?q=Bašelj' })).toBe(
      'https://maps.google.com/?q=Bašelj',
    )
  })

  it('builds an encoded Google Maps search URL from the address when no mapUrl', () => {
    expect(mapLink({ address: 'Bašelj 37a, 4205 Preddvor' })).toBe(
      'https://www.google.com/maps/search/?api=1&query=Ba%C5%A1elj%2037a%2C%204205%20Preddvor',
    )
  })

  it('returns null when neither mapUrl nor address is set, including undefined', () => {
    expect(mapLink(undefined)).toBeNull()
    expect(mapLink({})).toBeNull()
  })

  it('ignores blank/whitespace-only fields rather than emitting an empty query', () => {
    expect(mapLink({ mapUrl: '   ', address: '' })).toBeNull()
  })
})
