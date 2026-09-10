# Architecture overview

TAC-XPRESS is a Next.js 16 App Router application using TypeScript, Tailwind CSS v4, Shadcn UI, Drizzle, Supabase, NextAuth, Arcjet, Sentry, Resend, and a WhatsApp relay.

## Request flow

`proxy.ts` is the application perimeter. It applies Arcjet protection, fails closed in production without a valid Arcjet key, redirects unauthenticated dashboard users to `/signin`, and hides test-only routes unless explicitly enabled outside production.

## Application surfaces

- Public: explanatory service pages, preparation guidance, AWB tracking, contact and feedback. The invoice PDF job endpoint requires a signed, invoice-specific token despite its legacy public path.
- Legacy portal paths: current staff guards and redirects to the dashboard; no customer sessions.
- Dashboard: staff operations for shipments, dispatch, manifests, fleet, warehouse, tracking, messages, invoices, customers, pricing, analytics, and metrics.
- Integrations: carrier and WhatsApp webhooks, telemetry, health, documents, and authenticated operational APIs.

## Boundaries

Server Components perform trusted reads. Server Actions validate and authorize mutations. Route handlers own HTTP, webhook, stream, and document contracts. Drizzle owns staff-facing operational domains; Supabase supports staff identity, private storage, ticket and relay data; public tracking is a constrained server projection. There is no customer portal.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the current subsystem map.



