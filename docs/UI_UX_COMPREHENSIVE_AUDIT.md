# TAC-XPRESS comprehensive UI/UX audit

Date: 4 November 2026, Asia/Calcutta. Status: all implementation phases approved and implemented; local Delivery Gate PASS.

## Current implementation status

The owner approved all remaining phases with "implement all the pending phases". UX-01 through UX-14 are implemented. Correcting unsupported advisory claims also corrected UX-06's destination labels. See the [implementation report](UI_UX_IMPLEMENTATION_REPORT.md) and [QA evidence](UI_UX_QA_VERIFICATION.md).

| Findings | Current disposition |
| --- | --- |
| UX-01/02/03/04/05 | Implemented and locally verified |
| UX-06 | Corrected alongside UX-02 and locally verified |
| UX-07/08/09/10/11/12/13/14 | Implemented; public browser, isolated register, and mocked-server evidence are recorded in QA |

Sections 1–17 below preserve the original audit baseline and its evidence. Their descriptions of defects, unchanged source, and approval requirements refer to that baseline. The linked implementation/QA reports record the current change set. No hosted or whole-product acceptance is implied.

## 1. Executive summary

Retain the existing application, its compact operations workspace, sharp geometry, semantic colors, and installed Radix/shadcn components. No evidence supports a rebuild or a new visual system.

The highest priorities are truthful operational information, the exclusive New Delhi–Imphal service boundary, and keyboard navigation. Three P1 findings remain: the homepage mobile modal leaks focus, generated data appears as measured telemetry, and the assistant advertises an unsupported gateway.

This audit accounts for **49 page files, 38 layout/loading/error/not-found files, and 24 route handlers**. It also accounts for both supported service parameter values. Every page entry received source inspection. Eleven public/authentication URL instances received rendered checks at 1440, 1280, 768, and 320 CSS pixels. Ten additional content/authentication pages and a missing-page response received 390px checks. The homepage also received 390px interaction checks.

**Coverage is complete for file-backed route discovery, but incomplete for authenticated visual acceptance.** Protected screens were inspected in source. Six representative protected URLs redirected to sign-in. The discovered Vercel Preview requires Vercel authentication; the connector could not fetch it, and the CLI had no credentials. No authenticated operations, real shipment lookup, provider submission, financial mutation, or production acceptance is claimed.

Local checks pass: typecheck, 505 unit tests across 74 files, lint with 75 warnings and zero errors, stylelint, token audit, and production build. These checks do not clear the 14 findings below.

### Evidence rules and preservation

- **B:** browser-observed. **S:** source-confirmed. **M:** actual MCP response. **R:** recommendation requiring product judgment.
- P0: critical defect. P1: high impact. P2: moderate improvement. P3: optional refinement. No P0 finding was established.
- Source references describe the current working tree, not only Git HEAD `6baaa954d2ddd42739c9e57de86affc14a12ada9`.
- The initial tree contained substantial tracked modifications and untracked reports. This audit preserves that work.
- Only reports and audit evidence were added. Application source, dependencies, database definitions, and deployments were not changed.
- This report consolidates current evidence without deleting historical Mission 02B/03C reports or treating their old checks as fresh results.

Evidence directory: [ui-ux-2026-11-04](audit-evidence/ui-ux-2026-11-04/). Machine-readable discovery: [source-inventory.json](audit-evidence/ui-ux-2026-11-04/source-inventory.json). Final artifact checks: [verification-summary.json](audit-evidence/ui-ux-2026-11-04/verification-summary.json). All 49 page paths and 14 finding IDs were reconciled against the reports; local evidence links resolve. SHA-256 comparisons found no changes in 687 product-source files during the report-writing and build checks.

## 2. Application architecture overview

| Area | Current evidence | Audit decision |
| --- | --- | --- |
| Framework | `package.json`: Next.js 16.4.3, React 19.2.4, TypeScript, pnpm. App Router owns page routes. | Retain. Installed Next.js layout/page documentation was read. |
| Request boundary | `proxy.ts`, guarded layouts, `lib/auth/page-access.ts`. | Preserve all guards. A sign-in redirect does not verify the protected screen. |
| Backend | Server Actions, route handlers, Drizzle/Postgres, Supabase identity and storage integrations. | Inspect frontend contracts only; no schema, SQL, RLS, or migration changes. |
| Authentication | Provisioned staff/admin workspace; NextAuth and MFA/passkey interfaces. | Preserve role checks and recovery behavior. No customer dashboard is proposed. |
| State | Server-rendered queries, URL query state through nuqs, TanStack Query provider, local component state. | Preserve server pagination and existing request contracts. |
| Tables | TanStack Table 8.21.3, shared `useDataTable`, installed shadcn `Table` and `DataTable`. | Refine existing owners before considering migration. |
| Styling | Tailwind v4, `app/globals.css`, `app/typeset.css`, semantic OKLCH tokens and public scopes. | Retain executed tokens; reconcile contradictory documentation separately. |
| UI ecosystem | `radix-nova` in `components.json`; Lucide; ReUI Badge; Kokonut components; Radix overlays; Sonner. | Do not mix Base UI registry code into the Radix application without compatibility proof. |
| Reporting | Recharts and operation-specific charts. Sampled overview charts enable `accessibilityLayer`. | Retain; authenticated chart behavior and every color pair remain unverified. |
| Observability | Sentry/PostHog providers; route errors report exceptions. | Preserve critical error reporting. |
| Deployment | `next.config.ts`, Vercel configuration, preview records. | Read-only discovery; no deployment actions. |

Reviewed documentation includes root `AGENTS.md`, `README.md`, `DESIGN.md`, `docs/DESIGN.md`, `docs/ARCHITECTURE.md`, Mission 02B/03C, and the 4 November frontend toolkit report. Some documents referenced by older reports are absent; their existence was not assumed. No top-level release-notes or changelog document was required to invent missing context.

## 3. Complete route inventory

All page-file paths below are relative to `app/`. **I-B** means source inspected and browser rendered. **I-S** means source inspected; authenticated rendering remains unverified. **I-D** means development-only source/render inspection. Shared-component findings apply only where import paths establish a consumer.

