# Tac-Xpress Enhancement Plan — Full Codebase Audit

**Date:** 2026-09-24
**Scope:** Entire project — landing/public, authentication & security perimeter, dashboard/operations workspace, data layer & integrations, styling/design system, delivery/portal, observability & deployment.
**Stack:** Next.js 16 (App Router, RSC), TypeScript strict, Tailwind v4 + Shadcn/Radix, Supabase + Drizzle `postgres` via PgBouncer, NextAuth 5 credentials, Arcjet, Resend, WPBox/WhatsApp, Puppeteer/Chromium, Sentry, PostHog.

---

## 1. Executive Summary

Tac-Xpress is functionally coherent but **stuck between two eras**: a polished public cargo site (Nordic Lagom/ivory-violet) and a heavyweight operations workspace (21+ navigation items, 18 Drizzle tables + 7 raw-SQL tables, multi-modal comms). Core risk is **drift**: Drizzle vs Supabase migrations, dual fleet models, overloaded `manifests` table, vestigial state libs, and `service_role` everywhere. The fastest leverage is to **harden the perimeter + unify the data story**, then **declutter the frontend bundle + fix dashboard performance/UX**.

**Plan philosophy:**
- Fix safety/reliability before features.
- Prefer deletion/consolidation over addition.
- Every task must be verifiable locally before staging.

---

## 2. Ground Truth — What Exists Today

### 2.1 Public / Landing
- `app/layout.tsx` → `components/public/logistics-home.tsx` assembly: `SiteNavigation` + `HomeHero` + `HomeServices` + `ShipmentDesk` + `ShippingSteps` + `HomeStory` + `ShippingPreparation` + `CargoStatement` + `TrackingExplainer` + `ShippingFaq` + `HomeSupport` + `SiteFooter` + `SupportChat`.
- Public pages (`app/{about,contact,services,shipping-guide,track,feedback,terms}/page.tsx`) mostly wrap `components/public/public-page.tsx` (`SiteNavigation` + `SiteFooter`). Exceptions: `/track` and `/terms` bypass `PublicPage`.
- Tracking: `lib/tracking/public-query.ts` (projected join, `isPublic` filter) + `app/actions/tracking.ts` `trackAwb` + `components/tracking/tracking-details.tsx`. Hero/Desk/Console all `GET /track?awb=`.
- Contact tickets: `app/(landing)/components/ticket-form.tsx` → `app/actions/tickets.ts` `createTicket` (honeypot + Arcjet 3/15m + `after(processBackgroundJobs)`). `feedback` is a second ticket path via `app/actions/feedback.ts`.
- SEO: bare `metadata` objects, no `metadataBase`, no `openGraph`, no `sitemap.ts`/`robots.ts`, no JSON-LD.
- Design: `app/globals.css` 834 LOC, Tailwind v4 CSS-first, `@theme inline` oklch tokens, `radius 0` square geometry, `cargo-public / .cargo-inverse / .cargo-accent` rebindings.

### 2.2 Auth & Security Perimeter
- `proxy.ts` (`aj` shield + bot + slidingWindow 100/m `DRY_RUN` dev) wraps `auth(handleAuthenticatedRequest)`. Handles unauth → `/signin`, non-staff → `?reason=staff-only`, legacy `/login`/`onboarding` redirects, `x-internal-document-token` bypass for `/invoice/:id`, `actionLimiter` for `next-action` POST, fail-closed `503` on Arcjet ERROR for sensitive routes. `config.matcher` excludes `api/auth|cron|webhooks|public|ingest|_next|monitoring`.
- `auth.config.ts` + `auth.ts` (NextAuth Credentials → Supabase `signInWithPassword` → reconcile `public.users` by `auth.uid`/`email`, `isStaffRole` gate, E2E synthetic users `000…/111…/222…`).
- `lib/auth/*`: `roles.ts`, `document-token.ts` (HMAC `pdf`/`render` 5m), `guards.ts` (`requireDashboard*` re-queries DB), `page-access.ts`, `credential-rate-limit.ts`, `verify-mobile-client.ts` (Bearer `MOBILE_API_SECRET`), `e2e-bypass.ts` (6 guards), `supabase/clients.ts` (dummy fallbacks + lazy Proxy).
- Sentry: `sentry.*.config.ts` — server and edge configs use `process.env.SENTRY_DSN`, production `tracesSampleRate 0.2`, and `sendDefaultPii false`; client uses env `NEXT_PUBLIC_SENTRY_DSN`, `tracesSampleRate 0.2`.
- CSP in `next.config.ts`: `script-src 'self' 'unsafe-inline' https:` + HSTS `preload`.

