# Cargo leg completion gate

The current database represents a manifest or dispatch run with only `draft` and `finalized` status. Finalization records departure. It does not establish arrival, pickup handover, leg completion, or the release of a shipment for another load. A shipment's `in-transit` or `delivered` status and free-text tracking notes are not reliable evidence that a particular manifest leg has ended.

Until an explicit leg lifecycle is implemented, allocation deliberately accepts only non-deleted, pending shipments without any manifest-item assignment. Allocators lock shipment rows before inspecting assignments; draft-load removal releases its assignments by cascade. Finalized movement remains immutable. Pickup-run completion cannot mark cargo delivered. Staff can record shipment tracking events, but those events do not release load assignments.

Consequently, one AWB cannot currently progress through pickup, line-haul and delivery loads. This is an open launch gate for multi-leg cargo operations, not a completed workflow.

The required migration and implementation must:

- Represent the leg kind explicitly and add an authenticated completion/handover record with time, actor, receiving location or party, and manifest identity. Distinguish departure from completion; preserve existing finalized records as uncompleted until actual handover is recorded.
- Preserve historical `manifest_items`, whose uniqueness is currently only `(manifest_id, shipment_id)`. Add an explicit active-assignment representation with database uniqueness on the shipment, or an equivalent database-enforced constraint, so one shipment cannot occupy two open legs.
- Complete a pickup or line-haul leg and release its active assignments in one transaction, retaining shipment `in-transit` status. Permit subsequent eligible in-transit legs only after that recorded handover. Only a delivery outcome may mark a shipment delivered.
- Acquire consistent manifest/shipment locks for allocation, departure, handover, cancellation and removal. Insert the audit record in the same transaction as every transition.
- Verify concurrent allocation and handover, partial delivery and exceptions, cancellation/reassignment, and recovery after failed audit or transition writes before enabling multi-leg selectors.

No hosted migration or schema change was performed for this gate. Local transaction tests verify atomic operational auditing, protected removal, and chargeable-weight updates; they do not prove a hosted schema baseline or multi-session lock behavior.
