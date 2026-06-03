import { Outlet, useLoaderData } from 'react-router'
import { VisualEditing } from '@sanity/visual-editing/react-router'

import type { Route } from './+types/layout'
import type { SiteData } from '~/lib/types'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { siteQuery } from '~/sanity/queries'

import { ExitPreview } from '~/components/ExitPreview'
import { SanityLiveMode } from '~/components/SanityLiveMode'
import { Footer } from '~/components/layout/Footer'
import { Header } from '~/components/layout/Header'

const EMPTY_SITE: SiteData = { settings: null }

export const loader = ({ request }: Route.LoaderArgs) =>
  loadSanity(request, siteQuery, { withPreview: true })

export type WebsiteOutletContext = { site: SiteData }

export default function WebsiteLayout() {
  const loaderData = useLoaderData<typeof loader>()
  const site = useSanity(siteQuery, loaderData) ?? EMPTY_SITE
  const { preview } = loaderData

  return (
    <div className="flex min-h-dvh flex-col">
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
