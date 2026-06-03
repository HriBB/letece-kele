import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'node',
    include: ['app/**/*.test.{ts,tsx}'],
    // Hermetic Sanity identifiers so the image pipeline's URL builder works in
    // tests without reading the git-ignored .env (no secrets, no network).
    env: {
      VITE_SANITY_PROJECT_ID: 'test-project',
      VITE_SANITY_DATASET: 'production',
      VITE_SANITY_API_VERSION: '2024-10-01',
    },
  },
})
