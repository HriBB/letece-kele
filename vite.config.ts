import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tailwindcss(), reactRouter(), tsconfigPaths(), devtoolsJson()],
  server: {
    host: '0.0.0.0',
  },
  optimizeDeps: {
    include: [
      '@sanity/asset-utils',
      '@sanity/client',
      '@sanity/icons',
      '@sanity/image-url',
      '@sanity/react-loader',
      '@sanity/visual-editing/react-router',
      '@sanity/image-url',
      '@portabletext/react',
      '@sanity/vision',
      'groq',
      'lucide-react',
      'clsx',
      'tailwind-merge',
      'sanity',
      'sanity/presentation',
      'sanity/structure',
      '@portabletext/react',
    ],
  },
})
