import type { SchemaTypeDefinition } from 'sanity'

import { projectType } from './documents/project'
import { serviceType } from './documents/service'
import { figureType } from './objects/figure'
import { ctaLinkType, navLinkType } from './objects/shared'
import { aboutPageType } from './singletons/aboutPage'
import { siteSettingsType } from './singletons/siteSettings'

export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects
  figureType,
  ctaLinkType,
  navLinkType,
  // Documents (collections)
  serviceType,
  projectType,
  // Singletons
  siteSettingsType,
  aboutPageType,
]

// Singleton ids (one document each). Used by desk + seed. The later homePage slice
// adds its own; service and project are collections (not singletons).
export const SINGLETONS = ['siteSettings', 'aboutPage'] as const
