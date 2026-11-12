# Cargo leg lifecycle

Local code now models pickup, line-haul, and delivery assignments. Departure changes pending cargo to in-transit. A recorded receipt releases one AWB assignment. Only a delivery receipt changes the shipment to delivered.

`manifest_items.is_active` keeps assignment history while allowing one active load per shipment. `manifest_item_handoffs` stores receipts and exceptions with actor, location, timestamp, and idempotency key. An exception keeps the assignment active. Receipt, assignment release, shipment status, tracking, and audit writes share one transaction.

The active migration is [20261102153718_manifest_leg_handoffs.sql](../supabase/migrations/20261102153718_manifest_leg_handoffs.sql). The November 13 audit verified that all eight active migration versions match the configured hosted ledger. The older draft and preflight checklist document the original rollout. See the [baseline decision](migration-baseline-decisions.md) and [current database audit](engineering/database-audit.md) before proposing new schema changes.

The flow tracks handoffs per AWB. Legacy in-transit shipments without a recorded receipt remain unavailable for another leg until staff reconciles their history. The November 4 synthetic staging evidence includes custody and concurrency checks against an earlier revision. Repeat those checks against the release candidate. See [release gates](engineering/production-readiness.md).
