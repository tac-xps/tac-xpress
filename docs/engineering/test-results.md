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

### Stabilization rerun on `b20a888`

The detached checkout used Node `24.13.1`, pnpm `9.4.0`, the existing frozen lockfile and Playwright Chromium. It had no production or staging environment files during local verification. The following commands ran separately from the hosted staging workload.

| Prior failure group | Investigation and result |
| --- | --- |
| Production environment validator | The previous failures returned `spawnSync.status=null`. The focused rerun exercised all 19 subprocess cases with their original deadlines. Each completed in 2.45–2.86 s and returned the expected exit status and diagnostic. |
| DLQ and SLA setup hooks | Both prior suites stopped at their 10-second setup deadlines. The focused rerun passed all 12 DLQ and SLA cases, including rollback and ownership assertions, with the original hook limits. |
| PostHog error capture | The previous manifests case exceeded its five-second deadline. The focused rerun passed the instrumentation and error boundary cases. The manifests case completed in 1.16 s. |
| Homepage accessibility and contrast | The previous homepage tests exceeded their budgets while scrolling, decoding images or capturing evidence. Warmup decoded the same responsive images at 320, 768 and 1440 px in 2.39–3.39 s per viewport. All four original tests passed with their existing timeouts and accessibility assertions. |
| Tracking and sign-in at 320 px | Both previous navigation calls timed out on first use. Warmup got HTTP 200 from both routes, and both original tests then passed. |
| Anonymous invoice and label routes | Both previous browser cases timed out. A warmup request returned HTTP 307 for each route, and both browser cases passed the original sign-in redirect and heading assertions. |
| Homepage tracking dialog | The prior visibility assertion failed. The separate warm probe and the unchanged full browser test both passed. The initial failure did not reproduce after warmup. |

The focused command `pnpm test:unit --reporter=verbose` with the four affected file paths passed 33 tests in 62.29 s. The full browser run used one worker and a temporary Playwright configuration with a route and image warmup in global setup. The test execution took 201.16 s, with 48 passed, zero failed and 15 expected skips. It retained traces on failure. The prior 39-pass run took 1,067.23 s. Evidence is stored locally in ignored `test-results/release-74c7723`. No application or assertion changes were needed to obtain those results.

The exact candidate's dependency audit found 12 moderate and four low findings, all through development tools. Moderate findings involved `@vitest/mocker`, `hono`, `@hono/node-server`, `ip-address`, `qs` and `minimatch`. The production-only audit passed. The capabilities Edge Function passed `deno check --cached-only --frozen index.ts` on Deno 2.9.8. Hosted runtime coverage remains separate from this check.

The subsequent exact-candidate `pnpm verify` passed. Typecheck, ESLint (49 warnings, zero errors), Stylelint and the token audit completed before the unit suite. All 541 unit cases passed across 82 files in 187.42 s. The build then generated 56 pages. `pnpm audit:supabase-migration-history` found eight unique versions and `pnpm validate:contracts` passed with seven warnings. The evidence for the earlier failures remains in the local logs. The same tests passed after sequencing the workloads and warming the browser server, with their timeouts unchanged.

Loopback staging on `b20a888` passed the admin sweep and customer denial before a cold staff API request timed out. After warming the protected APIs, six further cases passed, including staff restrictions, revocation, invoice totals and the audit row, mobile navigation, warehouse observation and private PDF. Line-haul failed at the final dialog visibility assertion. Read-only staging SQL confirmed one exception, one receipt, an inactive assignment and shipment status `in-transit`. The remaining two cases were skipped by the serial suite. The application fix is in `00b77cd5bcd6f9eaee93be701bba865d4a6f9e13`. The earlier unit and browser passes belong to `b20a888`.

### Prior candidate `00b77cd`

Exact application commit `00b77cd5bcd6f9eaee93be701bba865d4a6f9e13` passed `pnpm verify` in the detached Windows checkout. It used Node `24.13.1`, pnpm `9.4.0`, the frozen lockfile and synthetic CI configuration. Typecheck, ESLint, Stylelint and the token audit passed. ESLint reported zero errors and 55 warnings, including six from the temporary browser harness. All 541 unit tests passed across 82 files in 215.09 s. The production build generated 56 pages. `pnpm validate:contracts` passed with seven warnings, and `pnpm audit:supabase-migration-history` passed with eight unique versions.

