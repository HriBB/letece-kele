/**
 * Small display formatters shared across components, so a label rule lives in one
 * place and the listing card, featured strip and detail page can't drift apart.
 */

/** The project label line: "Location · Year", omitting whichever field is missing. */
export function projectMeta(p: { location?: string; year?: number }): string {
  return [p.location, p.year].filter(Boolean).join(' · ')
}
