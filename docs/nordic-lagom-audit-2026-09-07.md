# Nordic Lagom redesign and production audit - 7 September 2026

Follow-up: the [control-center audit](control-center-audit-2026-09-07.md) records subsequent invoice, document, communications, telemetry and dependency repairs. Counts below describe this earlier audit pass.

**Release decision: not cleared for production.** The public site and staff workspace have been substantially redesigned, and the critical access, privacy and cargo transaction defects listed below have been repaired locally. The actual deployment and several operational acceptance gates remain unverified.

This report supersedes the customer-portal model and green visual direction in the earlier [production audit](production-readiness-2026-09-07.md). That report remains historical evidence for the earlier hosted security repairs.

## Product and design delivered

Customers use the public website, AWB tracking and contact/support. Only provisioned, non-deleted admins and staff can enter the operations workspace. Legacy portal URLs are protected compatibility redirects. Customer enrollment, email-link session creation and customer portal navigation are retired; customer business records remain available to staff.

The active interface uses Tailark Veil compositions and official shadcn Radix components, with warm stone surfaces, graphite text, restrained brown actions, DM Sans and IBM Plex Mono identifiers. The work applies Nordic Lagom as balance, clarity and usefulness. There are no invented testimonials, carrier fares, client logos, shipment statistics or live map positions.

All seven Tailark documentation pages were read: introduction, quick setup, project setup, migration, theme, MCP and changelog. Official shadcn sidebar, table, chart, command, accordion, field and dropdown guidance and source patterns were inspected. [UI sources](UI-SOURCES.md) records exact blocks, documentation links and adaptations; public registry snapshots are in `artifacts/ui-sources`. Inventorying the registry does not mean every one of its 260 items was reviewed.

The homepage now explains services, booking steps, preparation, tracking, operating expectations, FAQs and contact. Dedicated services, air cargo, surface cargo, shipping guide, about and contact pages provide further detail. Tracking, feedback, terms and staff sign-in share the public system.

The staff workspace has grouped sticky navigation, mobile navigation, breadcrumbs, command search, account controls and guarded activity notifications. Operations overview, shipments, dispatch, manifests, warehouse, fleet, hubs, invoices, customer ledgers, pricing, support, tracking, analytics, service levels and integrations use the shared system. Primary registers use bounded server queries and sorting; current-page CSV exports are labelled honestly. Named record selectors replace manual internal-ID entry. Destructive and irreversible transitions explain their consequences in shadcn dialogs.

## Audit scope and method

The starting dirty checkout contained 520 modified, deleted or untracked entries. Existing work was preserved. This pass did not delete source files, commit, push, deploy, send provider messages or mutate hosted records.

GStack workflow, design/engineering review guidance, the critical review checklist, and QA techniques were applied alongside the repository's Senior Frontend Architect, shadcn, Next.js 16, Tailwind 4 and Supabase guidance. Two focused specialist reviews covered access/document boundaries and cargo transaction integrity. GStack's browser daemon failed to start on this Windows host; Edge through CUA and Playwright supplied browser evidence. This is not a claim that every GStack shipping step or a remote CI pipeline ran.

The route dependency index contains 63 page/API files and 73 entries including shared route conventions. The codebase was indexed across application routes, shared components, server modules, migrations, tests, scripts and documentation. Risk review focused on active routes, authorization, public-data projections, URL trust, state transitions, documents, messaging and shared UI. It was not an exhaustive line-by-line certification. The [route dependency inventory](../artifacts/route-source-audit.json) records exact entry points and reachable runtime imports. It found no active imports from the competing UI kits checked by the script; unused legacy kit files remain preserved.

## Material fixes