The database-free Chromium run used `pnpm exec playwright test --config playwright.release-local.config.ts --workers=1 --retries=0` with the temporary route and image warmup and synthetic server configuration. It exited 0 after 3.7 minutes with 48 passed and 15 expected skips. The skips cover 11 synthetic staging and four preview-only cases. The runner retained failure traces and saved JSON and console evidence under `test-results/release-74c7723`.

Loopback used the existing synthetic Supabase project on PostgreSQL 17.11, the 5432 session pooler, a single application database connection, and one Playwright worker. No hosted deployment ID exists for this revision. Warmup verified the session and protected API endpoints and checked that outbound providers were unconfigured.

| Playwright staging attempt | Result |
| --- | --- |
| All 11 cases | 4 passed, 1 failed, 6 skipped. Admin sweep, customer denial, staff authorization and revocation passed. Invoice lookup missed the 15-second assertion. The expected synthetic customer was visible in the failure snapshot. |
| Invoice through concurrency, 7 cases | 4 passed, 1 failed, 2 skipped. Invoice creation and audit, mobile navigation, warehouse observation and private PDF passed. Line-haul stopped at departure after 25 seconds with the dialog still saving. Staging readback found a draft manifest, pending shipment, active assignment and zero handoffs. This attempt did not reach the final receipt. |
| Pickup and signed final delivery | 1 passed in 3.9 minutes, including pickup receipt, delivery signature, both custody receipts, the original invoice amount and zero active assignments. |
| Concurrent staff lookup | 1 failed. The authenticated customer API burst hit the 15-second request deadline. The test did not attach its maximum response time because all eight requests must resolve before it writes the attachment. The result does not establish saturation or a database failure. Console and JSON reports have synthetic session headers redacted. |
| Fresh invoice and line-haul custody | 2 passed in 4.4 minutes. The invoice case supplied a fresh pending synthetic shipment. Line-haul verified departure, exception and receipt, dialog closure, one receipt and one exception in the database, and an inactive assignment with the shipment still in transit. |
| Concurrent lookup with server timings | 1 failed at the original 15-second client deadline. Next.js logged HTTP 200 for all eight requests at 14.8 s each. It attributed roughly 14.5–14.6 s per request to application code. That time includes authorization, query execution and connection waits. The run did not measure those individually. |

Ten distinct cases passed on this candidate across the attempts above. The line-haul departure stall did not recur in the focused run. Its cause remains unresolved. The earlier readback showed zero current lock waits after the stall. Repeat all 11 cases on a protected preview. For the lookup burst, measure request time, role-check time, query time and pool waits together. The original timeouts remained in effect.

### CTO release follow-up

Application candidate `852f17cfcfd3fa98783ae4d82c42b9a9d281d6fe` is local. Evidence commit `51d451fef280247044fe476f7925e4af35f94771` changed four engineering Markdown files relative to `00b77cd`. The Vercel release branch query returned zero deployments. The production alias still serves `98f3e42ac19b3680d329415d61be716058d600cd` at deployment `dpl_J3GQjo4rGfGMHowqBdifkE2nV1xR`.

The measurement baseline was the instrumented commit `a4b84315841057c80a2f74ab9e290a435ce5918c`. The corrected candidate uses the same isolated loopback Next.js runner and one Postgres.js socket to synthetic Supabase PostgreSQL 17.11 over port 5432. Each cold wave started a fresh application process with an existing synthetic session and a cold route and database socket. Each warm wave followed immediately. Client time includes receiving and validating the response. The diagnostic driver uses the original 15 s client deadline and records correlation IDs, timings and status only. A timed-out client has no response ID. The server logs generated IDs without exposing cookies, SQL parameters or rows. The optional timing flag is off by default.

