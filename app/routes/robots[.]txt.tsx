import type { Route } from './+types/robots[.]txt'

import { buildRobotsTxt } from '~/lib/robots'

export function loader({ request }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin

  return new Response(buildRobotsTxt(origin), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
