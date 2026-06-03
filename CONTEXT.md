# Leteče Kele — domain & architecture context

Single-context domain doc. Terms here are load-bearing: use them exactly in code,
commits, reviews, issues, and tests. Architecture vocabulary (module, interface,
seam, depth, adapter, leverage, locality) follows the deepening glossary.

Leteče Kele Višinska dela ("Flying Trowels — rope-access work") is a Slovenian B2B
company doing facade, concrete, and steel restoration via alpinist rope access, plus
solar-plant installation. Tagline: *Kvaliteta na višini* ("quality at altitude").
The new site is a **B2B lead-generation marketing site**: services + completed-project
references are the centerpiece; contact is the conversion goal.

## Domain

Use the **canonical** term in code, commits, reviews, issues, and tests. Avoid the
listed synonyms. The *sl label* is the Slovenian word shown to users — it lives in
CMS content, never hardcoded.

| Canonical | Meaning | Avoid | sl label |
|-----------|---------|-------|----------|
| **service** | One of the offerings the company performs (concrete restoration, dilatation joints, insulation facade, steel-structure restoration, solar-plant install). Collection. Has title, description, process steps, photo. Detail at `/storitve/:slug`, list at `/storitve`. | offering | storitev |
| **project** | A completed job the company showcases. Collection. Title, location, year, summary, optional case-study body, photo **gallery**. Listing at `/reference`; featured ones on home; a project with a rich body reads as a case study. Unifies the old site's "Reference" gallery and "Projekti" case-study posts into one type. | reference (the *route* + sl label is "reference"; the *concept* is project), job | reference |
| **siteSettings** | Singleton: header nav, footer, contact details, legal/company data (*osnovni podatki* — address, tax/registration no., bank), CTA. Wraps every route. | — | — |
| **homePage** | Singleton driving the home sections (hero, services teaser, featured projects, why-us strip, contact CTA). | — | — |
| **aboutPage** | Singleton at `/o-podjetju`. Merges the old *o-podjetju*, *vizija*, *kvaliteta* pages and the alpinist "why we work at height" credibility story into one About page. | — | — |

## Routes

`/` (home) · `/storitve` + `/storitve/:slug` · `/reference` + `/reference/:slug` ·
`/o-podjetju` (about) · `/kontakt`. The old site's ~12 stub pages collapse into these
five groups; legal *osnovni podatki* live in `siteSettings`, rendered in footer + contact.

## Decisions

See `docs/adr/`:

- [0001 — Stack: React Router 7 + embedded Sanity](docs/adr/0001-stack-react-router-7-sanity.md)
- [0002 — Scope: B2B lead-gen focus (drop personal blog, info-only contact)](docs/adr/0002-scope-b2b-focus.md)
- [0003 — Unified `project` content type](docs/adr/0003-unified-project-type.md)
- [0004 — No i18n, single locale (`sl`)](docs/adr/0004-no-i18n-single-locale.md)
- [0005 — Migration source + image pipeline](docs/adr/0005-migration-and-image-pipeline.md)
- [0006 — Docker self-host deployment](docs/adr/0006-docker-self-host-deploy.md)