| Requests | Baseline cold | Candidate cold | Baseline warm | Candidate warm |
| --- | --- | --- | --- | --- |
| 1 | 1/1 in 10.52 s | 1/1 in 8.45 s | 1/1 in 1.71 s | 1/1 in 0.94 s |
| 2 | 2/2 in 10.82 s | 2/2 in 8.64 s | 2/2 in 3.20 s | 2/2 in 1.60 s |
| 4 | 3/4 by deadline | 4/4 in 10.52 s | 4/4 in 6.56 s | 4/4 in 3.28 s |
| 8 | 0/8 by deadline | 8/8 in 14.30 s | 7/8 by deadline, then 8/8 in 12.57 s | 8/8 in 6.35 s, then 8/8 in 6.34 s |
| 16 | 0/16 by deadline | 9/16 by deadline | 0/16 by deadline | 16/16 in 14.20 s |

Two sequential database round trips per request amplified queue time on the single socket. The role and search SQL took approximately 0.78 s each from dispatch to receipt over the staging pooler. The SQL engine plans executed in 2.571 ms and 0.120 ms. The combined staging plan executed in 0.975 ms. Baseline session verification took 13–220 ms and response construction took at most 1.6 ms in the captured samples. The driver marks dispatch before wire execution, so its SQL round-trip metric includes network and pooler time. A catalog sample saw no lock wait.

The correction joins an active staff or admin record to the customer search in one statement. Every lookup checks current authorization and returns 403 for a revoked or non-staff workspace record. Focused verification covered empty results, invalid input, selected-customer ordering, deleted rows and private cache headers. Two focused suites passed 19 tests. The original eight-request Playwright case passed on the corrected candidate with its 15 s client deadline and all original assertions. Cold 16-request capacity and a production latency budget remain open.

On `852f17c`, `pnpm verify` exited 0 in the detached Windows checkout with synthetic CI values. Type checking, ESLint, Stylelint and the token audit passed. ESLint reported zero errors and 57 warnings, including temporary runner and optional diagnostic logging warnings. Vitest passed 543 tests in 83 files in 206.62 s. The production build generated all 56 pages.

The warmed local Chromium run passed 48 cases in 4.1 minutes and skipped 15 by configuration. Four of those cases passed separately against the exact candidate's local Storybook preview in 47.2 s, covering three viewport widths and dark mode command search. The protected Vercel application preview remains pending.

The complete synthetic loopback suite stopped at `/dashboard/hubs` during the admin sweep. Navigation returned an acceptable status and the expected URL. The `main` assertion saw zero elements before its 30 s deadline, and the serial suite skipped the other ten cases. The failure snapshot did not establish whether the request was waiting for compilation, rendering or database access. The separate concurrency case had already passed on this SHA.

The November 14 authenticated warmup rendered Hubs successfully. Next.js reported 16.5 s overall, including 5.7 s in Next.js and 10.6 s in application code. During the subsequent sweep, the development server logged fatal memory allocation failures and the browser received HTML where Auth.js expected a session JSON response on Fleet. The admin case failed and the ten serial successors did not run. These logs establish resource exhaustion in the warm retry. The cause of the earlier Hubs timeout remains unresolved.

The isolated three-case role group passed customer sign-in denial, staff lookup access with administration denied, and revocation with an existing cookie. This run used the original assertions and a fresh loopback server.

The billing and custody group passed invoice creation with exact totals and the private PDF test. Line-haul stopped before departure because the creation dialog stayed visible at the 25 s deadline. Read-only staging SQL confirmed that a draft manifest and an active assignment had committed for the new invoice shipment, which stayed pending with zero handoffs. The snapshot showed the submit button enabled again. The cause of the dialog remaining open after creation is unconfirmed. This failure occurred earlier than the prior final-receipt dialog defect.

The three-case field group passed mobile workspace navigation, warehouse observation without a custody change, and pickup through signed final delivery. The delivery case checked both receipts, the stored signature, the original invoice amount and zero active assignments.

A fresh invoice and line-haul retry captured manifest POSTs at 27.3 s and 30.8 s. Creation and departure completed, then the original 15 s click deadline expired waiting for Record handover. The snapshot showed the affected row still offering Start run. SQL readback showed the manifest finalized, the shipment in transit, one active assignment and zero handoffs. A manifest reload was logged at 16.1 s. This establishes delayed UI convergence after committed departure on this runner. It leaves the post-commit response and refresh path open for profiling. Across the independent runs, nine distinct staging cases passed on `852f17c`. The full admin sweep and line-haul remain failed on loopback.

