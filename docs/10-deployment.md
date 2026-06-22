# Deployment

## Target

Tac-Xpress is deployed to Vercel.

## Required Production Environment

Core:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`
- `PORTAL_SESSION_SECRET`
- `NEXT_PUBLIC_APP_URL`

Perimeter:

- `ARCJET_KEY`

Messaging and support:

- `RESEND_API_KEY`
- `FROM_EMAIL`
- `INVOICE_PDF_SIGNING_SECRET`
- `WHATSAPP_ENABLED`
- `WPBOX_API_TOKEN`
- `WPBOX_BASE_URL`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`

AI and telemetry:

- `OPENROUTER_API`
- `OPENAI_MODEL` if overridden
- `POSTHOG_KEY` and `POSTHOG_HOST` if analytics are enabled

## Deployment Sequence

1. Merge a green pull request.
2. Confirm Supabase migrations are applied, including the ticket and WhatsApp hardening migrations.
3. Confirm all required Vercel environment variables are set.
4. Deploy to preview.
5. Run the smoke procedure below.
6. Promote to production only after the smoke gates pass.

## Pre-Deploy Gates

```bash
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:unit
pnpm build
```

## Smoke Procedure

Run from a clean process state:

1. Ensure no other `next build` process is running.
2. Run `pnpm build`.
3. Start the production server with `pnpm start`.
4. Verify:
   - `/`
   - `/signin`
   - `/portal`
   - `/track`
   - `/dashboard`
   - `/dashboard/messages`
   - `/dashboard/invoices`
5. Verify `/api/webhooks/whatsapp` GET challenge handling.
6. If relay credentials exist, verify one invoice WhatsApp send in a non-production-safe test context.

## Rollback Guidance

- Disable outbound WhatsApp quickly with `WHATSAPP_ENABLED=false`.
- If the perimeter breaks in production, treat missing `ARCJET_KEY` as a release blocker, not a feature regression.
- Rotate `AUTH_SECRET`, `PORTAL_SESSION_SECRET`, and webhook secrets after any suspected exposure.
