# Restore and staging acceptance

Current production project: `ujyellrhwhqjmfponhuz`. Verify this reference against `.env.local` before every operation.
This runbook supersedes project coordinates in the archived restore documents. Those documents reference another project.

## Executed staging setup, 2026-11-03

- Supabase rejected isolated branch creation on 2026-11-03: branching requires Pro or above. No branch or paid upgrade was created.
- The owner approved a separate Free project: `tac-xpress-staging`, reference `zuevgwqmphbvgnwhvvnq`, in `tac-xps's Org`, Sydney.
- MCP created that project. Production remains `ujyellrhwhqjmfponhuz`; `.env.local` still identifies production.
- Windows and Ubuntu have no Docker-compatible runtime. CLI version 2.100.1 is installed but uses a different account.
- Do not use that CLI session to link or migrate these projects. The verified connection and MCP handled this setup.
- A portable PostgreSQL 17.11 client exported only the production public schema. No production customer rows were exported.
- Restored the application schema through two staging-only MCP migrations. No historical production migration was replayed or ledger-marked.
- Twelve catalog comparisons match: tables, columns, constraints, enum labels, functions, indexes, policies, grants, and triggers.
- The restored schema contains 28 tables, 341 columns, 83 constraints, 110 indexes, and 28 RLS-enabled tables.
- Initial database fixtures used only New Delhi and Imphal, with notifications disabled and no outbound records. Later application-test logs appear below.
- Eleven rollback/constraint assertions, 61 RLS/access assertions, two concurrency probes, and six Data API checks pass.
- Concurrent allocation creates one manifest and one assignment. Competing recovery requests produce one claim; stale ownership updates nothing.
- Nine application browser cases also pass on loopback port 3001 against this hosted database. Vercel and customer-data recovery acceptance remain incomplete.
- See the [execution receipt](audit-evidence/staging-acceptance-2026-11-03.json).

## Remaining gates

- The updated `.env.staging.local` identifies staging. Its publishable and server credentials pass live checks; signing secrets are populated.
- The owner reset the staging database password. The verified session pooler now connects successfully to PostgreSQL 17.11.
- Local direct resolution returned `ENOTFOUND`; local acceptance uses the session pooler. Serverless deployment connection settings require separate verification.
- The application runs from an isolated source copy on loopback port 3001 without production environment files.
- Never overlay staging onto `.env.local`. Keep credentials out of chat and Git.
- Keep WhatsApp, Resend, AI providers, and scheduled recovery disabled during synthetic acceptance.
- Verify the transaction pooler independently before Vercel acceptance. Earlier port 6543 checks showed cancellations and long connection stalls.
- A later 2026-11-03 read-only recheck passed six short queries on each pooler port. Hosted workload acceptance remains incomplete.
- Prove customer-data backup restoration separately. A schema-only restore does not establish recovered customer records, files, or recovery time.
- The [ledger inventory](audit-evidence/migration-ledger-2026-11-03.json) maps 41 local files to eight hosted versions.
- Thirty-three local versions lack hosted ledger entries. This does not prove their schema changes are missing or safely replayable.

The source uses PostgreSQL 17.6; staging uses 17.11. Review the [minor-release compatibility notes](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes).
Production was not upgraded. Production data encryption compatibility was not inspected by this schema-only exercise.

## Schema restore details

