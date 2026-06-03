import { Outlet, useLoaderData } from 'react-router'
import { VisualEditing } from '@sanity/visual-editing/react-router'

import type { Route } from './+types/layout'
import type { SiteData } from '~/lib/types'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { siteQuery } from '~/sanity/queries'
import { localBusinessJsonLd } from '~/lib/jsonLd'

import { ExitPreview } from '~/components/ExitPreview'
import { JsonLd } from '~/components/JsonLd'
import { SanityLiveMode } from '~/components/SanityLiveMode'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'

const EMPTY_SITE: SiteData = { settings: null, services: [] }

// Resolve the request origin server-side so the site-wide JSON-LD (and any other
// absolute-URL needs) don't reach for a hardcoded domain — same origin the sitemap
// and robots routes derive from `request.url`.
export const loader = async ({ request }: Route.LoaderArgs) => {
  const sanity = await loadSanity(request, siteQuery, { withPreview: true })
  return { ...sanity, origin: new URL(request.url).origin }
}

export type WebsiteOutletContext = { site: SiteData }

export default function WebsiteLayout() {
  const loaderData = useLoaderData<typeof loader>()
  const site = useSanity(siteQuery, loaderData) ?? EMPTY_SITE
  const { preview, origin } = loaderData

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd
        data={localBusinessJsonLd({
          settings: site.settings,
          services: site.services,
          origin,
        })}
      />
      <Header site={site} />
      <main className="flex-1">
        <Outlet context={{ site } satisfies WebsiteOutletContext} />
      </main>
      <Footer site={site} />
      {preview ? (
        <>
          <SanityLiveMode />
          <ExitPreview />
          <VisualEditing />
        </>
      ) : null}
    </div>
  )
}
