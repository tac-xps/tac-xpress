# TAC-XPRESS engineering audit

**Overall assessment: NOT READY.**  
November 13, 2026

The chat directory contained no repository. I selected `C:/tac-xpress` after confirming the matching Next.js and Supabase stack, Git history, and Codex and Kilo files. The original checkout remained on `main` at `98f3e42`. The local audit branch is `codex/engineering-audit-2026-11-13` at `e13a27f`.

## Application and architecture

TAC-XPRESS provides public cargo inquiries and tracking for the New Delhi–Imphal corridor. Provisioned staff use the workspace for shipments, manifests, dispatch, fleet, invoices, private documents, warehouse operations, and support. The audit mapped 43 pages and 24 route handlers. The stack is Next.js 16.4.3, React 19.2.4, TypeScript, Tailwind 4, Auth.js, Drizzle, and Supabase/PostgreSQL. Auth.js issues staff sessions after Supabase Auth verifies credentials. Privileged operations check the current active staff role.

Ten maintained documents in `docs/engineering/` cover architecture, features, routes, database, security, cleanup, backlog, verification, decisions, and production readiness.

## Remediation and recovery

- Enforced the current staff role on seven MFA management actions. Public tracking and support AI now require a published event before returning shipment metadata. Browser Sentry Replay follows the opt-in, masks data when enabled, and disables default PII.
- Fixed footer feedback selection, reduced-motion hydration, AWB shipping-label lookup, UUID validation for document and staff routes, and the build failure caused by an empty optional Blob hostname.
- Removed 27 duplicate PNGs totaling 79.51 MiB, an obsolete CI transcript, two historical Kilo files, a stale package script, and two unused direct dependencies. The production build served all legacy images with the expected bytes and cache headers. The original Codex and Antigravity configuration, Kilo worktrees, and local operational data were preserved.
- Verified a separate Git bundle by restoring it into a new clone and running `git fsck --full`. The bundle is at `C:/Users/stack/Documents/Codex/2026-11-13/us/work/tac-xpress-baseline-98f3e42.bundle`. Source changes were committed locally in four reversible batches, with a separate documentation commit.

## Verification

- Baseline passed 521 unit tests and 46 browser tests. Final candidate passed all 536 unit tests across 82 files on the serial run. The first concurrent run recorded ten subprocess timeouts in one existing suite, which subsequently passed in full without changes to the tests. Chromium passed 48 tests and skipped 15 staging and preview cases.
- Typecheck, ESLint, Stylelint, token audit, migration filename audit, API contract validation, and production build passed. ESLint retained 49 warnings and contract validation retained seven warnings.
- Production dependencies had zero advisories. The full audit reported 20 development-tool advisories, including four high. Qodo was blocked by Windows Application Control. The diff review and focused validation ran locally.
- Read-only Supabase inspection confirmed that all eight active migrations match the configured hosted ledger, including normalized SQL, and that all 28 public tables have RLS. Catalog inspection confirms configuration. Current-candidate role and policy behavior still needs synthetic acceptance.

## Release gates

| Gate | Status | Evidence or remaining work |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Authenticated cargo, billing, and document workflows need current-candidate staging acceptance. |
| B. Security | BLOCKED | Current role and RLS behavior, telemetry redaction, and hosted request protection need candidate acceptance. |
| C. Database integrity | BLOCKED | Hosted ledger and schema metadata match. Current mutation and replacement Storage recovery checks remain open. |
| D. Engineering quality | PASS | Local verification is recorded in `docs/engineering/test-results.md`. |
| E. Reliability and performance | BLOCKED | Controlled load and provider acceptance remain open. The existing tracking load fixture targets the wrong route. |
| F. Operational readiness | FAIL | The scheduled backup last exited 1 on November 12. The backup volume was unavailable, so snapshot freshness and the failure cause remain unverified. The local production-environment check also failed HTTPS origin and sender validation. |

## Next actions

1. Inspect the failed backup with its configured volume available. Restore a current snapshot and verify private Storage access, managed Auth recovery, and the documented recovery targets.
2. Exercise the exact candidate on approved synthetic staging. Cover staff and revoked sessions, custody, billing, signed documents, RLS, provider delivery, and bounded concurrency.
3. Validate the release environment's HTTPS origin and sender configuration. Review the development-tool advisories through scoped lockfile changes.

The changes are local. Hosted work consisted of read-only metadata inspection.
