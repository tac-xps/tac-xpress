TAC-Xpress — Enterprise Production-Readiness Agent Prompt You are an expert
full-stack engineer. Your mission is to audit, code-review, and enhance the
TAC-Xpress logistics platform to enterprise-grade production readiness. Work
through each phase sequentially. Do not skip steps. After each phase, run pnpm
typecheck && pnpm build to confirm nothing is broken before proceeding.

Stack: Next.js 16 (App Router, RSC), TypeScript strict, Tailwind CSS v4, Shadcn
UI, Drizzle ORM, Supabase, Sentry, pnpm. Key docs: Read ARCHITECTURE.md,
DESIGN.md, OPERATIONS.md, and dashboard_ui_inventory.md before starting. Style
mandate: Clean, polished, modern, minimalist. Deep navy + electric cyan OKLCH
palette. No visual clutter.

PHASE 1 — DEAD CODE PURGE & CLEANUP 1A. Delete test/debug files that must not
exist in production Delete these files entirely:

app/api/sentry-example-api/ — Sentry test route app/api/test-customer/ —
test-only API route add-column.ts (root) — debug script debug-query.ts (root) —
debug script query-columns.ts (root) — debug script scratch-test.ts (root) —
debug script test-action.ts (root) — debug script test-dashboard.cjs (root) —
debug script test-error.cjs (root) — debug script lib/test-auth.ts — test
utility lib/mock-fleet-stream.ts — mock data generator features/ — empty
directory After deleting, search the entire codebase for any imports referencing
these deleted files and remove them. Run pnpm typecheck to confirm no broken
imports.

1B. Gate E2E test routes app/e2e-auth/ is already gated in proxy.ts — verify the
gate works: in production or when E2E_TEST_BYPASS_ENABLED !== "true", these
routes must 404.

1C. Fix Arcjet dev environment noise The error log (.next-start-audit.err.log)
contains hundreds of repeated Arcjet fingerprint errors: "unable to generate
fingerprint: error generating identifier - requested 'ip' characteristic but the
'ip' value was empty".

Fix: In .env.local, add ARCJET_ENV=development. In proxy.ts, verify the Arcjet
config properly bypasses in development when ARCJET_KEY is the placeholder value
— this logic already exists at line 106-112, confirm it works.

1D. Ensure mocks/cargo-data.ts is test-only Search the codebase for any non-test
file that imports from mocks/cargo-data.ts. If any production component imports
it, replace that import with a real database query. This file must only be
referenced from *.test.ts or *.stories.tsx files.

PHASE 2 — REMOVE ALL HARDCODED / FAKE DATA FROM PRODUCTION VIEWS This is the
highest-priority production blocker. The dashboard and analytics pages are
filled with static numbers that will mislead users.

2A. Dashboard Statistics —
components/shadcn-space/blocks/dashboard-shell-01/statistics.tsx Problem: Lines
22-23 hardcode 12,482. Lines 42-43 hardcode 4,231. Lines 64-65 hardcode 5,102.
Lines 86-87 hardcode 3,149. All trend percentages (+14.2%, +8.1%, +3.4%, +21.2%)
are fake.

Fix:

Convert to accept props: { stats: { totalDispatches: number; airCargo: number;
surfaceCargo: number; pickDrop: number; trends: { dispatches: number; air:
number; surface: number; pick: number } } }. In app/dashboard/page.tsx, query
shipments table: COUNT(_) total, COUNT(_) WHERE serviceType = 'express_air',
COUNT(*) WHERE serviceType = 'standard_ocean' OR serviceType = 'road_freight',
and a pick-and-drop count. Calculate trends by comparing current month count vs
previous month count. Pass real data as props. When the database is empty, show
0 with no trend indicator — never show fake numbers. 2B. Sales Overview Chart —
components/shadcn-space/blocks/dashboard-shell-01/sales-overview-chart.tsx
Problem: Lines 29-121 contain 90 rows of hardcoded chart data with dates from
April-June 2024.

Fix: Accept a data prop. In app/dashboard/page.tsx, query shipments grouped by
bookingDate::date and serviceType for the last 90 days. Pass the aggregated
array. Show "No shipment data yet" empty state when array is empty.