### Workflow stabilization candidate

Application candidate `868946e4818c8b0fe9db1acffe37485b5192dfe8` is local. The release branch has no hosted deployment ID. Previous evidence for `852f17c` establishes the original failure and the single-statement customer lookup baseline.

The manifest flow now returns the committed departure and active handover item IDs after the transaction. The controls apply that result before requesting a fresh page. The client uses one explicit refresh on successful submission and requests a refresh after an interrupted departure response. It guards against duplicate clicks while a request is in flight. Retrying the same line-haul departure reads the finalized manifest under its transaction lock and leaves tracking and audit history intact.

Manifest creation uses a stable submission UUID as the manifest primary key. The transaction serializes that key and recognizes a replay only when the creator, assignments and shipment set match. Existing cargo locks and the unique active-shipment constraint remain in effect. A recognized replay skips the outbound driver notice. No schema migration is required.

Optional `MANIFEST_TIMING` and `NEXT_PUBLIC_MANIFEST_TIMING` correlate client submission, response, UI update and refresh request with authorization, transaction completion and post-commit work. Records contain generated IDs and timings. The transaction measurement includes pool wait and commit acknowledgement. Next.js request logs provide route response and refresh timings. The initial checkpoint `2cfcb73` passed 56 focused tests and failed type checking. Checkpoint `11849fe` passed type checking and exposed two outdated test mocks that targeted the old form hook. The current candidate exercises the submission path directly and checks that an interrupted response reuses the same key.

On `868946e`, `pnpm verify` exited 0 in the detached checkout with synthetic CI values. TypeScript, Stylelint, and the token audit passed. ESLint reported zero errors and 63 warnings, including optional timing logs and temporary runner warnings. All 547 unit tests passed across 84 files in 212.86 s. The production build generated 56 pages.

The production-mode loopback probe used the exact build with `next start` and the isolated staging profile. `/robots.txt` returned 200 in 29 ms. `/signin` and `/dashboard/hubs` returned the configured perimeter's missing-key response, HTTP 503 in 156 ms and 13 ms. The listener working set was 165,404,672 bytes before authenticated load. The admin case stopped before login because the sign-in form could not render. A dedicated staging Arcjet key is required to measure authenticated production-mode rendering and memory growth. The prior development-server memory failure remains separately documented.

The first full local Chromium attempt reported 45 passed, three failed and 15 skips. The three failures were an anonymous cargo-documents request returning 500, a 768 px image case timing out at navigation, and the tracking dialog visibility assertion. All three passed in a separate 1.0-minute rerun. A subsequent full `pnpm exec playwright test --config playwright.release-local.config.ts --workers=1 --retries=0` passed 48 cases and skipped 15 in 3.2 minutes. All runs used the same SHA, assertions and timeouts. The first failures did not recur and their causes remain unresolved. All four workspace cases passed against the separate local Storybook preview in 45.1 s.

The first instrumented line-haul and lookup runs stopped during readiness because the runner used the production readiness URL in development mode. After selecting the sign-in readiness route for development, `pnpm exec playwright test tests/staging-dashboard.spec.ts --config playwright.release-workflow.config.ts --workers=1 --retries=0 --grep 'invoice wizard|line-haul departure'` passed both cases in 4.1 minutes. It used a fresh synthetic invoice shipment and verified departure, exception, final receipt, dialog closure and database custody. The original timeouts and assertions were retained.

Creation authorization took 3.90 s, the transaction and commit 15.30 s, and post-commit work 3.77 s. The creation POST took 23.1 s and its next GET took 4.5 s. Departure authorization took 4.34 s, the transaction and commit 17.04 s, and post-commit work rounded to 0 ms. The departure POST took 21.4 s and its next GET took 4.2 s. The test proceeded to Record handover within its existing deadline. These are loopback measurements against synthetic PostgreSQL 17.11. Hosted latency and a browser-side correlation trace remain open.