Layout keys: **H** homepage `LogisticsHome`; **P** `PublicPage` with SiteNavigation/SiteFooter; **A** two-column staff sign-in; **W** guarded dashboard AppShell; **D** guarded driver AppShell; **I** invoice layout/document authorization; **L** compatibility redirect; **X** development diagnostic. Root layout supplies fonts, themes, query/URL providers, tooltips, and toasts to all families.

Responsive keys: **PUB** rendered matrix at 1440/1280/768/320; **REG** source has shared horizontal table scroll and responsive headers; **GRID** source has breakpoint grids; **FLOW** source has fluid form/dialog composition; **REDIR** no independent content. REG/GRID/FLOW do not imply runtime acceptance. UX-14 applies to every P-family content route in this table.

| Route | Page file | Purpose | Layout | Important components | Responsive | Audit status | Issues / disposition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | `page.tsx` | Explain, price, inquire, support | H | LandingNav, HeroSection, ActivityTerrain, tariffs, ContactSection, SupportChat | PUB; 390 interactions | I-B | UX-01/02/03/05/06/09/10/12 |
| `/signin` | `(auth)/signin/page.tsx` | Staff authentication | A | LoginForm, alerts, theme control | PUB; 390 | I-B | Retain; authenticated/MFA outcomes untested |
| `/services` | `services/page.tsx` | Compare existing cargo services | P | HomeServices, ServiceComparison, ShippingSteps, FAQ | PUB; 390 | I-B | Retain; UX-11 documentation applies |
| `/services/[service]` | `services/[service]/page.tsx` | Service-specific explanation | P | PageIntro, service content, steps, FAQ | PUB for both supported values | I-B for known values; S for fallback | Unknown values call notFound; no other service invented |
| `/services/air-cargo` | Same dynamic page | Air cargo explanation | P | Service content | PUB; 390 | I-B | Content says 24–48h; reconcile with homepage 24h claims under UX-02 |
| `/services/surface-cargo` | Same dynamic page | Surface cargo explanation | P | Service content | PUB; 390 | I-B | Retain |
| `/shipping-guide` | `shipping-guide/page.tsx` | Prepare cargo | P | ShippingPreparation, TrackingExplainer, FAQ | PUB; 390 | I-B | Retain; not an advisory article destination, UX-06 |
| `/about` | `about/page.tsx` | Explain operating relationship | P | HomeStory, principles, contact action | PUB; 390 | I-B | Retain content structure; typography conventions need reconciliation, UX-11 |
| `/contact` | `contact/page.tsx` | Inquiry/support | P | ContactSection, TicketForm | PUB; 390 | I-B | Error-branch semantics inspected; successful submission not attempted |
| `/track` | `track/page.tsx` | Public AWB lookup | P | GET form, Alert, TrackingDetails | PUB; 390; invalid-format lookup | I-B | UX-04; initial/invalid states tested, real result untested |
| `/feedback` | `feedback/page.tsx` | Submit feedback | P | TicketForm | PUB; 390 | I-B | No submission; preserve feedback and contact modes |
| `/terms` | `terms/page.tsx` | Terms of carriage | P | PageIntro, policy sections | PUB; 390 | I-B | Preserve legal content; no legal accuracy certification |
| `/dashboard` | `dashboard/page.tsx` | Operations overview | W | OverviewMetrics, work queue, charts, control center | GRID | I-S; sign-in gate observed | Retain real-query structure; authenticated visuals unverified |
| `/dashboard/shipments` | `dashboard/shipments/page.tsx` | Shipment register | W | ShipmentRegister, TableToolbar, ShipmentsDataTable | REG | I-S; sign-in gate observed | UX-08; state refinement optional |
| `/dashboard/shipments/[id]` | `dashboard/shipments/[id]/page.tsx` | Shipment detail and updates | W | StatusBadge, timeline, tracking dialog, CargoDocuments | GRID/FLOW | I-S | Retain; real record/dialog states unverified |
| `/dashboard/dispatch` | `dashboard/dispatch/page.tsx` | Dispatch availability and runs | W | DispatchClientLayout, Tabs, create dialog, run table | GRID/REG | I-S | Retain explicit handover workflow; drag-board replacement unjustified |
| `/dashboard/manifests` | `dashboard/manifests/page.tsx` | Load planning and handoff | W | CreateManifestDialog, ManifestClientTable, export | REG/FLOW | I-S | UX-08; finalized/receipt states require staging |
| `/dashboard/warehouse` | `dashboard/warehouse/page.tsx` | Warehouse intake register | W | ShipmentRegister in warehouse mode, ScannerDialog | REG | I-S | UX-08; retain scanner and audit actions |
| `/dashboard/warehouse/audit` | `dashboard/warehouse/audit/page.tsx` | Scan reconciliation | W | WarehouseAuditTable, scanner provider | GRID/REG | I-S | Real scan/device and recovery behavior unverified |
| `/dashboard/tracking` | `dashboard/tracking/page.tsx` | Staff AWB/scanner station | W | ScannerStation | FLOW/GRID | I-S | Retain manual fallback and text errors; camera untested |
| `/dashboard/fleet` | `dashboard/fleet/page.tsx` | Vehicles and drivers | W | FleetTabsClient, two tables, add dialogs | REG/FLOW | I-S | Retain unified module; no separate driver-management page invented |
| `/dashboard/hubs` | `dashboard/hubs/page.tsx` | Corridor hub records | W | HubsClientTable, AddHubDialog | REG/FLOW | I-S | Runtime labels/data unverified; preserve corridor validation |
| `/dashboard/invoices` | `dashboard/invoices/page.tsx` | Billing register | W | Financial summary, InvoiceDataTable, export | REG/GRID | I-S | UX-08; retain integer-paise/domain calculations |
| `/dashboard/invoices/create` | `dashboard/invoices/create/page.tsx` | Shipment/invoice wizard | W | WizardForm, step fields, lookup adapters | FLOW | I-S | Retain existing city, label, retry fixes; submission untested |
| `/dashboard/customers` | `dashboard/customers/page.tsx` | Customer directory | W | CustomerDataTable, AddCustomerDialog, export | REG | I-S | UX-08; retain ledger entry points |
| `/dashboard/customers/[id]/ledger` | `dashboard/customers/[id]/ledger/page.tsx` | Customer financial history | W | Summary cards, LedgerDataTable | GRID/REG | I-S | Preserve balances; authenticated record required |
| `/dashboard/staff` | `dashboard/staff/page.tsx` | Admin team management | W | StaffClientTable, AddStaffDialog | REG | I-S; sign-in gate observed | requireAdminPage; role-filtered navigation already exists |
| `/dashboard/pricing` | `dashboard/pricing/page.tsx` | Corridor rate rules | W | PricingDataTable, calculator, pricing dialogs | GRID/REG | I-S | Retain STEM functions and corridor enforcement |
| `/dashboard/messages` | `dashboard/messages/page.tsx` | Support inbox | W | TicketsClient, ticket dialog, OutboundMessageLog | REG/FLOW | I-S | Retain provider-state distinction; reply/provider effects untested |
| `/dashboard/feedback` | `dashboard/feedback/page.tsx` | Feedback review | W | FeedbackMetrics, FeedbackClientTable | GRID/REG | I-S | Retain; public/embedded preview links need authenticated walkthrough |
| `/dashboard/communications` | `dashboard/communications/page.tsx` | Notification attempts and queues | W | DeliveryHistory, job/email summaries | GRID/REG | I-S | Retain real attempts; do not equate accepted with delivered |
| `/dashboard/jobs` | `dashboard/jobs/page.tsx` | Admin retries/DLQ | W | FailedJobsTable, DlqTable | REG | I-S | requireAdminPage; no retries executed |
| `/dashboard/analytics` | `dashboard/analytics/page.tsx` | Period-based reporting | W | AnalyticsTabsContainer, date range, CSV, charts | GRID; source scroll chain | I-S | Retain; keyboard chart/scroll and period changes unverified |
| `/dashboard/metrics` | `dashboard/metrics/page.tsx` | Service-level reporting | W | SLA/delivery charts, breach history | GRID | I-S | Period described; retain denominator-aware pattern |
| `/dashboard/operations/air-cargo` | `dashboard/operations/air-cargo/page.tsx` | Air workload | W | OperationsDashboardPage, table, charts | GRID/REG | I-S | UX-07: latest 100 rows presented as totals |
| `/dashboard/operations/surface-cargo` | `dashboard/operations/surface-cargo/page.tsx` | Surface workload | W | Same shared operations composition | GRID/REG | I-S | UX-07; shared copy also says air cargo |
| `/dashboard/integrations` | `dashboard/integrations/page.tsx` | Integration configuration/status | W | WebhookEndpointsCard, ScannerTest, status cards | GRID | I-S | Preserve secret masking and provider states; no tests sent |
| `/dashboard/settings` | `dashboard/settings/page.tsx` | Settings entry | W/L | Redirect to security | REDIR | I-S | Intentional compatibility route |
| `/dashboard/settings/security` | `dashboard/settings/security/page.tsx` | MFA and passkeys | W | MfaSecuritySettings | FLOW | I-S | Preserve account security; no enrollment/recovery executed |
| `/driver` | `driver/page.tsx` | Driver entry | D/L | Redirect to delivery | REDIR | I-S | Intentional redirect |
| `/driver/delivery` | `driver/delivery/page.tsx` | Assigned delivery manifest | D | DeliveryClient, filter, scan controls | FLOW/REG | I-S; sign-in gate observed | Retain truthful offline restriction; device/keyboard unverified |
| `/driver/delivery/[id]` | `driver/delivery/[id]/page.tsx` | Delivery details/POD | D | DeliveryDetails, signature/document flow | FLOW | I-S | No receipt, signature, or delivery mutation executed |
| `/invoice/[id]` | `invoice/[id]/page.tsx` | Authorized invoice display | I | InvoiceView | Physical document with screen preview | I-S; synthetic-ID sign-in gate observed | Document auth preserved; dev sample is not a real invoice |
| `/invoice/[id]/label` | `invoice/[id]/label/page.tsx` | Authorized shipping label | I | ShippingLabel, PrintButton | Scroll container; print scale | I-S | Print/PDF and real record not verified |
| `/portal` | `portal/page.tsx` | Legacy entry | L | Staff guard; redirect `/dashboard` | REDIR | I-S; sign-in gate observed | Not a customer portal |
| `/portal/shipments` | `portal/shipments/page.tsx` | Legacy shipments | L | Staff guard; redirect `/dashboard/shipments` | REDIR | I-S | Retain |
| `/portal/invoices` | `portal/invoices/page.tsx` | Legacy invoices | L | Staff guard; redirect `/dashboard/invoices` | REDIR | I-S | Retain |
| `/portal/tickets` | `portal/tickets/page.tsx` | Legacy support | L | Staff guard; redirect `/dashboard/messages` | REDIR | I-S | Retain |
| `/portal/track` | `portal/track/page.tsx` | Legacy staff tracking | L | Staff guard; redirect `/dashboard/tracking` | REDIR | I-S | Public lookup remains `/track` |
| `/docs-preview` | `(landing)/docs-preview/page.tsx` | Synthetic document design studio | X | ShippingLabel, InvoiceDocument, preview dialog | Rendered 1440/320; label clips at 320 | I-D | UX-13; production calls notFound; print acceptance not claimed |
| `/sentry-example-page` | `sentry-example-page/page.tsx` | Development diagnostics | X | Diagnostic buttons | Source flow; rendered heading | I-D | Production calls notFound; buttons deliberately not activated |

