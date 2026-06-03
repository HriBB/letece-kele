import { defineLocations } from 'sanity/presentation'

import type { PresentationPluginOptions } from 'sanity/presentation'

// Maps documents to the front-end routes that render them, for Visual Editing.
// Later slices add service / project / homePage / aboutPage locations.
export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    siteSettings: defineLocations({
      message: 'Site-wide header, footer and contact data',
      locations: [{ title: 'Home', href: '/' }],
    }),
  },
}
