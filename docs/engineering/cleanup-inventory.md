# Repository cleanup inventory

Baseline recorded 2026-11-13 at commit `98f3e42ac19b3680d329415d61be716058d600cd`.

## Starting state and recovery

- **VERIFIED** — The primary checkout is `C:/tac-xpress` on `main`. Its index and worktree were clean for tracked files, and Git reported zero ordinary untracked files. Local branches and two registered Kilo worktrees already existed.
- **VERIFIED** — Engineering changes use the separate `codex/engineering-audit-2026-11-13` worktree. The baseline bundle sits outside that worktree. `git bundle verify` reported complete history for the bundled `main` ref, and the independent recovery repository resolved the same commit and tree `84898f6782579a40ce2cc2595ab0d6dbf05a8e8d`. The bundle covers baseline tracked files and their history. The original checkout retains local branches and ignored files.
- **VERIFIED** — The original checkout holds ignored environment settings, Auth0 MCP state and logs, provider/IDE MCP settings, workflow definitions, test reports, historical audit receipts, and scratch files. Those files were left in place. Their contents are outside this Git recovery proof. Keep them private and inspect retention requirements before moving any ignored payload.
- **VERIFIED** — The [offsite backup runbook](../OFFSITE-BACKUPS.md) documents encrypted database and storage snapshots, restores, and task scheduling. That process protects application data and is separate from source recovery. The Windows task was Ready and its latest recorded run exited 1 at 20:35 IST on 2026-11-12. Its worker, Node executable, and working directory exist. The configured local backup volume was unavailable during this audit, so the latest worker log and receipt were inaccessible. Task Scheduler Operational history was disabled.
- **VERIFIED** — A retained value-free receipt from 2026-11-04 at 04:58 IST records a successful offsite restore, matching file checksums, and retention after verification. The current snapshot age is **UNVERIFIED**. An unavailable volume is a plausible explanation for the scheduled failure, classified as **INFERRED**.

## Inventory and disposition