The two expanded service rows do not increase the 49 page-file count. Dynamic shipment/customer/document IDs represent data instances, not additional file routes. No separate payments, notifications, or driver-directory page was invented. Fleet, communications, invoices, and driver delivery own those existing concerns.

### Shared boundaries and non-page routes

There are five layout files: root, dashboard, driver, invoice, and portal. Dashboard/driver layouts own staff access and AppShell. Portal layout is passthrough; each compatibility page owns its guard/redirect. Invoice pages call document authorization. Source-inspected status means the route entry, guards, layout, and principal composition were examined; it does not certify every nested control or conditional branch.

The 38-file boundary inventory includes root `error.tsx`, `global-error.tsx`, `not-found.tsx`, dashboard error/loading boundaries, route skeletons, nested shipment errors, and portal error recovery. Dashboard errors already report to Sentry and offer Try again. These were inspected in source, not fault-injected in an authenticated session. The root 404 rendered at 390px and returned HTTP 404 with recovery links.

All 24 route handlers are listed in `source-inventory.json`: `/auth/callback`; `/api/auth/[...nextauth]`; `/api/auth/capabilities`; `/api/chat`; `/api/customers`; `/api/drivers`; `/api/hubs`; `/api/vehicles`; `/api/health`; `/api/workspace-activity`; `/api/documents`; `/api/documents/download`; `/api/cargo-documents/[entity]/[id]`; `/api/staff-avatar/[id]`; `/api/public/invoice-pdf`; `/api/manifests/[id]/print`; `/api/fleet/telemetry`; `/api/stream/tracking`; `/api/webhooks/carrier`; `/api/webhooks/whatsapp`; `/api/cron/cleanup`; `/api/cron/communications`; `/api/cron/sla-check`; `/api/sentry-example-api`. These are integration endpoints, not additional UI screens. No webhook, cron, diagnostic, or mutation endpoint was exercised.