### 2.3 Dashboard / Operations Workspace
- `app/dashboard/layout.tsx` RSC guard → `NotificationWrapper` → `OnboardingTourProvider` → `ScannerProvider` → `AppShell` → `WorkspaceFrame` (`SidebarProvider`, `AppSidebar sticky top-0 h-svh`) + `SiteHeader` + `SystemBanner`.
- `components/operations/navigation.ts` = 21-item single source (Daily Ops/ Network / Business / Reporting).
- Overview: `app/dashboard/page.tsx` `Promise.all(getDashboardOverview(), …)` + `lib/dashboard-metrics.ts` + `lib/control-center.ts` + `lib/service-metrics.ts`. All uncached DB aggregates, 90-day/30-day windows.
- Domains: shipments (`shipment-register.tsx` `mode=all, air, surface, warehouse`), dispatch (`manifests` where `referenceId like PU-% or DL-%` Kanban), manifests (hub loads), warehouse/audit, tracking/live-fleet (not wired to Realtime), fleet (dual `vehicles` vs `fleet_vehicles`), hubs, invoices (cents/GST/paise), communications (`messageOutbound` + `background_jobs` + `email_notifications`), customers/ledger, pricing (`origin/destination` text), support/messages, feedback (second table), staff (admin-only), integrations (`getWhatsAppConfig`), operations air/surface via `OperationsDashboardPage`.
- State: Zustand (`use-app-store.ts` vestigial), Jotai (kibo table only), TanStack Query installed but only used in `useRLS.ts`, TanStack Table heavily used, `nuqs` for URL pagination.
- Fetch: RSC direct `db.query` + `revalidatePath`; no `unstable_cache`; `hasNext = rows.length > PAGE_SIZE`.

### 2.4 Data & Integrations
- `lib/db/schema.ts` 18 tables; 7 operational tables (`background_jobs`, `email_notifications`, `dead_letter_queue`, `audit_log`, `notifications`, `sla_policies`, `fleet_telemetry`) absent from Drizzle, managed by raw `sql` in `supabase/migrations/*` (27 files). `drizzle/*` (`0000-0003`) out of sync with `supabase/migrations`.
- `app/api/*` 20 routes: `auth/[...nextauth]`, `auth/capabilities`, `cron/communications`, `cron/slac-check` (`CRON_SECRET`), `webhooks/whatsapp`, `webhooks/carrier` (HMAC), `fleet/telemetry` (Bearer + Zod + upsert), `documents/download`, `public/invoice-pdf` (HMAC `pdf`), `cargo-documents/[entity]/[id]` (5 MB magic-byte, origin check, single bucket), `staff-avatar/[id]` (self-only), plus customers/drivers/vehicles/hubs/chat/stream/manifest print/health.
- Jobs: `lib/jobs/store.ts` (`support_email` / `support_triage`, `ON CONFLICT (kind,dedupe_key)`, `FOR UPDATE SKIP LOCKED`, `locked_until +5m`, backoff `60*2^n`) + `lib/jobs/worker.ts` (Resend idempotency `ticket-created/${job.id}`, 23h vs 24h window, OpenRouter triage).
- Communications: `lib/whatsapp/service.ts` via WPBox relay (`chat.leminai.com`, `hasSemanticFailure`, phone IN normalisation), `inbound-store.ts` (advisory lock + audit dedup + ack via `after()`), `delivery-status.ts` (monotonic), `email-notifications.ts` (Resend 15s + `email_notifications` log).
- AI: `app/actions/ai-triage.ts` + `ai-responder.ts` (OpenRouter `gpt-4o-mini`, `withRetry 1`, `publicShipmentContext` leaked to LLM).
- Fleet: `lib/fleet-telemetry-store.ts` upsert newer wins + 15m staleness filter; `lib/documents/render-invoice-pdf.ts` Chromium `networkidle0` 30s per render.
- Barcode/QR: `react-barcode`, `qrcode.react`, `html5-qrcode`, `hooks/use-barcode-scanner.ts` global wedge.

