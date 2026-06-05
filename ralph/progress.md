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
