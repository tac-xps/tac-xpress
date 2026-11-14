# Production readiness

**Decision on November 14, 2026: NO-GO.**

Application `868946e4818c8b0fe9db1acffe37485b5192dfe8` is READY on protected Preview `dpl_3pCH4xXb1Ah4GqNty1W4o5GNbSqE` from `codex/hosted-acceptance-868946e`. Vercel's production alias serves `98f3e42` at `dpl_KfBTeZLvkXACtGowH9SWHP5yBQrP`.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Arcjet confirmed a fresh headless denial and a cached denial on headed Chrome. Vercel still challenges anonymous access on the exact Preview. The next protected access window requires approval. Runtime staging identity remains unverified and all 11 hosted staging scenarios remain unrun. |
| B. Security | BLOCKED | Four active staff/admin records match confirmed Auth accounts. Production signup remains enabled and relay credential rotation is pending. Fresh production admin sign-in, secure password handoff, and hosted session, role and telemetry acceptance remain open. |
| C. Database integrity | BLOCKED | The private synthetic `cargo-documents` bucket exists with zero objects and zero direct object policies. Authorized access, revocation, signed expiry and the upload audit are pending. |
| D. Engineering quality | PASS | `pnpm verify` passed with 547 unit tests and 56 generated pages. The full local Chromium rerun passed all 48 applicable cases, and the four separate Storybook cases passed. |
| E. Reliability and performance | FAIL | The current candidate passed the unchanged eight-request loopback test. The cold 16-request profile missed seven requests at 15 s. Hosted performance and an agreed latency and throughput budget remain open. |
| F. Operational readiness | BLOCKED | The November 14 workstation backup exited 0 and verified offsite recovery checksums for the 02:30:16 IST snapshot. Managed Auth and Storage replacement, always-on scheduling, complete Vercel environment verification, and rollback rehearsal remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The release plan records the approvals, credentials, and isolated resources required for the remaining checks. Resend sender and delivery acceptance and LeminAI callbacks remain deferred. Outbound LeminAI acceptance remains required.