### 2.5 Cross-Cutting
- `app/globals.css` + `components.json` (Tailwind v4). No `tailwind.config.*`. `app/styles/enterprise-overrides.css` dead (never imported).
- `next.config.ts` + `proxy.ts` + `instrumentation.ts` already cited.
- `lib/*`: `jobs`, `whatsapp`, `documents`, `invoices/calculations` (paise integer, GST split), `config/app-url.ts` (strict origin), `audit.ts`, `safe-action.ts`, `posthog`.
- Tests: Vitest (`__tests__`/`tests/unit`) + Playwright (`tests/*.spec.ts`) + k6 `load/k6-tracking.js`.

---

## 3. Audit Findings — Prioritised

### P0 — Must Fix Before Any Enhancement Work Expands

| ID | Area | Finding | Impact |
|----|------|---------|--------|
| P0-01 | Auth | `sentry.*.config.ts` — verified server and edge use `process.env.SENTRY_DSN`, production `tracesSampleRate: 0.2`, and `sendDefaultPii: false` | Retain hardened baseline |
| P0-02 | Perimeter | `config.matcher` excludes `api/public`, `api/webhooks`, `api/cron`, `api/auth` from Arcjet; add per-route rate limits on `public/invoice-pdf`, `fleet/telemetry POST`, `webhooks/whatsapp` | Abuse / DoS prevention |
| P0-03 | Dashboard | `app/driver/layout.tsx` has zero auth guard; `app/portal/*` are placeholders redirecting customers to staff dashboard | AuthZ bypass / confusion |
| P0-04 | Data | Dual fleet truth `vehicles` (ops `active`, `maintenance`, `retired`, FK `drivers`) vs `fleet_vehicles` (registry `active`, `maintenance`, `idle`, FK `users`) + `manifests` overloaded (`PU-` / `DL-` runs vs line-haul) | Data corruption / divergent queries |
| P0-05 | Storage | Single private bucket `cargo-documents` co-mingles cargo docs + staff avatars + invoice PDFs; `app/api/cargo-documents` origin check fails behind CDN; `upsert:true` on invoice PDF clobbers | Access / overwrite |

### P1 — High Value, High Friction If Deferred

- P1-01 SEO invisible: no `metadataBase`, `openGraph`, `robots.ts`, `sitemap.ts`, JSON-LD, canonical.
- P1-02 Dead code & drift: `app/(landing)/components/*` (`awb-tracker` max20 vs prod max40, `ambient-background` unused), `docs-preview` public with mock PII + `localhost` origin, `enterprise-overrides.css` never imported, `Zustand` vestigial, `motion` vs `framer-motion` duplication.
- P1-03 Performance: `SiteNavigation` loads `gsap` + `@gsap/react` + `motion/react` on every public route; `HeroLottieTruck` always loads `lottie-web`; analytics/overview do 7+ full scans per load with zero cache; `renderInvoicePdf` launches Chromium per download.
- P1-04 Schema ownership split: Drizzle `lib/db/schema.ts` ≠ `supabase/migrations`; `types/db-aligned.ts` stale 2026-06-24.
- P1-05 Jobs observability gap: `background_jobs`/`email_notifications`/`dead_letter_queue` only via `db.execute sql`, no dashboard, no DLQ UI, cron `limit 2` starves bursts, Resend 23h/24h off-by-one, `after()` silent failure.

### P2 — Medium Polish That Blocks Credibility

- Styling leaks: `orange-500` in `hero-dispatch-console`, `bg-slate-*` in `/terms`, `hard-coded #211b30` etc vs oklch tokens; `/terms` bypasses `PublicPage` with inline `new Date().getFullYear()` hydration risk.
- Tracking UX fragmentation: 4 AWB inputs (hero, desk, console tab, `/track`) with diverging placeholder/maxLength/validation; console `Attach e-Way bill` never uploads.
- Table ergonomics: 3 `data-table` implementations (`operations/data-table`, `ui/data-table`, `kibo-ui/table`), no `tsvector`/`pg_trgm` index for `ilike %q%`, pricing `origin|destination` text not FK, `feedback` vs `tickets` duplication.
- Resiliency: `verifyMobileClient` `Buffer.byteLength` length leak, client/server password zod mismatch (`min1` vs `min6`), `DEV_FALLBACK_AUTH_SECRET` known constant imported client-side in Storybook.

---

## 4. Design Decisions & Open Questions

Before implementation starts, lock these (recommended answer first):

