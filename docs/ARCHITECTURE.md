# TAC-XPRESS architecture

## Product and access model

The public website explains cargo services, preparation, tracking and contact. It has no customer accounts or customer dashboard. `/portal` routes are compatibility redirects guarded by current staff authorization; they cannot establish customer sessions. Retired email callbacks clear legacy cookies and route to staff sign-in.

The operations workspace is for provisioned admins and staff. NextAuth credentials verify Supabase Auth identity, then require a matching non-deleted `users` record. Every protected page, action and API rechecks the current database role; a stale admin JWT does not retain admin permissions after demotion. Team directory access is admin-only. `AUTH_SECRET` signs staff sessions.

## Request perimeter and trusted URLs

`proxy.ts` is the Next.js 16 request interceptor. Arcjet supplies shield, bot and rate protection; production rejects missing or placeholder keys. SDK errors and partial rule failures return 503 for private routes and mutations; read-only public pages remain available and report the degraded protection. The application origin is validated by `lib/config/app-url.ts`. A Supabase project API URL or MCP URL is never a substitute for the website origin.

Invoice and label rendering requires staff authorization or a short-lived invoice-specific render token. Job and render tokens have separate purposes and are signed with `INVOICE_PDF_SIGNING_SECRET`. Download links use invoice IDs. Preview URLs are generated internally rather than trusting stored arbitrary URLs.

## Data and operational workflows

Drizzle queries operational domains through guarded server code. RLS is enabled on hosted public tables, but service-role and database-owner queries still require application authorization. Search and sorting for primary registers use bounded, parameterized server queries with deterministic pagination. Customer records describe billing/consignment contacts; a customer row does not grant access.

Public tracking reads only non-deleted shipments with explicitly published tracking events. It exposes the published-event state, not private operational state or contact/financial fields. Public support AI also uses that projection rather than unrestricted shipment records.

Shipment, manifest and dispatch writes use transaction locks and transactional audit insertion for the repaired workflows. Finalized loads cannot be edited. Assigned active shipments cannot be silently removed. Chargeable weight is computed on the server from locked cargo fields. Cargo movement across multiple legs still requires an explicit leg-completion model; see the audit's release blockers.

Invoice persistence owns integer-paise calculations, all six charge lines, tax rounding, payment validation and balance/status derivation. The multi-step booking flow uses a request UUID and advisory lock to save a shipment, invoice, initial public booking event and audit together; a retried request returns its existing invoice. Financial edits do not turn a previously paid status into a new payment. Admin voiding preserves records and rejects paid invoices requiring reconciliation.

Fleet positions are stored in the private `fleet_telemetry` table, keyed to registered active vehicles. Only newer observations replace the last position; the staff view excludes inactive vehicles and observations older than fifteen minutes. The mobile integration credential is mandatory. It does not provide per-driver or per-device assignment isolation.

## Storage and documents

`cargo-documents` is a private bucket. Record uploads accept signature-checked PDF/JPEG/PNG up to 5 MB, are scoped to an existing shipment/manifest, require a same-origin staff request and are audited. Download paths are parsed and reauthorized. Files are served as attachments with `nosniff`; selecting a file does not imply upload. Audit failure compensates an upload where possible and explicitly reports saved-but-unreconciled state if cleanup also fails.

Staff avatars use a separate `staff-avatars/{userId}/...` prefix within the private bucket, JPEG/PNG/WebP signature checks, a 2 MB cap and a guarded own-user image endpoint. Profile and audit writes share a database transaction. No public avatar bucket is assumed.

## Support and communication

Public contact requests save the ticket, audit and two durable jobs in one transaction. `background_jobs` uses deduplication, row locks, expiring leases, stale-worker protection and bounded retries. Next.js `after` starts processing after commit; the authenticated `/api/cron/communications` route recovers pending work. Customer acknowledgment email uses a stable Resend idempotency key; an uncertain retry outside the provider retention window requires manual review. Triage failure remains visible, and SLA deadlines are anchored to ticket receipt rather than retry time. The communications workspace reports pending/failed jobs and provider attempts. Production scheduling, capacity and provider acceptance still need validation.

WhatsApp sends first persist a pending attempt. Provider requests have a timeout and do not automatically resend after an ambiguous response. Accepted IDs update the same attempt; a post-send logging failure is reported to Sentry for reconciliation. Signed webhooks validate bounded payloads, preserve monotonic delivery state and save inbound messages under replay and phone locks. Contact/ticket/reply/audit changes and the triage job commit together. Automatic inbound acknowledgments remain best-effort. A skipped, rejected or merely accepted send is never described as delivered.

Invoice sending validates the recipient against the canonical billing/sender record and regenerates the current PDF. A saved invoice or accepted provider send stays successful if a later rendering/status step fails, with a separate warning. Email replies derive recipient and subject from the saved ticket. AI auto-reply remains disabled by default; its outbound persistence and real-provider acceptance require further work before activation.

Staff workspace activity is fetched through a guarded server action on initial load, window focus and a visible-window interval. Ticket lists refresh through the server on focus or explicit refresh. They do not depend on an anonymous Supabase Realtime session.

## UI and routes

Public: `/`, `/services`, `/services/air-cargo`, `/services/surface-cargo`, `/shipping-guide`, `/about`, `/contact`, `/track`, `/feedback`, `/terms`, and staff `/signin`.

Staff: operations overview, shipments/detail, dispatch, manifests, warehouse/audit, tracking/scanner, fleet, hubs, invoices, communications, customer ledger, pricing, support, analytics, service levels and integrations. Driver/delivery pages are staff tools; driver-specific assignment isolation remains outside the verified release scope. Public navigation keeps Staff access in the footer utility row rather than the customer task navigation.

Tailark Veil and official shadcn Radix supply the interface, with shared Nordic Lagom tokens. [UI sources](UI-SOURCES.md) record provenance. [Route-source inventory](../artifacts/route-source-audit.json) records current statically reachable modules. Storybook sample data is isolated from live operations.

## Release evidence

Sentry records critical failures. The private health endpoint exposes configuration/health only to authorized callers; OpenRouter authentication is checked against its private key endpoint rather than its public model catalog. Local type, lint, style, unit, browser and build checks are separate from authenticated staging acceptance and production clearance. The [control-center audit](control-center-audit-2026-09-07.md) records the latest changes and remaining gates. Hosted migration baseline, restore testing, multi-leg state, provider acceptance and actual deployment identity remain release concerns.
