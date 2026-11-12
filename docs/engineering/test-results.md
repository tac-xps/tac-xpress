# Engineering verification

Local checks began from `98f3e42ac19b3680d329415d61be716058d600cd` on Windows, Node 24.13.1 and pnpm 9.4.0. The isolated worktree uses the CI synthetic environment in `.github/workflows/quality.yml`. It contains no copied environment files, hosted service credentials, or E2E authorization bypasses.

## Baseline

| Command or check | Baseline outcome |
| --- | --- |
| `pnpm install --frozen-lockfile --prefer-offline` | Exit 0. Offline-only install reported a missing cached tarball. The frozen online fallback filled the local store using the unchanged lockfile. |
| `pnpm typecheck` | Exit 0. Next generated route types and TypeScript passed. |
| `pnpm lint` | Exit 0. 49 warnings and zero errors. |
| `pnpm stylelint` | Exit 0. |
| `pnpm audit:tokens` | Exit 0. Zero violations. |
| `pnpm test:unit` | Exit 0 after correcting environment cleanup. 521 tests across 80 files. |
| `pnpm build` | Exit 0 after correcting environment cleanup. Next.js completed TypeScript, generated 56 static pages, and emitted the route inventory. |
| `pnpm audit:supabase-migration-history` | Exit 0. Eight unique active versions. A separate hosted read matched every version, name, and normalized migration body. |
| `pnpm validate:contracts` | Exit 0. Seven Redocly warnings. |
| `pnpm audit --prod --json` | Exit 0. Zero advisories from the configured registry. |
| `pnpm audit --json` | Exit 1. Four high, twelve moderate, and four low advisories. The paths in this run were developer tools and their dependencies. |
| `pnpm test:e2e --reporter=list` | Exit 0. 46 Chromium tests passed and 15 skipped. Four workspace preview cases require a preview URL. Eleven staging cases require explicit synthetic acceptance configuration. |
| `pnpm verify:production-env` from the original checkout | Exit 1. The local production-shaped configuration fails the HTTPS application-origin and Resend sender checks. Meta callbacks are unconfigured. The check reads values locally and makes no network calls. |

The first engineering runner attempted to clear inherited variables through Windows .NET. That left empty environment keys. The empty `NODE_ENV` selected Vite's development path, causing seven failures across the credential and chat tests. The empty optional Blob hostname caused Next's image-manifest generation to fail with `Expected a non-empty string`. The corrected runner removes the keys with PowerShell's environment provider. A focused credential suite passed all eight checks after that correction.

## Runtime coverage

The anonymous browser checks cover homepage, tracking, sign-in, terms, dark contrast, keyboard focus, private-route denial, and local inquiry error recovery. They used a loopback server with no database connection. A passing local build and browser suite leave positive shipment lookup, staff and admin actions, financial mutations, RLS behavior, and provider delivery to controlled acceptance runs.

A filename-only source scan found no tracked strings matching the checked private-key or live-token prefixes. URL-shaped matches were local defaults, documentation examples, or test fixtures. This was a narrow check of tracked source at baseline. Operational environment files and repository history require their own authorized coverage.

## Focused remediation checks

| Check | Result |
| --- | --- |
| MFA current-role, projection, AI support privacy, Sentry instrumentation, and MFA UI/flow | 48 unit tests passed across six suites. Focused ESLint passed. |
| Document UUID and AWB lookup plus tracking UUID input | Five mocked route tests passed. |
| Feedback and reduced-motion browser regressions | Both passed in Chromium. Feedback opened from the footer and again by keyboard after a manual mode change. The reduced-motion case reported no hydration warnings and restored focus after closing the illustration. |
| Dependency removal | Frozen offline install succeeded. The new pnpm graph prunes two unused React dependencies and two exclusive transitives. |
| Legacy image rewrite | Pinned Next.js production scratch fixture passed direct, rewritten, missing, and optimized image requests. The final application build has its own full check. |
| Optional Blob hostname | Direct config checks passed for unset, empty, whitespace-only, and trimmed configured values. |

## Dependency assessment

The baseline and final full audits each reported four high advisories, twelve moderate, and four low. High entries identify the MCP SDK, Vite, and body-parser through developer tooling. The production-only audit passed with zero advisories after the dependency cleanup. The next dependency review should isolate Vite/Vitest from the GBrain/MCP graph and verify the changed development server and CLI behavior. See [backlog](task-backlog.md).

## Final candidate

Application and test changes are recorded through commit `02e1646`. Documentation follows separately.

| Command or check | Candidate outcome |
| --- | --- |
| `pnpm typecheck` | Exit 0. |
| `pnpm lint` | Exit 0. Zero errors and 49 warnings, matching the baseline. |
| `pnpm stylelint` | Exit 0. |
| `pnpm audit:tokens` | Exit 0. Zero violations. |
| `pnpm build` | Exit 0 with `NEXT_PUBLIC_VERCEL_BLOB_HOSTNAME` deliberately empty. 56 static pages generated. |
| `pnpm audit:supabase-migration-history` | Exit 0. Eight active files. |
| `pnpm validate:contracts` | Exit 0. Seven existing warnings. |
| `pnpm test:e2e --reporter=list` | Exit 0. 48 passed and 15 skipped. New feedback and reduced-motion regressions passed. |
| `pnpm test:unit`, first candidate run | 526 passed and 10 failed in one existing environment-check suite. The failures followed the test's 10-second child-process limit during a run that overlapped the browser workload. |
| Focused `pnpm exec vitest run __tests__/production-env.test.ts` | Exit 0. All 17 passed after stopping the browser workload. No test assertions or time limits changed. |
| `pnpm test:unit --reporter=dot`, isolated candidate rerun | Exit 0. All 536 tests passed across 82 files. No browser server or build ran concurrently. |
| Production `next start` image compatibility check | 27 old/new PNG pairs returned HTTP 200 with matching SHA-256, image content type, and immutable caching. Both old-only files returned original bytes. An unknown path returned 404. The legacy optimizer URL returned 200. |
