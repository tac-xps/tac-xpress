# TAC-XPRESS documentation

This directory documents the code that exists in this repository. When code and prose disagree, code is authoritative until the documentation is corrected.

## Product and engineering guides

| Guide | Purpose |
| --- | --- |
| [Current control-center audit](./control-center-audit-2026-09-07.md) | Latest invoice, communications, fleet, UI and deployment evidence; open release gates. |
| [Earlier Nordic production audit](./nordic-lagom-audit-2026-09-07.md) | Earlier access, transaction and redesign evidence, retained as history. |
| [Route source inventory](../artifacts/route-source-audit.json) | Indexed application routes and runtime coverage boundaries. |
| [Architecture](./ARCHITECTURE.md) | Request perimeter, identity, data access, support, WhatsApp, and route surfaces. |
| [Getting started](./02-getting-started.md) | Local setup, environment variables, and verification. |
| [Data model](./03-database-schema.md) | Drizzle and Supabase ownership boundaries. |
| [Authentication](./04-authentication-and-authorization.md) | Current staff roles and retired customer access. |
| [API reference](./05-api-reference.md) | Current route handlers, webhooks, and server actions. |
| [Design system](./DESIGN.md) | Nordic Lagom tokens and Tailark/shadcn source rules. |
| [UI components](./06-ui-components.md) | Shadcn composition, component states, and Storybook expectations. |
| [Design migration](./15-nordic-lagom-migration.md) | Replacing legacy visual treatments safely. |
| [Operations](./OPERATIONS.md) | Staff operating model and release checks. |
| [Deployment](./10-deployment.md) | Deployment configuration and release gates. |
| [Security](./11-security-and-compliance.md) | Perimeter, secrets, RLS, and webhook controls. |
| [Observability](./12-monitoring-and-observability.md) | Health checks and Sentry expectations. |

Historical audits, plans, and superseded guidance live in `docs/old_docs`. They are preserved for context and are not active standards.
