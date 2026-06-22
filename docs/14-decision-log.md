# 14 — Decision Log

**Document:** Architectural Decision Records (ADRs)  
**Audience:** All Engineers, CTO  
**Last Updated:** 2026-06-06

---

## About This Document

Every significant architectural decision made during the development of Tac-Xpress is recorded here. This is the authoritative source for *why* the system is built the way it is.

Each record follows this format:
- **Context** — The situation that required a decision
- **Decision** — What was decided
- **Reasoning** — Why this option was chosen over alternatives
- **Consequences** — Trade-offs and follow-on implications
- **Status** — Active / Superseded / Deprecated

---

## ADR-001: Mock-First Contract Generation

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P0

### Context
Traditional API-first development causes drift between what the frontend expects and what the backend delivers. Type mismatches are caught at runtime, not at compile time.

### Decision
The UI mock (`mocks/cargo-data.ts`) is the single source of truth. Backend schemas are generated from the mock, not the other way around. Any backend schema that cannot render data from `cargo-data.ts` in Storybook is invalid.

### Reasoning
- Eliminates API drift — UI and backend always agree on the shape
- Storybook becomes a living contract validator
- Chromatic snapshots catch visual regressions from any schema change

### Consequences
- Developers must update `mocks/cargo-data.ts` before changing any data contract
- Adding backend fields not reflected in the mock is a code smell and will fail CI
- Requires discipline in the team to update mocks as the source of truth

---

## ADR-002: Zero-Curve Design System

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P0

### Context
The logistics industry has a visual language of precision and authority. Rounded corners communicate softness and consumer apps. A platform trusted by freight forwarders for court-admissible data should feel different.

### Decision
`rounded-none` is the enforced design standard for all structural elements. `rounded-full` is permitted for avatar/badge circles only. `rounded-xl` is pre-approved for outer card containers.

### Reasoning
- Creates a distinctive visual identity that signals professionalism
- Differentiates Tac-Xpress from generic SaaS dashboards
- Enforced via CI (`pnpm audit:curves`) — no exceptions slip through

### Consequences
- All Shadcn UI components must be overridden with `rounded-none` on import
- The curve audit script must be maintained as the component library grows
- Third-party components (e.g., Mapbox popups) may not be fully controllable

---

## ADR-003: JWT Strategy over Database Sessions

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P2

### Context
NextAuth supports two session strategies: `database` (each request hits the DB to validate the session) and `jwt` (the session is verified locally using the NEXTAUTH_SECRET).

### Decision
Use `jwt` strategy. Extend the JWT with `org_id` and `role` so they are available server-side without additional DB lookups.

### Reasoning
- **Performance:** Database sessions require a DB query on every protected request. JWT validation is CPU-only.
- **Edge compatibility:** JWT works on Vercel Edge Runtime; database sessions require full Node.js.
- **Scalability:** JWT sessions scale horizontally with no shared state.

### Consequences
- Session revocation is not instant — a revoked user's JWT is valid until expiry (24h). Full revocation requires JTI implementation (planned in Moat #7).
- Role changes take effect on next login, not immediately.
- The JWT size grows with each additional claim. Keep claims minimal.

---

## ADR-004: Server Actions as the Only Mutation Entry Point

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P3

### Context
Traditional REST APIs expose mutation endpoints (POST, PUT, DELETE) that can be targeted directly. Each endpoint requires its own auth middleware, rate limiting, and validation.

### Decision
All data mutations flow through Next.js Server Actions. No external REST mutation endpoints are exposed for internal UI operations.

### Reasoning
- **Security surface reduction:** There are no URLs to enumerate or probe.
- **Type safety:** Server Actions are typed end-to-end with TypeScript.
- **Auth consistency:** Every server action calls `auth()` as its first instruction — there is no way to forget to add auth middleware.
- **Zod validation:** Each action validates inputs at the server boundary.

### Consequences
- External integrations (carrier webhooks, future public API) still use Route Handlers — this ADR applies to UI-initiated mutations only.
- Debugging server actions is slightly harder than inspecting HTTP requests (use Sentry breadcrumbs).

---

## ADR-005: Event Sourcing for Tracking Data

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P3

### Context
Shipment tracking is historically mutable — systems update a `status` field. This loses history and makes disputes impossible to resolve definitively.

### Decision
Tracking data is event-sourced. The `tracking_event_log` is an append-only ledger. Status is derived from the latest event. The database enforces immutability via RLS (`UPDATE` and `DELETE` policies set to `USING (false)`).

### Reasoning
- **Auditability:** Every state transition is recorded with timestamps and actor identity.
- **Dispute resolution:** The hash chain is court-admissible evidence of what happened and when.
- **No data loss:** Even if a status is incorrectly set, the incorrect entry is on record — it can be superseded by a corrective event, not overwritten.
- **Competitive moat:** No spreadsheet or legacy TMS provides this.

### Consequences
- Storage grows with every event (by design — events are never deleted).
- Querying "current status" requires a `DISTINCT ON` or the materialized view.
- The materialized view and trigger must be maintained as the schema evolves.

---

## ADR-006: SHA-256 Hash Chains for Tamper Evidence

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P3

### Context
An append-only ledger prevents deletion but doesn't prevent modification of existing rows (if the RLS policy is bypassed, e.g., via a superuser or future bug).