Metadata endpoints are also accounted for: `app/robots.ts` serves `/robots.txt`, `app/sitemap.ts` serves `/sitemap.xml`, `app/manifest.ts` serves `/manifest.webmanifest`, and `app/favicon.ico` supplies the favicon. These are metadata/assets, not page screens. No additional page/route file extensions or parallel-route page files were discovered.

## 4. Existing design system analysis

The governing product direction is industrial, factual, compact, and corridor-specific. Root `DESIGN.md` declares ENERGY 2 / RHYTHM 2 / MOTION 2, Inter/IBM Plex Mono, a 12px digital floor, square geometry, and ReUI/shadcn reuse. Source confirms Inter/IBM Plex Mono and semantic teal actions. `docs/DESIGN.md` additionally contains older violet and IBM Plex Sans claims. UX-11 records the conflict; it does not authorize changing the running palette.

Keep semantic token ownership in `app/globals.css`. Typography uses shared scales and utility overrides. Public display text and compact staff metadata have different purposes. Do not replace 12px metadata with a global 16px rule from generic skill defaults. Do not interpret zero-radius industrial geometry as an invitation to introduce varied radii.

ReUI/shadcn contracts outrank generic design-search suggestions. UI UX Pro Max was used for targeted validation/error, table, and Next.js boundary guidance. No new design-system generator output was persisted because this is an audit of an established system.

## 5. Page-by-page findings

### UX-01 — P1: homepage mobile modal leaks keyboard focus

- **Route/component:** `/`, `LandingNav`.
- **Current implementation:** Motion container declares `role="dialog"` and `aria-modal="true"`; a window listener handles Escape.
- **Problem:** Focus remains on the external toggle when opened, then leaves the menu for hero actions while the modal remains open.
- **Evidence:** B: [mobile-menu-keyboard.txt](audit-evidence/ui-ux-2026-11-04/mobile-menu-keyboard.txt), 390px. Tab positions 8–10 are outside the dialog. Escape returns focus correctly. S: `components/public/landing/landing-nav.tsx:21-36`, `:195-207`.
- **Recommendation:** Replace only the custom modal container with the installed Radix Sheet composition. Preserve links, scroll behavior, theme control, and trigger.
- **Benefit/complexity:** Predictable modal keyboard behavior; small change with medium focus/scroll regression risk.
- **Classification:** B+S verified defect. Accessibility review includes focus order and modal semantics; no whole-site WCAG verdict.

### UX-02 — P1: generated activity is presented as measured operations

- **Route/component:** `/`, TelemetryStatsBand, ActivityTerrain, related commercial claims and cinema modal.
- **Current implementation:** Copy says activity is measured directly. Terrain defaults to a seeded generator normalized to 8,314,549kg. No actual data prop is passed. Static counters state volume, growth, SLA, and verification claims.
- **Problem:** Demonstration data is indistinguishable from actual operational evidence. A video-labelled cinema action opens a static image with live-radar/GPS wording.
- **Evidence:** S: `components/kokonutui/activity-terrain.tsx:118-142`, `:350`; `components/public/landing/telemetry-stats-band.tsx:29`, `:60-112`; `components/public/landing/corridor-cinema-section.tsx:53-100`. B: homepage screenshots and [interaction-checks.txt](audit-evidence/ui-ux-2026-11-04/interaction-checks.txt) show the live-transit wording and static modal. Service detail says 24–48h while homepage says 24h.
- **Recommendation:** Remove public simulated measurements and live-status claims until supported. Retain factual corridor/service explanation. Label retained illustrative imagery as illustration and name its action accurately. Verify other commercial claims with the owner before publishing them as facts.
- **Benefit/complexity:** Trustworthy booking expectations; medium content scope. No new telemetry backend is requested.
- **Classification:** B+S verified generated-data mismatch. Other certifications, testimonials, fares, and airline-capacity claims are **unverified**, not proven false by their presence in source.

### UX-03 — P1: assistant menu advertises an unsupported gateway

- **Route/component:** `/`, SupportConversation tool menu.
- **Current implementation:** Route inquiry hint says `DEL, IMF, CCU and all gateways`.
- **Problem:** The visible hint offers service scope beyond the exclusive New Delhi–Imphal corridor.
- **Evidence:** S: `components/public/support-conversation.tsx:50-54`. B: [assistant-detail.txt](audit-evidence/ui-ux-2026-11-04/assistant-detail.txt) and [assistant-tools-320-dark.png](audit-evidence/ui-ux-2026-11-04/assistant-tools-320-dark.png). Menu opened by keyboard; no AI message sent.
- **Recommendation:** Change this hint to the two approved endpoints and directions. Check other reachable tool hints for the same contract.
- **Benefit/complexity:** Accurate service selection; small copy change. This finding does not demonstrate a server routing bypass.
- **Classification:** B+S verified business-boundary presentation defect.

