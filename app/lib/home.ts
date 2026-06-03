// Pure helpers backing the home page (issue #8). Kept out of the route/components so
// the home's two bits of real logic — which projects the featured strip shows, and
// the short checklist a service teaser card distils from its process steps — are
// unit-testable without rendering React or touching the Content Lake.

import type { PortableTextBlock } from '@portabletext/types'

/**
 * Pick the projects the home featured strip shows. Prefers those an editor flagged
 * `featured`; when none are flagged, falls back to the first `limit` (the listing is
 * already in editor order), so the strip is never empty. Caps the result at `limit`.
 * The same `project` documents back the strip and `/reference` (ADR 0003).
 */
export function selectFeaturedProjects<T extends { featured?: boolean }>(
  projects: T[] | null | undefined,
  limit = 6,
): T[] {
  if (!projects?.length) return []
  const flagged = projects.filter((p) => p.featured)
  return (flagged.length ? flagged : projects).slice(0, limit)
}

/**
 * Distil a service's `steps` (Portable Text process) into short plain-text lines for
 * the home services-teaser checklist. Skips heading blocks (the steps' "Postopek"
 * sub-titles), keeps the ordered process paragraphs, and caps the list at `limit`.
 */
export function serviceChecklist(
  steps: PortableTextBlock[] | null | undefined,
  limit = 4,
): string[] {
  if (!steps?.length) return []
  return steps
    .filter((b) => b._type === 'block' && (b.style == null || b.style === 'normal'))
    .map((b) =>
      Array.isArray(b.children)
        ? b.children
            .map((c) =>
              typeof (c as { text?: unknown }).text === 'string'
                ? (c as { text: string }).text
                : '',
            )
            .join('')
            .trim()
        : '',
    )
    .filter(Boolean)
    .slice(0, limit)
}
