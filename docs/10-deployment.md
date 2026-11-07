# Deployment and release process

TAC-XPRESS deploys as a Next.js application with Supabase-backed services and external providers. Production must fail closed when `ARCJET_KEY` is missing or placeholder.

## Required configuration

Set production values for staff auth, Supabase/database access, Arcjet, cron/mobile secrets, invoice signing, Sentry, and enabled providers. NEXT_PUBLIC_APP_URL must be the HTTPS website origin, not the Supabase API or MCP URL. Disable E2E bypass flags. Custom portal signing is no longer used. Use `.env.example` for environment names and keep values in the deployment secret store.

`pnpm verify:production-env` loads `.env.local` when present; already supplied environment values take precedence. In deployment CI, run it with the platform's production variables and without a local development env file. A local pass is configuration validation only. Actual sender-domain, WhatsApp template/callback, PDF rendering and database restore acceptance remain separate.

The communications worker is scheduled daily (`0 1 * * *`) in `vercel.json` for Vercel Hobby tier compatibility. High-frequency sweeps (e.g. every 5 minutes) require Vercel Pro/Enterprise or an external scheduler calling the authenticated `/api/cron/communications` endpoint. Monitor pending and failed jobs in the communications workspace and verify throughput before launch.

The Operations Recovery GitHub workflow schedules recovery every fifteen minutes. Its reviewed working copy calls communications and SLA endpoints.
It requires HTTPS, bounded requests, HTTP 200, and valid JSON response contracts. Configure repository `CRON_SECRET` and optional `APP_URL`.
The default origin is `https://tac-xpress-five.vercel.app`. Actual communications execution is verified at baseline `6baaa95`; publishing the SLA addition remains pending.
The daily Vercel schedules remain fallback sweeps. Verify both endpoints and measure latency after publishing the new workflow.

Configure LeminAI outbound messaging with `WHATSAPP_ENABLED=true`, `WPBOX_API_TOKEN`, and `WPBOX_USER_ID`. `WPBOX_BASE_URL` defaults to `https://chat.leminai.com`.
Meta webhook verification uses the separate `WHATSAPP_APP_SECRET` and `WHATSAPP_VERIFY_TOKEN` pair. These are not outbound relay credentials.
The environment validator warns when both Meta credentials are absent and rejects a partial pair. Callback authentication and receipt acceptance remain release checks.
Confirm LeminAI's documented callback contract before connecting the relay to the Meta endpoint. Do not bypass signature verification.

Configure an approved `OPS_NOTIFICATION_EMAIL` or `ADMIN_EMAIL` before release. SLA checks reject missing operator recipients.
The owner-approved existing mailbox is configured temporarily in local and Vercel production/preview settings. Keep personal recipient values out of Git.
The updated local Resend key authenticates, but Gmail cannot serve as its sender domain. Complete the [sender setup](RESEND-SETUP.md) before email acceptance.
`tacxpress.in` has pending verification records and returned NXDOMAIN during this audit. Do not substitute a recipient change for sender verification.
Reconcile uncertain DLQ provider outcomes before releasing abandoned recovery claims; never clear a claim merely to enable another send.

Vercel production/preview configuration now stores the verified production origin and disables both E2E bypass flags.
Preview document requests use the actual preview hostname. Environment changes affect subsequent deployments, not the existing deployment.

The [dashboard audit](../DASHBOARD-PRODUCTION-AUDIT.md) records the current local validation and remaining hosted acceptance gates.

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

The configured project is `ujyellrhwhqjmfponhuz`. Its [current ledger inventory](audit-evidence/migration-ledger-2026-11-03.json) records eight hosted versions and 33 unrecorded historical files.
Branch creation requires Pro or above and was rejected without creating a resource. Follow the [restore acceptance runbook](restore-acceptance.md).

The owner-approved Free staging project is now `zuevgwqmphbvgnwhvvnq` (`tac-xpress-staging`, Sydney).
Its restored public schema matches production across twelve catalog comparisons. Hosted synthetic rollback, RLS, concurrency, and Data API checks pass.
Production credentials remain in `.env.local`. The ignored `.env.staging.local` is separate and disables outbound providers.
Its API credentials and session-pooler connection pass live verification. Local acceptance uses an isolated source copy without production environment files.
Nine bounded application cases pass, including 24 admin routes, access revocation, billing, private PDFs, mobile navigation, and line-haul handovers.
The database client now honors the configured URL. Transaction-pooler stalls require independent verification before a serverless release.
The local PDF test uses an explicit browser executable; Vercel Chromium packaging still needs deployment acceptance.
The local Supabase CLI uses another account; do not use its current login to link or migrate these projects.
No production customer data, Auth settings, Storage objects, provider credentials, or sessions were copied.
The [staging receipt](audit-evidence/staging-acceptance-2026-11-03.json) records the verified scope and remaining gates.

## Current remediation order

Follow the [release remediation plan](release-remediation-plan.md) for concrete actions and pass criteria.
The later 2026-11-03 read-only probes pass on both staging pooler ports; hosted workload acceptance remains incomplete.
Team-scoped Vercel and GitHub access now work. The isolated release branch is `codex/staging-release-20261103`.
Forty-seven branch-specific preview settings isolate staging and disable outbound providers. Production settings remain unchanged.
Actual serverless transaction-pooler requests stalled despite short probes passing. Session pooling on port 5432 passes the hosted route check.
The serverless client now budgets one connection per instance. Configured ports remain explicit; no automatic port rewrite occurs.
The protected-preview PDF fix forwards the deployment cookie only to the invoice origin and strips rendering credentials from external requests.
The owner deferred sender verification and email delivery acceptance from this release scope.
The production checker now rejects common personal-mailbox senders, including the optional `RESEND_FROM_EMAIL` override.

The active Supabase history now matches all eight hosted versions. Thirty-three historical files remain archived without ledger changes.
Restricted local recovery matches 55 application/Auth tables and recovers seven Storage files. Shared staging contains synthetic records only.
Use the current [release plan](release-remediation-plan.md) for final gate results. Earlier paragraphs record historical acceptance boundaries.
