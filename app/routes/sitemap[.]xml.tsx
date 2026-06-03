import type { Route } from './+types/sitemap[.]xml'

import { serverClient } from '~/sanity/client.server'
import { PROJECT_SLUGS_QUERY, SERVICE_SLUGS_QUERY } from '~/sanity/queries'
import { buildSitemapXml } from '~/lib/sitemap'

import type { SitemapEntry } from '~/lib/sitemap'

type SlugRow = { slug: string; _updatedAt: string }

const toEntry = (r: SlugRow): SitemapEntry => ({ slug: r.slug, updatedAt: r._updatedAt })

export async function loader({ request }: Route.LoaderArgs) {
  const origin = new URL(request.url).origin
  const [services, projects] = await Promise.all([
    serverClient.fetch<SlugRow[]>(SERVICE_SLUGS_QUERY),
    serverClient.fetch<SlugRow[]>(PROJECT_SLUGS_QUERY),
  ])

  const body = buildSitemapXml({
    origin,
    services: services.map(toEntry),
    projects: projects.map(toEntry),
  })

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
