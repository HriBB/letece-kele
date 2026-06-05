# 0007 — Rich case-study body (inline marks, lists, in-order figures)

- Status: Accepted
- Date: 2026-06-03
- Amends: ADR 0003 (unified `project` type), ADR 0005 (migration + image pipeline)

## Context

ADR 0003 promised "one type, two depths": a `project` with a rich body reads as a full
case study. ADR 0005 promised the migrated Slovenian copy is kept **verbatim**, only
formatting junk dropped. The first cleaner (`app/lib/wp-body.ts`) broke both promises:

- It flattened each block's inner HTML to plain text, **dropping inline `<a>` links,
  `<strong>`/`<em>` emphasis, and `<ul>/<li>` lists**. Service process-step lists
  collapsed to run-on prose; outbound links vanished — not "formatting junk", real copy.
- It lifted **every** `<img>` into a flat `gallery`, so a case-study photo lost its
  place in the narrative. A "full case study" with images interleaved in the prose was
  structurally impossible — every project rendered as a gallery strip.
- The body block type hardcoded `markDefs: never[]`, which actively forbade link marks.

## Decision

Model the migrated body as **rich Portable Text**, end to end:

- **Cleaner** (`app/lib/wp-body.ts`) emits: text/heading/blockquote blocks with inline
  `link` (a `markDef` + mark), `strong`, and `em` marks; `bullet`/`number` list-item
  blocks; and an inline **`figure`** node for each embedded image, **kept in document
  order**. Each image is *also* still lifted into the returned `gallery` (for the
  listing-card thumbnail and the gallery-only render path) — the seed's per-URL upload
  dedupe means one Sanity asset backs both.
- **Gallery blocks follow the same invariant.** A Gutenberg gallery (`<ul
  class="blocks-gallery-grid">` of `<li><figure><img/><figcaption>` items) is NOT a
  text list — each item lands in `gallery` *and* stays inline as a `figure` node in
  document order, with its `<figcaption>` as the visible `caption` and the
  `data-full-url` original preferred over the `src` crop. Detection is content-based
  (a list item containing an `<img>`), not class-based, so any gallery markup
  variant is covered; what must never happen is the captions degrading into a
  caption-only bullet list with the photos dropped.
- **Schema**: `project.body`, `service.steps`, and `aboutPage.body` share one rich-body
  definition (`richBodyMembers` in `schemaTypes/objects/shared.ts`) — a `block` with link
  annotations + strong/em decorators + bullet/number lists, plus an inline `figure`
  member — so the three can't drift apart. `figure` carries `alt` (screen-reader
  description) and `caption` (visible label, from the WP `<figcaption>`) as distinct
  fields — one is accessibility text, the other is content.
- **Query**: a shared `BODY` projection expands the asset on any inline `figure` node so
  it renders responsively, leaving text blocks untouched.
- **Render**: `PortableText` gains a `figure` serializer (via the shared `Image`); the
  link/strong/em + list serializers already existed. `ProjectPage` decides depth by
  **prose, not by body length**: a body with real prose renders inline as a case study;
  a figures-only body renders as a reference card. The gallery strip shows whenever the
  project has photos — the strip is the at-a-glance overview, the inline figures are
  the narrative placement; the two showing the same photos is accepted.

## Consequences

- "Two depths" is now a real distinction driven by content: prose ⇒ case study,
  figures-only ⇒ reference card.
- Outbound links, emphasis, and process lists survive migration verbatim, honouring
  ADR 0005.
- Inline figures and the lifted `gallery` overlap by design; the seed dedupes uploads by
  URL so this costs nothing in assets. The strip and the inline figures intentionally
  show the same photos (overview vs narrative placement).
- A prose post whose photos arrive via a gallery block (e.g. *Preglov trg 10*) renders
  the same as any other case study: prose, then its photos inline (captioned), plus the
  gallery strip.
- The schema change requires a Sanity schema deploy + re-seed to take effect on the live
  dataset (a deferred human step); the pure cleaner/mapper logic is unit-tested against
  committed fixtures.
