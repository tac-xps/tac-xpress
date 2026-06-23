# Tac-Xpress Architecture

## 1. Request Perimeter

- `proxy.ts` is the single Next.js 16 perimeter entry point.
- Arcjet runs here for shield, bot detection, and sliding-window protection.
- Production fails closed when `ARCJET_KEY` is missing or still set to the placeholder.
- Dashboard routes redirect to `/signin` when no NextAuth session exists.
- Public invoice rendering can bypass the normal perimeter only with the derived `x-puppeteer-bypass` header.

## 2. Authentication Model

Tac-Xpress uses two auth systems on purpose:

- Dashboard and admin routes use NextAuth credentials. The credentials provider authenticates against Supabase Auth, then enriches the session with the app role from the `users` table.
- Customer portal and public self-service flows use Supabase-generated signup or magic links plus the signed `portal_session` cookie.

Canonical secrets:

- `AUTH_SECRET` is the production auth secret.
- `NEXTAUTH_SECRET` is supported only as a compatibility alias.
- `PORTAL_SESSION_SECRET` signs the customer portal cookie.

## 3. Data Access

- Drizzle is the typed query layer for operator-owned domains such as `users`, `shipments`, `invoices`, `manifests`, and fleet tables.
- Supabase clients are the source of truth for portal/public surfaces, ticketing, tracking reads, AI support flows, and WhatsApp relay logs.
- The ticket contract keeps `tickets.category` canonical for triage values only: `delay`, `damage`, `billing`, `general`, `lost`.
- Raw intake labels are stored separately in `tickets.intake_category`.

## 4. Support Pipeline

Landing page:

- Public users can submit a support ticket from the landing page.
- The flow uses a honeypot field and a process-local rate limiter.
- Landing submissions now map into canonical triage categories before insert and keep the original label in `intake_category`.

Portal:

- Portal users authenticate with AWB plus email, receive a signed cookie session, and can view shipments, invoices, and tickets tied to their email.

AI triage:

- `app/actions/ai-triage.ts` classifies tickets into category and priority.
- `app/actions/ai-responder.ts` generates optional lower-risk responses.
- SLA logic and notification fan-out run after triage.

## 5. WhatsApp Relay

Tac-Xpress uses WPBox/Lemin as the outbound relay layer.

Shared relay:

- `lib/whatsapp/config.ts` owns the provider env contract and template metadata.
- `lib/whatsapp/service.ts` owns phone normalization, retries, DLQ handoff, outbound logging, inbound subscriber updates, and status correlation.

Outbound callers:

- Invoice sends
- Driver route messages
- AI-generated customer replies
- Proactive shipment status updates
- Inbound acknowledgements

Inbound handling:

- `app/api/webhooks/whatsapp/route.ts` verifies Meta signatures.
- Inbound customer messages update `whatsapp_subscribers.last_inbound_at`.
- Repeated customer messages append to an existing active WhatsApp ticket when one exists.
- Proactive 24-hour window decisions are based on the customer's last inbound activity, not the app's last outbound send.

Logging:

- `message_outbound` stores provider ids, Meta ids, message type, template metadata, related ticket or AWB, status, failure reason, and the latest status timestamp.
- Failed external sends still flow through the dead-letter queue for replay and investigation.

## 6. Public and Portal Surfaces

Public:

- `/` landing page
- `/track`
- `/api/public/invoice-pdf`

Portal:

- `/portal`
- `/portal/track`
- `/portal/tickets`
- `/portal/invoices`

Dashboard:

- `/dashboard`
- `/dashboard/analytics`
- `/dashboard/metrics`
- `/dashboard/shipments`
- `/dashboard/dispatch`
- `/dashboard/manifests`
- `/dashboard/fleet`
- `/dashboard/warehouse`
- `/dashboard/tracking`
- `/dashboard/messages`
- `/dashboard/invoices`
- `/dashboard/customers`
- `/dashboard/pricing`

## 7. Monitoring and Release Gates

- Sentry captures critical route, action, and relay failures.
- `/api/health` reports database, OpenRouter, and WhatsApp configuration status.
- Production release verification requires `pnpm typecheck`, `pnpm lint`, `pnpm stylelint`, `pnpm test:unit`, and a clean `pnpm build`.
- Release remains a no-go until secret handling, ticket contracts, WhatsApp relay consistency, and docs or CI drift are closed together.
