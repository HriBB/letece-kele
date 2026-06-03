import 'dotenv/config'

import { defineCliConfig } from 'sanity/cli'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
  },
  deployment: {
    appId: process.env.SANITY_APP_ID ?? '',
  },
  vite: (config) => ({
    ...config,
    plugins: [...(config.plugins ?? []), tsconfigPaths()],
  }),
})
