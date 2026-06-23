# Getting Started

## Prerequisites

- Node.js 20+
- pnpm 9+
- Supabase project access
- Vercel environment access for production verification

## Install

```bash
pnpm install
cp .env.example .env.local
```

## Minimum Local Environment

Core app:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`
- `PORTAL_SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

Operational integrations:

- `OPENROUTER_API`
- `RESEND_API_KEY`
- `FROM_EMAIL`
- `INVOICE_PDF_SIGNING_SECRET`

WhatsApp relay:

- `WHATSAPP_ENABLED`
- `WPBOX_API_TOKEN`
- `WPBOX_BASE_URL`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`

Perimeter:

- `ARCJET_KEY`

## Run Locally

```bash
pnpm dev
```

Open:

- `/`
- `/signin`
- `/portal`
- `/track`
- `/dashboard`

## Database and Schema

Apply migrations in the target Supabase environment before verifying portal, support, or WhatsApp flows.

For local schema operations:

```bash
pnpm db:migrate
pnpm db:seed
```

## Local Verification

Static gates:

```bash
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:unit
```

Production build gate:

```bash
pnpm build
```

If a previous Next build process still owns the build lock, terminate it before rerunning `pnpm build`.

## Smoke Procedure

1. Verify `/` returns `200`.
2. Verify `/signin` renders.
3. Verify `/portal` renders and accepts AWB plus email.
4. Verify `/track` renders.
5. Verify `/dashboard` redirects when unauthenticated.
6. Verify `/api/webhooks/whatsapp` GET challenge handling with a valid token.
