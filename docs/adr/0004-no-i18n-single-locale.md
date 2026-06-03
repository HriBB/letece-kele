# 0004 — No i18n, single locale (`sl`)

- Status: Accepted
- Date: 2026-06-03

## Context

The site serves a Slovenian audience only. Full Sanity localization (locale fields,
language filters, locale-aware routing) adds real complexity to schema, queries, and the
editing experience. There is no second language and no committed plan for one. The brief
explicitly asks to skip multilanguage for now but keep it easy to add later.

## Decision

Ship **single-language** (`sl`). Do **not** add i18n machinery now — no locale fields,
no per-locale documents, no locale filters or prefixed routes. Keep the door open: all
user-facing Slovenian copy lives in CMS content (never hardcoded in components), and the
data model avoids assumptions that would block a later locale split.

To re-introduce localization later: add `@sanity/document-internationalization` in
`sanity.shared.ts` and a `language` field per document, plus query/routing changes.

## Consequences

- Simpler schema, queries, and Studio UX today.
- Copy already lives outside components, easing a future locale split.
- Adding a second language later is a deliberate migration (locale fields + query/routing
  changes), not a config flag — accepted trade-off.
