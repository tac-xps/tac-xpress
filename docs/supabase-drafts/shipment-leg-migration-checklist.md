# Manifest handoff migration checklist

**Status: local implementation drafted; hosted migration deferred.** The executable draft is [manifest-handoff-migration.sql](manifest-handoff-migration.sql). Keep it outside `supabase/migrations/` until the hosted history and data preflight pass.

## Local contract

- `manifest_leg_type` classifies pickup, line-haul, and delivery manifests.
- `manifest_items.is_active` preserves history and permits one active assignment per shipment.
- `manifest_item_handoffs` records receipt or exception, receiving actor, location, timestamp, and idempotency key.
- A receipt releases one AWB assignment. An exception keeps it active.
- Pickup and line-haul receipts retain `in-transit`. A delivery receipt sets `delivered`.
- Tracking, assignment, shipment status, and audit changes commit in one transaction.
- The UI supports handoffs per AWB. It does not split or partially receive pieces within one AWB.

## Before staging

1. Read the target Supabase project reference from `.env.local` without printing credentials.
2. Confirm the connected CLI project reference matches that value.
3. Resolve the duplicate local `0018` migration prefixes against the hosted migration ledger. Preserve applied migration identities.
4. Run `pnpm audit:supabase-migration-history` and record its result.
5. Run `scripts/sql/inspect-cargo-leg-migration-preflight.sql` against a staging snapshot.
6. Reconcile duplicate assignments. The draft migration aborts if one shipment has multiple existing manifest rows.
7. Review all old `PU-` and `DL-` references. The draft maps those prefixes to pickup and delivery; all others become line-haul.
8. Capture backups and counts for shipments, manifests, manifest items, and tracking events.
9. Apply the migration to staging through the approved Supabase migration workflow. Never use direct SQL helper scripts.
10. Verify RLS, grants, indexes, constraints, row counts, audit rollback, exception recovery, and repeated handoffs.

## Known gaps

- The hosted schema and migration ledger are unverified.
- Existing in-transit cargo has no receipt history. Staff must record a verified handoff before reallocation.
- Multi-session concurrency requires staging verification.
- Shipment-piece allocation is out of scope. A receipt applies to the full AWB.
- Rollback needs a separately reviewed plan because dropping the new fields would discard handoff history.
