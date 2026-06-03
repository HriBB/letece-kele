# 0005 — Migration source + image pipeline (seed + responsive delivery)

- Status: Accepted
- Date: 2026-06-03

## Context

Content must come from the live WordPress site at letecekele.si — there is no clean
export. The WordPress **REST API** (`/wp-json/wp/v2/*`) is fully open (pages, posts,
media, categories), but post/page bodies carry 2012-era cruft: inline `<style>` blocks,
`[gallery]` shortcodes, and legacy markup. Images are remote WordPress upload URLs.

A marketing site for a facade company lives or dies on image performance: we want
responsive sizes, no layout shift, and a fast placeholder.

## Decision

**Seeding (`pnpm seed`, needs an Editor `SANITY_WRITE_TOKEN`):**

- Pull pages, posts, and media from the WordPress REST API.
- **Clean** on the way in: strip inline styles and gallery shortcodes, lift embedded
  images into the `project.gallery` field, convert prose to **Portable Text**.
- **Map**: WordPress service pages → `service`; the *o-podjetju*/*vizija*/*kvaliteta*
  pages → the `aboutPage` singleton; `projekti`-category posts → `project`; legal
  *osnovni podatki* → `siteSettings`. Personal blog posts are **not** migrated (ADR 0002).
- Slovenian copy is kept **verbatim**; only formatting junk is dropped. One-off content
  fixes happen in the Studio afterwards, not in the seed script.
- Images download to `.tmp` first, then upload as Sanity assets referenced from
  documents. Re-runnable from the live API.

**Delivery:** serve every image through Sanity's image pipeline with **responsive
`srcset`**, **LQIP** (low-quality placeholder), and explicit **width/height /
aspect-ratio** to reserve layout space. Centralized in `app/lib/image.ts` /
`app/sanity/image.ts` and one `Image` component. Galleries are **pure-CSS** `scroll-snap`
sliders — no carousel library, no animation.

## Consequences

- Images are Sanity-managed assets (transformable, CDN-served), not hotlinked WordPress
  URLs.
- Pages reserve image space up front (no CLS) and show an LQIP before the full image —
  directly serving the Lighthouse goal.
- The seed is reproducible from the still-live API; if the old site goes down before
  seeding, the API must be archived first.
- Cleaning is lossy by design (the cruft is the loss); the verbatim Slovenian text is
  preserved so editorial review happens against real copy.
