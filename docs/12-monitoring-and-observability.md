# Monitoring and Observability

## Sentry

Sentry is the primary exception capture layer for:

- auth route failures
- public invoice PDF failures
- portal action failures
- AI triage and responder failures
- WhatsApp relay and webhook correlation failures

## Health Endpoint

`GET /api/health` reports:

- database reachability
- OpenRouter configuration
- WhatsApp relay and webhook configuration

Access:

- dashboard-authenticated users
- cron-style bearer access with `CRON_SECRET`

## Support and Messaging Audit Surfaces

Email:

- `email_notifications` stores dispatch attempts and provider ids.

WhatsApp:

- `message_outbound` stores provider ids, Meta ids, message type, related ticket or AWB, status, failure reason, and status timestamps.
- `whatsapp_subscribers.last_inbound_at` is the conversation-window reference point.

AI and SLA:

- `audit_log` captures automated ticket routing and responder activity.

## Dead Letter Queue

Failed external operations are written to `dead_letter_queue`.

Use this for:

- relay failures that exhausted retries
- transient provider outages
- replay and operational investigation

Do not replace the DLQ with one-off resend code paths.

## Release Observability Gates

Before production release, confirm:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm stylelint`
4. `pnpm test:unit`
5. `pnpm build`
6. smoke verification of landing, portal, dashboard, and WhatsApp webhook challenge
