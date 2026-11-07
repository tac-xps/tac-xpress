# Supabase migration work

This file tracks release readiness. Use the project reference from `.env.local`; never substitute a project by display name.

## Current status

- Local schema and cargo actions model pickup, line-haul, and delivery receipts.
- Supabase MCP applied `20261102153718_manifest_leg_handoffs.sql` to the configured project `ujyellrhwhqjmfponhuz`.
- Supabase MCP applied `20261102193011_dlq_recovery_claims.sql` to the same project. Both local SQL files match the hosted ledger statements.
- Hosted migration ledger was inspected and verified via Supabase MCP. Neither local 0018 migration was applied remotely.
- The 0018 duplicate prefix conflict was resolved: `0018_secure_public_tracking.sql` was safely promoted to `0023_secure_public_tracking.sql`.
- Target-specific preflight found one draft line-haul manifest and seven pending, unique shipment assignments. No receipt history was fabricated.
- Automated preflight runner `pnpm inspect:cargo-leg-preflight` validates schema state without data mutation across both legacy and modern tables.
- The Drizzle journal tracks entries `0000` through `0005` in `drizzle/meta/_journal.json`.
- The historical cargo `shipment_legs` scaffold is not used by the new handoff workflow. Do not infer completion from its status or from free-text tracking notes.
- Historical baseline reconciliation now preserves 33 unrecorded files outside the active sequence. The eight active versions match production.
- The complete baseline passes fresh PostgreSQL verification. Restricted recovery matches all 55 application and Auth tables.
- The [2026-11-03 ledger inventory](audit-evidence/migration-ledger-2026-11-03.json) identifies eight recorded versions and 33 unrecorded historical files.
- Supabase rejected branch creation because this project requires Pro for branching. No paid change or branch was created.
- Follow the [current restore acceptance runbook](restore-acceptance.md). Archived restore instructions contain another project's coordinates.
- The owner-approved Free project `zuevgwqmphbvgnwhvvnq` now hosts a matching public schema and synthetic fixtures.
- Hosted rollback, RLS, concurrency, and Data API checks pass. Nine bounded application browser cases also pass against hosted staging.
- The configured session pooler authenticates after the owner's reset. Earlier port 6543 checks showed stalls and cancellations.
- Later read-only probes passed six short queries per pooler port. Serverless workload acceptance remains open.
- The application no longer rewrites the configured database port. No production connection or migration ledger was changed by this follow-up.
- See the [staging execution receipt](audit-evidence/staging-acceptance-2026-11-03.json). Production history remains unchanged.

## Reconciliation decision, 2026-11-03

The historical inventory above describes the pre-archive checkout. Archived SQL retains its original bytes and old metadata.
The current active directory contains eight recorded versions. A fresh Supabase MCP inspection confirms the same unchanged hosted ledger.
The [baseline decision](migration-baseline-decisions.md) defines fresh installation and future forward migrations.
No historical backfill is presumed complete. No archive file was replayed or falsely marked applied.
Drizzle's separate `drizzle/` journal remains unchanged.

## Prepared local checks

Run the migration filename audit without database access:

```powershell
pnpm audit:supabase-migration-history
```

Run the cargo leg preflight inspection against staging without mutations:

```powershell
pnpm inspect:cargo-leg-preflight
```

Review `scripts/sql/inspect-cargo-leg-migration-preflight.sql` before running it manually. It reports schema and assignment state without mutating data.

## Release work

1. Confirm the project reference from `.env.local` matches the linked CLI target. Do not print keys or connection strings.
2. Verify migration filename audit passes cleanly (`pnpm audit:supabase-migration-history`).
3. Execute preflight validation (`pnpm inspect:cargo-leg-preflight`) and verify zero duplicate assignments.
4. Capture a staging backup and the row counts listed in the [migration checklist](supabase-drafts/shipment-leg-migration-checklist.md).
5. Apply only through the approved Supabase migration workflow.
6. Verify constraints, RLS, grants, transaction rollback, receipt idempotency, and multi-session allocation in staging.
7. Approve the production change window and rollback plan after staging acceptance.

Never use `db:push`, `db:reset`, direct `psql`, or the legacy SQL helpers as a substitute for a reviewed migration.
