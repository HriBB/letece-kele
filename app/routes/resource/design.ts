import { data, redirect } from 'react-router'

import type { Route } from './+types/design'

import { isStaging, serializeDesignCookie } from '~/lib/design.server'
import { DEFAULT_VARIANT_NUMBER, isValidVariantNumber } from '~/variants'

// Picker target (ADR 0008, issue #16). The floating picker POSTs `n` here; the action
// sets the design cookie and returns — React Router then revalidates the page loaders
// (which re-read the cookie and re-resolve the variant) without navigating, so the
// picker stays on the same URL. A GET loader handles direct `?design=n` style links.
// All scaffolding, deleted once the client picks.

/** Clamp an incoming `n` to a real variant number (default otherwise). */
function pickVariant(raw: string | null): number {
  const n = Number(raw)
  return isValidVariantNumber(n) ? n : DEFAULT_VARIANT_NUMBER
}

/** Only allow same-origin path redirects (no open redirect via `?redirect=`). */
function safePath(redirectTo: string | null): string {
  if (!redirectTo || !redirectTo.startsWith('/') || redirectTo.startsWith('//')) {
    return '/'
  }
  return redirectTo
}

// POST from the picker pill — set the cookie, then let revalidation swap the variant
// in place. Outside staging the picker is hidden, so this is a no-op.
export async function action({ request }: Route.ActionArgs) {
  if (!isStaging()) return data(null)
  const form = await request.formData()
  const next = pickVariant(form.get('n')?.toString() ?? null)
  return data(null, {
    headers: { 'Set-Cookie': await serializeDesignCookie(next) },
  })
}

// GET fallback for direct links — set the cookie and redirect to the given path.
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const redirectTo = safePath(url.searchParams.get('redirect'))
  if (!isStaging()) return redirect(redirectTo)
  const next = pickVariant(url.searchParams.get('n'))
  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await serializeDesignCookie(next) },
  })
}
