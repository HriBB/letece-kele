import { createImageUrlBuilder } from '@sanity/image-url'

import { dataset, projectId } from '~/sanity/projectDetails'

// Single shared URL builder. Every responsive image goes through Sanity's
// pipeline (ADR 0005): one CDN origin, on-the-fly transforms, no hotlinked
// WordPress uploads.
export const imageUrlBuilder = createImageUrlBuilder({ projectId, dataset })
