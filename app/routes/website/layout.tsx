import { Outlet, useLoaderData } from 'react-router'
import { VisualEditing } from '@sanity/visual-editing/react-router'

import type { Route } from './+types/layout'
import type { SiteData } from '~/lib/types'
import type { Variant } from '~/variants'

import { loadSanity } from '~/sanity/data.server'
import { useSanity } from '~/sanity/data'
import { siteQuery } from '~/sanity/queries'
import { localBusinessJsonLd } from '~/lib/jsonLd'
import { designParamRedirect, isStaging, resolveVariantNumber } from '~/lib/design.server'
import { getVariant } from '~/variants'

import { ExitPreview } from '~/components/ExitPreview'
import { JsonLd } from '~/components/JsonLd'
import { SanityLiveMode } from '~/components/SanityLiveMode'
import { Picker } from '~/variants/Picker'

const EMPTY_SITE: SiteData = { settings: null, services: [] }

export const loader = async ({ request }: Route.LoaderArgs) => {
  const designRedirect = await designParamRedirect(request)
  if (designRedirect) return designRedirect

  const variantNumber = await resolveVariantNumber(request)
  const staging = isStaging()
  const sanity = await loadSanity(request, siteQuery, { withPreview: true })
  return { ...sanity, origin: new URL(request.url).origin, variantNumber, staging }
}

export type WebsiteOutletContext = { site: SiteData; variant: Variant }

export default function WebsiteLayout() {
  const loaderData = useLoaderData<typeof loader>()
  const site = useSanity(siteQuery, loaderData) ?? EMPTY_SITE
  const { preview, origin, variantNumber, staging } = loaderData
  const variant = getVariant(variantNumber)
  const Pages = variant.pages

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd
        data={localBusinessJsonLd({
          settings: site.settings,
          services: site.services,
          origin,
        })}
      />
      <Pages.Header site={site} />
      <main className="flex-1">
        <Outlet context={{ site, variant } satisfies WebsiteOutletContext} />
      </main>
      <Pages.Footer site={site} />
      {staging ? <Picker current={variant} /> : null}
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
