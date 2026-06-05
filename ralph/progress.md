# Ralph progress — design-variant round (epic #15)

Iterations append dated entries below: issue number, what was built, verify results,
anything deferred or surprising for the next iteration.

---

## 2026-06-05 — Issue #16: Variant scaffolding

**Built:**
- `app/lib/design.server.ts`: cookie (`__design`), `isStaging()`, `resolveVariantNumber()`, `designParamRedirect()`. SSR resolves active variant with no flash; `?design=n` sets cookie + redirects clean; production always locks to variant 1.
- `app/routes/resource/design.ts`: picker POST action (sets cookie, React Router revalidates in place without navigation) + GET fallback for direct `?n=` links.
- `app/variants/types.ts`: `VariantPages` (10-component contract) + `Variant` type.
- `app/variants/index.ts`: five-variant registry; variants 2–5 fall back to warm craftsman pages as placeholders until #17–#20 land — picker cycles all five on staging now.
- `app/variants/Picker.tsx`: floating `← n/5 · Ime →` pill, `useFetcher` POST, keyboard ←/→ (skips typing targets), staging-only.
- `app/variants/warm-craftsman/` (10 page components + 7 sections): Contact + NotFound created this iteration; About, Footer, Header, Home, ProjectDetail, ProjectList, ServiceDetail, ServiceList + sections were pre-existing but untracked.
- `app/routes/website/layout.tsx`: wires `designParamRedirect` + `resolveVariantNumber` in loader, uses `variant.pages.Header/Footer`, renders `Picker` when staging. `WebsiteOutletContext` extended to `{ site, variant }`.
- All seven website routes delegate rendering to `variant.pages.*` — loaders, queries, SEO untouched.
- `robots.txt` staging mode: full `Disallow: /` when `SITE_ENV=staging`.
- Root `meta` export: `noindex, nofollow` when `SITE_ENV=staging`.

**Verify:** typecheck ✓ | 104 tests (16 files) ✓ | build ✓

**Notes for next iteration:**
- All pre-existing scaffolding files (`design.server.ts`, `resource/design.ts`, `Picker.tsx`, `variants/index.ts`, `variants/types.ts`, all warm-craftsman pages) were untracked on the branch — committed here in one go alongside this iteration's completions.
- Next: #17 Swiss technical — full page tree under `app/variants/swiss-technical/`. Structurally distinct from warm craftsman; not a reskin.

---

## 2026-06-05 — Issue #17: Variant 2 Swiss technical

**Built:** Full structural variant under `app/variants/swiss-technical/` (11 files: Header, Footer, Home, ServiceList, ServiceDetail, ProjectList, ProjectDetail, About, Contact, NotFound, index.ts). Registered as variant 2 in `app/variants/index.ts` (replaces placeholder).

**Art direction:** Paper-white surfaces throughout; thin horizontal rules as primary structure (no card shadows); Space Grotesk for all labels, numbers, nav (no Manrope). Orange used sparingly: index numbers, CTA buttons, left-rule borders, metadata. Data-forward home hero — value prop left + right-side key-metrics grid (no hero photo). Services as numbered rule list. Projects as metadata-heavy gap-px grid (location · year prominent). Why-us as filled cell grid. ServiceDetail: process steps in left-bordered spec block + sidebar CTA panel. Contact: ruled spec-sheet rows (label/value), not card grid. No rounded-full anywhere.

**Structurally distinct from warm craftsman:** every route group uses a completely different layout pattern — not a token reskin.

**Hard constraints met:** brand orange #f58220 + logo fixed; light surfaces only; same content/loaders/queries/SEO; Slovenian labels from CMS; no new runtime deps; responsive + accessible.

**Verify:** typecheck ✓ | 104 tests (16 files) ✓ | build ✓
Issue #17 closed. Epic #15 checkbox ticked.

**Next:** #18 Photo-led alpine — full-bleed rope-work photography, dramatic scale, text on light panels/off-image, no dark scrims.

---

## 2026-06-05 — Issue #18: Variant 3 Photo-led alpine

**Built:** Full structural variant under `app/variants/photo-led-alpine/` (11 files: Header, Footer, Home, ServiceList, ServiceDetail, ProjectList, ProjectDetail, About, Contact, NotFound, index.ts). Registered as variant 3 in `app/variants/index.ts` (replaces placeholder).

**Art direction:** Photography commands every page. Home hero = full-bleed image edge-to-edge (aspect 16:9/21:9), value prop on white panel below — image lands first, text is secondary. No dark scrims, no dark surfaces. Footer: bone bg + 4px orange top-border accent. Header: h-16, rectangular orange CTA on right.

**Structural patterns (distinct from both other variants):**
- Home hero: photo-first full-bleed → white text panel below (vs wc text-left/photo-right, vs swiss text-only)
- ServiceList: editorial 3/2 photo-cards (photo top, panel below) vs swiss ruled-list vs wc shadow cards
- ServiceDetail: full-bleed 16:9 → reading zone → full-width CTA band (vs swiss aside spec-block)
- ProjectList: asymmetric grid — first 16:9 full-width (hero reference), rest 4:3 2-3 col
- ProjectDetail: lead photo full-bleed → meta panel → remaining photos in Gallery slider → case-study body (ADR 0007)
- About: full-bleed hero → white reading zone (no two-col split)
- Contact: bone-card channel grid (each channel in own card) vs swiss spec-sheet ruled rows

