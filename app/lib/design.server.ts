import { createCookie, redirect } from 'react-router'

import { DEFAULT_VARIANT_NUMBER, isValidVariantNumber } from '~/variants'

// Server-side variant resolution for the design-variant round (ADR 0008, issue #16).
// The active variant is resolved from a cookie so SSR renders the right tree with no
// client-side flash. The picker (and `?design=n`) set the cookie; the pick itself is
// never recorded — the cookie is a viewing control. All scaffolding, deleted once the
// client picks.

export const DESIGN_COOKIE_NAME = '__design'

const designCookie = createCookie(DESIGN_COOKIE_NAME, {
  path: '/',
  sameSite: 'lax',
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 30, // 30 days — long enough for a review window
  secure: process.env.NODE_ENV === 'production',
})

/**
 * Staging exposes the picker and unlocks the variants; production hides the picker
 * and locks the site to variant 1. Driven by `SITE_ENV=staging` (ADR 0008).
 */
export function isStaging(): boolean {
  return process.env.SITE_ENV === 'staging'
}

/** Serialize the design cookie value for a `Set-Cookie` header. */
export function serializeDesignCookie(n: number): Promise<string> {
  return designCookie.serialize(n)
}

/**
 * The active variant number for this request: production → always the default;
 * staging → the cookie value, clamped to a real variant (default otherwise).
 */
export async function resolveVariantNumber(request: Request): Promise<number> {
  if (!isStaging()) return DEFAULT_VARIANT_NUMBER
  const value = await designCookie.parse(request.headers.get('Cookie'))
  const n = Number(value)
  return isValidVariantNumber(n) ? n : DEFAULT_VARIANT_NUMBER
}

/**
 * If a request carries `?design=n` (staging only), set the cookie and redirect to the
 * same URL with the param stripped — so the variant resolves server-side on the next
 * render (no flash) and the address bar stays clean. Returns the redirect to `throw`,
 * or `null` when there is nothing to do. Production ignores the param entirely.
 */
export async function designParamRedirect(request: Request): Promise<Response | null> {
  if (!isStaging()) return null
  const url = new URL(request.url)
  const raw = url.searchParams.get('design')
  if (raw == null) return null

  const n = Number(raw)
  const next = isValidVariantNumber(n) ? n : DEFAULT_VARIANT_NUMBER
  url.searchParams.delete('design')

  return redirect(url.pathname + url.search, {
    headers: { 'Set-Cookie': await serializeDesignCookie(next) },
  })
}