### UX-04 — P2: tracking error recovery targets a missing section

- **Route/component:** `/track`, error Alert link.
- **Current implementation:** `contact support` links to `/#support`.
- **Problem:** The homepage has no `support` ID, so recovery navigates home without reaching support.
- **Evidence:** S: `app/track/page.tsx:65-66`. B: [tracking-recovery.txt](audit-evidence/ui-ux-2026-11-04/tracking-recovery.txt). An invalid-format `awb=!` returns before database lookup; the clicked link resolves to `/#support`, target absent.
- **Recommendation:** Link this existing recovery action to `/contact`.
- **Benefit/complexity:** Reliable next step after lookup failure; small change.
- **Classification:** B+S verified defect. Real AWB data was not queried.

### UX-05 — P2: reduced-motion preference causes hero hydration mismatch

- **Route/component:** `/`, HeroSection.
- **Current implementation:** `useState(!shouldReduceMotion)` and video autoPlay derive initial markup from `useReducedMotion()`.
- **Problem:** Server and reduced-motion client render different playback icons/markup; React regenerates the tree.
- **Evidence:** S: `components/public/landing/hero-section.tsx:11-12`, `:116`, `:136-139`. B: [reduced-motion-hydration.txt](audit-evidence/ui-ux-2026-11-04/reduced-motion-hydration.txt). Two fresh pages with reduced motion reproduced the hydration error before any screenshot. Video ultimately remained paused with Play label.
- **Recommendation:** Use deterministic initial playback markup. Reconcile preference and actual video state after mount, including playback failure/end events as needed.
- **Benefit/complexity:** Stable initial rendering and trustworthy playback state; small to medium change.
- **Classification:** B+S verified technical UI defect. Separate caret-style warnings during early screenshots were excluded from this finding.

### UX-06 — P2: advisory article labels lead to general pages

- **Route/component:** `/`, DispatchBulletinsSection.
- **Current implementation:** Three specific operational headlines have `Read article` links; two target `/shipping-guide`, one `/services/air-cargo`.
- **Problem:** Destinations do not contain the promised specific articles.
- **Evidence:** S: `components/public/landing/dispatch-bulletins-section.tsx:17`, `:27`, `:37`, `:68`, `:96`. B confirms these destination pages render general guides/service information; no article route was discovered.
- **Recommendation:** Replace advisory/article claims and link labels with accurate descriptions of the existing destinations. Do not create a blog or invent advisory content.
- **Benefit/complexity:** Predictable navigation; small copy/composition change.
- **Classification:** S verified content/destination mismatch, with rendered destination evidence.

### UX-07 — P2: operations totals hide the latest-100-record limit

- **Routes/component:** `/dashboard/operations/air-cargo`, `/dashboard/operations/surface-cargo`, OperationsDashboardPage.
- **Current implementation:** Both queries limit results to 100 and derive totals from `rows.length`. Labels say Total Air Volume/Total Dispatches; shared context says total active bookings. Shared distribution description always says air cargo.
- **Problem:** Presented totals lack their sample denominator; surface cargo inherits incorrect mode wording. Delivered rows are not excluded by the query, despite active labels.
- **Evidence:** S: air page `:27`, `:42-45`; surface page `:30`, `:45-48`; shared component `:84`, `:142`. Existing shortcut comments acknowledge the query cap.
- **Recommendation:** Keep the bounded query. Label the figures and table as the latest up to 100 records, and pass the correct cargo-mode description through the existing composition. Avoid implying all-time or active-only totals.
- **Benefit/complexity:** Honest operational interpretation; small shared copy/prop change. No aggregate-query rewrite required.
- **Classification:** S verified presentation/denominator defect; no live operational counts verified.

### UX-08 — P2: register compositions duplicate card containment

- **Routes/components:** shipments, warehouse, invoices, customers, manifests; shared DataTable.
- **Current implementation:** Route registers wrap tables in bordered `bg-card` surfaces. DataTable always adds an inner `bg-card`, plus border/shadow by default.
- **Problem:** The same record region owns two card-like surface layers, contrary to the repository single-containment rule.
- **Evidence:** S: `components/ui/data-table/data-table.tsx:31-43`; `components/operations/shipment-register.tsx:160-178`; invoice page record section; customers page record section; manifests page Card and ManifestClientTable. Consumer table adapters call DataTable without opting out. `bordered={false}` removes the inner border but currently leaves its `bg-card`.
- **Recommendation:** Let the enclosing record region own its surface. Reuse the existing `bordered` option, make its unbordered branch genuinely surface-neutral, and thread it only through enclosed consumers. Preserve standalone tables.
- **Benefit/complexity:** Clearer grouping and fewer competing borders; medium change across a small set of consumers.
- **Classification:** S verified design-contract defect. Authenticated visual severity remains unverified; no table replacement recommended.

### UX-09 — P2: assistant controls violate the 12px text floor

- **Route/component:** `/`, AIInputSearch tool controls.
- **Current implementation:** Change control uses 11px; its shortcut uses 10px. Tool hints/menu metadata also use 11px source classes and hardcoded black/zinc treatments.
- **Problem:** Actual interactive controls use sizes below the documented digital floor.
- **Evidence:** B: computed styles in [assistant-detail.txt](audit-evidence/ui-ux-2026-11-04/assistant-detail.txt), 320px. S: `components/kokonutui/ai-input-search.tsx:336`, `:677`, `:725`, `:737`, `:942`.
- **Recommendation:** Apply `text-xs` to active controls and hints. Use existing semantic text/surface tokens when touching those same lines. Retain the installed component and keyboard behavior.
- **Benefit/complexity:** Readable compact controls; small change. No blanket control-height or font redesign.
- **Classification:** B+S verified contract defect; not an automatic WCAG text-size failure.

### UX-10 — P2: homepage booking errors lack announcement semantics

