# Production readiness

**Decision on November 13, 2026: NO-GO.**

The application candidate is `b20a88878a14a710f512f71b4934aaa702b8e649` on `codex/release-remediation-2026-11-13`. Vercel's live alias serves `98f3e42`. The November 4 hosted acceptance covers runtime `8676eaa`.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Staging resumed. The candidate's loopback public tracking checks passed. Protected preview and hosted workflow acceptance are pending. |
| B. Security | BLOCKED | Four active staff/admin records match confirmed Auth accounts. Production signup remains enabled. Fresh production admin sign-in, secure password handoff, and hosted session, role and telemetry acceptance remain open. |
| C. Database integrity | BLOCKED | Eight production migration versions and names match. Staging has both baseline migrations and 28 public tables with RLS. Anonymous and authenticated synthetic requests returned zero shipment rows through the direct Data API. Staging has no private Storage bucket. |
| D. Engineering quality | BLOCKED | Candidate `b20a888` passed the standalone production build and focused cargo render. Local Chromium reported 39 passed, nine failed and 15 expected skips. The warmed tracking dialog check passed separately. Production dependency audit passed and the full audit found zero high or critical advisories. See [current test results](test-results.md). |
| E. Reliability and performance | BLOCKED | The corrected k6 workload targets public tracking and checks that the expected shipment rendered. Hosted load, the enabled provider path, and recovery timing remain open. |
| F. Operational readiness | BLOCKED | The workstation backup exited 0 and independent offsite file verification passed. Windows Application Control prevented the new database import. Managed Auth and Storage replacement, always-on scheduling, complete Vercel environment verification, and rollback rehearsal remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The release plan records the approvals, credentials, and isolated resources required for the remaining checks. Resend sender and delivery acceptance and LeminAI callbacks remain deferred. Outbound LeminAI acceptance remains required.
