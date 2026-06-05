# 0008 — Client design selection via five structural variants

- Status: Accepted
- Date: 2026-06-05

## Context

The current site design ("warm craftsman") won an internal five-variant home-page
round, but the client has not chosen a design direction yet. They need to review real
candidates — on their own content, on every page, on their own devices — and pick one.

The cheap way to offer choice is token-only theming: five sets of CSS custom
properties (palette, fonts, radius) over one shared layout. That was considered and
rejected — palette swaps don't express genuinely different art directions, and the
client would be picking between tints, not designs.

## Decision

Build **five full structural variants** — every route group (home, service list +
detail, project list + detail, about, contact) gets a distinct layout per variant —
and let the client cycle them with a floating left/right **picker** on a staging URL.

- **Lineup**: 1 warm craftsman (the current site, as-is) · 2 Swiss technical ·
  3 photo-led alpine · 4 construction rugged · 5 blueprint/drafting.
- **Brand bounds**: orange `#f58220` and the logo are fixed in every variant; all
  variants are light-toned (no dark surfaces — explicit client constraint). The
  client picks a design, not a rebrand.
- **Architecture**: one app, one deploy. Each variant is a page-component tree under
  `app/variants/<name>/` (pages + header/footer); routes, loaders, queries, and the
  SEO surface stay single. The active variant is resolved server-side from a cookie
  (set via `?design=n` or the picker), so SSR renders the right variant with no
  flash. Default is variant 1.
- **Publishing**: staging URL on the owner's VPS (ADR 0006 container), open picker —
  the unlisted URL is the gate. A staging env flag forces robots + meta noindex.
  Staging reads the production Sanity dataset read-only.
- **The pick is not recorded.** The picker is a viewing control; the client tells
  the owner their choice directly.

Rejected alternatives: URL-prefixed variant subtrees (`/v/3/...` — link/SEO
plumbing), five separate deploys (5× ops, cross-domain picker state), and token-only
theming (above).

## Consequences

- ~28 new page designs (4 new variants × 7 route groups) — the deliberate cost of
  offering real choice. The shared data layer, schema, and content are untouched.
- The variant mechanism is **scaffolding**: once the client picks, the winning tree
  is promoted into the main component tree and the losing variants, the picker, and
  the cookie plumbing are deleted. Future readers finding `app/variants/` mid-window
  should read this ADR, not generalize it into a theming system.
- Each variant tree owns its PortableText/case-study styling, so the rich body
  (ADR 0007) must render acceptably in all five.
- One deploy serves all variants; nothing about the eventual production setup
  changes (ADR 0006 stands).
