# Supabase migration work

This file tracks release readiness. Use the project reference from `.env.local`; never substitute a project by display name.

## Current status

- Local schema and cargo actions model pickup, line-haul, and delivery receipts.
- The deployable migration is committed at `supabase/migrations/20261022000000_manifest_leg_handoffs.sql` and `drizzle/0005_manifest_leg_handoffs.sql`.
- Hosted migration ledger was inspected and verified via Supabase MCP. Neither local 0018 migration was applied remotely.
- The 0018 duplicate prefix conflict was resolved: `0018_secure_public_tracking.sql` was safely promoted to `0023_secure_public_tracking.sql`.
- Preflight inspection verified zero duplicate shipment assignments on staging.
- Automated preflight runner `pnpm inspect:cargo-leg-preflight` validates schema state without data mutation across both legacy and modern tables.
- The Drizzle journal tracks entries `0000` through `0005` in `drizzle/meta/_journal.json`.
- The historical cargo `shipment_legs` scaffold is not used by the new handoff workflow. Do not infer completion from its status or from free-text tracking notes.
- Historical repeated manifest assignments can block the migration partial unique index. Zero duplicate assignments exist on staging.

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
