import { redirect } from 'react-router'

import type { Route } from './+types/preview'

import { commitSession, destroySession, getSession } from '~/lib/session.server'
import { client } from '~/sanity/client'

// A POST request exits preview mode by destroying the gated session cookie.
export async function action({ request }: Route.ActionArgs) {
  const session = await getSession(request.headers.get('Cookie'))
  return redirect('/', {
    headers: { 'Set-Cookie': await destroySession(session) },
  })
}

// Enables Visual Editing preview mode (sets the gated session cookie), then
// returns to the requested front-end path. Called by the Presentation tool.
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url)
  const redirectTo =
    url.searchParams.get('sanity-preview-pathname') ||
    url.searchParams.get('redirect') ||
    '/'

  const session = await getSession(request.headers.get('Cookie'))
  session.set('projectId', client.config().projectId)

  return redirect(redirectTo, {
    headers: { 'Set-Cookie': await commitSession(session) },
  })
}
