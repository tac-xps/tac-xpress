# Production readiness

**Decision on November 14, 2026: NO-GO.**

The application candidate is `868946e4818c8b0fe9db1acffe37485b5192dfe8` on `codex/release-remediation-2026-11-13`. Vercel's live alias serves `98f3e42` at `dpl_KfBTeZLvkXACtGowH9SWHP5yBQrP`. The release branch has zero deployments.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Synthetic loopback invoice and line-haul passed. With a distinct staging Arcjet key, the production-mode login page returned 200. The admin case failed to reach the dashboard, direct protected probes returned the perimeter's fail-closed 503, and ten serial cases did not run. Hosted acceptance remains untested. |
| B. Security | BLOCKED | Four active staff/admin records match confirmed Auth accounts. Production signup remains enabled and relay credential rotation is pending. Fresh production admin sign-in, secure password handoff, and hosted session, role and telemetry acceptance remain open. |
| C. Database integrity | BLOCKED | Production and staging catalog fingerprints match for the inspected public and Storage security controls. Staging has no private Storage bucket. Signed URL expiry, application revocation and document audit acceptance are pending. |
| D. Engineering quality | PASS | `pnpm verify` passed with 547 unit tests and 56 generated pages. The full local Chromium rerun passed all 48 applicable cases, and the four separate Storybook cases passed. |
| E. Reliability and performance | FAIL | The current candidate passed the unchanged eight-request loopback test. The cold 16-request profile missed seven requests at 15 s. Hosted performance and an agreed latency and throughput budget remain open. |
| F. Operational readiness | BLOCKED | The November 14 workstation backup exited 0 and verified offsite recovery checksums for the 02:30:16 IST snapshot. Managed Auth and Storage replacement, always-on scheduling, complete Vercel environment verification, and rollback rehearsal remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The release plan records the approvals, credentials, and isolated resources required for the remaining checks. Resend sender and delivery acceptance and LeminAI callbacks remain deferred. Outbound LeminAI acceptance remains required.
