# API and server-action reference

## Route handlers

Current route handlers live under `app/api`. They provide NextAuth, health, chat, documents, fleet telemetry, customer/driver/vehicle/hub lookup, tracking streams, invoice PDF generation, carrier webhooks, and WhatsApp webhooks.

## Contract rules

- Dashboard handlers use `requireDashboardApi` unless they are explicitly public or integration-authenticated.
- Carrier and WhatsApp webhooks verify their HMAC or verification token before parsing or processing payloads.
- Cron and health probes require the configured bearer secret or a dashboard session.
- Request payloads use Zod where structured input is accepted; failure responses are generic and safe for callers.

## Staff document and lookup endpoints

| Endpoint | Contract |
| --- | --- |
| `GET /api/customers`, `/api/drivers`, `/api/vehicles`, `/api/hubs` | Current staff role; bounded `query`, optional UUID `id`, at most 20 named results. Invalid selected IDs return 400. |
| `GET /api/cargo-documents/{shipments\|manifests}/{id}` | Current staff role and an existing record; private document list capped at 100. |
| `POST /api/cargo-documents/{shipments\|manifests}/{id}` | Same-origin staff multipart upload. Signature-checked PDF/JPEG/PNG, at most 5 MB including a bounded request envelope. Success records storage and audit state explicitly. |
| `GET /api/documents` | Reauthorized private cargo path, safe attachment and `nosniff` response. |
| `GET /api/staff-avatar/{id}?file={uuid}.{ext}` | Current owner staff identity, validated JPEG/PNG/WebP filename and private no-store response. |
| `GET /api/documents/download?id={invoiceId}` | Current staff access to an invoice-specific PDF job. |
| `GET /api/public/invoice-pdf` | Requires a valid short-lived signed job; the public path is not anonymous financial access. |

Unauthorized staff APIs return 401; authenticated disallowed roles return 403. A protection outage can return 503 at the proxy before route authorization. Record validation and provider/storage errors remain distinct from a successful empty result.

The legacy contract generator infers examples from `mocks/cargo-data.ts`. Its output is not the authoritative live HTTP specification.

## Communications and fleet integrations

| Endpoint | Contract |
| --- | --- |
| `GET /api/cron/communications` | Exact configured `CRON_SECRET` bearer credential. Claims up to two durable support jobs per invocation. Finite provider timeouts, lease-based recovery, no-store response. |
| `GET /api/fleet/telemetry` | Current staff authorization. Up to 1,000 registered active vehicles with observations no older than fifteen minutes. Reads persisted Postgres positions. |
| `POST /api/fleet/telemetry` | Exact non-empty `MOBILE_API_SECRET` bearer credential. Bounded 8 KB JSON, coordinate/heading/speed validation and at most five minutes of future clock skew. UUID or registration identifies an active vehicle; older observations cannot overwrite newer positions. |
| `GET /api/webhooks/whatsapp` | Requires the configured verification token; missing configuration rejects the challenge. |
| `POST /api/webhooks/whatsapp` | HMAC over the raw request body, 128 KB envelope and at most twenty events. Malformed input fails before persistence. Persistence failures return 503 for provider retry; replayed message IDs do not create duplicate inbox records. |
| `POST /api/chat` | Public, abuse-controlled streaming chat. Validates user/assistant text transport, bounds history to twelve messages, uses only published shipment context and has a finite upstream deadline. Provider failure supports a visible retry/contact recovery path. |

Invoice WhatsApp delivery is a guarded server action, not an unauthenticated HTTP send endpoint. The action validates the canonical recipient and saves an outbound attempt before contacting the relay. Provider acceptance, delivery and read receipts are separate states. A timeout must be reconciled against provider history before a manual resend.

## Server actions

Actions under `app/actions` and dashboard feature directories own form mutations and trusted reads. They must validate input, derive identity from the session, write audit records where appropriate, revalidate affected paths, and report unexpected failures to Sentry.

For exact request and response shapes, inspect the route or action source and its adjacent validation schema; this repository does not currently publish a generated external API specification.