The same runner with `--grep 'concurrent staff lookups'` passed the unchanged eight-request test in a 1.1-minute run, including startup, preflight and login. The application still authorizes each request against the current staff record within the lookup statement. The isolated profile driver `node profile-customer-lookup.cjs 8 16` then recorded all eight cold requests in 13.40 s and all eight warm requests in 6.29 s, repeated in 6.30 s. At 16 requests, nine cold responses arrived by the original 15 s deadline, while all 16 warm responses completed in 14.76 s. The one-socket pool was unchanged. This is synthetic loopback evidence. Hosted cold and warm performance remain untested.

### Hosted acceptance preflight

Application SHA `868946e4818c8b0fe9db1acffe37485b5192dfe8` was tested in the detached Windows checkout. The release branch and exact SHA had no Vercel deployment. The production alias read back READY deployment `dpl_KfBTeZLvkXACtGowH9SWHP5yBQrP` at `98f3e42ac19b3680d329415d61be716058d600cd`.

| Check | Status | Outcome |
| --- | --- | --- |
| Vercel Preview metadata | BLOCKED | `filter_project_envs` with decryption off found zero branch entries and one unverified shared Preview `ARCJET_KEY`. Project protection reported `all_except_custom_domains`. No deployment or configuration change was made. |
| Synthetic connection and profile | PASS | Supabase `zuevgwqmphbvgnwhvvnq` was `ACTIVE_HEALTHY` on PostgreSQL 17.11. Three active synthetic identities and zero Storage buckets. The local profile identifies the staging host, role and session pooler on 5432. Stage Auth, cron, PDF, mobile and Supabase keys differ from the local production entries. A distinct local Arcjet key is present. |
| Production-mode build and public sign-in route | PASS | `node hosted-acceptance-local-prod.cjs` built the exact SHA with the isolated staging profile, using `next build`. Exit 0, compilation 22.7 s, 56 pages generated. `next start` returned sign-in HTTP 200 in 1.49–1.92 s, with listener working-set samples of 271–360 MB after initial navigation. |
| Production-mode authenticated acceptance | FAIL | `pnpm exec playwright test tests/staging-dashboard.spec.ts --config playwright.release-hosted-preflight.config.ts --workers=1 --retries=0` failed the admin case waiting for a dashboard redirect after form submission. Ten serial successors did not run. A focused retry reproduced the result. Direct HTTP probes returned the configured perimeter's fail-closed 503 response from Hubs, health and customer lookup. The key-missing response was absent. Six memory samples during the first failed login were 204.91–204.97 MB. Authenticated route memory growth remains unmeasured. |
| Hosted workflows, Storage and load | NOT TESTED | No candidate deployment or private staging bucket. The local production-mode run reached the request perimeter. It produced no evidence on authenticated application route performance. |

The installed Arcjet SDK requires client IP attribution outside development. The loopback result confirms a perimeter error and leaves the underlying Arcjet decision unclassified. A protected Vercel run must preserve the fail-closed rules and use platform-provided client IP attribution. [Arcjet IP attribution](https://docs.arcjet.com/reference/nodejs#client-ip-address-detection)

Read-only Supabase MCP SQL sampled four client backends against PostgreSQL `max_connections=60` and zero lock waits. This is a database snapshot and does not measure Supavisor client utilization. `extensions.pg_stat_statements` reported mean execution of 5.31 ms for manifest inserts, 1.37 ms for assignment inserts, 0.31 ms for manifest updates, 1.15 ms for tracking inserts, 0.47 ms for advisory locks and 0.22 ms for staff lookup. These counters aggregate staging history. Read-only `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)` measured 1.18 ms for the manifest reference lookup and 10.12 ms for a receipt join on synthetic fixtures.

A one-socket Postgres.js probe used `sql.reserve()` against the staging session pooler. Initial acquisition and connection setup took 3.78 s. Across three `BEGIN READ ONLY`, `SELECT 1` and `COMMIT` cycles on the same socket, each command returned in 389–390 ms. These durations include network and acknowledgement. They support investigating connection setup and round-trip count before changing indexes or pool limits. They provide no write-commit timing or hosted performance certification.

Production Supabase Auth settings returned HTTP 200 with `disable_signup=false`. Aggregate SQL found four active staff records and four confirmed canonical Auth matches. The November 14 workstation backup exited 0. The 02:32:06 IST receipt verified the 02:30:16 IST snapshot and file checksums. Auth lockdown, relay rotation, and managed application recovery remain blocked.

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
