# 0003 — Unified `project` content type

- Status: Accepted
- Date: 2026-06-03

## Context

The old site showcases completed work in two places that are really the same concept:

- **"Reference"** (a sub-page under *Zakaj izbrati nas*) — a photo grid of job highlights
  with short captions (Ulica bratov Učakar, Puhova, cerkveni ornamenti, integrirane
  sončne elektrarne…).
- **"Projekti"** (a blog category) — long narrative case studies of a single job
  (e.g. *Preglov trg 10*), with photos.

Modeling these as two Sanity types would double the schema and force an editor to decide
"is this a reference or a project?" every time — a classic source of drift.

## Decision

Collapse both into one document type: **`project`** (a completed job we showcase).
Fields: title, location, year, short summary, optional case-study **body** (Portable
Text), and a photo **gallery** (captioned). Listing at `/reference`; featured projects
surface on the home page.

Render depth follows the data: a project with a rich body reads as a full case study; a
project with only gallery + summary reads as a reference card. One type, two depths.
(ADR 0007 makes the body rich Portable Text — inline marks, lists, in-order figures — so
"case study" is decided by prose, and refines the depth split accordingly.)

Naming: the **canonical** term in code/queries/tests is `project`. The **route** and the
**Slovenian user label** are "reference" (`/reference`) — that is the word that signals
credibility to a B2B buyer. This deliberate split (concept name ≠ route/label) mirrors
mojterapevt's `testimonial` → `/review`.

## Consequences

- One schema, one editing surface, no "which type?" ambiguity.
- The `/reference` listing and the home "featured" strip read the same documents through
  different queries/projections — no second source of truth.
- Mapping from WordPress is uniform: every showcased job (whether it was a "Reference"
  caption or a "Projekti" post) becomes one `project`.
- The concept-name/route-name split must be documented (it is, in CONTEXT.md) so a future
  reader is not surprised that `project` lives at `/reference`.