| Decision | Options | Recommendation |
|----------|---------|---------------|
| Fleet truth | (A) Unify to single `vehicles` table | **A** — migrate `fleet_vehicles → vehicles` with `fleet_source` enum (`managed`, `registry`), keep 15m telemetry on `fleet_telemetry.vehicle_id → vehicles.id` only; stop `registration_number` fallback spoof |
| Manifest vs Dispatch | (A) Add `manifest_type` enum | **A** — `manifest_type: linehaul, pickup_run, delivery_run` with CHECK on `referenceId` prefix; defer separate `dispatch_runs` table until SLA engine needs leg-completion |
| Portal | (A) Retire portal entirely | **A for now** — portal is nonfunctional. Remove `app/portal/*` redirects + keep `lib/auth/portal-ownership.ts` for future, or commit to (B) build `verifyPortalSession` + sender-only ledger. Decide at kickoff. |
| AI auto-reply | (A) Keep disabled, triage only | **A** — keep `AI_AUTO_REPLY_ENABLED=false`, ship `ai-triage` → `needs_human_review` path only; gate auto-reply behind explicit provider acceptance + content moderation review |
| State libs | (A) Remove Zustand/Jotai | **A** — delete `use-app-store.ts`, remove `jotai` dep, keep `nuqs` + `TanStack Table`; add `QueryProvider` already exists — wire it or remove `tanstack/query` dep |
| PDF pipeline | (A) Cache Chromium renders | **A** — keep `puppeteer-core` path, add `hash(invoice.updatedAt)` cache in `cargo-documents` + signed-url cache, fallback to `supabase/functions/generate-invoice-pdf` (jsPDF) for low-cost path |
| SEO | (A) Minimal `sitemap.ts` + `metadataBase` | **A** — generate static + `services/[service]` entries, `robots.ts` with `Sitemap:` directive, `JsonLd` org/logistics |

> If any decision is marked "defer", keep code unchanged and document the deferral in `docs/14-decision-log.md`.

---

## 5. Enhancement Roadmap — Phased, Ordered Task List

Do not parallelise across phases until the phase’s validation passes locally.

### Phase 0 — Safety Gates & Baselines (no UI movement)

- **0.1 Env & Secrets**
  - Verify `sentry.server/edge.config.ts` uses `process.env.SENTRY_DSN`, production `tracesSampleRate 0.2`, and `sendDefaultPii: false` (already satisfied and verified).
  - Add CI gate: `pnpm verify:production-env` + `pnpm audit --prod` must pass on every PR (Vercel build step already expected).
  - Remove `DEV_FALLBACK_AUTH_SECRET` from client bundle; keep it `server-only` and never export to Storybook/browser.

- **0.2 Perimeter**
  - In `proxy.ts` / per-route handlers, add explicit rate limits for `api/public/invoice-pdf`, `api/fleet/telemetry POST`, `api/webhooks/whatsapp` (verify `WHATSAPP_APP_SECRET` already does; add Arcjet `slidingWindow` wrapper even though matcher excludes). Return `429` + `Retry-After`.
  - Audit every matcher-excluded route (`api/auth`, `api/cron`, `api/webhooks`, `api/public`, `ingest`) and document its alternative protection in `docs/11-security-and-compliance.md`.

- **0.3 Guards**
  - Add `requireStaffPage()` to `app/driver/layout.tsx` (and driver-specific `driverId` check or explicitly scope driver pages to staff tool and document that in architecture).
  - Retire or guard `app/(landing)/docs-preview` ( `if (process.env.NODE_ENV === "production") notFound()` + `metadata robots noindex`).
  - Fix `/terms` to use `PublicPage` + `PageIntro`, make `year` server-computed constant, replace `bg-slate-*` with tokens.

- **Validation:** `pnpm typecheck && pnpm lint && pnpm test:unit && pnpm build` + `pnpm verify:production-env` (expected fail locally unless env supplied — assert error shape) + manual `curl` rate-limit probes.

### Phase 1 — Public Site: Performance, SEO, Correctness

- **1.1 Consolidate tracking**
  - Delete `app/(landing)/components/*` dead files or re-export from `components/public`. Single `<TrackForm method="GET" action="/track">` used by `HomeHero`, `ShipmentDesk`, `HeroDispatchConsole` tab 01. Align `zod` to `^[A-Z0-9-]{5,40}$` everywhere, `maxLength 40`, same placeholder.
  - Wire or remove `HeroDispatchConsole` e-Way bill attach (hidden `fileName` state never submitted).

