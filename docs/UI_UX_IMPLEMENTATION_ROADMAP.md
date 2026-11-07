# TAC-XPRESS UI/UX implementation roadmap

Date: 4 November 2026. Status: all implementation phases approved and implemented; local Delivery Gate PASS.

This roadmap implements findings in [the comprehensive audit](UI_UX_COMPREHENSIVE_AUDIT.md). Current working-tree evidence governs each task. Historical Mission 02B/03C findings must not be reintroduced without current proof.

## Execution boundary

The owner approved Phase 1 and subsequently requested implementation of all pending phases. UX-01 through UX-14 are implemented. This approval does not authorize deployments, pushes, PR creation, database changes, authentication changes, or new provider integrations.

Preserve the exclusive New Delhi–Imphal corridor in both directions. Keep the existing radix-nova system, semantic tokens, Inter/IBM Plex Mono, compact operations density, and zero-radius geometry. Reuse installed components. Do not migrate TanStack Table or add a second grid/filter system as part of this work.

Before implementation, capture the current diff and re-open affected files. The audit ran against a substantially modified working tree. Preserve unrelated work and revalidate finding evidence if it has changed.

Complexity: **S** one small owner change; **M** several related consumers or state transitions. These are relative estimates, not delivery-date commitments.

## Phase 1: primary-task, trust, and rendering corrections

Approved, implemented, and locally verified: **UX-01, UX-02, UX-03, UX-04, UX-05**. See [the implementation report](UI_UX_IMPLEMENTATION_REPORT.md). UX-02's correction also makes the calculator use quoted inputs and removes fabricated advisory content, resolving UX-06.

| Finding | Affected files and routes | Existing problem | Proposed solution / component | Dependencies | Expected outcome | Regression risk | Priority / complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UX-01 | `components/public/landing/landing-nav.tsx`; `/` | A custom modal leaks focus to page content. | Reuse installed `Sheet`, `SheetTrigger`, `SheetContent`, title/description. Preserve current anchors, theme control, trigger, and reduced-motion scroll handler. | None; existing `components/public/nav-client.tsx` provides a local Sheet exemplar. | Focus enters the modal, remains contained, and returns after dismissal. | Medium: sticky header, section navigation, scroll lock, responsive switch. | P1 / S–M |
| UX-02 | `components/public/landing/telemetry-stats-band.tsx`, `hero-section.tsx`, `corridor-cinema-section.tsx`, `dispatch-bulletins-section.tsx`, `testimonial-section.tsx`, `carrier-trust-band.tsx`, `corridor-tariffs-section.tsx` as evidence identifies claims; `/` and service-content comparisons | Synthetic terrain and static statements appear measured/live; other commercial claims lack supplied evidence. | Remove public simulated measurements and unsupported live-state labels. Keep factual service content and clearly identified illustration. Describe static modal content accurately. Review claims in place; do not replace them with invented statistics. | Owner-supplied evidence is required only to retain factual claims; removing unverified claims can proceed within approved scope. UX-06 handles destination labels separately. | Public claims match actual available evidence. | Medium: content balance, removal of an imported visualization, pricing/SLA wording. Preserve freight calculations and inquiry actions. | P1 / M |
| UX-03 | `components/public/support-conversation.tsx`; `/` assistant tools | Route inquiry includes `CCU and all gateways`. | Replace the hint with the approved DEL/IMF directions. Keep the existing tool and menu. | None. | Assistant presents only supported corridor choices. | Low: copy-only. No AI prompt/server contract changes required. | P1 / S |
| UX-04 | `app/track/page.tsx`; `/track` error state | `contact support` navigates to missing `/#support`. | Change the existing Link target to `/contact`. | None. | Tracking failure has a working support destination. | Low: one navigation target. | P2 / S |
| UX-05 | `components/public/landing/hero-section.tsx`; `/` | Reduced-motion preference changes initial server/client playback markup. | Render deterministic initial video/control markup. Reconcile preference and real playback state after mount. Preserve user pause/play control. | Retain existing MotionProvider. No new animation library. | No hydration mismatch; reduced motion remains paused and control label matches playback. | Medium: autoplay refusal, preference changes, click state, media events. | P2 / S–M |

Acceptance for Phase 1:

1. Open the mobile menu by keyboard at 320px and 390px.
2. Verify initial focus, Tab containment, Shift-Tab containment, Escape, and focus return.
3. Activate every retained navigation anchor and verify its target.
4. Open assistant tools and verify only the approved corridor appears.
5. Reject an invalid AWB format and follow its support link.
6. Load fresh pages with reduced motion enabled and disabled.
7. Assert no hydration errors before taking screenshots.
8. Verify playback labels against actual video state and failed autoplay.
9. Record the source for every retained quantitative or compliance claim.
10. Compare desktop/mobile screenshots after content removal.