### Decision
Every tracking event stores a `event_hash` = SHA-256 of `(shipment_id + type + payload + occurred_at + previous_hash)`. The first event's `previous_hash` is `null` (genesis).

### Reasoning
- **Tamper detection:** Modifying any event breaks every subsequent hash.
- **No trusted third party required:** Verification is purely mathematical — no external system needed.
- **Evidence-grade:** SHA-256 is a NIST-approved cryptographic standard, recognized in legal proceedings.

### Consequences
- Hash chains cannot be retroactively corrected — if an event is inserted with wrong data, the chain is "stained." A corrective event must be appended.
- The hash computation is deterministic — the exact JSON serialization order of `payload` must be preserved across deployments.

---

## ADR-007: Mapbox GL JS over MapLibre GL

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P4

### Context
`maplibre-gl` was already installed in the project as an open-source Mapbox fork. The CTO memo specified `mapbox-gl` for P4.

### Decision
Use `mapbox-gl` (proprietary, requires API key and token) instead of `maplibre-gl`.

### Reasoning
- **Satellite imagery:** Mapbox satellite tiles are higher quality than MapLibre's default providers.
- **Globe projection:** Mapbox GL JS 3.x includes a globe projection (`projection: 'globe'`) that creates a visually impressive demo with atmospheric fog rendering.
- **Demo impact:** The globe view is a key moment in the 10-minute customer demo.
- **Cost:** Mapbox free tier (50,000 map loads/month) is sufficient for demo and early customer usage.

### Consequences
- Requires `NEXT_PUBLIC_MAPBOX_TOKEN` in every environment.
- Cost scales with usage — monitor via Mapbox dashboard. At Growth tier ($299/month), Mapbox costs should remain < $20/month.
- If open-source is required (e.g., enterprise air-gapped deployment), `maplibre-gl` with self-hosted tiles is the fallback path.

---

## ADR-008: Resend for Transactional Email

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P4

### Context
Carrier webhook events need to notify organization admins immediately. Email is the lowest-friction notification channel for the target customer (freight forwarders).

### Decision
Use Resend (`resend` npm package) for transactional email. Email sending is fire-and-forget — the webhook response is not blocked by email delivery.

### Reasoning
- **Developer experience:** Resend has the best DX of any transactional email service (React email templates, excellent API).
- **Reliability:** Dedicated deliverability infrastructure.
- **Simplicity:** Single `RESEND_API_KEY` env var.
- **Fire-and-forget:** Email errors are caught and swallowed (`.catch(console.error)`) — a failed email should never cause a webhook to return 500.

### Consequences
- Failed emails are silent (logged to console, not surfaced to user).
- For customer-facing email reliability, a retry mechanism or webhook to a queue should be added in the Growth tier.
- Email templates are inline HTML strings — future enhancement is to use React Email for templating.

---

## ADR-009: Transactional Demo Data Generation

**Date:** 2026-06-06  
**Status:** ✅ Active  
**Phase:** P5

### Context
Demo data generation could be implemented as a CLI script (`npx tsx scripts/generate-demo-data.ts`) or a Next.js Server Action. A CTO decision was made between the two approaches.

### Decision
Implement as a Next.js Server Action (`app/actions/demo.ts`) triggered from the onboarding UI.

### Reasoning
- **Demo UX:** CLI requires SSH access and switching contexts during a customer demo. A button click provides magic.
- **Atomicity:** The entire generation runs in a single Drizzle transaction. Failure rolls back completely — no broken state.
- **Security:** The action enforces `admin` or `manager` role — no demo data can be injected by unauthorized users.
- **Cache revalidation:** `revalidatePath('/dashboard')` ensures the dashboard reflects new data immediately post-generation.

### Consequences
- Demo data generation is not idempotent — calling it twice creates duplicate entries. A guard should be added (check for existing demo containers before inserting).
- The onboarding button should be disabled after first use.

---

## ADR-010: Multi-Tenant Isolation via `org_id` from Day One

**Date:** 2026-06-05  
**Status:** ✅ Active  
**Phase:** P1

### Context
Building multi-tenancy into an existing single-tenant system is a major migration. Many startups defer it until they have multiple customers, then face months of refactoring.

### Decision
`org_id` is present on every table from P0. Every database query is scoped by `org_id`. Every RLS policy enforces `org_id = jwt.org_id`. There are no exceptions.

### Reasoning
- **Zero migration cost:** Adding tenancy retroactively is 10x harder.
- **Security by default:** A developer cannot accidentally fetch cross-tenant data — RLS prevents it.
- **Sales enablement:** The platform can be demoed to multiple prospects simultaneously without data isolation concerns.

### Consequences
- Every database query must include `org_id` in the WHERE clause (or be covered by RLS automatically).
- The `service_role` key bypasses RLS — extra care is required in webhook handlers that use it.
- First-time users get a new organization automatically provisioned — this is the correct behavior.

---

## Adding a New ADR

When making a significant architectural decision:

1. Assign the next sequential ADR number
2. Fill in all sections: Context, Decision, Reasoning, Consequences, Status
3. Add a one-line summary to the table at the top of this document
4. Commit alongside the code that implements the decision
5. Reference the ADR number in the PR description
