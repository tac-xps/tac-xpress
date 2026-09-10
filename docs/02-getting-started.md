# Getting started

## Prerequisites

- Node.js 22.13 or later and pnpm 9.4 (the version pinned in package.json).
- A Supabase project and PostgreSQL connection for data-backed flows.
- Provider credentials only for the features you intend to exercise: Arcjet, Resend, OpenRouter, Mapbox, WhatsApp/WPBox, and Sentry.

## Local setup

```bash
pnpm install
Copy-Item .env.example .env.local
pnpm dev
```

Set `AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`, Supabase URL/keys, and `DATABASE_URL` before testing authentication or operational pages. Portal sessions use verified Supabase identities; the retired `PORTAL_SESSION_SECRET` signer is no longer used. Never place service-role keys in `NEXT_PUBLIC_*` variables. `NEXT_PUBLIC_APP_URL` is the website origin, not the Supabase API or MCP URL.

## Daily checks

```bash
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:unit
pnpm build
```

For local Supabase workflows, use the CLI help before running a command and start the local stack before querying migrations.
