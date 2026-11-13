# Engineering verification

## November 13 remediation candidate

Application commit `74c772302ddbaed8e27b4b15a844b9a0809ff34e` was tested in a detached checkout. The build and unit tests used synthetic CI values. Loopback staging used only the reviewed staging configuration for `zuevgwqmphbvgnwhvvnq`. Provider sends, scheduled jobs and test authorization bypasses were disabled in that runner.

| Check | Result |
| --- | --- |
| Frozen pnpm install and unit tests | PASS. 541 tests across 82 files. GBrain still resolves to the same Git revision and its CLI reports version `0.42.52.0`. |
| TypeScript, ESLint, Stylelint, token audit and contract validation | PASS. ESLint reported zero errors and 62 warnings in the main working checkout, which includes ignored scratch files. Redocly reported seven warnings. Zero token violations. |
| Production build | PASS with synthetic values. 56 pages generated. |
| Dependencies | Production-only audit passed. Full audit reported zero high, zero critical, 12 moderate and four low findings. The four original high advisories on Vite, MCP SDK and body-parser cleared. |
| Edge Function | Capabilities runtime graph locked. Deno 2.9.8 passed the cached frozen application check. `--all` fails on dependency declaration types for WebAuthn and Node globals. |
| Staging preflight | PASS for `ACTIVE_HEALTHY`, session pooler port 5432, two baseline migrations, 28 RLS-enabled public tables and three synthetic password grants. Each test grant was followed by local-scope logout. Staging had zero Storage buckets. |
| Staging tracking and Data API | Published fixture rendered and unpublished fixture showed the unavailable state on loopback. Anonymous and authenticated synthetic staff Data API requests returned empty shipment results. |
| Public tracking smoke | k6 v1.8.2 passed ten out of ten rendered tracking checks with one virtual user and zero request errors. The measured p95 was 4.92 s on the Windows development runner. Its localhost listener is IPv6, so the successful run used `K6_DNS=ttl=5m,select=first,policy=preferIPv6`. The first run selected IPv4 and could not connect. |
| Offsite recovery | Restic verified 13 files independently from the 06:37:39 IST snapshot. The manifest covers 55 database/Auth tables and seven Storage objects. `pg_restore --list` found 55 table data entries. Application Control blocked `dict_snowball.dll` during local `initdb`. No database import occurred. |
| Candidate history scan | Zero matches against known local credential values and common token signatures in added lines. Zero sensitive filenames in the unpublished commit range. Raw logs and screenshots remain ignored. |
| Vercel baseline | Public homepage and sign-in returned 200. Anonymous dashboard returned 307 to `/signin`. The credentials callback uses the verified HTTPS alias. The alias points to `dpl_J3GQjo4rGfGMHowqBdifkE2nV1xR` at `98f3e42`. Candidate preview ID pending. |

The first recorded staging browser run timed out on the cold `/api/auth/session` request after successful admin sign-in. Its serial test group skipped the following ten cases. The warmed run passed the 24-route admin sweep, customer denial, staff restrictions and revoked session. The invoice case failed and six were skipped. A focused browser run reproduced the `FormLabel` field-context exception in the invoice cargo step. Commit `b20a88878a14a710f512f71b4934aaa702b8e649` replaces the static field label with an accessible button group and extends the staging regression.

On `b20a888`, the standalone production build passed TypeScript and generated all 56 pages. A focused React render passed and exposed the named preset group. The first post-fix browser retry failed before opening the wizard while dashboard queries logged `CONNECT_TIMEOUT`. Another retry timed out waiting for the local dev server to compile sign-in. Full invoice, custody and private PDF browser evidence remains pending for this candidate.

The database-free Chromium suite on `b20a888` finished with 39 passed, nine failed and 15 expected skips. Eight failures hit 30-second limits during navigation or image handling. The tracking dialog visibility assertion failed on the full run. A warmed browser check opened the dialog at the same URL with no page errors. A new background server command for a follow-up failed-only run was rejected by the execution policy. The browser gate remains open.

The full unit rerun on `b20a888` took 1,410 seconds and finished with 509 passed, 20 failed and 12 skipped. Failures included 10-second hooks in the DLQ and SLA suites, validator subprocesses that returned no exit status within their deadline, and a PostHog test timeout. The earlier 541-pass result applies to `74c7723`. Repeat the full unit gate on an isolated runner before release.

## Audit baseline and prior candidates

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

Release remediation application candidate `4d768b6` passed all 541 unit tests across 82 files, plus typecheck, ESLint, Stylelint, token and migration audits, contract validation, and production build. Local Chromium passed 48 and skipped 15. The 11 approved staging cases remain unrun because the configured backend is unreachable. The two additional unit cases cover the explicit Resend deferral and continued enforcement of core and active provider settings.

The subsequent manual staff provisioning change passed all 539 unit tests across 82 files, including three new regressions. Typecheck, ESLint, Stylelint, the token and migration audits, contract validation, and the production build passed. A synthetic embedded PostgreSQL check also verified the MFA lookup with linked and unlinked IDs. The approved hosted staging preflight still returned `XX000`, so authenticated browser acceptance remains open.

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
