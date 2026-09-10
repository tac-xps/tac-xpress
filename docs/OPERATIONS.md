# Operations guide

## Dashboard operating model

Staff use the dashboard to create and manage shipments, manifests, dispatches, fleet records, invoices, customers, pricing, warehouse updates, and support tickets. Dashboard access requires an `admin` or `staff` session.

## Reliable operation

- Confirm an AWB, route, customer, and current status before making an update.
- Use manifests and dispatch flows to coordinate driver, vehicle, and shipment movement.
- Treat support and WhatsApp failures as operational work: inspect the ticket or message record, then retry only through the supported workflow.
- Use the audit history and outbound logs when resolving disputes or delivery exceptions.

## Communications review

Open Communications to review WhatsApp attempts, email notifications and the background-job counts. “Sent” means provider acceptance; “Delivered” and “Read” require provider receipts. A pending attempt or uncertain failure can already have reached the provider. Match the AWB/invoice, recipient and attempt time against provider history before manually sending again. A post-send warning does not mean the invoice should be resent.

Contact acknowledgment and triage jobs retry automatically with bounded backoff and leases. Investigate failed jobs and Sentry errors before recovery. Email jobs older than the provider idempotency window require manual reconciliation; do not reset or replay them blindly. There is no general-purpose manual queue replay control in the dashboard yet. Keep AI auto-reply disabled until its separate delivery acceptance is completed.

## Invoice and label checks

The booking wizard's dimensions describe the overall packed consignment. Enter actual piece count and actual aggregate weight; do not assume equal dimensions or weight for every piece. The server calculates chargeable weight and invoice totals. Financial edits and explicit payment recording are separate operations. A paid invoice requiring cancellation needs reconciliation rather than an ordinary void.

The invoice is A4; the shared shipping label is 4 × 6 inches. Preview sender, recipient, AWB, PIN code, piece count, weight, charges and balance before issuing. Confirm 100% scale on the physical label printer and test both QR and Code128 on the actual scanner. Storybook examples are simulated and must never be issued to customers.

## Cargo arrival and fleet

Finalized manifests stay locked. Do not remove or reassign their shipments to work around the missing leg-completion step. Destination receipt and reassignment acceptance remain an operational design decision. Fleet positions now persist, but a position older than fifteen minutes disappears from the live view; that means telemetry is stale, not that a vehicle has arrived. Mobile credentials must be provisioned securely, and individual device/driver isolation is still required before broader mobile access.

## Release readiness

Before release, validate current staff roles, retired portal denial, public tracking privacy, webhook verification, message configuration, and required health checks. The detailed technical gate is [deployment](./10-deployment.md).