- **1.2 Navigation bundle**
  - Replace `gsap` + `@gsap/react` entrance with `motion` (already used). Keep only `motion` OR `framer-motion` (they alias `motion`). Debounce scroll `scaleX` progress via `requestAnimationFrame` + `useSyncExternalStore`. Gate `SiteNavigation` as server + isolate client islands (`MagneticButton`, mobile `Sheet`).
  - `dynamic(() => import("./hero-lottie-truck"), { ssr:false })` + `CargoImage` `priority` only on hero.

- **1.3 SEO foundation**
  - `lib/config/app-url.ts` → `metadataBase: new URL(getAppUrl())` in `app/layout.tsx`.
  - Add `app/sitemap.ts` (static routes + `generateStaticParams` for `services/[service]`), `app/robots.ts` (`Allow: /`, `Disallow: /e2e-auth/ /api/test/`, `Sitemap: ${getAppUrl()}/sitemap.xml`), `app/manifest.ts`.
  - Add `components/public/json-ld.tsx` (`Organization`, `LogisticsService` for air/surface, `BreadcrumbList`, `FAQPage` from `shipping-content.ts`) and `generateMetadata` with `openGraph` + `alternates.canonical` (especially `/track?awb=` self-canonical, `noindex` when `awb` missing).

- **1.4 Design cleanup**
  - Import or delete `app/styles/enterprise-overrides.css`; map `orange-500` → `primary`, replace `/terms` hardcodes with `bg-card`/`text-muted-foreground`, add `--trend-positive` token if needed, keep `radius 0` but audit `badge` ergonomics.

- **Validation:** Lighthouse (perf ≥90, SEO 100), Playwright `cargo-frontend.spec.ts` + `accessibility.spec.ts`, manual viewport 320/768/1440/1920 dark+light.

### Phase 2 — Dashboard: Structure, Performance, UX

- **2.1 Shell**
  - Make `components/app-shell.tsx` RSC, `Suspense` around `children`, add per-route `loading.tsx` for shipments/dispatch/manifests/invoices. Remove `OnboardingTourProvider` + `ScannerProvider` from global `dashboard/layout.tsx` → lazy wrap only on routes that need them.
  - Deduplicate nav: remove duplicate `MessageSquare` for Support/Communications, fix `isWorkspaceRouteActive` for `/dashboard/operations/*`.

- **2.2 Data fetching**
  - Wrap `getDashboardOverview` / `getAnalyticsOverview` / `getServiceMetrics` / `getControlCenterSnapshot` with `React.cache` per-request + `unstable_cache` with tags (`dashboard:overview`, `analytics`, …) + `revalidateTag` in mutations (already `revalidatePath`).
  - Stream heavy sections (`VolumeChart`, `FleetUtilizationChart`) with `Suspense`.
  - Add composite indexes: `gin_trgm_ops` on `shipments(awb_number,origin,destination,consignor_name,consignee_name)`, `(status, created_at)`, `tracking_events(awb_number,status,is_public)`, `manifestItems(manifest_id, shipment_id)` already exists — verify `EXPLAIN` for `hubRows` left-joins.

- **2.3 Domain repairs**
  - Fleet: decide per Decision table, run migration, backfill, update `getAnalyticsOverview` `revenueByMonth` to filter `invoices.status != 'void'` and `coalesce`, fix `FleetEfficiencyTrend` (remove or compute MoM).
  - Dispatch: extract `isDispatchRun(manifest)` util, enforce `referenceId` uniqueness with retry on collision (UUID slice clash), allow `PU-` completion if business needs (currently `DL-` only), virtualise 100-item Kanban.
  - Manifest/Hub search: replace `inArray(select id where ilike)` with `JOIN` + `ilike containsPattern`. Add `limit + search` to `pendingShipments` (currently 100 no filter).
  - Invoices: unify `balanceDue ?? amount` vs `coalesce` null handling; exclude `void` from outstanding/paid totals; standardise financial edits never turning `paid → unpaid`.
  - Customers/Pricing: make pricing `originHubId`/`destinationHubId` FK to `hubs` (or validate against `hubs` list), add `hub` existence check.
  - Communications: deduplicate `messageOutbound` views (one log), enforce `status` enum (`pending|sent|delivered|read|failed`), consolidate `feedback` → `tickets(source='feedback')` or explicitly keep separate and document.

