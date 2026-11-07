# Migration baseline reconciliation

Checked: 2026-11-03. Production: `ujyellrhwhqjmfponhuz`. No production ledger entries were changed.

## Verified baseline

The hosted ledger contains eight versions. The active Supabase directory now contains those same eight versions.
Thirty-three unrecorded historical versions and their old metadata are preserved in `supabase/migrations-archive/pre-20261103/`.
Their bytes and per-file checks remain recorded. Archiving does not claim historical statements ran.
The approved public-schema baseline restores into fresh PostgreSQL 17.11 and preserves 28 RLS-enabled tables.
The public-schema dump omits event triggers. The complete baseline now includes `ensure_rls`.
The [packaged baseline](../supabase/baselines/20261103_current_public.sql) rejects populated targets before changing anything.
Fresh PostgreSQL verification proves automatic RLS on future tables and zero visible probe rows for anonymous users.

Complete baseline SHA-256: `468000af9230df8aaabefc4448b62bbcbc62e4251762430f9e8a95bef4643734`.
The earlier schema-only source baseline remains recorded as `2512242effac868cfc36d2de5b30dbfc6bd2b5be16810dda788417d46f2bbc5b`.
The [per-file comparison](audit-evidence/migration-reconciliation-2026-11-03.json) records named-object checks for all 33 versions.
The [synthetic recovery receipt](audit-evidence/synthetic-recovery-2026-11-03.json) records the clean baseline and backup restoration checks.

## Historical differences

| Historical files | Observed state and disposition |
| --- | --- |
| `0000` | Core tables remain. The historical `update_updated_at_column` function is absent. Preserve the observed baseline; review timestamp semantics before history repair. |
| `0001` through `0004`, `0006`, `0007` | Named tables, added columns, and indexes are represented. Type, default, constraint, and data-history equivalence still require review. |
| `0005`, `0008`, `0017`, `0023` | Historical public/staff Data API policies and tracking views do not represent the current server-authorized, default-deny model. Do not recreate permissive access. |
| `0008`, `0009`, `0011` | Legacy shipment/invoice portal email and public-tracking columns are absent. Current workflows use canonical customers and the private invoice snapshot. Do not restore retired portal access. |
| `0010`, `0013`, `0016`, `0019` through `0022` | Named audit, SLA, profile, onboarding, and invoice-link objects are represented. Named-object presence does not prove original data backfills executed. |
| `0012` | AI triage columns exist; the historical `tickets_ai_routing_idx` name is absent. Any new performance index needs a measured query requirement. |
| `0014` | The legacy optional `customers` table is absent. Current customer records use `users`; the source migration already guarded that optional alteration. Some historical ticket index names are absent. |
| `0015` | The historical unresolved-DLQ index is absent. The current queue uses its verified recovery-claim workflow; do not add unused historical fields. |
| `0018` | Message-provider fields and provider-ID indexes exist. `message_outbound_related_ticket_id_idx` covers the historical ticket-link index under another name. Other historical index names remain absent. |
| `20260609194226` | `fleet_vehicles` was superseded by the canonical `vehicles` table. Do not recreate the redundant fleet table. |
| `20261010000000` through `20261010000007` | Search, custody scaffold, document snapshots, MFA, passkeys, token-consumption, and operational indexes are represented by the baseline. The subsequent fleet-drop file explains the retired fleet table. |

These dispositions explain current state. They do not assert that every historical statement executed or authorize blind ledger marking.
The legacy `shipment_legs` scaffold remains separate from the implemented manifest handover workflow.

## Accepted history boundary

1. Keep only hosted, recorded versions in the active Supabase migration sequence.
2. Start fresh installations from the separately verified complete baseline, including its event trigger and extension dependencies.
3. Use new timestamped forward migrations for future reviewed schema changes.
4. Keep Drizzle's independent `drizzle/meta/_journal.json` unchanged; do not merge the two ledgers.
5. Preserve archived files for investigation, never for automatic replay.

Never replay these 33 files against production. Never use destructive schema synchronization or reset commands to repair history.
Fresh MCP inspection confirms the production ledger remains unchanged, with eight versions matching the active sequence.
The [production restore receipt](audit-evidence/production-data-restore-2026-11-03.json) verifies all 55 application and Auth tables.
No ledger repair or production schema change is needed for this reconciliation decision.
Historical backfill execution remains unknown. Future features must use current postconditions, not inferred historical execution.

## Fresh managed installations

The baseline is separate from incremental migration replay. Do not run both blindly against an empty migration ledger.
Provision managed roles and Auth helpers first. Apply the baseline only to an empty application schema through the reviewed setup workflow.
Compare its complete catalog with the verified baseline before initializing that fresh target's migration history.
Use Supabase's supported migration repair workflow to record the eight baseline-covered versions on that new target only.
Confirm local and remote history match before applying any later timestamped migration.
This initialization is not needed on production and does not authorize changing its existing ledger.
