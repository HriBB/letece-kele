import type { SiteData } from '~/lib/types'

import { ContactPage } from '~/components/ContactPage'

export function Contact({ site }: { site: SiteData }) {
  return <ContactPage settings={site.settings} />
}

export default Contact
