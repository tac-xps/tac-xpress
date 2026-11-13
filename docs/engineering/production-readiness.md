# Production readiness

**Overall assessment: NOT READY.**

November 13, 2026. The audit began at `98f3e42ac19b3680d329415d61be716058d600cd`. Changes are in the local branch `codex/engineering-audit-2026-11-13`. The original checkout remains available for parallel work. Earlier hosted acceptance is tied to runtime `8676eaa`.

| Gate | Status | Evidence and release requirement |
| --- | --- | --- |
| A. Functional correctness | BLOCKED | Local Chromium verifies public navigation, tracking validation, and anonymous access denial. Historical staging verifies cargo custody, invoices, and private PDF downloads. Current authenticated business flows require synthetic staging acceptance. |
| B. Security | BLOCKED | All four active staff/admin records now match confirmed Supabase Auth identities. Hosted signup remains enabled. A fresh admin sign-in and current-candidate role, revocation, RLS behavior, and telemetry checks remain open. |
| C. Database integrity | BLOCKED | All eight active migration versions, names, and normalized SQL bodies match the hosted ledger. Twenty-eight public tables have RLS. An earlier independent restore matched 55 application and Auth tables. Current release acceptance for data mutations and replacement Storage remains open. |
| D. Engineering quality | PASS | Typecheck, lint, Stylelint, token audit, contract validation, production build, and all 541 unit tests passed. Chromium passed 48 local cases. The previous production dependency audit reported zero advisories. The full audit retains development-tool findings. See [test results](test-results.md). |
| E. Reliability and performance | BLOCKED | Local diagnostics cover error recovery and responsive behavior. The checked-in k6 scenario targets the wrong tracking surface. Sustained load, current provider acceptance, and complete recovery timing remain open. |
| F. Operational readiness | BLOCKED | The repaired workstation backup exited 0 and the latest receipt verified fresh offsite recovery and checksums. Release-environment origin, replacement Storage, managed Auth configuration, always-on scheduling, and the rollback drill remain open. |

## Evidence and remaining release work

Use the [production release plan](release-plan.md) for sequencing, owners, staging evidence, and the go/no-go checklist.

1. Carry the verified backup forward into the managed replacement drill. Verify signed private Storage access, managed Auth recovery, and scheduling against the operating targets. [Backup runbook](../OFFSITE-BACKUPS.md), [restore acceptance](../restore-acceptance.md)
2. Review the candidate and run authenticated synthetic acceptance for staff/admin and revoked sessions, the cargo lifecycle, invoices, documents, and database policies. Record the tested revision and reproduce a bounded load test with the intended routes and credentials. [Feature inventory](feature-inventory.md), [database audit](database-audit.md), [security audit](security-audit.md)
3. Validate the approved origin, sender configuration, and enabled integration paths in the release environment. Confirm the rollback procedure and operator access before promotion. [Operations guide](../OPERATIONS.md), [engineering backlog](task-backlog.md)

The authorized remediation provisioned three Auth accounts through the Supabase Auth Admin API. It applied no database migration and did not promote a deployment.
