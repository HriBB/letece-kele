import { useLiveMode } from '@sanity/react-loader'

import { STUDIO_BASEPATH } from '~/sanity/constants'
import { client } from '~/sanity/client'

// Browser client (tokenless) with stega for Visual Editing overlays. Mounted only
// while preview is active (see website/layout.tsx) — subscribes useSanity queries
// to live draft updates.
const browserClient = client.withConfig({
  stega: { studioUrl: STUDIO_BASEPATH },
})

export function SanityLiveMode() {
  useLiveMode({ client: browserClient })
  return null
}

export default SanityLiveMode