- **Route/component:** `/#contact`, landing ContactSection.
- **Current implementation:** Async submitError appears in an ordinary div above the fields; focus remains at submission. Field-specific server errors collapse to a generic message.
- **Problem:** New failure text has no live/status/alert semantics or controlled focus target. The label/error relationship is weaker than the installed form primitives.
- **Evidence:** S: `components/public/landing/contact-section.tsx:59-64`, `:206-210`. The error branch was inspected; no real booking was submitted or fault-injected.
- **Recommendation:** Announce the existing form-level failure using the installed Alert/appropriate alert semantics. Map returned field errors to their fields where available; preserve entered values and resubmission.
- **Benefit/complexity:** Perceivable recovery; small to medium change. Use a focusable summary only when multiple field errors justify one.
- **Classification:** S verified missing semantics; screen-reader outcome remains untested.

### UX-11 — P2: design documentation gives conflicting implementation directions

- **Scope:** Shared design references affecting all routes.
- **Current implementation:** Root DESIGN specifies Inter; `docs/DESIGN.md:16`, `:91-96` says IBM Plex Sans. Its opening direction references violet, while later sections and executed tokens use teal. Its tracked uppercase label guidance conflicts with current AGENTS rules.
- **Problem:** A future contributor cannot follow both documents consistently.
- **Evidence:** S: `DESIGN.md`, `docs/DESIGN.md:13-16`, `:25-49`, `:91-109`, `app/layout.tsx:2-16`, `app/globals.css:506`, `:633`. B: computed Inter font and teal surfaces in screenshots.
- **Recommendation:** After approval, reconcile the design documentation to the current approved system and explicitly mark historical directions. Preserve runtime fonts/colors during that documentation correction.
- **Benefit/complexity:** Fewer contradictory future edits; small documentation change with owner review.
- **Classification:** S verified documentation defect, not approval for a palette change.

### UX-12 — P3: homepage tracking entry could be easier to find

- **Route/component:** `/`, LandingNav and hero actions.
- **Current implementation:** Top navigation is Features/Method/Customers/Pricing/Company; hero actions focus on booking/quote. AWB Tracking appears in the footer and assistant.
- **Problem:** Returning shippers may need to search a long page to reach the existing tracking task.
- **Evidence:** B: homepage desktop/mobile screenshots and navigation snapshot. S: LandingNav item map and LandingFooter resources.
- **Recommendation:** Consider a visible Track a shipment link in the existing top navigation. Test the 768px header before selecting its placement.
- **Benefit/complexity:** Faster repeat-user lookup; small change, subject to product approval.
- **Classification:** R subjective usability recommendation. Current tracking route works; this is not a broken-link claim.

### UX-13 — P3: development label preview clips at mobile width

- **Route/component:** `/docs-preview`, development document studio.
- **Current implementation:** A fixed physical-size ShippingLabel sits directly in a centered flex section. Its adjacent preview toolbar stays in one row.
- **Problem:** At 320px, the label's left edge and toolbar actions extend outside the visible area even though document scrollWidth stays at 320px.
- **Evidence:** B: [docs-preview-320.png](audit-evidence/ui-ux-2026-11-04/docs-preview-320.png). S: `app/(landing)/docs-preview/page.tsx:141-165`. The invoice sample separately has an overflow wrapper.
- **Recommendation:** Contain the label in a left-aligned horizontal scroll region and allow the preview actions to wrap. Preserve physical label dimensions and print behavior.
- **Benefit/complexity:** Usable developer inspection at narrow widths; small change.
- **Classification:** B+S verified development-only layout defect. The route calls notFound in production; no production label defect is inferred.

### UX-14 — P2: shared public labels conflict with typography rules

- **Routes/components:** PublicPage content family: services and its two detail values, shipping guide, about, contact, track, feedback, terms. SiteNavigation, NavDesktopLinks/NavMobileSheet, PageIntro.
- **Current implementation:** Navigation and booking labels use `font-mono uppercase tracking-wider`. PageIntro repeats the breadcrumb category above the heading as an eyebrow.
- **Problem:** User-facing navigation uses operational-data typography, while stacked categories and tracked capitals contradict current AGENTS rules.
- **Evidence:** S: `components/public/nav-client.tsx:145`, `:233`, `:261`; `components/public/site-navigation.tsx:35`; `components/public/page-intro.tsx:44-45`. B: services-1440, track-768, and contact-320 screenshots show the pattern. This shared import path reaches the named routes.
- **Recommendation:** Use the existing sans interface face with sentence-case, untracked navigation labels. Keep the breadcrumb and remove the redundant PageIntro eyebrow paragraph. Preserve heading sizes and route destinations.
- **Benefit/complexity:** Clearer hierarchy and conformance across nine content URL instances; small shared change.
- **Classification:** B+S verified design-contract defect. This does not authorize new typography tokens or a font replacement.

## 6. Component-level audit

| Family | Evaluation | Decision |
| --- | --- | --- |
| Button/Input/Textarea/Select | Installed variants include focus, invalid, disabled, and larger mobile input text. Consumers sometimes override dimensions, titles, transitions, and tracked labels. | Retain primitives. Avoid broad restyling; apply contract corrections when an approved consumer is touched. |
| Form and lookup adapters | SearchSelect now forwards trigger IDs/ARIA, lookup retry exists, city choices use the corridor. | Retain. Earlier UI-02/03/07 findings are not repeated as unresolved. |
| Dialog/Sheet/AlertDialog | Installed Radix primitives own focus and overlay behavior. Public content mobile navigation already uses Sheet. | Reuse Sheet for UX-01. Preserve confirmation safeguards. |
| Tables and pagination | Semantic Table, keyboard-focusable horizontal scroll, server query state, named rows-per-page, correct empty-page count. | Retain; refine UX-08. Never migrate the grid solely for visual novelty. |
| Table states | DataTable contains text loading and generic empty text. Route skeletons, page create actions, Reset, and parent Retry boundaries also exist. | State-specific empty copy is optional. Do not claim all tables lack recovery or duplicate existing boundaries. |
| Sidebar and navigation | Sticky `top-0 h-svh`, aria-current, role-aware filtering, mobile closure. | Retain. Admin/staff runtime comparison remains pending. |
| Cards and headers | Existing PageHeader and summary layout are suitable. Some consumers resize CardTitle/use tracked capitals. | Reuse existing variants. Do not create another page-shell abstraction. |
| Badge/Alert | Both shadcn custom semantic badges and ReUI badges exist. | Use installed ReUI light variants for future state edits. Do not bulk-replace legacy badges without rendered need. |
| Tabs, dropdowns, tooltips | Installed primitives provide reusable composition; assistant tools operate by keyboard. | Retain; correct text/scope in UX-03/09. |
| Charts | Existing Recharts wrappers and textual context support operational reporting. Terrain has keyboard inspection but synthetic default data. | Retain real-data charts; remove misleading public measurements under UX-02. |
| Toasts | Sonner exists globally. | Retain; do not rely on a toast alone for form field errors. |
| Documents/scanner/delivery | Existing modules reflect physical cargo and handoff workflows. The development label preview clips despite contained document width, UX-13. | Retain document dimensions; real scan/POD/PDF/print acceptance remains pending. |