- **2.4 Tables**
  - Consolidate to single `components/ui/data-table/*` + `hooks/use-data-table.ts` (`nuqs`). Delete `components/kibo-ui/table` + `components/operations/data-table.tsx` wrappers; remove vestigial `Zustand` + `jotai` if unused.
  - `ExportPage` must note "current page only" and add optional "export filtered set" (server CSV stream) behind `admin` check.

- **Validation:** `pnpm typecheck`, Vitest unit for `dashboard-metrics` helpers, Playwright `workspace-design.spec.ts`, manual filter/sort/pagination on shipments + invoices with 5k seeded rows.

### Phase 3 — Data Layer & Integrations Reliability

- **3.1 Single source of migrations**
  - Pick `supabase/migrations` as authority, freeze `drizzle/*` as snapshot only. Run `supabase gen types` + `drizzle-kit` introspection to regenerate `types/db-aligned.ts` and `lib/db/schema.ts` stubs for the 7 missing tables (or create `lib/db/operational-tables.ts` with `pgTable` + `sql` for those tables so Drizzle can type-check raw queries). Document in `docs/03-database-schema.md`.

- **3.2 Storage**
  - Keep `cargo-documents` as private; prefix `staff-avatars/` already does but enforce bucket policy via Supabase storage RLS (or Supabase Dashboard). Fix `cargo-documents` origin check to allow `NEXT_PUBLIC_APP_URL` + Vercel proxy (`x-forwarded-host`) not just `Origin` header. Keep `upsert:false` for cargo, add separate `invoice-pdfs/` prefix with `upsert:true` intentionally + lifecycle (30d).

- **3.3 Jobs & Comms durability**
  - Add admin-only diagnostics UI: `app/dashboard/communications` already shows 3 cards — extend to `Background Jobs` table (pending/processing/failed, `attempts`, `locked_until`, manual retry + DLQ viewer for `dead_letter_queue`).
  - Make cron configurable (`limit` param, env `COMM_CRON_LIMIT`), bump default from `2` to `10`, add `priority` column if burst matters. Fix `sla-check` `withRetry` to be `await`ed and transaction-wrap ticket+notification; align `notifications.type` enum across migrations.
  - Resend: bubble `RESEND_API_KEY` missing as job failure (not silent `skipped:true` success); respect `idempotencyKey` window (24h) consistently; ensure `email_notifications` insert failure does not mark job `completed`.

- **3.4 WhatsApp & AI**
  - Document WPBox relay vs Meta direct migration path in `docs/whatsapp_implementation_guide.md`; add request idempotency key to relay (hash `phone+body`).
  - Harden `hasSemanticFailure` regex (avoid `error` substring false positives), expose `WPBOX_BASE_URL` health in `app/dashboard/integrations/page.tsx`.
  - AI triage keep `AI_AUTO_REPLY_ENABLED=false` default; add content moderation pre-check; sanitize `publicShipmentContext` before LLM; `withRetry 1` for triage is okay, for auto-reply require manual DLQ.

- **3.5 Fleet & PDF**
  - Fleet `POST` add per-vehicle throttling + Zod `vehicleId` existence check (no `registration_number` fallback unless explicitly allowed), enforce `0<=heading<360`, cap `speed` but log over-limit rather than silently clip.
  - PDF: add render cache (`sha256(invoiceId + invoice.updatedAt)` → `storage.exists` before `puppeteer`), throttle `api/public/invoice-pdf` (`arcjet 20/m`), await `fonts.ready` already does.

- **Validation:** `supabase db reset` against fresh project, `drizzle-kit generate` diff empty, unit tests for `lib/jobs/store.ts` `claimJob` lease race (concurrent `claim`), contract test for webhook HMAC + carrier linear transition, manual Resend + WhatsApp sandbox sends.

### Phase 4 — Observability, A11y, Testing

- **4.1 Sentry & PostHog**
  - Wire `lib/posthog/posthog-server.ts` consistently (`capturePostHogEvent` already used in dispatch/manifest/shipment actions).
  - Maintain production `tracesSampleRate 0.2`, sample `replays` as today (0.1 sess / 0.5 error). Add `beforeSend` `level` mapping already present — extend to `sla`, `jobs`, `whatsapp` areas.

