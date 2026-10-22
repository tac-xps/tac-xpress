# Audit follow-up — 16 October 2026 (updated 18 October)

This follow-up records work performed after the 7 September control-center audit. It is a focused follow-up, not a new line-by-line certification of every route or hosted resource. See the [prior audit](control-center-audit-2026-09-07.md), [surface inventory](audit-surface-inventory-2026-09-07.md), and [deferred migration work](supabase-deferred-migration-work.md) for broader scope and release gates.

## Findings and changes

| Priority | Finding                                                                                                                               | Status                                                                                                                                                                                                                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P1       | Two SQL migrations share version prefix `0018`. Local `pnpm audit:supabase-migration-history` detects the conflict and exits nonzero. | Confirmed; migration history reconciliation deferred because hosted state is unavailable. No filenames were changed.                                                                                                          |
| P1       | Cargo leg completion was not a safe active-assignment lifecycle.                                                                      | Implemented locally: explicit leg types, active assignments, idempotent handoffs and exceptions, transactional tracking/audit, and per-AWB dispatch controls. Hosted migration remains blocked on history and data preflight. |
| P2       | The public tracking stepper exposed `role=tablist` around navigation/list content.                                                    | Fixed by using ordered-list semantics and removing unsupported tab roles.                                                                                                                                                     |
| P2       | Public tracking Playwright assertions used stale copy and an ambiguous `alert` role that matched the route announcer.                 | Fixed with exact visible text and a scoped alert assertion.                                                                                                                                                                   |
| P2       | The public mobile navigation Sheet lacked an assistive description, and finalized dispatches exposed draft-only edit/delete actions.  | Added a Sheet description, removed the inactive status selector, and hid draft-only actions after departure.                                                                                                                  |
| P2       | The full dependency audit reports 24 advisories in non-production dependency paths; the production-only audit is clean.               | Recorded for compatibility-reviewed tooling updates.                                                                                                                                                                          |

## Verification

- `pnpm verify`: passed after dependency updates. Typecheck, lint (0 errors; 70 warnings), Stylelint, design-token audit, 322 unit tests, and production build passed.
- `pnpm build-storybook`: passed on Storybook 10.6.2. Webpack reported asset-size recommendations.
- `pnpm audit --prod`: no known vulnerabilities. The full audit reports three development-only advisories without published fixes: `braces` (high), `sprintf-js` (moderate), and `elliptic` (low).
- Full Playwright suite against a warmed dev server: 68 passed, 0 failed, and 4 skipped in 2.5 minutes. The skips require `WORKSPACE_PREVIEW_URL`. A first cold-server run exposed route-compilation timing failures; the warmed full rerun and focused reruns passed.
- Focused PostgreSQL transaction and leg-rule tests: 40 passed.
- Focused Playwright reruns: three image/layout viewports, two anonymous API denials, and mobile navigation keyboard access passed.
- ReUI C1-C4 self-checks returned no hits on edited UI files.
- Focused Playwright regression: 6 passed for public homepage accessibility at three viewport sizes, dark-theme contrast, the client AWB validation flow, and no-JavaScript tracking validation.
- Migration filename audit: detected both `0018` files and exited with status 1, as designed.
- Prepared scripts: the local filename audit, read-only cargo assignment preflight, and manifest handoff SQL migration draft are ready. The SQL stays outside Supabase migration discovery and was not executed.
- `pnpm exec supabase --version`: local CLI is 2.117.0. `supabase migration list --help` confirms the CLI supports local and linked migration listing. No linked or local database listing was run.
- Initial dependency review found 24 advisories in development-only dependency paths. Storybook was updated to 10.6.2, Vitest and its browser/coverage adapters to 4.1.11, Playwright to 1.64.1, patched transitive packages received compatible overrides, and the deprecated `@types/dompurify` stub was removed. The current full audit reports three advisories without published fixes (`braces`, `elliptic`, and `sprintf-js`); the production-only audit remains clean.
- No hosted database, schema, RLS, migration, or advisor operation was performed in this follow-up.

## Remaining work

1. Reconcile the duplicate migration version against the intended project's migration ledger before any Supabase CLI migration action.
2. Review the locally implemented cargo receipt and exception rules with operations before staging acceptance.
3. Verify the intended staging project from `.env.local`; inspect hosted schema, migration ledger, RLS, and security/performance advisors when access is available.
4. Complete authenticated staging acceptance for staff roles, shipment dispatch/receipt, invoices, provider callbacks, scheduling, physical labels, and deployment perimeter as listed in the [prior release gates](control-center-audit-2026-09-07.md#deployment-gates-and-next-acceptance-work).
5. Complete authenticated staging acceptance for cargo handoffs and the other operational modules.
6. Track the three development-only advisories until upstream fixes are available. The warmed full Playwright suite passed; rerun it after material browser or route changes.

The local cargo lifecycle, migration-history audit, read-only preflight, and dependency fixes are implemented. Remaining gates require hosted or business evidence: reconcile duplicate migration version `0018` and the Drizzle baseline; inspect the configured hosted schema, RLS and advisors; rehearse backup restoration; obtain operations acceptance of receipt and exception rules; complete authenticated staging journeys; validate the production website origin, trusted request perimeter and secrets; confirm provider templates, callbacks, email and cron throughput; agree finance and physical-label requirements; and accept production AI capacity and spend limits. These checks were not performed. Keep production readiness **not cleared** until the release owner records that evidence.

Production readiness remains **not cleared**. Local checks do not establish hosted schema correctness or deployed operational acceptance.
