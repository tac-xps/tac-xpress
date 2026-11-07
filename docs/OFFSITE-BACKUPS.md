# Encrypted offsite backups

TAC-XPRESS stores encrypted Restic snapshots in the private `tac-xpress-vault` R2 bucket.
The dedicated repository prefix is `tac-xpress-dr/ujyellrhwhqjmfponhuz/restic-v1`.
The bucket-scoped token supports object reads and writes. The backup command does not modify bucket policies or lifecycle rules.

## Captured data

The command exports application and Auth tables through one read-only PostgreSQL snapshot.
It records row counts, canonical row checksums, roles, migration history, and automatic-RLS trigger metadata.
Storage capture includes all object bytes, bucket settings, policy metadata, and file checksums.
Storage metadata must remain stable during capture. Database and Storage captures are separate; cross-service atomicity is not claimed.
The encrypted snapshot also contains application configuration, public Auth settings, and the verified public-schema baseline.
It excludes the backup password and never sends provider messages.

Native Restic encrypts the repository. Each run checks remote data, restores its new snapshot, and verifies every captured file checksum.
Only then does retention keep seven daily periods and four weekly periods, grouped by fixed host and tags.
The command removes its verified plaintext capture and temporary restoration after success.
Failures retain restricted diagnostics and stop retention. The dedicated backup root grants access only to its Windows owner and SYSTEM.

## Local configuration

Keep live S3 credentials in `.env.local` and operations settings in ignored `.env.backup.local`.
The normal operations profile omits duplicate S3 credentials, so token rotation uses the current `.env.local` values.
Store the password file outside the repository and backup directory. Keep an independent recovery copy in a password manager or offline vault.
Use a normal filesystem path shared with Task Scheduler. Packaged desktop apps can virtualize AppData paths and hide those files from scheduled processes.
The owner confirmed independent password storage on 2026-11-04. Reports contain no password or API credential values.
Pin `BACKUP_REPOSITORY_ID`, `RESTIC_SHA256`, and `PG_DUMP_SHA256` to the verified repository and binaries.
The current tools are Restic 0.19.1 and PostgreSQL 17.11. No system installation or application dependency is required.

`BACKUP_DATABASE_URL` explicitly uses the production session pooler on port 5432.
Update that operations URL when the production database password rotates.
Production application URLs remain unchanged. The script rejects another source project, another bucket, insecure endpoints, and overlapping key paths.
The current transfer budget is 2 GiB per capture. Review capacity before raising it.

Run a backup:

```powershell
pnpm backup:offsite
```

The latest value-free receipt is `BACKUP_ROOT/latest-receipt.json`.
Check its snapshot identifier, source timestamp, file verification, retention result, and elapsed time.

## Scheduled operation

Register the task from the project directory:

```powershell
powershell.exe -NoProfile -ExecutionPolicy RemoteSigned -File scripts/register-offsite-backup.ps1
```

The task runs daily at 02:30 in Windows local time. The verified host uses India Standard Time.
It runs with the owner's limited token and a hidden process window. No password appears in its command arguments.
Missed runs start when available. Overlapping scheduled runs are ignored; failures retry three times at 15-minute intervals.
The owner must remain logged in, with the machine and backup drive available.
This workstation schedule does not guarantee a 24-hour recovery point during extended shutdowns.
An always-on runner remains the next operational improvement; the connected GitHub tool cannot provision repository secrets.

Inspect execution:

```powershell
Get-ScheduledTask -TaskName 'TAC-XPRESS Encrypted Offsite Backup'
Get-ScheduledTaskInfo -TaskName 'TAC-XPRESS Encrypted Offsite Backup'
```

## Independent recovery

For independent recovery, prepare `.env.backup.local` with vault credentials, repository identity, Restic binary/checksum, backup root, and password-file path.
Normal workspace recovery can read vault credentials from `.env.local` instead.
Production database credentials and `.env.local` are unnecessary for file recovery.
Recover the full snapshot identifier from a receipt or the Restic snapshot inventory.

```powershell
pnpm backup:recover <full-snapshot-id>
```

Recovery creates a new restricted directory and validates every manifest file.
It does not overwrite existing data or connect to production.
Keep restored application configuration isolated. Replace production connection and provider settings before starting any recovered service.
Restore the database into a fresh target with PostgreSQL 17 tools, managed roles, and extension dependencies.
Restore the recorded automatic-RLS event trigger separately; schema-filtered dumps omit event triggers.
Verify row checksums, RLS, access restrictions, and file checksums before cutover.
Follow the [restore acceptance runbook](restore-acceptance.md) for remaining managed Auth and Storage service checks.

## Tool references

The official [Restic repository guide](https://restic.readthedocs.io/en/stable/030_preparing_a_new_repo.html) explains password protection and S3 configuration.
The [restore guide](https://restic.readthedocs.io/en/stable/050_restore.html) documents recovery and verification.
The [retention guide](https://restic.readthedocs.io/en/stable/060_forget.html) explains daily and weekly snapshot policies.
Cloudflare documents [bucket-scoped S3 credentials](https://developers.cloudflare.com/r2/api/tokens/).