| Area | Repaired behavior and evidence |
| --- | --- |
| Staff access | Current database role and deletion state govern access. A stale admin JWT cannot preserve admin privileges after demotion. Database failures deny access and reach Sentry. Seven focused guard tests cover these boundaries. |
| Request protection | Explicitly handle SDK errors and partial rule failures before private reads or mutations. Production placeholders are rejected. Thirteen regression cases cover outages, protected routes, server actions, allowed requests and denial status. Public information remains available during an outage. |
| Retired portal | Registration and legacy identity-minting actions cannot establish sessions. Callback recovery clears legacy cookies. Public pages offer tracking/contact and a separate staff sign-in. |
| Public AI context | AI triage and reply helpers use the same explicitly published shipment projection as public tracking. Internal status, private notes and customer/financial fields are excluded. Privacy tests exercise the returned context. |
| Cargo integrity | Shipment, manifest, dispatch and scanner transitions write their audit records inside the same database transaction. Locks protect merged cargo edits and assignments. Audit failures roll back status, events and assignments. Finalized loads are immutable; assigned or moving shipments cannot be silently removed. |
| Honest workflow | Pickup completion cannot mark cargo delivered. The UI offers delivery completion only for delivery runs and explains that it covers every shipment. Multi-leg handover is an explicit remaining gate, described below. |
| Private documents | Uploads require same-origin staff access to an existing record, enforce streamed size limits and file signatures, and use private scoped storage. Audit failure compensates the upload; failed compensation returns an explicit saved-but-unreconciled warning. Fourteen route tests cover success, denial and failure paths. |
| Staff profile | Private avatars use the existing private cargo bucket with a separate user prefix and own-user endpoint, signature validation and a 2 MB limit. Profile changes and their audit commit together; failed persistence cleans up the new object. |
| Scanner | Bounded, guarded lookups exclude deleted shipments. Stale scan responses cannot overwrite the latest selection. Status updates are explicit, validated and audited; scanning alone does not change a shipment. |
| Support reliability | Nested work inside Next.js after is awaited. Dashboard email replies derive recipient and subject from the saved ticket. Skipped/rejected provider sends are not presented as delivered. Status/reply inputs bind to the current staff actor. Durable delivery remains unimplemented. |
| Reporting | SQL aggregates replace unbounded record arrays. Service-level metrics explain their periods and denominators. On-time delivery uses the first recorded delivered event, so a later note cannot move delivery time. Missing evidence is excluded rather than counted as success. |
| Tables and navigation | Server-backed filters and sorting, bounded deterministic pagination, useful empty states, accessible scroll regions, mobile sheets and keyboard focus. Dispatch pagination stays within the runs tab. |
| Integration truthfulness | Configuration presence is distinguished from provider acceptance. Carrier quotes remain manual coordination; unconnected telemetry and notification settings are not labelled live or working. |

## Verification

Final results are recorded in [machine-readable verification evidence](audit-evidence/nordic-2026-09-07/verification-summary.json).

| Check | Final result |
| --- | --- |
| TypeScript and Next route generation | Passed `pnpm typecheck`. |
| Production build | Passed `pnpm build` on Next.js 16.2.11 after the final application changes. |
| Unit/security/transaction tests | 109 passed across 16 files. |
| ESLint | Zero errors, 243 warnings in the full run; subsequent changed-file checks passed. Warnings remain debt. |
| Stylelint | Passed. |
| Storybook production build | Passed. Remote Chromatic baseline review was not performed. |
| Public/access browser suite | 53 passed on the final run: 11 public/sign-in routes at 320/768/1440 pixels, focus/theme/assistant checks and protected access denial. No provider messages or live sign-ins. |
| Isolated operations overview | Four browser checks passed: 320/768/1440 pixels, dark theme, sidebar and command-search keyboard behavior. Simulated data only. |
| Local production perimeter | Three smoke checks passed: protection failure returns 503 for the dashboard and hub API; public homepage remains 200. Thirteen unit cases also cover the policy. |
| Production dependency audit | Zero known advisories across 881 dependency entries. |
| Production environment verifier | **Failed as expected for this local checkout:** localhost website origin and two enabled E2E flags. The preview processes override both flags to false; the environment file was preserved. |

The final browser suite used local development with explicit placeholder Arcjet configuration and both sign-in bypasses disabled. It validates application access and UI behavior. The separate production-mode smoke run validates failure handling; neither establishes acceptance of a deployed Arcjet perimeter with trusted client-IP forwarding.

