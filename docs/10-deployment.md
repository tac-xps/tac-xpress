# Deployment and release process

TAC-XPRESS deploys as a Next.js application with Supabase-backed services and external providers. Production must fail closed when `ARCJET_KEY` is missing or placeholder.

## Required configuration

Set production values for staff auth, Supabase/database access, Arcjet, cron/mobile secrets, invoice signing, Sentry, and enabled providers. NEXT_PUBLIC_APP_URL must be the HTTPS website origin, not the Supabase API or MCP URL. Disable E2E bypass flags. Custom portal signing is no longer used. Use `.env.example` for environment names and keep values in the deployment secret store.

`pnpm verify:production-env` loads `.env.local` when present; already supplied environment values take precedence. In deployment CI, run it with the platform's production variables and without a local development env file. A local pass is configuration validation only. Actual sender-domain, WhatsApp template/callback, PDF rendering and database restore acceptance remain separate.

The communications worker is scheduled every five minutes in `vercel.json`. This requires Vercel Pro/Enterprise or an external scheduler calling the authenticated cron endpoint; Hobby does not support that frequency. Monitor pending and failed jobs in the communications workspace and verify throughput before launch.

## Release gates

```bash
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:unit
pnpm build
pnpm test:e2e
pnpm verify:production-env
```

For UI releases also build Storybook and review visual changes. Verify the landing page, sign-in redirect, public tracking, retired portal denial, and authenticated admin/staff dashboard flows against the actual production perimeter.

## Database changes

Review migration order, RLS impact, and rollback compatibility before deploy. Apply migrations through the approved Supabase/Drizzle workflow; do not edit migration history after application.

The earlier September audit applied narrow security/index repairs. The control-center follow-up additionally applied durable communication tables, WhatsApp inbox indexes and private fleet telemetry. Older hosted migration history was absent; do not replay all historical migrations or run db:push/reset against the populated project. Reconcile in staging and demonstrate backup restoration first. [Current release gates](control-center-audit-2026-09-07.md).
