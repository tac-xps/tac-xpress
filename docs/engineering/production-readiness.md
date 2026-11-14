# Production readiness

**Decision on November 14, 2026: NO-GO.**

Application `868946e4818c8b0fe9db1acffe37485b5192dfe8` is READY on protected Preview `dpl_3pCH4xXb1Ah4GqNty1W4o5GNbSqE` from `codex/hosted-acceptance-868946e`. Vercel's production alias serves `98f3e42` at `dpl_KfBTeZLvkXACtGowH9SWHP5yBQrP`.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | FAIL | Hosted preflight and admin/Hubs/Fleet passed. The full serial suite finished 9 pass, 1 fail, 1 unrun. Focused signed delivery and eight-request lookup passed. The original signature interaction failure remains unresolved. |
| B. Security | BLOCKED | Hosted Arcjet LIVE, Vercel protection, app authorization and revoked sessions passed. Production public signup and relay credential rotation remain open. Fresh production admin sign-in, secure password handoff, and telemetry acceptance remain open. |
| C. Database integrity | PASS on staging | Verified the synthetic database via a published fixture. Line-haul custody and private cargo Storage passed, including staff upload, download, signed expiry, revoked-session denial and audit. Managed replacement remains under Gate F. |
| D. Engineering quality | PASS | `pnpm verify` passed with 547 unit tests and 56 generated pages. The full local Chromium rerun passed all 48 applicable cases, and the four separate Storybook cases passed. |
| E. Reliability and performance | BLOCKED | Eight-request hosted lookup passed and all 30 bounded diagnostic reads succeeded. Manifest application timing was recorded. Hosted cold-start classification, peak function memory, sustained capacity and an agreed latency and throughput budget remain open. |
| F. Operational readiness | BLOCKED | The November 14 workstation backup exited 0 and verified offsite recovery checksums for the 02:30:16 IST snapshot. Managed Auth and Storage replacement, always-on scheduling, complete Vercel environment verification, and rollback rehearsal remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The release plan records the approvals, credentials, and isolated resources required for the remaining checks. Resend sender and delivery acceptance and LeminAI callbacks remain deferred. Outbound LeminAI acceptance remains required.
