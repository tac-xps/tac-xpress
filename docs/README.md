# TAC-XPRESS documentation

This directory documents the code that exists in this repository. When code and prose disagree, code is authoritative until the documentation is corrected.

## Product and engineering guides

| Guide | Purpose |
| --- | --- |
| [Engineering and release evidence](./engineering/production-readiness.md) | Current release gates, engineering findings, and verification. |
| [September control-center audit](./control-center-audit-2026-09-07.md) | Historical invoice, communications, fleet, UI, and deployment evidence. |
| [Earlier Nordic production audit](./nordic-lagom-audit-2026-09-07.md) | Earlier access, transaction and redesign evidence, retained as history. |
| [Route map](./engineering/route-map.md) | Registered routes, access requirements, and runtime coverage. |
| [Architecture](./engineering/architecture.md) | Current application boundaries, integrations, and data flow. |
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
