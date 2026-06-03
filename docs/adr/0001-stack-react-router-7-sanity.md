# 0001 — Stack: React Router 7 + embedded Sanity

- Status: Accepted
- Date: 2026-06-03

## Context

We are rebuilding letecekele.si (a 2012-era WordPress site) as a modern marketing
site. The team already runs this exact pattern in `mojterapevt/website` and
`slackalien/studio-website`: React Router 7 (SSR) with a Sanity Studio embedded at
`/studio`, Tailwind v4, shadcn, pnpm. Reusing it means shared muscle memory, shared
seams (authenticated read client, query descriptors, image pipeline), and no new
runtime to learn.

## Decision

- **React Router 7** in SSR mode as the app framework.
- **Sanity** as the headless CMS, with the Studio **embedded** at `/studio` (not a
  separate deploy). The dataset is **private**; published content is read server-side
  through one authenticated read client (`SANITY_READ_TOKEN`).
- **Tailwind v4 + shadcn** for styling and primitives; **pnpm** as package manager.
- Reuse the `mojterapevt` conventions: query-descriptor seam binding GROQ to result
  types, `loadSanity`/`useSanity` halves, `resolveLink`/`SmartLink`, `pageMeta`.
  Add **Sanity TypeGen** to generate result types.

## Consequences

- Fast start: most architecture is lifted from a working sibling project.
- One private-dataset read path; a tokenless read silently yields empty results, so
  server reads must go through the authenticated client (guarded by tests).
- The Studio ships with the site; editors get Visual Editing / Presentation without a
  second deployment.
- Coupling to the sibling projects' conventions is deliberate — divergence should be a
  considered choice, not drift.
