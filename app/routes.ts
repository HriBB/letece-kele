import { index, layout, prefix, route } from '@react-router/dev/routes'

import type { RouteConfig } from '@react-router/dev/routes'

export default [
  // Front-end website (shared Header + Footer from siteSettings).
  layout('./routes/website/layout.tsx', [
    index('./routes/website/home.tsx'),
    // service (#4)
    route('storitve', './routes/website/storitve.tsx'),
    route('storitve/:slug', './routes/website/storitev.tsx'),
    // project (#5) — concept `project`, route/label "reference" (ADR 0003)
    route('reference', './routes/website/reference.tsx'),
    route('reference/:slug', './routes/website/referenca.tsx'),
    // about (#6) — the merged company story singleton
    route('o-podjetju', './routes/website/o-podjetju.tsx'),
    // contact route group lands in a later slice.
  ]),
  // Embedded Sanity Studio.
  route('studio/*', './routes/studio.tsx'),
  // Resource routes (Visual Editing preview toggle).
  ...prefix('resource', [route('preview', './routes/resource/preview.ts')]),
] satisfies RouteConfig
