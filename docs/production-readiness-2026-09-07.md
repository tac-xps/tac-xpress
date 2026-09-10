# Production readiness audit — 7 September 2026

> Historical audit: the later [Nordic Lagom and staff-only audit](nordic-lagom-audit-2026-09-07.md) supersedes the customer-portal model, visual direction and local verification counts below.

**Release decision: not cleared for production.** The code and shared design have been substantially repaired, with local verification recorded below. Deployment, provider acceptance, migration reconciliation and remaining operational features are still release gates.

## Scope

The starting checkout was main with 520 modified, deleted or untracked entries. Existing work was preserved; no commit, push or deployment was performed. The final surface inventory covers 660 application, component, library, migration, documentation and test files and 55 page/API routes, excluding generated evidence. It is an index plus targeted risk review, not a claim of exhaustive line-by-line inspection. See [surface inventory](audit-surface-inventory-2026-09-07.md).

## Implemented fixes

| Severity | Finding | Remediation |
| --- | --- | --- |
| Critical | Public portal action could mint an identity from email/AWB knowledge | Removed the signer; portal access now requires a Supabase-verified, confirmed identity. Magic links verify hashed email tokens before setting HttpOnly cookies. |
| Critical | New Supabase users were automatically created as staff | Staff access now requires a provisioned, non-deleted admin/staff record. Current database roles are checked at protected data boundaries. |
| Critical | Driver pages and delivery completion lacked authorization | Staff authorization now precedes page queries and completion mutations. Driver-specific assignment/identity remains a release gate. |
| Critical | Invoice/label pages exposed records without document authorization | Added staff guards and five-minute, invoice-specific rendering tokens. PDF jobs have a distinct signed purpose and reject legacy permanent signatures. |
| High | Internal AI, messaging, email and SLA helpers were exposed as server actions | Converted privileged internal helpers to server-only modules. |
| High | Public profile enumeration and self-editable role | Applied and verified owner-only profile access and explicit editable-column permissions. Anonymous profile reads and role changes are denied. |
| High | Next-Action header bypassed the request rate limit | Multipart actions retain a dedicated rate limit. Credential attempts have a separate limit and fail closed on limiter failure. |
| High | Portal queries used columns absent from the hosted schema | Replaced with explicit Drizzle projections and verified-email ownership predicates. Financial records are sender-only. Failures now show recovery rather than empty records. |
| High | Public tracking depended on an absent view | Replaced with a server query that returns only explicitly public events on active shipments. Added an explicit staff publishing control; private status and personal/financial fields are excluded. No existing events were published. |
| High | Manifest HTML interpolated unescaped database text | Escaped text and attribute values and required current staff authorization. |
| High | Weak/false-green tooling | Restored dependencies, configured real Next/TypeScript ESLint rules, removed zero-test success flags, replaced ineffective smoke assertions and added a CI quality workflow. |
| High | Vulnerable production dependencies | Patched Next.js, editor/security dependencies and targeted transitive resolutions. Final production audit has zero known advisories. |
| Medium | Incorrect website URLs and fragile PDF paths | Website-origin validation rejects localhost in production, credentials, extra paths and Supabase/MCP URLs. Shared PDF rendering verifies its destination and does not forward user cookies. |
| Medium | Feedback used an absent table; ticket follow-up could end with a serverless response | Feedback now enters the staffed support queue with the same validation/rate limit. Ticket follow-up runs through Next.js after with captured errors. This is not a durable delivery queue. |
| Medium | Hosted function/security and index advisories | Locked three function search paths, revoked public trigger execution, and added seven missing foreign-key indexes. |
| Medium | Unsupported flight/fare data | Removed invented carrier responses. Staff are told that operations arrange carrier quotes. |
| Medium | Inconsistent UI and accessibility | Applied the approved crisp logistics system across tokens, forms, tables, dashboard shell/navigation/metrics, portal, public pages, sign-in, tracking, assistant and recovery screens. Fixed small-screen forms, focus, contrast, hydration and render-time side effects. |

## Hosted changes and verified boundaries

Target: tac-xpress, project ujyellrhwhqjmfponhuz. The local Codex MCP URL was corrected from another project, OAuth login succeeded with explicit supported scopes, and live project access was reverified.

Applied migrations, with matching local filenames:

- 20260907141835_harden_public_function_permissions
- 20260907143329_restrict_profile_access
- 20260907145618_index_operational_foreign_keys

Live privilege checks show anonymous profile reads denied, authenticated role edits denied, own-name edits allowed by privilege and owner policy, and anonymous trigger execution denied. All 20 public tables have RLS enabled. Nineteen tables have no policies and deny ordinary Data API access. The cargo-documents bucket is private. The application uses privileged server access for operational data, so application authorization remains essential.