## 7. shadcn component evaluation

The named shadcn MCP namespace was unavailable when discovery ran. No shadcn MCP call or successful MCP inspection is claimed. The fallback inspected installed Radix components, `components.json`, and official [Sheet](https://ui.shadcn.com/docs/components/radix/sheet) and [Data Table](https://ui.shadcn.com/docs/components/radix/data-table) documentation.

Sheet already solves the UX-01 focus ownership problem and is already used by SiteNavigation/SupportChat. Table plus TanStack is already the repository's register foundation. Existing Alert, Form, Empty, Skeleton, and Button components are sufficient for scoped recovery/copy improvements. No installation is needed for the proposed first phase. UI UX Pro Max modal searches returned generic focus guidance after one retry, not a specific trap contract; the modal recommendation uses observed behavior and the installed Radix composition instead.

## 8. ReUI component evaluation

ReUI MCP search, get_component, and get_audit_checklist were invoked. A first API request used an undersized character cap; it was corrected and the real API was read. Research results are not installed runtime behavior.

| Resource and live preview | Compatibility/evidence | Decision |
| --- | --- | --- |
| [Data Grid](https://reui.io/components/data-grid?ref=mcp) | Current capsule uses TanStack v9 `useTable`/dataGridFeatures and lists Base UI/DnD/virtualization dependencies. App uses v8 and radix-nova. | Retain current DataTable. A compatible Radix/version plan is required before any future migration. |
| [Filters](https://reui.io/components/filters?ref=mcp) | Current API owns a boolean query tree, nested rules, and unfinished-rule handling. App's existing server toolbar supports simpler URL filters. | Do not add. Advanced rule trees have no demonstrated current requirement. |
| [Badge](https://reui.io/components/badge?ref=mcp) | Existing local ReUI badge is already available with semantic variants. | Retain and use its documented light variants when changing state UI. |

No premium block, new dependency, registry install, or secondary component system was introduced. ReUI's audited checklist informed semantic color, focus, state, scroll, and reuse assessment. Component migration is not an audit success criterion.

## 9. Typography audit

Runtime uses Inter for interface text and IBM Plex Mono for operational values. Public display scales and 12px metadata remain purposeful. Screenshots show readable primary hierarchy at desktop and 320px. No global typeface replacement is recommended.

UX-09 is the measured size exception: assistant Change/shortcut controls are 11/10px. UX-11 records stale font documentation; UX-14 covers shared public label hierarchy. Source also contains resized CardTitle consumers in OperationsDashboardPage. Resolve those consumer overrides when that approved composition is touched instead of running a repository-wide aesthetic rewrite. Smaller print text has a different physical-media purpose and is excluded from the digital floor finding.

## 10. Colour system audit

Semantic foreground/background, primary, muted, border/input, and state tokens govern the application. Public inverse/accent scopes rebind Tailwind aliases explicitly. Keep these owners and both theme modes.

Twenty-two public axe scans at 390px found no automated violations in the checked initial states. They retained incomplete/manual results, including image/overlay contrast. This does not establish every text, focus ring, chart segment, alpha surface, or error-state contrast ratio. No unmeasured color pair is labelled compliant.

The assistant retains hardcoded black/zinc/white styles. UX-09 scopes token correction to touched active controls. `--radius-full:9999px` remains defined, but a token's existence alone does not prove a rendered rounded element; no global token deletion is prescribed from that search hit.

## 11. Layout and spacing audit

The homepage uses deliberate editorial sections; the staff app uses compact records and relevant controls. Different densities are appropriate. Retain responsive grids, PageHeader, sticky sidebar, and semantic table overflow regions.

UX-08 identifies a proven nested-surface composition. Other source-level `space-y-*`, primitive dimension overrides, and paint transitions are design-contract debt, not proof that a screen is unusable. For example, the shared operations distribution uses `transition-all duration-500`; remove unnecessary paint/layout transitions when that approved composition is touched. Do not retime installed overlays.

## 12. Responsive design audit

| Check | Fresh result | Boundary |
| --- | --- | --- |
| Desktop 1440, laptop 1280, tablet 768, mobile 320 | Eleven public/auth URL instances at each width: document scrollWidth equals viewport; all direct same-page anchor targets exist. | 44 states; no claim about all offscreen child clipping. |
| Mobile 390 | Ten public/auth content pages and 404 rendered; no document overflow. Homepage menu and assistant exercised separately. | Screenshots and DOM geometry, not real-device touch/keyboard testing. |
| Development documents | Document width stays contained at 1440/320, but centered label content clips at 320, UX-13. | Sample documents only; physical printing/PDF unverified. |
| Assistant 320 dark | Sheet fits width; tool menu and Escape/focus return exercised. | No message/provider request; mobile software keyboard untested. |
| Protected tables/forms | Responsive source branches, grid/scroll owners inspected. | Authenticated tablet/mobile visual acceptance pending. |

Artifacts: [responsive-matrix.txt](audit-evidence/ui-ux-2026-11-04/responsive-matrix.txt), [public-routes-mobile.txt](audit-evidence/ui-ux-2026-11-04/public-routes-mobile.txt), and route-width PNG files. Multiple screenshots were visually opened, including homepage 1440/320, assistant 320, and selected content/document screens. Not every generated screenshot received a manual pixel-by-pixel review.

## 13. Accessibility audit

Automated checks used axe-core 4.13.0 with wcag2a/wcag2aa/wcag21aa/wcag22aa tags. All 22 initial public light/dark scans returned zero automated violations. Manual results remain in [public-axe-light-dark.txt](audit-evidence/ui-ux-2026-11-04/public-axe-light-dark.txt). Runtime-loaded assistant components require their own checks; initial-page scans do not cover closed dialogs.

Manual keyboard evidence confirms UX-01 and successful assistant menu keyboard operation/Escape focus return. Invalid AWB format displays a text Alert. Reduced-motion video eventually pauses, but initial hydration fails, UX-05. Homepage async booking error announcement needs correction, UX-10. No screen reader session was performed.

Web AA target sizing is 24×24 CSS pixels or an applicable exception; the skill's preferred 44px touch size is not a universal AA rule. See [W3C target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). Dense desktop controls were not automatically classified as failures.

Remaining acceptance work includes every authenticated dialog, destructive pending state, focus obscuration, 200% text resize/zoom, forced colors, all rendered contrast pairs, software keyboard/safe areas, and real assistive-technology announcements. **WCAG 2.2 AA compliance is not certified.**

## 14. Technical UI quality and fresh checks

| Check | Result | Evidence |
| --- | --- | --- |
| `pnpm typecheck` | PASS, zero errors | `typecheck.log` |
| `pnpm test:unit` | PASS, 74 files / 505 tests | `unit.log` |
| `pnpm lint` | PASS, zero errors / 75 warnings | `lint.log` |
| `pnpm stylelint` | PASS | `stylelint.log` |
| `pnpm audit:tokens` | PASS, zero violations | `tokens.log` |
| Hallmark sloplint command from AGENTS | PASS exit, zero FAIL / two WARN across 22 files | `sloplint.log` |
| `pnpm build` | PASS; compiled successfully and generated all 63 static outputs | `build.log` |
| Browser discovery/interactions | Completed with limitations described above | Browser text records and PNGs |
| Full E2E mutation suite | Not run | Audit-only scope; configured DB/provider effects excluded |

The Hallmark warnings suggest varying radius; that generic suggestion conflicts with mandatory square geometry and was not adopted. Passing token/slop scanners does not clear measured small text, nested surfaces, generated claims, or runtime hydration errors.

Maintainability: keep the current shared tables, lookup adapters, navigation model, and freight STEM functions. No unused module is declared removable merely because a static walk did not reach it. The large client homepage and imported decorative code are possible future profiling targets, but no bundle-size or performance regression was measured; dependency removal/refactoring is not recommended without that evidence.

Ponytail review: zero application implementation diff; recommendations reuse existing owners. The proposed roadmap does not add a grid migration, wrapper layer, new route family, provider, or data model.

## 15. Identified risks

1. Incorrect public scope or unsupported measurements can mislead customers before booking.
2. Passing automated accessibility checks can conceal manual modal failures.
3. Unbounded restyling could regress dense tables, financial views, and document print geometry.
4. Current registry APIs can differ from installed package versions and component bases.
5. Historical reports can repeat fixed findings or overstate fresh hosted coverage.
6. Local working-tree changes differ from the discovered preview commit; local and hosted evidence are not interchangeable.

## 16. Prioritised recommendations and delivery gate

First approve UX-01/02/03/04/05, which address primary navigation, trust, corridor scope, and rendering. Then address UX-06/07/09/10/11/14. Refine UX-08 in one shared-component batch after authenticated screenshots are available. UX-12 and development-only UX-13 remain optional.

**Audit artifact gate: PASS for documented discovery, evidence, findings, and roadmap, subject to the explicit coverage limits.**

**Frontend acceptance gate: FAIL.** Known P1 findings remain, protected visual acceptance is incomplete, and manual accessibility/contrast coverage is incomplete. This is an audit verdict, not an implemented-fix or release-readiness claim. User-directed audit-only scope takes precedence over skill instructions to fix failed gates immediately.

ReUI hand-back: Installed: none. Motion: none added. States: existing states assessed, conditional branches and protected outcomes remain limited. Checks: checklist read; C1–C4 edit checks not applicable because no UI source changed; local checks above ran. Deviations: existing defects documented, no authorized source correction yet.

## 17. Outstanding limitations and approval boundary

- Preview discovery found ready deployment `tac-xpress-qmzxb2238-tac-xps.vercel.app`, commit `eed8dd28b4cf1ae9d8200aa4ca3ff08e13c37934`, on the staging-release branch. Vercel access blocked rendering; no deployment was modified.
- Protected screenshots, real records, role-specific interactions, pending/destructive states, camera scanning, POD/signatures, print/PDF, provider delivery, and authenticated route errors remain unverified.
- Initial render geometry and an axe pass are not end-to-end workflow acceptance. Real-device touch, software keyboard, screen-reader, and exhaustive contrast testing remain open.
- shadcn MCP inspection could not be completed because its tools were unavailable. Official documentation/local components supplied the fallback; ReUI MCP research did complete.
- Prior issues repaired in current source were not carried forward: city/lookup label propagation, unsupported booking-city choices, lookup retry, empty-page pagination, role-filtered sidebar, and explicit navigation reduced-motion scrolling. Their current hosted behavior was not re-certified.
- The old `/tracking` homepage-link finding is not repeated: current homepage tracking resource uses `/track`. UX-04 is a different recovery-link defect.

The attached master directive, section 12, requires audit-only execution and explicit approval before application changes. Review [the implementation roadmap](UI_UX_IMPLEMENTATION_ROADMAP.md) and approve a phase or selected finding IDs. No source fixes, PR, push, or deployment is included in this audit.
