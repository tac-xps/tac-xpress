# Cargo leg lifecycle

Local code now models pickup, line-haul, and delivery assignments. Departure changes pending cargo to in-transit. A recorded receipt releases one AWB assignment. Only a delivery receipt changes the shipment to delivered.

`manifest_items.is_active` keeps assignment history while allowing one active load per shipment. `manifest_item_handoffs` stores receipts and exceptions with actor, location, timestamp, and idempotency key. An exception keeps the assignment active. Receipt, assignment release, shipment status, tracking, and audit writes share one transaction.

The migration remains a draft. The repository's Supabase history has duplicate `0018` prefixes, and the linked project migration ledger could not be inspected. The draft migration aborts if historical assignments conflict. Do not move it into `supabase/migrations/` or apply it until the migration ledger and active assignment report are reconciled. See [deferred Supabase migration work](supabase-deferred-migration-work.md), the [migration draft](supabase-drafts/manifest-handoff-migration.sql), and the [preflight checklist](supabase-drafts/shipment-leg-migration-checklist.md).

The flow tracks handoffs per AWB. It does not split pieces within one AWB. Legacy in-transit shipments without a recorded receipt remain unavailable for another leg until staff reconciles their history. Hosted schema state and concurrent multi-session behavior remain unverified.
