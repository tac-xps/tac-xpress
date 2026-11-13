# Production readiness

**Decision on November 13, 2026: NO-GO.**

The application candidate is `00b77cd5bcd6f9eaee93be701bba865d4a6f9e13` on `codex/release-remediation-2026-11-13`. Vercel's live alias serves `98f3e42`. The November 4 hosted acceptance covers runtime `8676eaa`.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Staging resumed and the current candidate passed synthetic invoice, document, role and custody checks over loopback. Protected preview workflow acceptance is pending. |
| B. Security | BLOCKED | Four active staff/admin records match confirmed Auth accounts. Production signup remains enabled and relay credential rotation is pending. Fresh production admin sign-in, secure password handoff, and hosted session, role and telemetry acceptance remain open. |
| C. Database integrity | BLOCKED | Eight production migration versions and names match. Staging has both baseline migrations and 28 public tables with RLS. Anonymous and authenticated synthetic requests returned zero shipment rows through the direct Data API. Staging has no private Storage bucket. |
| D. Engineering quality | PASS | Candidate `00b77cd` passed `pnpm verify`, including 541 unit tests, type checking, lint and a 56-page production build. Local Chromium passed 48 cases with 15 expected hosted skips. See [current test results](test-results.md). |
| E. Reliability and performance | BLOCKED | The eight-read loopback burst missed its 15-second client deadline twice. Next.js logged eight HTTP 200 responses at 14.8 s on the timed retry. Hosted load, the enabled provider path, and recovery timing remain open. |
| F. Operational readiness | BLOCKED | The workstation backup exited 0 and independent offsite file verification passed. Windows Application Control prevented the new database import. Managed Auth and Storage replacement, always-on scheduling, complete Vercel environment verification, and rollback rehearsal remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The release plan records the approvals, credentials, and isolated resources required for the remaining checks. Resend sender and delivery acceptance and LeminAI callbacks remain deferred. Outbound LeminAI acceptance remains required.