| Candidate | Classification | Evidence and action |
| --- | --- | --- |
| `AGENTS.md`, `agents.toml`, `.codex/`, `.agents/`, `.vscode/`, root `.mcp.json` | KEEP | The local Codex hook file, Antigravity rules/workflows, and IDE MCP settings exist in the primary checkout. `git check-ignore -v` verified that local agent and MCP files are outside the Git worktree and bundle. `agents.toml` points to local skills. Keep ignored settings and their tracked integration files. [IDE integration notes](../setup/GREPTILE_SETUP.md) |
| `.ci_log.txt` | REMOVE | One tracked CI transcript from commit `cd02b76` with 1,248 lines and a 167,500-byte Git blob. Tracked source, configs, scripts, and docs have no reader. Remove from the isolated branch and add `/.ci_log.txt` beside existing log exclusions. Restore the file from baseline Git if needed. |
| `.kilo/plans/1790274582483-tac-xpress-enhancement-plan.md` | CONSOLIDATE | The September plan records useful architecture and release decisions. The reconciled pointers below preserve those decisions. Its file and task lists predate later changes. Retire the tracked plan in the isolated branch after the notes below land. The baseline bundle preserves the original. |
| `.kilo/agents/data.md` | REMOVE | Generic Kilo notebook-mode instructions with no TAC-XPRESS-specific behavior. A tracked reference search found no consumer and Git contains no tracked notebooks. The Kilo VS Code extension remains installed on this machine, so preserve the original checkout, the extension, and its local settings. Retire only the tracked repository copy in the isolated branch. |
| `.kilo/.gitignore`, `.kilo/worktrees/`, ESLint `.kilo/**` exclusion | REVIEW | Both nested worktrees were clean, including a check for ignored entries. Both point to detached `c52424a`, with zero commits outside baseline `main`. Their ownership and IDE usage remain unverified. Retain the worktrees, local ignore file, and ESLint exclusion. If retired later, recheck both trees and use Git worktree operations. |
| `package.json` `design:diff` script | REMOVE | The script references missing `docs/DESIGN-v2.md`. That path is absent from all locally reachable history, and the script has no tracked callers. The baseline command also failed with exit 1 because this machine has no `designmd` binary. Remove the stale shortcut in its own batch. Keep `design:lint` and both existing design guidance files. |
| `react-dropzone`, `react-use-measure` | REMOVE | Tracked source, config, and registry searches found no use of either specifier. Local `pnpm why` reports each only as a root dependency. The only Deno entries are two strings in root `workspace.packageJson.dependencies`. Remove the package entries and corresponding pnpm lock entries in a separate batch, then verify a clean frozen install, the production build, and document-upload and dashboard behavior. |
| Root `deno.lock` and per-function Deno files | KEEP | Both Edge Functions have their own `deno.json`. The PDF function also has a local lockfile and passes a cache-only frozen typecheck. Capabilities has no local lockfile. Its cache-only frozen check asks for a new local lockfile, while the root lock already records remote hashes for its imports. Preserve the root `remote` and `redirects` records and the PDF lockfile. Any package cleanup can remove the two stale React metadata strings without changing Deno import pins. [Supabase dependency configuration](https://supabase.com/docs/guides/functions/dependencies) · [Deno lockfiles](https://docs.deno.com/examples/dependency_lockfile_tutorial/) |
| `@tiptap/extension-link`, `@tiptap/extension-underline`, `@tiptap/pm`, `@radix-ui/react-use-controllable-state`, `tw-animate-css` | REVIEW | Initial import search found only manifests, lockfiles, or historical notes. Tiptap StarterKit, Radix peers, and Tailwind/registry packages can use indirect dependencies. Resolve the dependency graph and inspect component behavior before changing package manifests. |
| `.next/`, `node_modules/`, `next-env.d.ts`, `tsconfig.tsbuildinfo`, `storybook-static/`, `build-storybook.log` | KEEP | Generated outputs and dependencies are already ignored. They serve local development and can be regenerated. Avoid removing them while the original checkout can be open in an IDE. |
| `components/examples/` | KEEP | Git's directory view surfaced the folder, and recursive inspection found no entries. It contributes no files. |
| `playwright-report/`, `test-results/`, `testsprite_tests/`, `artifacts/`, `scratch/`, `scripts/archive/` | REVIEW | Ignored workspace material may contain local reports, working files, or evidence. The documentation index links an artifact route inventory. Keep files pending retention and ownership review. |
| `public/images/corridor-ink/` and `public/images/new-assets/` | CONSOLIDATE | SHA-256 confirms 27 same-name pairs totaling 83,373,616 duplicate bytes (79.51 MiB). Current application references use the new paths. Preserve the old public URLs with a same-origin rewrite, keep the two old-only files, and verify both URL sets against a production build before closing the batch. |
| `docs/old_docs/`, `docs/audit-evidence/`, migrations, `data/`, `assets/`, `public/` | KEEP | The old docs contain 97 tracked historical files and are identified in the documentation index. The audit evidence directory contains 101 tracked files alongside newer ignored receipts. Migrations, data inputs, and assets need their consumers and provenance established before any removal. |

## Historical plan decisions retained

- Customer tracking and contact remain public. Staff use the provisioned dashboard. The older portal paths remain compatibility redirects. Use the current product decision and route contract. [Architecture](../ARCHITECTURE.md) · [Decision log](../14-decision-log.md)
- `vehicles` supersedes `fleet_vehicles`. Current manifest handoff work defines active assignment uniqueness, idempotent receipt and exception handling, and transactional updates. Reconcile the migration ledger with current hosted evidence before changing migration history. [Migration baseline](../migration-baseline-decisions.md) · [Cargo lifecycle gate](../cargo-lifecycle-gate.md)
- Provider delivery and authenticated workflow acceptance are release checks. The September roadmap can explain earlier design constraints. Verify closure against current code, test runs, and environment evidence. [Operations](../OPERATIONS.md) · [Restore acceptance](../restore-acceptance.md)

## Public asset compatibility

Retain `public/images/corridor-ink/cta-panorama.png` and `public/images/corridor-ink/tariff-secure.png`. An appended rule in the existing `rewrites()` array can map `/images/corridor-ink/:file` to `/images/new-assets/:file`. Next.js checks public files before array rewrites, so both old-only paths still serve from disk. The app applies its immutable image cache header on both prefixes and skips Proxy for PNG files. [Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)

Validate the built local server by comparing HTTP status, content type, cache headers, and SHA-256 for all 27 old/new pairs. Require both old-only paths to return 200 and an unknown old PNG to return 404. Check a legacy path through the Next.js image optimizer and review the landing and dashboard image paths. Hosted routing and cache behavior require separate evidence. Existing Git objects keep the old copies for recovery.

A separate production build on Next.js 16.4.3 verified the rewrite with one representative duplicate pair and both old-only PNGs. The duplicate paths returned matching bytes, HTTP 200, PNG content type, the immutable cache header, and no redirect. The fixture also returned 404 for an unknown legacy PNG and 200 for the legacy image optimizer URL.

The final TAC-XPRESS production build also passed the complete check. All 27 pairs matched by SHA-256 and returned HTTP 200, PNG content type, and immutable caching. Both old-only files matched the Git baseline bytes, the missing image returned 404, and the legacy optimizer URL returned 200.

## Reversible cleanup batches

1. Remove the tracked CI transcript and add its precise ignore rule. Check the staged file set and ignore rule. Run the repository validation checks.
2. Retire the two tracked Kilo files after preserving the decisions above. Keep the original checkout and nested worktrees. Validate the branch and confirm the original Kilo worktree state.
3. Remove the orphan design comparison shortcut and keep the lint command. Check for script consumers and run the affected design and repository checks.
4. Deduplicate the 27 verified asset pairs and preserve legacy URLs with the existing Next.js routing configuration. Run the asset compatibility checks and the repository validation checks.
5. Evaluate dependency removals separately with a lockfile diff, clean frozen install, typecheck, lint, tests, build, and targeted workflows. Preserve dependencies if those checks show a consumer.

## Applied in the isolated worktree

- Removed the tracked CI transcript and added `/.ci_log.txt` to `.gitignore`. `git check-ignore -v --no-index .ci_log.txt` confirmed the root-specific rule.
- Retired the two tracked Kilo Markdown files. Both original Kilo worktrees still resolve to `c52424a` and report zero modified, untracked, or ignored entries. The primary checkout remains clean with its Kilo, Codex, and Antigravity files in place.
- Removed the 27 verified legacy PNG copies, saving 83,373,616 bytes from the public tree. Added the compatibility rewrite and retained both legacy-only PNGs. The Git diff reports exactly 30 scoped tracked deletions across these batches. `git diff --check` passed on the scoped changes.
- Trimmed the optional Vercel Blob hostname before choosing the default. A direct Next configuration check passed for unset, empty, whitespace-only, and configured values. The same check confirmed the compatibility rewrite and the three analytics rewrites.
- Removed the stale `design:diff` package script and kept `design:lint`. Removed `react-dropzone`, `react-use-measure`, and the two transitive packages used solely by the removed roots. Pruned just those entries and their two stale Deno workspace metadata strings. Both Edge Function configs and the PDF function lock remain. Frozen pnpm install passed.

Recover a scoped deleted path with `git restore --source=98f3e42 -- <path>` from the isolated worktree. See the validation record for application build and runtime results.