The original schema dump and applied baseline are retained outside Git at `G:/tac-xpress-dashboard-audit-20261102`.
The execution receipt records both SHA-256 hashes. The portable client came from EDB's official PostgreSQL archive.
The restore removes psql-only commands, keeps the existing public schema, and installs `pg_trgm` in its source location.
Initial default grants are removed before object restoration, preventing target defaults from widening restored privileges.
Twelve reserved-role default grants were already identical and were not rewritten. The application RLS event trigger was restored separately.
No custom Auth/Storage policies or public-function triggers on managed tables were present in the source metadata.
Managed Auth settings, Storage objects, production data, provider credentials, and existing sessions were not copied.
The advisor retains the inherited [public `pg_trgm` warning](https://supabase.com/docs/guides/database/database-linter?lint=0014_extension_in_public).
The [27 RLS-without-policy notices](https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy) represent default-deny tables; access probes verify that denial.

## Auth fixture verification

The original SQL fixtures had NULL confirmation/recovery/email-change token fields. Auth logs identified an unsupported NULL-to-string conversion.
Corrected only the two synthetic records and the archived seed script. The Auth admin API now reads them successfully.
Created three additional synthetic accounts through the supported server SDK for admin, staff, and customer acceptance.
All three password sign-ins and nine JWT ownership/Data API checks pass. Canonical application IDs match their Auth IDs.
Their private credentials are in ignored `.env.staging.auth.local`. No invitation or signup email was requested.
Five synthetic users now exist. All fixture notification preferences remain disabled.
The guarded application launcher is prepared outside Git at `G:/tac-xpress-dashboard-audit-20261102/launch-staging-app.cjs`.
It validates the staging connection before starting the isolated application on loopback port 3001.

## Executed application acceptance

The owner-reset database password works. API, canonical staff identities, and session-pooler authentication pass.
The application previously rewrote the configured session port to transaction mode. It now uses the configured URL unchanged.
Port 6543 exhibited cancellations and stalled `ClientRead` backends. This resembles the [reported hosted pooler issue](https://github.com/supabase/supabase/issues/50358).
The [upstream Sync-handling fix](https://github.com/supabase/supavisor/pull/1205) does not establish deployment to this endpoint. Serverless acceptance remains open.

All 24 requested administrator routes load. Customer denial, staff restrictions, revoked-cookie recovery, and mobile navigation pass.
Invoice creation commits exact totals, its document snapshot, and its audit. Anonymous requests cannot read its document or PDF.
The downloaded PDF passes structural and visual checks after correcting total-label contrast and removing an unsupported certification claim.
The local PDF check uses the installed test browser through `PDF_BROWSER_EXECUTABLE_PATH`; it does not prove Vercel's Chromium packaging.
Warehouse scanning preserves custody and records a private observation. Line-haul departure, exception, and receipt also pass through real server actions.
The received line-haul assignment becomes inactive while the shipment remains in transit. Final delivery requires its own receipt.

Seven browser cases pass in `staging-final-e2e.log`; three targeted follow-ups pass in `staging-flow-final-e2e.log`. Billing appears in both runs.
Run `tests/staging-dashboard.spec.ts` with `RUN_STAGING_ACCEPTANCE=true` and `PLAYWRIGHT_BASE_URL=http://localhost:3001` only against the guarded isolated app.
The test rejects another project and enabled outbound providers. Traces and video remain disabled to protect login credentials.

Postflight contains seven synthetic user/contact rows, five shipments, three invoices, four manifests, and three handovers.
Two customer contacts have no login identity; every staff identity remains canonical. The revoked test staff row is restored.
Four internal message logs record disabled-delivery failures. All have no provider message IDs; no provider delivery occurred.
No background jobs, email notifications, enabled profile notifications, or out-of-corridor shipments exist.
An earlier synthetic exception fixture remains available for review. No production customer records were copied or changed.

## Local synthetic backup drill, 2026-11-03

A portable PostgreSQL 17.11 runtime created the verified application baseline in a fresh loopback-only database.
Its synthetic dataset was backed up in custom format and restored into another fresh local database.
All 28 tables and their RLS settings were restored. Shipment counts, invoice amount, and the immutable snapshot match.
Eleven rollback assertions and 61 access assertions pass after restoration.
Restore plus verification took 3.173 seconds for this tiny fixture. This is not a production recovery-time estimate.
The local test uses an Auth identity shim. It does not establish managed Auth, production customer-data, or Storage recovery.
Schema-filtered dumps require explicit extension installation. The restore list excludes an already-existing empty public schema's creation entry.
The local server was stopped after verification. Private passwords and backup files remain outside Git.
See the [synthetic recovery receipt](audit-evidence/synthetic-recovery-2026-11-03.json).

## Restricted production recovery, 2026-11-03

The owner delegated the recovery decision after the earlier synthetic-only authorization.
Production records were restored into an ACL-restricted, loopback-only PostgreSQL target, outside shared staging and Git.
An exported, read-only transaction snapshot supplied the backup and comparison manifest.
All 55 application and Auth tables match their source row counts and canonical row checksums.
All 28 public tables retain RLS. The automatic-RLS event trigger was restored separately.
Database restoration plus verification took 24.48 seconds. The complete drill took 142.23 seconds.
The recovered snapshot timestamp is `2026-11-03T17:14:33.334Z`.
The private backup directory permits only the current Windows user and SYSTEM. Its server was stopped after verification.

Seven Storage objects from one bucket were recovered into the same restricted local area.
Every downloaded object matches its recovered file checksum. Bucket and policy metadata were retained privately.
Storage metadata remained stable during the 21.63-second capture. No object names or contents enter the public receipt.
Storage was captured separately from the database snapshot. Cross-service atomic recovery is not asserted.
This verifies recovered bytes, not a replacement cloud bucket or signed-URL service.

Production writes and provider sends remain zero. Customer records were not copied into shared staging.
The separate recovery check runs the official GoTrue v2.197.0 Linux binary against the restored database through a local-only relay.
Its archive checksum matches the official release. Password sign-in, JWT identity, refresh, and logout revocation pass for a synthetic identity.
The original signing secret was not copied. SMTP, phone providers, external hooks, and notification sends remained disabled.
The local service and database were stopped after verification.
This proves the recovered Auth engine and records work together. It does not certify restored managed-provider settings or original signing keys.
These measured drills do not establish an ongoing backup retention policy or a complete regional-outage recovery time.
See the [database receipt](audit-evidence/production-data-restore-2026-11-03.json) and [Storage receipt](audit-evidence/storage-recovery-2026-11-03.json).
The [Auth service receipt](audit-evidence/auth-service-recovery-2026-11-03.json) records the separate sign-in and revocation checks.

## Encrypted offsite recovery, 2026-11-04

The private R2 repository now holds encrypted Restic snapshots with seven daily periods and four weekly periods.
The scheduled snapshot passed a complete remote data check, independent file restoration, and all 13 file checksums.
It contains 55 application/Auth tables, seven Storage objects, application configuration, public Auth settings, and recovery metadata.
The encryption password stays outside backup contents. The owner confirmed independent password storage.
The same password moved to a normal filesystem path accessible to the Windows task; its independent copy remains valid.

A fresh PostgreSQL target restored an earlier offsite download without connecting to production.
All 55 table counts and canonical row checksums match. All 28 public tables retain RLS, including the automatic-RLS trigger.
Restore and verification took 71.11 seconds. The recovered server was stopped afterward.
Daily retention can remove earlier same-day manual snapshots; the historical drill receipt remains valid evidence.

The daily Windows task completed with result zero. It runs at 02:30 local time with missed-run recovery and bounded retries.
The owner must remain logged in, with the machine and backup drive available. An always-on runner remains pending.
This does not establish a complete cloud replacement or guarantee the 24-hour recovery-point target.
Follow the [offsite runbook](OFFSITE-BACKUPS.md) and inspect the [offsite receipt](audit-evidence/offsite-backup-2026-11-04.json).

## Recovery operating targets

Use a four-hour target for application rollback and an eight-hour target for full project replacement.
For the current Free-plan logical-backup strategy, target at most 24 hours of data loss.
Retain seven daily encrypted backups and four weekly copies in a separately controlled offsite destination.
Keep encryption recovery keys separate from backup files. Rehearse restoration before relying on these targets.
These are operating targets, not measured cloud recovery guarantees. The later offsite implementation below adds verified retention and workstation scheduling.
The old PITR runbooks name another project and paid features. They do not establish PITR availability for the configured project.
The current source exposes email as its only enabled Auth provider. Public Auth settings were captured privately through a read-only request.
Recover managed Auth settings separately. Restore signing material from an approved vault, or rotate keys and require fresh sign-in after recovery.

## Prepare the isolated target

1. Use the approved staging reference above. Verify it before every write or restore.
2. Record the source project, isolated target, backup timestamp, and responsible operator.
3. Export schema, roles, and data through the supported backup workflow. Keep backup contents outside Git and chat.
4. Inventory Storage objects separately. Database backups contain their metadata, not the objects.
5. Compare the source schema with historical migrations before choosing the target baseline.
6. Restore only into the isolated target. Keep the production project and its migration ledger unchanged.
7. Disable outbound messages and scheduled recovery on the isolated target. Use approved test recipients for later provider acceptance.
8. Verify the preview database credentials identify the isolated target before running write tests.

## Record acceptance evidence

Compare table counts, financial totals, invoice snapshots, active assignments, and handoff event keys with the backup manifest.
Verify RLS, grants, staff provisioning, revoked access, private documents, and published public tracking.
Run synthetic pickup, line-haul, delivery, exception, invoice revision, and concurrent recovery workflows on the isolated target.
Confirm rollback leaves no partial custody, billing, audit, or queue records. Measure restore duration and the recovered timestamp.
Record the target deployment commit and test results. Local embedded-database tests do not establish hosted restore acceptance.

Use the current [Supabase backup guide](https://supabase.com/docs/guides/platform/backups) and [branching guide](https://supabase.com/docs/guides/deployment/branching).