- **4.2 A11y**
  - Fix `MagneticButton` to disable magnet on `focus-visible`, ensure `SheetTrigger` `aria-expanded`, keep `prefers-reduced-motion` disables ship/parallax (`SiteNavigation` already respects). Run `pnpm test:a11y` (axe) on every PR.

- **4.3 Tests**
  - Expand Vitest: `lib/invoices/calculations` (paise rounding), `lib/jobs/store`, `lib/auth/document-token`, `lib/whatsapp/webhook-schema`.
  - Add Playwright: `sla-check` idempotency, `carrier` replay, `fleet telemetry` 15m staleness, `cargo-documents` 5 MB + magic-byte rejection.
  - Wire Chromatic + Storybook only for `components/ui` + marketing (`components/public`), not live dashboard.

- **4.4 Docs**
  - Update `docs/ARCHITECTURE.md` (fleet table decision, portal retirement), `docs/14-decision-log.md` (manifest type), `docs/06-ui-components.md` (single table story), `UI-SOURCES.md` (drop Tailark vs shadcn drift note).

### Phase 5 — Pre-Deployment & Production Clearance (gates from 2026-09-07 audit still open)

- **5.1 Deployment identity** — supply `NEXT_PUBLIC_APP_URL` prod origin, disable `E2E_TEST_BYPASS_ENABLED` + `NEXT_PUBLIC_E2E_TEST_BYPASS_ENABLED` + `PLAYWRIGHT_TEST`, run `pnpm verify:production-env` in that environment (assert `SUPABASE_URL ujyellrhwhqjmfponhuz`).
- **5.2 DB baseline & restore** — reconcile hosted schema (formatter noted no hosted history at audit start), replay baseline in staging, demonstrate restore-tested backup, never run blind `db:push`/`db:reset` on prod.
- **5.3 Authenticated acceptance** — seeded staging users: admin/staff revocation, shipments/invoices/PDF/manifests/scanners end-to-end (the browser suite today covers public + denial only).
- **5.4 Providers** — real Resend delivery + allowed auth redirects + expired link + WhatsApp template/delivery + carrier replay + cron + Sentry alert. Verify `cargo-documents` is private, `pgrst reload` after RLS.

---

## 6. What NOT To Do

- No new customer account system. TAC-XPRESS has no customer dashboard by design; keep `users.role customer` as contact only.
- No `pages/` directory, no `middleware.ts` (use `proxy.ts`).
- No glass cards / saturated gradients / 3D engine / autoplay video (violates `docs/DESIGN.md`).
- No `npm`/`yarn` — `pnpm` only.
- No deletion of source files without an `implementation_plan.md` + user approval.
- No multi-leg cargo state refactor beyond `manifest_type` until leg-completion model is specified with audit requirements.

---

## 7. Affected File Inventory (by Phase)