Do not send live booking, AI, email, WhatsApp, or provider requests for these checks. Invalid-format tracking returns before querying shipment records.

## Phase 2: content clarity and bounded shared refinements

Approved and implemented: UX-07/09/10/11/14. UX-06 was already completed.

UX-06 was resolved alongside UX-02 in Phase 1. Its row below preserves the original recommendation; do not repeat that completed work.

| Finding | Affected files and routes | Existing problem | Proposed solution / component | Dependencies | Expected outcome | Regression risk | Priority / complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UX-06 | `components/public/landing/dispatch-bulletins-section.tsx`; `/`, links to shipping guide and air service | Specific article labels lead to general pages. | Keep existing destinations; rewrite headings, accessible names, and link copy to describe them accurately. Do not create article routes. | Coordinate with UX-02 claim review. | Link promises match destinations. | Low: copy/accessibility names. | P2 / S |
| UX-07 | `app/dashboard/operations/air-cargo/page.tsx`, `surface-cargo/page.tsx`, `../_components/operations-dashboard-page.tsx`; both operation routes | Latest 100 records appear as overall/active totals; surface inherits air wording. | Disclose the latest-up-to-100 sample in labels/context. Name shipment counts accurately. Pass the existing cargo-mode context through the shared composition. | Read-only authenticated test session for final rendered acceptance. Existing bounded query stays unchanged. | Staff see the correct sample scope and cargo mode. | Low to medium: shared props and sibling routes. No query or financial behavior change. | P2 / S–M |
| UX-09 | `components/kokonutui/ai-input-search.tsx`; homepage assistant | Change/shortcut text renders at 11px/10px; menu hints use 11px. | Apply existing `text-xs` to active text. Replace touched raw text/surface colors with existing semantics. Edit installed source in place. | None. Compare both themes and tool menu. | Readable controls that meet the 12px project floor. | Low to medium: narrow tool menu, truncation, keyboard shortcut positioning. | P2 / S |
| UX-10 | `components/public/landing/contact-section.tsx`; `/#contact` | New async failure text has no announcement semantics; field errors lose context. | Use the installed Alert/form conventions for the existing error. Associate available field errors with inputs; retain values and retry. Use a focused summary only when warranted. | Isolated synthetic failure transport or database-free test server. Never submit fixtures to the configured database. | Failure is discoverable by keyboard/screen reader and preserves recovery. | Medium: native validation, async result shape, pending/resubmission. | P2 / S–M |
| UX-11 | `docs/DESIGN.md`, root `DESIGN.md`, relevant documentation links; all route families | Font, palette history, and label rules conflict. | Reconcile documentation to the approved executed system. Mark superseded directions explicitly. Preserve fonts, colors, density, and geometry during this task. | Owner approval of the current design authority. | One coherent future implementation reference. | Low: documentation; medium if approval changes actual design direction, which would require separate scope. | P2 / S |
| UX-14 | `components/public/nav-client.tsx`, `site-navigation.tsx`, `page-intro.tsx`; PublicPage content routes | Tracked monospace capitals and duplicate category eyebrows conflict with current UI rules. | Use existing sans sentence-case navigation labels. Preserve breadcrumbs and remove the redundant PageIntro eyebrow paragraph. Preserve heading scale and destinations. | None; validate all shared content consumers. | Consistent public typography without new tokens or fonts. | Low to medium: navigation width, mobile menu, intro spacing. | P2 / S |

Phase 2 acceptance checks:

1. Follow each revised bulletin link and compare its label with destination content.
2. Inspect both operation routes with synthetic records, including more than 100 eligible records in isolated staging.
3. Verify count labels without changing the bounded query.
4. Inspect assistant control sizes at 320px in light and dark themes.
5. Reject a synthetic booking request without database or provider writes.
6. Verify announcement semantics, retained values, and enabled resubmission.
7. Search reconciled documentation for conflicting font and palette directions.
8. Compare all public content headers and both navigation branches after the shared typography correction.

## Phase 3: shared register composition

Approved and implemented: UX-08. One surface owner; standalone framing remains the default.

| Finding | Affected files and routes | Existing problem | Proposed solution / component | Dependencies | Expected outcome | Regression risk | Priority / complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UX-08 | `components/ui/data-table/data-table.tsx`; `components/operations/shipment-register.tsx`; enclosed adapters under `app/dashboard/shipments`, `invoices`, `customers`, and `manifests` | An enclosing card-like region contains another bg-card/border/shadow table surface. | Reuse the existing `bordered` contract. Make unbordered tables surface-neutral and opt enclosed consumers into that mode. Keep standalone tables unchanged. Trace other consumers before editing. | Authenticated before/after screenshots of affected routes and a standalone-table exemplar. | Each record region has one surface owner. | Medium: column controls, pagination, focus ring clipping, standalone consumers. | P2 / M |

