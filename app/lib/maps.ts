import type { Contact } from '~/lib/types'

/**
 * The location reference for the contact address (issue #7, ADR 0002): a link to the
 * address on a map with NO interactive-map dependency. Prefers the editor-set Google
 * Maps URL; otherwise builds a Maps search URL from the address. Null when neither is set.
 */
export function mapLink(contact: Contact | undefined): string | null {
  const mapUrl = contact?.mapUrl?.trim()
  if (mapUrl) return mapUrl
  const address = contact?.address?.trim()
  if (address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
  }
  return null
}
