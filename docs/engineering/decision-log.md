# Engineering decisions

Reviewed 2026-11-13 against baseline `98f3e42ac19b3680d329415d61be716058d600cd`. Earlier decisions remain in [the historical decision log](../14-decision-log.md) and [the migration baseline decisions](../migration-baseline-decisions.md).

| Decision | Reason and trade-off |
| --- | --- |
| Audit TAC-XPRESS | The Codex chat directory held only work and output folders. Of the C-drive candidates inspected, `C:/tac-xpress` matched Next.js, Supabase, existing Git history, and Codex/Kilo artifacts. The local project evidence corroborated prior project notes. |
| Work in `codex/engineering-audit-2026-11-13` | The original `main` had no tracked changes at intake. A linked worktree keeps the original working files, local tooling, and historical receipts available to other editors. The worktree excludes ignored files by construction. |
| Verify a separate source recovery checkpoint | A Git bundle of `main` was verified, cloned into a separate recovery directory, checked for exact HEAD equality, and inspected with `git fsck --full`. The checkpoint covers the tracked history of `main`. Local configurations and restricted operational evidence stay in the original checkout. |
| Use the repository's synthetic CI environment for engineering checks | Synthetic build settings and a database-free local browser run let checks exercise the baseline without production credentials or provider writes. Authenticated business flows require isolated synthetic fixtures and a separate acceptance run. |
| Compare the repository-configured hosted database using catalog reads | Migration and RLS metadata establish current schema facts. Effective app authorization also depends on Auth.js guards and role checks in the app's privileged data paths. |
| Keep release decisions tied to the tested revision | Previous hosted and restore receipts cover their recorded revisions and scenarios. The release gates in this directory require evidence for the current candidate and explicitly track remaining recovery boundaries. |
| Preserve old image URLs through a same-origin rewrite | SHA-256 comparisons verified identical content. The rewrite retains existing public paths, removes duplicate source bytes, and lets legacy-only images serve directly. |
| Prune four lockfile nodes without refreshing unrelated versions | The removed React packages had no source or tool consumers, and their two exclusive transitive nodes had no other importers. A broad pnpm resolution also changed the unrelated GBrain Git revision. The final frozen lock retains that revision and the other dependency resolutions. |
| Preserve public tracking's published-event boundary | Current architecture and shipment creation flows require an explicit public event. The shared query applies the requirement for both public lookup and support AI. Shipments with no public event remain hidden until staff publish one. |
| Use a local diff review for this cycle | Windows Application Control blocked the Qodo executable. The Qodo local review skill would also send the diff and coding context to its service. Review used the local diff, focused tests, and the engineering gate. |
