import type { Variant, VariantPages } from '~/variants/types'

import { warmCraftsmanPages } from '~/variants/warm-craftsman'
import { swissTechnicalPages } from '~/variants/swiss-technical'
import { photoLedAlpinePages } from '~/variants/photo-led-alpine'

export type { Variant, VariantPages }

/** The variant rendered when none is chosen — warm craftsman, the current site. */
export const DEFAULT_VARIANT_NUMBER = 1

// Placeholder bundle for variants not built yet (#18–#20). Until each lands, its
// entry falls back to warm craftsman's pages so the picker can still cycle 1↔5 on
// staging (ADR 0008 — the lineup is fixed; the trees arrive one slice at a time).
const PLACEHOLDER: VariantPages = warmCraftsmanPages

// The fixed five-variant lineup (ADR 0008). Order is the picker order; `number` is
// the `?design=n` value. Slovenian `name`s are staging picker chrome, not CMS content.
export const variants: Variant[] = [
  { number: 1, slug: 'warm-craftsman', name: 'Topli mojster', pages: warmCraftsmanPages },
  { number: 2, slug: 'swiss-technical', name: 'Švicarska tehnika', pages: swissTechnicalPages },
  { number: 3, slug: 'photo-led-alpine', name: 'Alpski poudarek', pages: photoLedAlpinePages },
  { number: 4, slug: 'construction-rugged', name: 'Gradbena moč', pages: PLACEHOLDER },
  { number: 5, slug: 'blueprint-drafting', name: 'Tehnična risba', pages: PLACEHOLDER },
]

/** True when `n` is a real variant position (1–5). */
export function isValidVariantNumber(n: unknown): boolean {
  return (
    typeof n === 'number' &&
    Number.isInteger(n) &&
    variants.some((v) => v.number === n)
  )
}

/** Resolve a variant by number, falling back to the default (warm craftsman). */
export function getVariant(n: number): Variant {
  return (
    variants.find((v) => v.number === n) ??
    variants.find((v) => v.number === DEFAULT_VARIANT_NUMBER)!
  )
}