**Hard constraints met:** brand orange #f58220 + logo fixed; light surfaces only; same loaders/queries/SEO; Slovenian labels from CMS; no new runtime deps; responsive + accessible.

**Verify:** typecheck ✓ | 104 tests (16 files) ✓ | build ✓
Issue #18 closed. Epic #15 checkbox ticked.

**Next:** #19 Construction rugged — rugged construction-site character, kept light-toned.

---

## 2026-06-05 — Issue #19: Variant 4 Construction rugged

**Built:** Full structural variant under `app/variants/construction-rugged/` (11 files: Header, Footer, Home, ServiceList, ServiceDetail, ProjectList, ProjectDetail, About, Contact, NotFound, index.ts). Registered as variant 4 in `app/variants/index.ts` (replaces placeholder).

**Art direction:** Sturdy Manrope black headings throughout; thick orange borders as structural frames (border-l-4, border-t-4, border-4); blocky/chunky layout with tactile material cues. Light surfaces only (paper + bone). Construction signage feel: uppercase bold tracking labels, heavy number indexes.

**Structural patterns (distinct from all three prior variants):**
- Home hero: headline left + heavy 4px-bordered photo frame right (vs alpine photo-first, swiss text-only, wc shadow cards)
- ServiceList: thick-bordered rows with large faded number + framed thumbnail on wide screens
- ServiceDetail: 16:9 heavy-frame photo → left-accent title block → bordered callout box for process steps → left-border CTA strip
- ProjectList: full-width 16:9 hero reference (first project) + 2/3-col heavy-frame grid for rest
- ProjectDetail: heavy-frame lead photo → left-accent meta → bordered gallery wrapper → reading zone → left-border CTA strip (ADR 0007 body handled)
- About: bold left-accent heading → heavy-framed hero image inside bone section → reading zone
- Contact: left-accent heading → top-orange-accent bordered channel tiles → bordered legal box
- Header: h-20, 4px orange bottom border, outlined orange CTA, uppercase Manrope nav
- Footer: bone bg, 4px orange top border, left-accent nav links

**Hard constraints met:** brand orange #f58220 + logo fixed; light surfaces only; same loaders/queries/SEO; no new runtime deps; responsive + accessible.

**Verify:** typecheck ✓ | 104 tests (16 files) ✓ | build ✓
Issue #19 closed. Epic #15 checkbox ticked.

**Next:** #20 Blueprint/drafting — light paper, technical-drawing linework, grid-paper texture, annotation-style labels.

---

## 2026-06-05 — Issue #20: Variant 5 Blueprint/drafting

**Built:** Full structural variant under `app/variants/blueprint-drafting/` (11 files: Header, Footer, Home, ServiceList, ServiceDetail, ProjectList, ProjectDetail, About, Contact, NotFound, index.ts). Registered as variant 5 in `app/variants/index.ts` (replaces PLACEHOLDER — all 5 real variants now in picker).

**Art direction:** Engineering-drawing aesthetic throughout. Thin 1px hairline borders (vs 2–4px in rugged/swiss). Corner registration marks (cross hairlines) on every photo frame. Grid-paper texture (repeating-linear-gradient) on bone sections. `font-mono` for all annotation labels; `font-sans` (Inter Variable) for headings — distinct from swiss-technical's Space Grotesk. Orange used on annotation prefixes (§, ↗) and CTAs only. DRW-001·REV A drawing stamp on home hero title block; FIG. n labels on photo frames; ERR-404·REV A stamp on 404.

**Structural patterns (distinct from all four prior variants):**
- Home hero: bordered "title block" left (engineering drawing title block with stamp) + registration-mark photo right. vs alpine photo-first, swiss text-only metrics, rugged heavy 4px frame, wc shadow-cards.
- Stats: horizontal measurement table with divide-x columns.
- Services (home + full list): bordered spec table — thin-ruled rows, each service as numbered spec line.
- ServiceDetail: photo + FIG. label in thin frame → annotation title block with header bar → steps → notes CTA box.
- ProjectList: lead 16:9 with FIG. label + footer count stamp; rest in grid with registration marks + FIG. labels.
- ProjectDetail: photo + fig label → datum annotation header (LOC: / LETO: prefixes) → gallery → body → notes CTA.
- About: annotation header block → photo with reg. marks + fig label → reading zone with § OPIS label.
- Contact: spec-sheet table (KANAL | VREDNOST columns, thin ruled rows). vs rugged tiles, swiss ruled rows, alpine editorial.
- NotFound: centred blueprint stamp card — large faint 404, ERR-404·REV A revision line.
- Header: h-16, 1px bottom rule, mono nav labels, outlined CTA.
- Footer: bone + grid texture, 1px top orange rule, mono columns, © REV 1 stamp.

**Hard constraints met:** brand orange #f58220 + logo; light surfaces; same loaders/queries/SEO; Slovenian labels from CMS; no new runtime deps; responsive + accessible.

**Verify:** typecheck ✓ | 104 tests (16 files) ✓ | build ✓
Issue #20 closed. Epic #15 checkbox ticked.

**Notes:** All five variants are now complete. Epic #15 is fully implemented — the staging site can cycle all five real designs. Next step for the owner: deploy staging + send link to client for the pick.
