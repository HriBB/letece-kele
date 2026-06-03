# 0002 — Scope: B2B lead-gen focus (drop personal blog, info-only contact)

- Status: Accepted
- Date: 2026-06-03

## Context

The old site has a split personality. It is a B2B rope-access facade/concrete/steel
restoration company **and** a personal alpinism blog: of ~30 posts (2012–2021), roughly
20 are personal climbing/reportage content (`filmi`, `reportaže`, `utrinki` — Matterhorn,
Monte Rosa, Fontainebleau, Brač) and only ~10 are actual job references (`projekti`). The
old contact page also carried a Contact Form 7 form (name / email / subject / message).

The new site's job is **lead generation** for the company.

## Decision

- **Drop the personal blog.** Do not migrate `filmi`/`reportaže`/`utrinki`. The
  alpinist identity survives as a credibility *story* on the About page ("why we can
  work at height"), not as 20 dated trip reports.
- **Migrate only job references** (`projekti`) into the `project` type — see ADR 0003.
- **No contact form.** Contact is info-only: prominent tel (040 465 749), email
  (info@letecekele.si), address (Bašelj 37a, 4205 Preddvor), and a static map. No
  server action, no email provider, no spam surface.

## Consequences

- Sharper B2B message; the homepage leads with services and completed work, not
  climbing films.
- Old blog permalinks (`/YYYY/MM/DD/slug/`) will 404 unless redirected; the personal
  content's SEO value is judged not worth the maintenance. Re-migrating later is
  possible from the still-live API if priorities change.
- A lead-gen site with no form is intentional: this buyer segment phones/emails, and
  the cost of a backend + spam handling outweighs marginal form conversions. Reversible
  — adding a form later is an RR action + provider, isolated to one route.
