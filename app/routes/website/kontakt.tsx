import { useOutletContext } from 'react-router'

import type { Route } from './+types/kontakt'
import type { WebsiteOutletContext } from './layout'

import { pageMeta } from '~/lib/meta'

import { ContactPage } from '~/components/ContactPage'

// Info-only contact (ADR 0002): no loader of its own — the layout already loads
// siteSettings and hands it down via the outlet context, exactly like the service
// and project detail routes. Nothing here writes; there is no form, no server action.
export const meta: Route.MetaFunction = () =>
  pageMeta({
    title: 'Kontakt — Leteče Kele',
    description:
      'Pokličite ali pišite Leteče Kele — telefon, e-pošta, naslov in osnovni podatki podjetja za višinska dela.',
    ogTitle: 'Kontakt',
  })

export default function ContactRoute() {
  const { site } = useOutletContext<WebsiteOutletContext>()
  return <ContactPage settings={site.settings} />
}
