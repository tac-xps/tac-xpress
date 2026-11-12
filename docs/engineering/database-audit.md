# Database audit

Reviewed 2026-11-13 against local source at `98f3e42` and the exact hosted project configured in the source checkout's `.env.local`. Hosted inspection used read-only migration, catalog, and advisor calls. It read no application records or credentials.

## Data model and access

| Area | Verified source or catalog evidence |
| --- | --- |
| Database path | `lib/db/index.ts` uses Postgres.js and Drizzle on the server, prefers the configured pooler URL, disables prepared statements, and limits production/serverless clients to one socket per instance. Production queries require a configured connection. |
| Staff identities | Supabase Auth verifies credentials. NextAuth issues the app session. The current active `public.users` row supplies workspace authorization. `profiles` stores preferences and display data separately. |
| Freight | `shipments` and `tracking_events` model the cargo record and event history. `manifests`, `manifest_items`, and `manifest_item_handoffs` model assigned cargo and receipt. Handoffs have a receiver constraint and a partial unique receipt index. Historical `shipment_legs` is separate from the active handoff workflow. |
| Finance | `invoices` links shipment and customer records. Application code persists price and document snapshots and computes integer-paise amounts server-side. |
| Support and operations | Tickets, replies, SLA policies, email and outbound message state, jobs, DLQ, and audit tables support customer communications. Fleet telemetry references the canonical vehicle registry. |
| Current hosted catalog | 28 public tables, 28 primary keys, 30 foreign keys, 8 unique constraints, and 17 check constraints. Public has no ordinary or materialized views. Auth has 27 managed tables and Storage has 10 managed tables. |

Schema and workflow sources are [Drizzle definitions](../../lib/db/schema.ts), [current baseline](../../supabase/baselines/20261103_current_public.sql), and the [migration reconciliation](../migration-baseline-decisions.md).

## Migration and restore evidence

- **VERIFIED** — `pnpm audit:supabase-migration-history` scanned eight files and exited 0. Hosted version/name pairs match all eight active files. An MD5 comparison also matched all eight recorded SQL statements after stripping comment-only lines and whitespace on both sides. This comparison checks normalized text. Four of eight also matched after only line-ending and trailing-whitespace normalization.
- **VERIFIED** — The 33 archived versions belong outside the active sequence. The earlier duplicate `0018` incident has been resolved. Drizzle maintains a separate journal under `drizzle/meta/`.
- **VERIFIED** — The checked-out baseline matches the recorded SHA-256 after normalizing Windows CRLF to LF. The current hosted `ensure_rls` event trigger is enabled for table creation, create-as-select, and select-into. Follow the [baseline runbook](../migration-baseline-decisions.md) for a fresh managed project.
- **VERIFIED historical evidence** — The November 3 receipts record a fresh baseline restore, restricted recovery of all 55 application and Auth tables, 11 synthetic rollback and constraint assertions, 61 RLS and access assertions, 6 Data API checks, and concurrent allocation and DLQ claim checks. The November 4 offsite receipt records a later isolated restore. The original checkout retains the receipts under `docs/audit-evidence/`. [Restore acceptance](../restore-acceptance.md).
- **BLOCKED** — This audit could not repeat a fresh isolated restore on this machine. Docker and `psql` were absent from PATH, and the installed Supabase shim could not start its executable. Use a disposable PostgreSQL 17/Supabase target and the existing runbook for a current release-candidate restore.

## RLS, grants, storage and routines

- **VERIFIED** — RLS is on for 28/28 public and 10/10 Storage tables. Twenty-seven public tables and all Storage tables have no matching data policies. This is consistent with server-side access and default-deny for API roles. Data privileges still exist on 18 tables for `anon` and 20 for `authenticated`, so monitor privileges and policies together.
- **VERIFIED** — The two public policies both concern `profiles`. Authenticated SELECT and UPDATE require `auth.uid() = id`, and UPDATE checks the new row too. Column privileges allow name, avatar, and preference updates and exclude `id` and `role`. Workspace authorization reads the active role from `users`.
- **VERIFIED** — The hosted `cargo-documents` bucket is private. The `supabase_realtime` publication contains zero tables. No live file contents, row contents, or Auth identities were read.
- **VERIFIED** — `get_resolution_metrics` and `get_sla_breach_rate` run as invoker with a set search path. Both are executable by API roles, and their source tables have default-deny RLS. `rls_auto_enable` runs as definer with a catalog-only path and no API-role EXECUTE. The trigger-only `update_first_reply` also has an explicit path. Review unnecessary routine EXECUTE as part of DB-01.
- **UNVERIFIED** — Direct positive and negative role/ownership behavior on the current release candidate requires synthetic identities on approved staging. The live catalog establishes deployed metadata, and the November 3 fixture receipt is historical. [Supabase Data API security](https://supabase.com/docs/guides/api/securing-your-api).

## Performance and follow-up

| ID | Finding and status | Acceptance criteria |
| --- | --- | --- |
| DB-01 · P2 | **VERIFIED**, open. Security advisor flags `pg_trgm` in `public`. The existing restore uses that location. Current grants and callable invoker metrics provide scope for a least-privilege review. | Confirm extension relocation support, stage any extension change against indexed search, and verify API and server permissions against the documented role matrix. [Extension advisory](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public). |
| DB-02 · P2 | **VERIFIED**, open. Performance advisor reports six foreign keys without covering indexes, one on `manifest_item_handoffs.received_by` and five on legacy `shipment_legs`. The same snapshot reports 56 unused indexes. | Measure applicable queries, parent-update/delete behavior, and index usage over a representative interval in approved staging. Preserve indexes until workload and constraint evidence supports a change. [Foreign-key advisory](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys), [index-usage advisory](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index). |
| DB-03 · P1 | **UNVERIFIED** for the candidate. The November 4 staging receipt passed a bounded concurrent staff lookup workload on runtime `8676eaa`. Production-like sustained capacity, pooler behavior under current traffic, and release-candidate restore remain open. | Re-run the bounded role/custody suite and restore on isolated staging for the candidate. Measure sustained capacity against the release traffic profile. The original checkout retains `hosted-release-acceptance-2026-11-04.json`. |

Hosted schema, grants, policies, storage, extensions, and history were inspected on November 13. The audit made no database or infrastructure changes.
