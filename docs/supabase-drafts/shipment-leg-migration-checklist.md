# Manifest handoff migration checklist

**Status: preflight passed on staging; migration draft staged.** The executable draft is located at `supabase/migrations/20261022000000_manifest_leg_handoffs.sql`.

## Local contract

- `manifest_leg_type` classifies pickup, line-haul, and delivery manifests.
- `manifest_items.is_active` preserves history and permits one active assignment per shipment.
- `manifest_item_handoffs` records receipt or exception, receiving actor, location, timestamp, and idempotency key.
- A receipt releases one AWB assignment. An exception keeps it active.
- Pickup and line-haul receipts retain `in-transit`. A delivery receipt sets `delivered`.
- Tracking, assignment, shipment status, and audit changes commit in one transaction.
- The UI supports handoffs per AWB. It does not split or partially receive pieces within one AWB.

## Staging verification checklist

1. [x] Read the target Supabase project reference from `.env.local` (`skkappqeaxsdygwrbqni`).
2. [x] Confirm connected database project status (`ACTIVE_HEALTHY`).
3. [x] Inspect hosted migration ledger (12 applied migrations recorded).
4. [x] Resolve duplicate local `0018` migration prefix: `0018_secure_public_tracking.sql` -> `0023_secure_public_tracking.sql`.
5. [x] Run `pnpm audit:supabase-migration-history`: 40/40 unique migration versions.
6. [x] Execute `pnpm inspect:cargo-leg-preflight`: 0 duplicate shipment assignments found on staging.
7. [x] Review prefix-based legacy leg classification: 1 draft manifest (`MAN-20261006-0001`) maps cleanly to `line_haul`.
8. [ ] Apply migration to staging through approved Supabase migration workflow during change window.
9. [ ] Verify RLS, grants, indexes, constraints, row counts, and repeated handoff idempotency in staging.

## Operational notes

- Existing in-transit cargo has no historical receipt log. Staff must record a verified handoff before reallocation.
- Multi-session concurrency requires staging verification.
- Shipment-piece allocation is out of scope. A receipt applies to the full AWB.
