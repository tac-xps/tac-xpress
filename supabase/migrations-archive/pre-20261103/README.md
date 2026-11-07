# Historical migrations

These 33 files were absent from the configured production migration ledger on 2026-11-03.
They are archived for provenance, not presented as executed migrations.
Some describe retired portal columns, redundant fleet storage, or superseded permissive policies.
Do not replay this archive against a populated database.

The active `supabase/migrations` directory retains the eight versions actually recorded in production.
The hosted ledger remains unchanged. The archive also retains the old Supabase-directory Drizzle snapshots.
The independent Drizzle generator still uses `drizzle/` and its own journal; it is not the hosted Supabase ledger.

Fresh isolated targets use the reviewed [complete baseline](../../baselines/20261103_current_public.sql).
It requires an empty application schema and the managed Supabase roles and Auth helpers.
The baseline includes `pg_trgm` and the automatic-RLS event trigger. It creates no customer records.
Apply future changes through the approved forward-migration workflow after checking the actual target and ledger.

See the [reconciliation decision](../../../docs/migration-baseline-decisions.md) and its linked evidence.
