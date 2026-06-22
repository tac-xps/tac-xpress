# 13 — Moat Activation Guide

**Document:** 8 Strategic Moats — Status, Triggers & Activation Playbooks  
**Audience:** CTO, Product, Engineering Leads  
**Last Updated:** 2026-06-06

---

## Overview

A "moat" is a feature that is **architecturally primed but not customer-facing yet**. Each moat is activated the moment a customer signals they need it — not before. This keeps the codebase lean while ensuring zero-delay delivery when the trigger is pulled.

**Activation philosophy:** The customer's words determine the next moat. Not ours.

---

## Moat Status Summary

| # | Moat Name | Status | Activation Trigger |
|---|-----------|--------|-------------------|
| 1 | [Ghost Fleet Simulation](#moat-1-ghost-fleet-simulation) | 🟡 Primed | "What if my container is delayed?" |
| 2 | [Zero-Trust UI](#moat-2-zero-trust-ui) | 🟢 **ACTIVE** | Live in production |
| 3 | [Contract API (Developer Portal)](#moat-3-contract-api--developer-portal) | 🟡 Primed | "Can my TMS integrate with this?" |
| 4 | [Event Sourcing + Hash Chains](#moat-4-event-sourcing--hash-chains) | 🟢 **ACTIVE** | Live in production |
| 5 | [Edge Auth (NFC/QR Hardware)](#moat-5-edge-auth-nfcqr-hardware) | 🟡 Primed | "My dock workers need badges" |
| 6 | [Chaos Logistics](#moat-6-chaos-logistics) | 🔴 Not Started | First enterprise SLA customer |
| 7 | [Compliance Kernel](#moat-7-compliance-kernel) | 🟡 Primed | "How do I prove this to customs?" |
| 8 | [Self-Documenting PRs](#moat-8-self-documenting-prs) | 🔴 Not Started | Engineering team > 5 people |

---

## Moat #1: Ghost Fleet Simulation

**Status:** 🟡 Primed  
**Business Value:** Enables freight forwarders to run "what-if" simulations — delay scenarios, rerouting, port closures — without touching live shipment data. Enterprise differentiator.

### Trigger Words
- "What if this container is delayed by a week?"
- "Can I simulate what happens if Port of LA is shut down?"
- "We need to stress-test our supply chain before peak season."

### Architecture (Ready to Activate)

The ghost fleet runs in a **parallel schema** — a mirror of the `shipments` and `tracking_event_log` tables with an `is_simulation: true` flag. Real data and simulation data never touch.

```typescript
// Planned schema addition
export const simulationShipments = pgTable('simulation_shipments', {
  // Identical to shipments table, plus:
  simulationId: uuid('simulation_id').references(() => simulations.id),
  forkFrom: uuid('fork_from').references(() => shipments.id), // Real shipment cloned
  mutationParams: jsonb('mutation_params').default({}), // Delay, reroute, etc.
});
```

### Activation Steps

1. **Add `simulations` and `simulation_shipments` tables** to `db/schema/`
2. **Create `forkSimulation` server action** that clones a real shipment into simulation space
3. **Add Ghost Fleet UI toggle** to the dashboard — a banner that switches between real data and simulation
4. **Build simulation mutation engine** — parameters: delay hours, port swap, carrier swap
5. **Add RLS policies** for the simulation tables (org-isolated, same as real tables)
6. **Gate behind `plan: 'enterprise'`** in the billing check

### Estimated Effort: 3-5 days

---

## Moat #2: Zero-Trust UI

**Status:** 🟢 ACTIVE  
**Implemented In:** P2-P3

The Zero-Trust UI is live. Every UI component is a security participant. `SecureBoundary` enforces capability checks at the component level, backed by RLS at the database level and role checks at the server action level.

**Active Components:**
- `components/security/SecureBoundary.tsx`
- `hooks/useRLS.ts` (or equivalent capability hook)
- All three server actions (createShipment, generateDemoData, webhook handler)
- RLS policies on all 6 tables

**Nothing to activate. Maintain and extend.**

---

## Moat #3: Contract API / Developer Portal

**Status:** 🟡 Primed  
**Business Value:** Allows enterprise customers to integrate Tac-Xpress with their existing TMS (Transportation Management System), ERP, or custom internal tools. Unlocks the $1,499/month tier.

### Trigger Words
- "Can my TMS pull tracking data from your API?"
- "We need to integrate this with SAP."
- "Does it have webhooks we can subscribe to?"
- "We need a developer to connect this to our internal system."

### Architecture (Ready to Activate)

The OpenAPI specification is already generated at `contracts/cargo-api.json`. The Zod schemas from the server actions are the contract surface.

```
contracts/
└── cargo-api.json    ← Generated OpenAPI 3.0 spec. Already exists.
```

### Activation Steps

1. **Build the Developer Portal** (`app/developer/` route) — API key management UI
2. **Create `api_keys` table** with scopes (`read:shipments`, `write:events`, etc.)
3. **Add API Key middleware** — checks `Authorization: Bearer <key>` header
4. **Expose public REST endpoints** wrapping the existing server action logic:
   - `GET /api/v1/shipments` — List org shipments
   - `GET /api/v1/shipments/:id` — Get shipment detail + events
   - `POST /api/v1/shipments/:id/events` — Append tracking event
   - `POST /api/v1/webhooks/subscribe` — Subscribe to org events
5. **Rate limit by API key** (extend Arcjet config)
6. **Add webhook subscriptions table** — orgs register URLs to receive events

### Estimated Effort: 5-7 days

---

## Moat #4: Event Sourcing + Hash Chains

**Status:** 🟢 ACTIVE  
**Implemented In:** P3

The event sourcing layer is live. `tracking_event_log` is an immutable, append-only ledger. Every event is SHA-256 linked to the previous, creating a tamper-evident chain.

**Active Infrastructure:**
- `db/schema/tracking-events.ts` — Schema definition
- `drizzle/0003_shipment_status_summary_view.sql` — Materialized view + auto-refresh trigger
- `app/api/webhooks/carrier/route.ts` — External event ingestion
- `components/shipments/RealtimeTracker.tsx` — Live UI rendering

**Extend by:** adding new event types (see [07-real-time-tracking.md §8](./07-real-time-tracking.md#8-adding-a-new-event-type)).

---

## Moat #5: Edge Auth (NFC/QR Hardware)

**Status:** 🟡 Primed  
**Business Value:** Physical badge-based authentication for dock workers. Workers tap an NFC badge to authenticate — no password, no phone. Critical for warehouses where shared devices are the norm.

### Trigger Words
- "My dock workers share tablets — how do they log in separately?"
- "Can this work with our existing badge system?"
- "We need workers to scan containers when they receive them."
- "My people don't have emails — they can't log in with Google."

### Architecture (Ready to Activate)

The `html5-qrcode` library is already installed in `package.json`. The warehouse UI buttons are placeholder-ready.

```typescript
// Planned schema addition
export const badgeTokens = pgTable('badge_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  orgId: uuid('org_id').references(() => organizations.id),
  userId: uuid('user_id').references(() => users.id),
  nfcUid: text('nfc_uid').unique(),       // NFC chip UID
  qrCode: text('qr_code').unique(),       // QR code payload
  isActive: boolean('is_active').default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
});
```

### Activation Steps

1. **Create `badge_tokens` table** in `db/schema/`
2. **Deploy `verify-nfc-badge` Supabase Edge Function** — validates NFC UID and returns a signed session token
3. **Wire the "NFC / QR" button** in the warehouse header:
   - QR path: `html5-qrcode` camera scan → verify token → create session
   - NFC path: `navigator.nfc.scan()` Web NFC API → verify UID → create session
4. **Build Badge Management UI** for admins — assign NFC UIDs to worker profiles
5. **Add `badge_token` auth provider** to NextAuth — a custom credentials provider

### Estimated Effort: 4-6 days

---

## Moat #6: Chaos Logistics

**Status:** 🔴 Not Started  
**Business Value:** Automated resilience testing for supply chains. When a customer has an SLA, they need confidence their routing can survive port closures, carrier failures, and weather events.

### Trigger Words
- "What happens to our shipments if the Suez Canal closes again?"
- "We need a Business Continuity Plan for our supply chain."
- "Can you guarantee our cargo gets through even if one carrier goes down?"

### Architecture (To Be Designed)

Chaos Logistics is a simulation engine that injects failure scenarios into the Ghost Fleet (Moat #1) to measure resilience:

- **Port Closure:** All shipments routed through port X are rerouted and ETA recalculated.
- **Carrier Failure:** All shipments with carrier Y are rebid to available alternatives.
- **Weather Event:** Delay injection based on historical weather data for a sea lane.

**Dependencies:** Requires Moat #1 (Ghost Fleet) to be active first.

### Estimated Effort: 8-12 days (after Ghost Fleet)

---

## Moat #7: Compliance Kernel

**Status:** 🟡 Primed  
**Business Value:** Packaged, exportable audit compliance. Enterprise customers (especially those shipping through US CBP, EU customs, and Asian customs authorities) need to provide documentary evidence in disputes. This moat packages the existing hash chains into exportable, court-ready formats.

### Trigger Words
- "How do I prove to customs that my container was delivered on time?"
- "We need to export audit logs for our compliance team."
- "Can you generate a PDF of the tracking history for our lawyers?"
- "We need SOC 2 Type II documentation."

### Architecture (Partially Ready)

The audit trail already exists — the hash chain **is** the compliance record. This moat adds the packaging layer.

**Planned Deliverables:**

1. **`ComplianceExport` server action** — generates a signed JSON export of the full event chain for a shipment, including hash verification proof
2. **PDF Audit Report** using `@react-pdf/renderer` (already installed) — renders the tracking timeline as a branded, printable document
3. **Chain Verification Endpoint** — `GET /api/v1/shipments/:id/verify` — returns `{ valid: true/false, chain_length: 18, genesis_hash: '...' }` for third-party verification
4. **JTI Revocation Table** — Allows admins to immediately invalidate sessions on breach (extends the existing JTI claim in the JWT)

### Activation Steps

1. **Build `ComplianceExportDialog`** — admin-only button in shipment detail view
2. **Create server action** that validates the full hash chain and serializes to JSON
3. **Create PDF template** using `@react-pdf/renderer` — timeline, hashes, org branding
4. **Deploy Chain Verification edge function** in Supabase
5. **Gate behind `plan: 'enterprise'`**

### Estimated Effort: 3-4 days

---

## Moat #8: Self-Documenting PRs

**Status:** 🔴 Not Started  
**Business Value:** As the engineering team grows, PR documentation quality degrades. This moat uses AI to auto-generate structured PR descriptions, test plans, and breaking change notices from the diff.

### Trigger Condition
Engineering team exceeds 5 people and review quality becomes inconsistent.

### Architecture (To Be Designed)

A GitHub Action triggered on PR creation:
1. Fetches the diff
2. Sends to OpenAI GPT-4o (or equivalent — `@ai-sdk/openai` already installed)
3. Generates a structured PR description: Summary, Changes, Test Plan, Breaking Changes
4. Posts as a PR comment

**Dependencies:** `@ai-sdk/openai` and `openai` are already installed in `package.json`.

### Estimated Effort: 1-2 days (when triggered)

---

## Activation Decision Framework

When a customer says something that matches a trigger:

```
1. IDENTIFY → Which moat does this map to?
2. QUOTE → Estimated effort (from above) → Translate to timeline
3. GATE → Is it available on their current plan, or is it an upgrade?
4. BUILD → Activate the moat using the playbook above
5. SHIP → Deploy, demo the new capability, collect feedback
6. REPEAT → Identify the next moat signal
```

**The rule:** Never activate a moat speculatively. Only activate when a real customer has expressed a real need. This is the constraint that keeps the product focused and the team shipping real value.