2C. Hub Volume Widget —
components/shadcn-space/blocks/dashboard-shell-01/hub-volume-widget.tsx Problem:
Lines 7-22 hardcode HUB_DATA array with fake hub names ("New Delhi Hub (DEL)
45.2K", "Mumbai Hub (BOM) 38.1K", etc).

Fix: Accept a hubs prop. In app/dashboard/page.tsx, query hubs table joined with
manifests → manifestItems to count shipments per hub. Show empty state when no
hubs exist.

2D. Earning Report Chart —
components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart.tsx
Problem: This is a visual card with static text "Real-time AI tracking active.
All hubs operating at optimal capacity." — verify this claim is actually backed
by real data or reword to be accurate.

2E. Analytics Page — app/dashboard/analytics/page.tsx Problem: This entire page
is "use client" with three hardcoded KPI cards:

Line 40: 84.2K — fake Network Volume Line 63: 92.8% — fake Fleet Efficiency Line
88: 99.1% — fake On-Time Performance Lines 44, 67, 92: fake trend percentages
+12.4%, +4.1%, +0.8% Fix: Convert to server component (remove "use client").
Query real data:

Network Volume = COUNT(_) from shipments table Fleet Efficiency = COUNT(_) WHERE
status='active' / COUNT(*) from vehicles table On-Time Performance = shipments
delivered before their edd / total delivered shipments Trends = current period
vs previous period percentage change Wire FleetUtilizationChart to real
vehicles + fleetVehicles data 2F. Dashboard Greeting — app/dashboard/page.tsx
Problem: Line 31 hardcodes "Welcome back, Admin.".

Fix: Import auth from @/auth, get session, use session?.user?.name || "there"
for dynamic greeting.

2G. Demo Data Labeling — app/actions/demo.ts The generateDemoData action creates
real-looking records. Prefix all demo AWB numbers with DEMO- so they're visually
distinguishable. Add a corresponding cleanupDemoData action that deletes all
DEMO--prefixed records.

PHASE 3 — DESIGN SYSTEM ENFORCEMENT Reference DESIGN.md for the canonical
palette. The brand uses deep navy + electric cyan OKLCH — no emerald, rose,
blue, green, red, orange, purple, violet, or yellow Tailwind color classes
should appear anywhere.

3A. Add design token CSS custom properties In app/globals.css, add these custom
properties (if not already present):

css

--color-status-pending: oklch(80% 0.15 85deg); --color-status-transit: oklch(72%
0.16 210deg); --color-status-delivered: oklch(70% 0.18 145deg);
--color-status-failed: oklch(70% 0.2 25deg); --color-trend-positive: oklch(70%
0.18 145deg); --color-trend-negative: oklch(70% 0.2 25deg); Add corresponding
Tailwind utility classes so components can use text-trend-positive,
bg-status-delivered, etc.

3B. Replace all non-OKLCH color classes Search the codebase for Tailwind color
classes that violate the design system. Here is the complete list of violations
found during audit — fix every one:

Substitution rules:

Find (regex)	Replace with	Context text-emerald-500 / text-emerald-600 /
text-emerald-400	text-trend-positive	Trend indicators, positive values
bg-emerald-500 / bg-emerald-400	bg-primary	Active status dots, pings
bg-emerald-500/10 / bg-emerald-50 / bg-emerald-950/30	bg-primary/10	Status badge
backgrounds text-rose-500 / text-rose-600 / text-rose-400 /
text-rose-700	text-trend-negative	Negative trends, error states bg-rose-500 /
bg-rose-600 / bg-rose-50 / bg-rose-950/30	bg-destructive	Destructive/error
backgrounds text-blue-500 / text-blue-600 / text-blue-400	text-primary	Info
icons, links bg-blue-500/10 / bg-blue-600	bg-primary/10 / bg-primary	Info
backgrounds, buttons text-purple-500	text-destructive	Critical severity
text-green-500 / text-green-600	text-trend-positive	Success, positive money
bg-green-500/10	bg-primary/10	Success backgrounds text-red-500 / bg-red-500 /
bg-red-600	text-destructive / bg-destructive	Error, negative money
text-orange-500 / text-orange-600 / text-orange-400	text-status-pending	EDD
warnings bg-yellow-500/10 / text-yellow-600 /
text-yellow-400	bg-status-pending/10 / text-status-pending	Warning notices
border-emerald-*	border-primary/20	Success borders
border-rose-*	border-destructive/20	Error borders Files requiring changes (found
during audit):

Dashboard pages:

app/dashboard/analytics/page.tsx — 3× emerald app/dashboard/tracking/page.tsx —
emerald, orange, blue, red app/dashboard/tracking/live-fleet-sidebar.tsx —
emerald app/dashboard/tracking/live-dispatch-map.tsx — emerald, amber
app/dashboard/fleet/page.tsx — emerald, rose app/dashboard/invoices/page.tsx —
emerald, rose app/dashboard/invoices/invoice-data-table.tsx — emerald
app/dashboard/invoices/edit-invoice-dialog.tsx — yellow, emerald
app/dashboard/invoices/create/invoice-success-dialog.tsx — green
app/dashboard/dispatch/dispatch-client-table.tsx — blue, emerald
app/dashboard/manifests/manifest-detail-dialog.tsx — blue, emerald, red
app/dashboard/manifests/manifest-client-table.tsx — emerald
app/dashboard/customers/[id]/ledger/page.tsx — green
app/dashboard/pricing/page.tsx — blue, red Shared components:

components/shadcn-space/blocks/dashboard-shell-01/statistics.tsx — 4× emerald
components/shadcn-space/blocks/dashboard-shell-01/hub-volume-widget.tsx —
emerald, rose
components/shadcn-space/blocks/dashboard-shell-01/earning-report-chart.tsx —
emerald
components/shadcn-space/blocks/dashboard-shell-01/active-dispatch-table.tsx —
emerald
components/shadcn-space/blocks/dashboard-shell-01/notification-dropdown.tsx —
emerald, blue components/logistics/status-badge.tsx — emerald, rose
components/ui/badge.tsx — emerald, rose components/ui/tracker-card.tsx — green
components/delta.tsx — emerald, rose components/scanner/scanner-result-modal.tsx
— blue, orange, red, emerald components/ui-components/interactive-logs-table.tsx
— blue, purple components/ui-components/floating-chat-widget.tsx — emerald
components/ui-components/animated-list.tsx — emerald
components/invoice-document.tsx — blue components/system-banner.tsx — rose
components/metrics/sla-compliance-chart.tsx — emerald
components/providers/notification-provider.tsx — emerald, blue
components/kibo-ui/metric/index.tsx — emerald
components/kibo-ui/status/index.tsx — emerald, red, blue
components/kibo-ui/pill/index.tsx — emerald, rose
components/warehouse/scanner-dialog.tsx — green After all replacements, verify:
grep -rn
"text-emerald\|bg-emerald\|text-rose\|bg-rose\|text-blue-[0-9]\|bg-blue-[0-9]\|text-purple\|text-green\|bg-green\|text-red\|bg-red\|text-orange\|bg-orange\|bg-yellow\|text-yellow"
--include="*.tsx" app/ components/ returns zero results (excluding .stories.tsx
files).

3C. Fix inline styles overriding Tailwind Per dashboard_ui_inventory.md Phase 3,
these files use style={{}} that should be Tailwind classes. Convert inline
styles to Tailwind utilities or CSS custom properties where possible:

app/dashboard/invoices/create/shipping-label-preview.tsx
app/dashboard/invoices/invoice-sheet.tsx components/carousel.tsx
components/cobe-globe.tsx components/conference-ticket.tsx
components/documentation-section.tsx components/invoice-document.tsx
components/pricing-section.tsx components/ui-components/cash-flow-chart.tsx Only
keep inline styles for truly dynamic values (e.g., style={{ width:
\${percentage}%`}}`).

3D. Typography Verify app/layout.tsx imports Google Fonts: DM Sans (body), Lora
(serif accents), IBM Plex Mono (data/AWB numbers). Every AWB number display in
the app should use font-mono class. Verify no component falls back to generic
font-sans system fonts.

3E. Empty states Every data-driven view must render a polished empty state when
there's no data — never a blank white area. Use the existing
components/logistics/empty-state.tsx component. Check these pages have empty
states:

Shipments table, Invoices table, Manifests table, Customers table Fleet vehicle
cards, Hubs list, Pricing rules table Tracking results, Messages log, Analytics
charts Dashboard widgets (statistics, charts, hub volume) PHASE 4 — FORMS, CRUD
& DATA INTEGRITY 4A. Shipment creation In
app/dashboard/shipments/create-shipment-form.tsx:

Zod schema must enforce: weightKg > 0, pieces >= 1, required origin and
destination Customer dropdown must query users table filtered by role =
'customer' AWB number generation: use format TAC-YYYYMMDD-XXXX (date +
sequential counter), not UUID fragments Phone fields (consignorPhone,
consigneePhone) must validate with libphonenumber-js In
app/actions/shipments.ts:

Every mutation must start with auth guard: const session = await auth(); if
(!session?.user?.id) return { error: "Unauthorized" } Status transitions must
follow state machine: pending → in-transit → delivered only — reject invalid
transitions Wrap mutations in Sentry spans for observability 4B. Invoice
creation In app/dashboard/invoices/create/wizard-form.tsx:

Pricing engine (lib/pricing.ts) must query pricingRules table for the matching
route + service type GST calculation: if origin state === destination state →
split into CGST + SGST; else → IGST only On submit: create invoices DB record,
generate PDF via @react-pdf/renderer, upload PDF to Supabase Storage bucket,
store the URL in invoices.pdfUrl 4C. Manifest + Barcode Scanner In
app/dashboard/manifests/create-manifest-form.tsx:

Reference ID: MAN-YYYYMMDD-XXXX format Hub, vehicle, driver dropdowns must query
real DB tables In app/dashboard/manifests/scanner-dialog.tsx +
app/actions/scanner-actions.ts:

scanAndLookup must query shipments by awbNumber via Drizzle — no mock data
Handle edge cases: unknown AWB (show error), duplicate scan (show warning),
already-manifested shipment (show info) On manifest finalization: update all
linked shipment statuses to in-transit, create trackingEvents entries 4D.
Customer management In app/dashboard/customers/add-customer-form.tsx:

Duplicate detection: check users.email and users.phone uniqueness before insert
Phone validation with libphonenumber-js In
app/dashboard/customers/[id]/ledger/page.tsx:

Query real invoices filtered by customerId — no hardcoded ledger data Show
running balance calculation 4E. Fleet, Hubs, Pricing add-driver-dialog.tsx:
license number uniqueness check add-vehicle-dialog.tsx: registration number
uniqueness check add-hub-dialog.tsx: validate required fields
add-pricing-rule-form.tsx: enforce basePrice >= 0, pricePerKg >= 0
pricing-actions.tsx: soft delete via deletedAt timestamp, not hard delete 4F.
Tracking Public tracking (app/track/): AWB input queries shipments +
trackingEvents — no auth required. Show visual timeline + map. Portal tracking
(app/portal/track/): same but scoped to customer's shipments via portal session.
Dashboard tracking (app/dashboard/tracking/): search by AWB, show results from
real DB.

PHASE 5 — BACKEND & API HARDENING 5A. Type safety — Remove all as any These are
the exact locations of as any casts. Replace each with a proper typed interface:

proxy.ts:37 — (req.auth?.user as any)?.role → extend the NextAuth session User
type to include role proxy.ts:79 — authMiddleware as any → properly type the
Arcjet middleware composition app/api/cron/sla-check/route.ts:41,96,152 —
Supabase .update({} as any) → define typed update payloads matching the Supabase
table schema app/actions/whatsapp-inbound.ts:112,227,251 — Supabase
insert/update casts → type the payloads app/actions/whatsapp-inbound.ts:331 —
(shipment.tracking_events as any[]) → type the Supabase query return
app/actions/ai-triage.ts:149 — Supabase update cast → type the payload
app/actions/sla.ts:41 — Supabase update cast → type the payload
app/actions/sla-acknowledge.ts:19 — Supabase update cast → type the payload
app/actions/notifications.ts:25 — Supabase update cast → type the payload
lib/supabase/clients.ts:64,91 — (null as any) for SSR window check → use
conditional type or null! with proper guard Run pnpm typecheck after — zero
errors.

5B. Auth guards Audit every file in app/actions/. Every mutation action must
have at the top:

ts

const session = await auth() if (!session?.user?.id) return { success: false,
error: "Unauthorized" } For admin-only actions (metrics.ts, user.ts role
changes, demo.ts), add:

ts

if (session.user.role !== "admin") return { success: false, error: "Forbidden" }
5C. Hardcoded emails in SLA cron app/api/cron/sla-check/route.ts hardcodes
ops@techparts.in (line 47) and dispatch@techparts.in (line 158). Replace with
environment variable OPS_NOTIFICATION_EMAIL.

5D. WhatsApp pipeline In lib/whatsapp/service.ts, verify:

Phone normalization: strips +, spaces, leading zeros before hashing/sending
Failed sends are inserted into dead-letter queue for retry
whatsapp_subscribers.last_inbound_at is updated on every inbound message In
app/actions/whatsapp-inbound.ts, verify:

Meta webhook signature verification is present and correct PII scrubbing per
OPERATIONS.md: phone numbers hashed via HMAC-SHA256 with PHONE_HASH_SECRET,
customer message text excluded from Sentry contexts 5E. AI triage resilience In
app/actions/ai-triage.ts:

Add timeout on LLM API call (30s max) On any LLM failure: fall back to category:
"general", priority: "medium", set a needs_human_review: true flag Log AI cost
per call via Sentry span attribute ai.cost.usd 5F. Database constraints Create a
new migration drizzle/0004_add_missing_constraints.sql:

sql

ALTER TABLE invoices ADD CONSTRAINT invoices_amount_nonnegative CHECK (amount >=
0); ALTER TABLE shipments ADD CONSTRAINT shipments_pieces_positive CHECK (pieces
>= 1); Run pnpm db:push.

5G. Health endpoint Verify app/api/health/ checks: database ping, OpenRouter
reachability, WhatsApp config validity, Resend API key presence. Return
structured JSON with per-service status.

5H. Audit logging Flesh out lib/audit.ts to actually insert audit records into a
Supabase audit_log table (create it if needed). Log: action
(create/update/delete), entity (shipments/invoices/etc), entityId, userId,
timestamp, before (JSON), after (JSON). Call logAudit() from all
create/update/delete server actions.

PHASE 6 — ANALYTICS, PORTAL & PRODUCTION POLISH 6A. Real analytics dashboards In
app/dashboard/analytics/page.tsx, build server-side aggregation queries:

Shipment volume by service type and month Revenue trend from invoices.amount by
month Delivery performance: on-time vs late (compare updatedAt to edd) Top
routes by volume Customer growth over time SLA compliance rate Wire the
FleetUtilizationChart component to real vehicles data.

6B. Messages page In app/dashboard/messages/, query messageOutbound table. Show:
phone (masked), status, template name, related AWB, timestamp. Group by
conversation thread.

6C. Metrics/SLA page In app/dashboard/metrics/, show real data:

At-risk shipments count from shipments WHERE slaAtRisk = true Average ticket
resolution time from tickets SLA breach history 6D. Portal scoping In
app/portal/layout.tsx, verify portal_session cookie validation. All portal page
queries must filter by the authenticated customer's email — never expose other
customers' data.

6E. Environment documentation Update .env.example with every required variable,
grouped and documented:

Production required: DATABASE_URL, SUPABASE_POOLER_URL,
NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
SUPABASE_SERVICE_ROLE_KEY, AUTH_SECRET, PORTAL_SESSION_SECRET, ARCJET_KEY,
SENTRY_DSN, CRON_SECRET Feature-specific: OPENROUTER_API_KEY, RESEND_API_KEY,
NEXT_PUBLIC_MAPBOX_TOKEN, INVOICE_PDF_SIGNING_SECRET, PHONE_HASH_SECRET
WhatsApp: WHATSAPP_ENABLED, WPBOX_API_TOKEN, WPBOX_BASE_URL,
WHATSAPP_APP_SECRET, WHATSAPP_VERIFY_TOKEN Ops: OPS_NOTIFICATION_EMAIL 6F. File
naming consistency Rename PascalCase component files to kebab-case to match
project convention:

components/shipments/CreateShipmentDialog.tsx → create-shipment-dialog.tsx
components/shipments/MapboxRoute.tsx → mapbox-route.tsx
components/shipments/RealtimeTracker.tsx → realtime-tracker.tsx
components/security/SecureBoundary.tsx → secure-boundary.tsx Update all imports
across the codebase.

6G. Performance Lazy-load heavy client components: map components (MapboxRoute,
CobeGlobe), PDF renderer (@react-pdf/renderer), barcode scanner (html5-qrcode)
Add pagination (25 per page default) to all list/table queries Verify all images
use next/image component FINAL VERIFICATION GATE Run all of these. Every single
one must pass with zero errors:

bash

pnpm typecheck # TypeScript strict mode — zero errors pnpm lint # ESLint — zero
violations pnpm stylelint # CSS lint — zero violations pnpm test:unit # Unit
tests — all pass pnpm build # Production build — clean, no warnings Then
manually verify:

Dashboard with empty database → all widgets show 0 or empty states, no hardcoded
numbers anywhere Create shipment → create invoice → create manifest → scan AWB →
finalize → tracking event appears Public /track page → enter AWB → see real
tracking timeline Portal login → customer sees only their own shipments/invoices
No text-emerald, bg-blue-600, text-purple, or any non-OKLCH color class visible
in source If all checks pass, the app is production-ready.