Keep TableToolbar Reset, page-level creation actions, route Skeletons, and error-boundary Retry. Their existence means generic empty-state text is not evidence that every register lacks recovery.

If a selected consumer needs improved empty copy, use its existing filter/create action. Do not add a universal state-management abstraction or duplicate error boundaries.

Acceptance checks:

1. Compare enclosed and standalone tables with records and without records.
2. Apply and reset server filters; preserve query state, sorting, and pagination.
3. Check zero-page and last-page pagination labels.
4. Verify keyboard access to horizontal table scroll at 320px and 768px.
5. Verify borders and focus indicators in light and dark themes.

## Phase 4: navigation and development previews

Approved and implemented: UX-12/13. Tracking is visible in the header; preview actions wrap.

| Finding | Affected files and routes | Existing problem | Proposed solution / component | Dependencies | Expected outcome | Regression risk | Priority / complexity |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UX-12 | `components/public/landing/landing-nav.tsx`; `/` | Existing tracking is available mainly through the long-page footer/assistant. | Consider a visible Track a shipment Link in the existing navigation. Select placement after inspecting 768px width. | Explicit product selection; Phase 1 modal correction. | Returning users reach `/track` sooner. | Medium: tablet header width and action hierarchy. | P3 / S |
| UX-13 | `app/(landing)/docs-preview/page.tsx`; development-only `/docs-preview` | Centered physical label and preview actions clip at 320px despite contained document width. | Put the label in a left-aligned horizontal scroll region; wrap actions. Preserve physical document dimensions and print styles. | Approved with all remaining phases. | Useful narrow-screen developer preview. | Low: development screen; physical output must stay unchanged. | P3 / S |

UX-12 is a usability recommendation, not an acceptance defect. UX-13 is a verified development-only defect. Neither blocks production solely on this audit evidence. Do not remove existing content routes, legal pages, support, feedback, or staff entry to simplify navigation.

## Components to retain and research decisions

| Existing owner | Decision and reason |
| --- | --- |
| Radix Sheet/Dialog/AlertDialog | Retain overlay accessibility ownership. Sheet supplies the targeted UX-01 correction. [Official Sheet reference](https://ui.shadcn.com/docs/components/radix/sheet). |
| Shared shadcn Table/DataTable and TanStack v8 | Retain server pagination, sorting, and URL contracts. [Official Data Table reference](https://ui.shadcn.com/docs/components/radix/data-table). |
| [ReUI Data Grid preview](https://reui.io/components/data-grid?ref=mcp) | Do not install. Current MCP API targets v9 and presents Base UI dependencies; migration compatibility is not established. |
| [ReUI Filters preview](https://reui.io/components/filters?ref=mcp) | Do not install. Its boolean tree exceeds the demonstrated simple-filter requirement. |
| [ReUI Badge preview](https://reui.io/components/badge?ref=mcp) | Retain installed implementation. Use documented semantic light variants for approved state edits. |
| SearchSelect and lookup adapters | Retain current label propagation, corridor options, loading/error/retry handling. |
| AppShell/PageHeader/sidebar | Retain sticky structure, role visibility, navigation, and current density. |
| Freight STEM and invoice persistence | Preserve formulas, business rules, API contracts, authorization, and document values. |

No new dependency is required by the proposed phases. The shadcn MCP limitation belongs to the original audit. Installed component sources remain authoritative; no new component installation was required.

## Verification and release boundaries

Before each approved UI batch, publish the ReUI plan: surface, archetype, container family, density, regions, states, and motion. Use the installed variants and props. Run the prescribed ReUI checks on changed source, at most two rounds, and report remaining findings. Do not apply generic radius variation or retime installed components.

Run the repository Definition of Done after approved implementation: typecheck, unit tests, lint, stylelint, token audit, production build, Delivery Gate, and Ponytail review. Add focused tests only for meaningful behavior, including modal focus and deterministic hydration. A one-link copy correction needs navigation verification, not an artificial unit test mirroring its string.

Authenticated acceptance still requires real rendered evidence for every affected route, all relevant states, both themes, desktop/laptop/tablet/mobile, and keyboard interaction. Use an authorized isolated staging environment for mutations. Keep production data and outbound providers outside audit fixture tests.

The audit's local passes are a baseline, not post-implementation evidence. Record fresh outcomes and limitations after each approved batch. Existing framework-generated type artifacts and build output do not count as application implementation.

After approved implementation, update the requested audit/roadmap and create the implementation report, QA verification, and final summary only when their corresponding work exists. Do not create completion reports before implementation.

## Completion and acceptance

All four implementation phases are approved and implemented. There are no pending finding implementations.
The tables above preserve the original proposed work and acceptance criteria.
See the implementation report and QA verification for current outcomes and remaining authenticated/hosted evidence limits.
