import { CogIcon } from '@sanity/icons'

import type {
  DefaultDocumentNodeResolver,
  StructureBuilder,
  StructureResolver,
} from 'sanity/structure'

// Singletons get a direct editor; collections get a document list.
function singleton(
  S: StructureBuilder,
  id: string,
  title: string,
  icon: Parameters<ReturnType<StructureBuilder['listItem']>['icon']>[0],
) {
  return S.listItem()
    .id(id)
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(id).documentId(id).title(title))
}

export const structure: StructureResolver = (S) =>
  S.list()
    .id('root')
    .title('Content')
    .items([
      // service / project collections + homePage / aboutPage singletons land in later slices.
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document()