There was **no hosted migration history at audit start**. Recording these three narrow repairs does not reconcile the previous schema. Historical migrations must not be blindly replayed; 0018_secure_public_tracking.sql references columns absent in the hosted database and is no longer used by the tracking action.

The remaining security-advisor warning is leaked-password protection being disabled. The seven missing foreign-key index notices are resolved. Unused-index notices on this small database are not evidence that those indexes should be removed.

## Local verification

- TypeScript and Next route generation: passing in the final local sequence.
- ESLint: zero errors and 253 warnings (mostly logging and hook dependency/deoptimization notices). Warnings are not presented as resolved debt.
- Stylelint: passing.
- Unit/security tests: 53 passing across 10 files, covering staff provisioning, portal identity/callback, document token scope/expiry, ownership/public projections, bounded input, HTML escaping and internal module boundaries.
- Production build: passing on Next.js 16.2.11, including TypeScript and route generation. This is local build evidence, not a deployment check.
- Storybook: production build passing. Remote Chromatic baseline approval was not performed.
- Browser suite: 30 passing checks cover public surfaces at 320/768/1440 pixels, automated WCAG A/AA checks, dark theme, navigation and assistant focus, invalid-link recovery, and anonymous access denial. The three homepage viewport checks were rerun and passed after the final component extraction. These tests do not send provider messages, log in as live users or change hosted records.
- Browser configuration: E2E sign-in bypass was disabled in the preview process. Arcjet used a local development placeholder; these results validate application access controls, not the deployed Arcjet perimeter.
- Dependency audit: zero production advisories across 881 dependency entries.
- Limited tracked-file secret-pattern scan: no matches in 709 scanned files. It excludes environment files/binaries and does not replace a complete secrets-history audit.

Evidence: [verification summary](audit-evidence/2026-09-07/verification-summary.json), [screenshots](audit-evidence/2026-09-07/), [dependency scan](audit-evidence/2026-09-07/dependency-audit.json), [Supabase advisor counts](audit-evidence/2026-09-07/supabase-advisors.json), [design system](DESIGN.md).

## Open release gates

1. **Deployment identity and production environment.** The current environment uses localhost and enabled E2E flags; the production verifier correctly rejects it. Supply the actual website origin in deployment configuration, disable test flags, verify release commit/hostname and run pnpm verify:production-env in that environment. The MCP URL is not a website URL. No production deployment was verified.
2. **Database baseline and recovery.** Reconcile local Drizzle/Supabase histories with the hosted schema, replay the resulting baseline in staging, and demonstrate a restore-tested backup. Do not run db:push, db:reset or all historical migrations against this project.
3. **Authenticated and performance acceptance.** Use seeded staging users to test staff roles, revocation, two-customer isolation, shipments, invoices, PDF generation/download, manifests, signatures, support and scanners. Browser tests here cover public/denial flows; they do not validate complete staff workflows. Measure deployed latency, load capacity and the production rate-limit perimeter; local responsive checks are not performance acceptance.
4. **Providers and reliability.** Verify real email delivery and allowed auth redirects, expired-link behavior, WhatsApp signatures/templates/delivery, carrier webhook replay handling, cron execution and Sentry alerts. The callback stores a short-lived access token without a refresh flow; customers must request a new link after expiry. Background after tasks still need durable retry/outbox acceptance.
5. **Incomplete operational features.** Fleet telemetry still uses process memory and is unsuitable for serverless production persistence. Driver pages are now staff tools but do not implement driver-specific assignment authorization. Carrier quotes are not connected. Resolve these features or explicitly exclude them from the release scope.
6. **Supabase Auth configuration.** Enable leaked-password protection where available and verify real staff account provisioning/password recovery.
7. **Content and operational ownership.** Approve service/route statements, terms, asset rights, support escalation, incident ownership and release/rollback ownership. No legal or operational approval is implied by this audit.

## Reproduce checks

Use pnpm install --frozen-lockfile, pnpm verify, pnpm audit --prod, and pnpm test:e2e. Keep builds/type generation separate from an active dev server if Next rewrites generated route files during verification. Browser tests use local fixtures and no sign-in bypass. On this Windows host, PLAYWRIGHT_CHANNEL=msedge uses installed Edge. CI uses Chromium and synthetic configuration; the new workflow has not been run remotely.

## Reference guidance

- [Next.js data security](https://nextjs.org/docs/app/guides/data-security)
- [Next.js production checklist](https://nextjs.org/docs/app/guides/production-checklist)
- [Supabase function search paths](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [Supabase password protection](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection)

