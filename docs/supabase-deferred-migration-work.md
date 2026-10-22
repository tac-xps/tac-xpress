# Supabase migration work

This file tracks local readiness. No hosted Supabase operation was performed. Use the project reference from `.env.local`; never substitute a project by display name.

## Current status

- Local schema and cargo actions now model pickup, line-haul, and delivery receipts.
- The deployable migration is committed at `supabase/migrations/20261022000000_manifest_leg_handoffs.sql` and `drizzle/0005_manifest_leg_handoffs.sql`.
- Hosted schema, RLS, advisor results, and migration ledger remain unverified. Earlier Supabase CLI inspection failed because this checkout is not linked. The configured project's connected account was not available through the Supabase tools.
- Two local files share migration prefix `0018`: `0018_whatsapp_ticket_contracts.sql` and `0018_secure_public_tracking.sql`. The read-only audit script reports this conflict. Do not rename either file until the hosted ledger is inspected.
- The Drizzle journal now tracks entries `0000` through `0005` in `drizzle/meta/_journal.json`.
- The historical cargo `shipment_legs` scaffold is not used by the new handoff workflow. Do not infer completion from its status or from free-text tracking notes.
- Historical repeated manifest assignments can block the migration's partial unique index. The migration raises an exception instead of choosing an active row.

## Prepared local checks

Run the migration filename audit without database access:

```powershell
pnpm audit:supabase-migration-history
```

The command exits nonzero while duplicate versions remain. Do not suppress this result or change the migration ledger.

Review `scripts/sql/inspect-cargo-leg-migration-preflight.sql` before running it against a staging snapshot. It reports schema and assignment state; it does not mutate data.

## Release work

1. Confirm the project reference from `.env.local` matches the linked CLI target. Do not print keys or connection strings.
2. Resolve duplicate `0018` prefixes against the hosted migration ledger.
3. Select one migration source of truth and reconcile missing Drizzle journal entries.
4. Capture a staging backup and the row counts listed in the [migration checklist](supabase-drafts/shipment-leg-migration-checklist.md).
5. Review prefix-based legacy leg classification and duplicate-assignment reconciliation.
6. Apply only through the approved Supabase migration workflow.
7. Verify constraints, RLS, grants, transaction rollback, receipt idempotency, and multi-session allocation in staging.
8. Approve the production change window and rollback plan after staging acceptance.

Never use `db:push`, `db:reset`, direct `psql`, or the legacy SQL helpers as a substitute for a reviewed migration.
