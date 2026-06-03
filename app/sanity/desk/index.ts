import { CaseIcon, CogIcon, InfoOutlineIcon, WrenchIcon } from '@sanity/icons'

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
      // Collections.
      S.documentTypeListItem('service').title('Services').icon(WrenchIcon),
      S.documentTypeListItem('project').title('Projects').icon(CaseIcon),
      S.divider(),
      // Singletons. The homePage singleton lands in a later slice.
      singleton(S, 'aboutPage', 'About page', InfoOutlineIcon),
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
    ])

export const defaultDocumentNode: DefaultDocumentNodeResolver = (S) => S.document()
