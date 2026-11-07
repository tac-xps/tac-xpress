# TAC-XPRESS

TAC-XPRESS manages cargo exclusively between New Delhi and Imphal, in both directions. It combines a provisioned admin/staff workspace, public tracking, invoices, dispatch, warehouse workflows, WhatsApp relay, and support triage in one Next.js application.

The operations workspace is for provisioned admins and staff. Customers use the public website, tracking and contact without an account. The current interface follows Nordic Lagom using Tailark Veil and official shadcn components.

See the [current audit](docs/nordic-lagom-audit-2026-09-07.md) for verified changes and remaining production gates.

See the [dashboard production audit](DASHBOARD-PRODUCTION-AUDIT.md) for the November 2026 fixes, checks, and outstanding release gates.

## Start here

```bash
pnpm install
pnpm dev
```

Copy `.env.example` to `.env.local` and provide the Supabase, database, auth, Arcjet, and provider credentials required by the features you run.

## Verification

```bash
pnpm typecheck
pnpm lint
pnpm stylelint
pnpm test:unit
pnpm build
```

## Documentation

The canonical guide index is [docs/README.md](docs/README.md). `docs/old_docs` is historical reference only and must not be treated as current architecture or design guidance.