**Phase 0:** `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `instrumentation.ts`, `next.config.ts`, `proxy.ts`, `lib/auth/secret.ts`, `lib/auth/verify-mobile-client.ts`, `app/driver/layout.tsx`, `app/(landing)/docs-preview/page.tsx`, `app/terms/page.tsx`, `scripts/verify-production-env.ts`, `docs/**/*`.

**Phase 1:** `app/layout.tsx`, `app/sitemap.ts` (new), `app/robots.ts` (new), `app/manifest.ts` (new), `app/(landing)/components/*`, `components/public/{site-navigation,home-hero,hero-dispatch-console,shipment-desk,tracking-explainer,logistics-home,json-ld}.tsx`, `components/public/shipping-content.ts`, `lib/tracking/*`, `app/actions/tracking.ts`, `app/globals.css`, `app/styles/enterprise-overrides.css`, `public/robots.txt`.

**Phase 2:** `components/app-shell.tsx`, `app/dashboard/layout.tsx`, `components/operations/workspace-frame.tsx`, `components/operations/app-sidebar.tsx`, `components/operations/navigation.ts`, `app/dashboard/page.tsx`, `app/dashboard/{analytics,metrics,shipments,dispatch,manifests,warehouse,tracking,fleet,hubs,invoices,communications,customers,pricing,messages,feedback,staff,integrations}/page.tsx`, `lib/dashboard-metrics.ts`, `lib/service-metrics.ts`, `lib/control-center.ts`, `components/ui/data-table/*`, `hooks/use-data-table.ts`, `lib/store/use-app-store.ts`, `components/kibo-ui/table/*`, `lib/table-query.ts`.

**Phase 3:** `lib/db/schema.ts`, `lib/db/index.ts`, `drizzle.config.ts`, `supabase/migrations/*`, `types/db-aligned.ts`, `supabase/functions/{generate-invoice-pdf,capabilities}/index.ts`, `lib/documents/{cargo-storage,cargo-file,render-invoice-pdf}.ts`, `app/api/cargo-documents/[entity]/[id]/route.ts`, `app/api/public/invoice-pdf/route.ts`, `app/api/fleet/telemetry/route.ts`, `app/api/webhooks/whatsapp/route.ts`, `app/api/webhooks/carrier/route.ts`, `app/api/cron/**/*`, `lib/jobs/{store,worker}.ts`, `lib/whatsapp/*`, `lib/fleet-telemetry*.ts`, `app/actions/{ai-triage,ai-responder,whatsapp-*}.ts`, `lib/support/*`, `lib/invoices/*`.

**Phase 4:** `lib/posthog*`, `sentry.*`, `tests/**/*`, `vitest.config.ts`, `playwright.config.ts`, `.agents/skills/**/*`, `docs/**/*`.

---

## 8. Risks & Mitigations

| Risk | Trigger | Mitigation |
|------|---------|------------|
| `vehicles` migration locks prod table | `fleet_vehicles` merge runs on live | Run on staging clone first; use `CONCURRENTLY` indexes + advisory lock; keep rollback migration |
| Chromium PDF cache serves stale invoice | `invoice.updatedAt` not bumped on payment | Hash includes `amount, balanceDue, status, updatedAt` + short TTL signed URL (1h already) |
| Search index creation blocks writes | `pg_trgm`/gin build on 100k rows | `CREATE INDEX CONCURRENTLY` + statement_timeout 15s already set in `lib/db/index.ts` |
| Tracking consolidation breaks GET /track | `awb` param handling diverges | Keep `app/track/page.tsx` as canonical, components only render the form; integration test on `?awb=` canonical |
| WhatsApp relay changes contract | `leminai.com` opaque | Pin `WPBOX_BASE_URL` env, add contract test on `sendViaRelay` payload shape |

---

## 9. Validation Plan (per Task)

Every phase exit requires:

1. `pnpm typecheck` (Next typegen + `tsc --noEmit`)
2. `pnpm lint` (Next ESLint) — zero errors
3. `pnpm stylelint` — zero errors (`@import` notation disabled already)
4. `pnpm test:unit` — Vitest pass
5. `pnpm build` (Turbopack) — `ANALYZE=false`, chunk report stable vs baseline (`@next/bundle-analyzer` available)
6. Route-specific Playwright: `cargo-frontend`, `workspace-design`, `accessibility`, `chat-recovery`, `auth`
7. Manual spot: public 320/768/1440/1920 light+dark, staff dashboard with real seed data.

Staging clearance adds `pnpm verify:production-env` in deployed env + provider acceptance (list in §5).

---

## 10. Rollout Order & Dependencies

```
0 Safety (secrets, perimeter, guards)
  ↓
1 Public (bundle, SEO, tracking) ─┐
                                   ├→ 3 Data (migrations, storage, jobs)
2 Dashboard (cache, tables, fleet) ┘        ↓
                                      4 Observe (tests, a11y, docs)
                                           ↓
                                      5 Deploy gates
```

`1` and `2` can run in parallel after `0`. `3` depends on `1` (origin check) + `2` (fleet decision).

---

## 11. Estimates Are Intentionally Omitted

Per planning protocol, no level-of-effort in hours/days/weeks is provided. Reviewers should size by team capacity after decision table is locked.

---

## 12. Immediate Next Actions (for Implementer)

1. Lock Decision Table (§4) — especially fleet + portal + manifest type.
2. Create `implementation_plan.md` artifact before any source deletion (§1.5 AGENTS rule) covering files to delete (`app/(landing)/components`, `enterprise-overrides.css`, Zustand store, `kibo-ui/table`).
3. Execute Phase 0 and open PR titled `chore(security): harden perimeter, Sentry, and guards` — must pass `verify:production-env` shape test before merging.
4. Follow phases sequentially; each phase = one PR with its validation evidence attached.

---

*Plan ready for review. Saved as `1790274582483-tac-xpress-enhancement-plan.md`; call `open_plan` then `plan_exit` to hand off to implementation.*
