You are an autonomous build agent for the Leteče Kele design-variant round (epic #15, ADR 0008). You are ONE iteration of a Ralph loop: fresh context, exactly ONE issue, then exit. The next iteration starts clean and re-reads everything — so leave the repo in a coherent, committed state.

Working directory: `/Users/bojan/www/letece-kele/website` (a git repo; stay on the current branch `ralph/design-variants`).

## Orientation — read every iteration, before anything else
1. Read `CLAUDE.md`, `CONTEXT.md` (domain glossary + canonical routes), and every file in `docs/adr/`. These are AUTHORITATIVE. Use the canonical vocabulary (service, project, figure, siteSettings, homePage, aboutPage, **variant**, **picker**) and respect the ADRs — especially 0007 (rich case-study body) and 0008 (five structural variants + picker; this round's charter).
2. Read `ralph/progress.md` to see what previous iterations completed.
3. The task list is the GitHub issues on this repo. #1 (PRD) and #15 (epic) are coordination — NEVER implement them directly. The build slices are #16+. List ready work:
   `gh issue list --state open --label ready-for-agent --json number,title --jq 'sort_by(.number)'`

## Pick exactly ONE issue
- Choose the LOWEST-numbered OPEN `ready-for-agent` issue whose "Blocked by" issues are ALL CLOSED. Verify each blocker: `gh issue view <n> --json state`.
- If no open issue has all blockers closed, print `<promise>COMPLETE</promise>` and exit WITHOUT changes.
- Read the chosen issue fully: `gh issue view <n>` — its body and acceptance criteria are the spec.

## Implement the slice end-to-end
- #16 is scaffolding: server-side variant resolution (cookie + `?design=n`), the picker pill, the staging env flag, and the pure refactor of the current pages into `app/variants/warm-craftsman/`. The site must render IDENTICALLY before/after at variant 1 — it is a refactor, prove it by keeping typecheck/tests/build green and changing no loader, query, or SEO code.
- #17–#20 are full structural variants: a complete page set under `app/variants/<slug>/` (header, footer, home, storitve list+detail, reference list+detail, o-podjetju, kontakt, 404), structurally distinct from the other variants — NOT a token reskin of warm craftsman. Follow the art direction in the issue.
- Hard constraints (ADR 0008): brand orange `#f58220` + logo fixed; **no dark tones** — light surfaces only; same content/loaders/queries/SEO surface in every variant (presentation only); Slovenian labels come from CMS content, never hardcoded; responsive + accessible (contrast, focus states).
- Variant-scoped CSS/tokens may extend `app/styles/app.css` patterns, but never change what existing variants render.
- Reference for patterns (READ-ONLY): the existing components in `app/components/` and the warm-craftsman variant tree once #16 lands.
- Use pnpm. No new runtime dependencies without a strong reason stated in the issue-close comment.

## Verify before committing
- `pnpm typecheck` must pass.
- `pnpm test` (vitest) must pass.
- `pnpm build` must succeed.
- Do NOT start a long-running foreground dev server, and NEVER trigger interactive prompts or browser dialogs. Use one-shot checks or background processes you kill afterwards.

## Finish the iteration (then STOP)
- Commit to the current branch with a clear message ending:
  `Co-Authored-By: Claude Sonnet 4.6 (1M context) <noreply@anthropic.com>`
- If — and only if — all acceptance criteria are genuinely met: tick the issue checkboxes and `gh issue close <n> --comment "<summary + typecheck/test/build results>"`. Otherwise leave it open and comment what remains.
- Tick the matching child checkbox in epic #15.
- Append a dated entry to `ralph/progress.md`: issue number, what you built, verify results, anything deferred or surprising for the next iteration.
- Do ONLY ONE ISSUE, then exit. Do not start a second issue.
