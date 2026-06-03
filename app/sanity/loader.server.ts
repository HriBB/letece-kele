import * as queryStore from '@sanity/react-loader'

import { serverClient } from '~/sanity/client.server'
import { STUDIO_BASEPATH } from '~/sanity/constants'

// Build on the shared authenticated client; this layer only adds stega for
// Visual Editing. The read token lives in client.server.ts, not here.
const clientWithToken = serverClient.withConfig({
  stega: { studioUrl: STUDIO_BASEPATH },
})

queryStore.setServerClient(clientWithToken)

export const { loadQuery } = queryStore
