# Data model and persistence

## Ownership

Drizzle is the typed persistence layer for staff-owned operational data: users, shipments, invoices, manifests, fleet, hubs, pricing, and tracking events. Supabase clients serve staff authentication, tickets, private Storage, WhatsApp relay records and AI-support workflows. Public tracking uses a constrained server projection. There are no customer sessions.

## Source of truth

- `lib/db/schema.ts` defines the Drizzle schema.
- `drizzle/` contains Drizzle migration history.
- `supabase/migrations/` contains Supabase policy and feature migrations.
- Generated and hand-maintained database-aligned types must agree with these sources before release.

## Security rules

Every exposed Supabase table requires RLS with an explicit access model. Service-role access is server-only. Public tracking must return a deliberately projected response; an RLS row policy does not hide sensitive columns.

## Migration workflow

Create migrations through the appropriate tool, review SQL and RLS impact, validate locally or in staging, then deploy in the release workflow. Do not edit applied migrations. Use expand/contract changes for production-compatible schema evolution.