Screenshots in `docs/audit-evidence/nordic-2026-09-07` include the public routes, homepage at 320/768/1440 pixels and light/dark operations previews. The operations preview uses clearly labelled simulated data in Storybook and has no live mutations. Automated accessibility checks and visual inspection are complementary; neither is a full manual accessibility certification.

The initial development-browser run passed 44 of 45 checks. Its last test timed out while sequentially compiling nine protected API endpoints. Server logs show compilation consumed most of that deadline. All 45 cases then passed against the production build. Its logs exposed the separate Arcjet error-handling defect described above, which was repaired afterward. The final access rerun uses separate API cases to make each boundary independently diagnosable. A subsequent development run returned framework 404 for two dynamic document routes; restarting the development server restored both to 401 without changing the authorization assertions. The fresh complete suite passed all 53 checks. The timeout and intermediate failures are not hidden as passes.

Embedded PostgreSQL tests execute the real repaired action handlers and actual transaction rollback using an isolated PGLite database. This proves local atomicity and guard behavior, not hosted multi-connection contention, a correct production schema baseline or complete multi-leg operations.

## Hosted evidence boundary

Read-only Supabase MCP calls confirmed the approved project API URL and relevant schema/storage metadata. The project URL is `https://ujyellrhwhqjmfponhuz.supabase.co`. The only current storage bucket is private `cargo-documents`; application handlers enforce type/size limits because bucket-level limits are unset. No hosted schema, storage or account changes were made in this redesign pass.

The earlier audit records three narrow hosted security/index migrations, RLS checks and remaining advisor findings. Those are historical results, not a fresh claim that every advisor was rerun here. The application still uses privileged server database/storage access, so its current-role guards are essential.

## Open release gates

1. **Website origin and deployment configuration.** No actual production/staging website URL was supplied. The local production verifier rejects the localhost origin and two enabled E2E flags. Set the deployment's actual HTTPS website origin and disable all test flags, then validate the release identity, security perimeter and generated links there. A Supabase API/MCP URL cannot serve as the website origin.
2. **Cargo leg lifecycle.** One AWB cannot yet progress safely through pickup, line-haul and delivery loads. The current draft/finalized model records departure but has no explicit completed leg or receiving handover. Allocation intentionally rejects historical assignments until a real completion/active-assignment model exists. See [cargo lifecycle gate](cargo-lifecycle-gate.md) for the required schema, transitions, concurrency and recovery acceptance. This is incomplete core functionality for a multi-leg release.
3. **Database baseline and recovery.** Reconcile Drizzle and historical Supabase migrations against the hosted schema in an isolated staging database. Demonstrate a restore-tested backup. Do not blindly replay historical migrations or reset the hosted project.
4. **Authenticated staging journeys.** Verify actual provisioned admin/staff sign-in, revocation, role restrictions, profile upload, shipment booking, manifests, dispatch, invoice/PDF generation, document retrieval, support and scanner hardware. Public-denial tests and isolated UI fixtures do not establish these workflows. No live customer records were seeded for testing.
5. **Providers and durable work.** Verify email/WhatsApp templates and delivery, webhook signatures and replay handling, SLA cron, alerts and retries. Next.js after is not a durable outbox. Current activity polling is not durable notification delivery.
6. **Remaining operational infrastructure.** Fleet telemetry still uses process memory; persistent telemetry is required if included in the release. Carrier quotes are not connected. Driver pages are staff tools; any future driver identity needs assignment-level authorization. Resolve these features or explicitly exclude them from the release scope.
7. **Operational and security acceptance.** Recheck Supabase password-security configuration, provision/recover real staff accounts, validate deployed performance/load, review remaining lint warnings, and approve service statements, terms, support/incident ownership and rollback ownership.

Arcjet guidance consulted for explicit error handling: [request decisions and failure policy](https://arcjet.com/learn/secure-express-api). Local production requests do not supply trusted deployment client-IP metadata; production perimeter acceptance therefore remains a deployment gate.

No local green check removes these gates. No production release was performed.


