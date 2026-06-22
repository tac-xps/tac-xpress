# 01 — Architecture Overview

**Document:** Architecture Overview  
**Audience:** All Engineers, CTO, Product  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [System Purpose](#1-system-purpose)
2. [Layer Progression (P0 → P5)](#2-layer-progression-p0--p5)
3. [Technology Stack](#3-technology-stack)
4. [Data Flow Architecture](#4-data-flow-architecture)
5. [Strategic Moats Summary](#5-strategic-moats-summary)
6. [Directory Structure](#6-directory-structure)

---

## 1. System Purpose

Tac-Xpress is not a CRUD app. It is a **mission-critical operational system** designed to give freight forwarders a cryptographically secured, real-time view of every container they manage — from origin port to final delivery.

Three architectural decisions define it:

1. **Event-Sourced Tracking with Hash Chains** — Every tracking event is immutable. The `event_hash` column is a SHA-256 of `(shipment_id + type + payload + occurred_at + previous_hash)`. Tamper with one event, every subsequent hash breaks. This is evidence-grade auditability.

2. **Capability-Aware UI at the Component Level** — The `SecureBoundary` component doesn't just hide buttons; it communicates the security model to users. A warehouse worker sees *exactly* why they can't edit a customs declaration and what role they need.

3. **Server Actions as the Security Perimeter** — The `createShipment` server action validates auth before Zod before database insertion. There is no API endpoint to attack; the only entry point is the authenticated server action. RLS is the final defense.

---

## 2. Layer Progression (P0 → P5)

```
┌─────────────────────────────────────────────────────────────┐
│  P5: BUSINESS                                               │
│  • Demo data generator (transactional, hash-chained)        │
│  • 4-step onboarding flow with demo activation              │
│  • Customer acquisition playbook ($0 → $299 → $1,499)       │
│  • 10-minute demo script for freight forwarders             │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  P4: REAL PRODUCT                                           │
│  • Mapbox GL JS (satellite, route lines, pulsing markers)   │
│  • Carrier webhooks (HMAC-SHA256 verified, Resend emails)   │
│  • Real-time SSE streaming + 30s fallback polling           │
│  • Warehouse tablet view (44px targets, scan-ready)         │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  P3: THE HAPPY PATH                                         │
│  • Create shipment → track → view (end-to-end)              │
│  • Event-sourced tracking (immutable SHA-256 hash chains)   │
│  • Capability-aware UI (SecureBoundary + useRLS)            │
│  • Server actions as security perimeter                     │
│  • shipment_status_summary Materialized View + triggers     │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  P2: IDENTITY                                               │
│  • NextAuth v5 + @auth/supabase-adapter                     │
│  • JWT with org_id + role injected via callbacks            │
│  • JTI revocation for immediate session termination         │
│  • Auto-org creation on first sign-up                       │
│  • Capability tokens from Supabase Edge Function            │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  P1: SECURITY FOUNDATION                                    │
│  • Row-Level Security (RLS) on ALL tables                   │
│  • Tenant isolation via org_id — no cross-org data leaks    │
│  • Serverless connection pooling (Supabase session mode)    │
│  • Compile-time schema sync (tsc --noEmit in CI)            │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────┐
│  P0: FOUNDATION                                             │
│  • 43 components, 109 stories, 165 Chromatic snapshots      │
│  • Mock-first architecture (mocks = source of truth)        │
│  • Tailwind CSS v4 zero-curve design system                 │
│  • Tailwind linting + curve audit in CI                     │
│  • Auto-generated contracts (Zod, TypeScript, OpenAPI)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| Framework | Next.js | 16.x | App Router, RSC default |
| Language | TypeScript | 5.x | Strict mode |
| Styling | Tailwind CSS | 4.x | Zero-curve enforcement |
| Components | Shadcn UI | Latest | Built on Radix UI |
| State | Zustand | 5.x | Global client state |
| Forms | React Hook Form + Zod | 7.x / 4.x | Type-safe forms |
| Charts | Recharts | 3.x | Data visualization |
| Maps | Mapbox GL JS | 3.x | Satellite, routes, markers |
| Animation | Framer Motion | 12.x | Micro-interactions |
| Email | Resend | 6.x | Transactional notifications |
| Auth | NextAuth v5 | beta.31 | JWT sessions |

### Backend

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| ORM | Drizzle ORM | 0.45.x | Type-safe Postgres queries |
| Database | Supabase PostgreSQL | 16+ | RLS, Realtime, Storage |
| Auth Adapter | @auth/supabase-adapter | 1.x | Session sync |
| Safe Actions | next-safe-action | 8.x | Validated server actions |
| Monitoring | Sentry | 10.x | Full APM + error tracking |

### Infrastructure

| Layer | Technology | Notes |
|-------|-----------|-------|
| Hosting | Vercel | Edge network, serverless |
| Database | Supabase | Managed Postgres + Storage |
| CI/CD | GitHub Actions | Lint, test, Chromatic, build |
| Error Tracking | Sentry SDK | Source maps via Next.js Webpack plugin |

---

## 4. Data Flow Architecture

```
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│ Carrier APIs │   │  Browser UI  │   │  Warehouse   │
│ (Webhooks)   │   │  (Next.js)   │   │  Tablet      │
└──────┬───────┘   └──────┬───────┘   └──────┬───────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────┐
│              HMAC Verification + Auth               │
│     (CARRIER_WEBHOOK_SECRET / NextAuth JWT)         │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              Server Actions / Route Handlers        │
│   • Zod validation  • Auth check  • Org isolation  │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              Drizzle ORM + RLS Policies             │
│    Tenant-isolated queries (org_id = jwt.org_id)   │
└──────────────────────────┬──────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────┐
│              Supabase PostgreSQL                    │
│  • tracking_event_log (immutable hash chain)        │
│  • shipment_status_summary (Materialized View)      │
│  • Trigger: REFRESH MATERIALIZED VIEW on INSERT     │
└──────────────────────────┬──────────────────────────┘
                           │
                ┌──────────┴──────────┐
                ▼                     ▼
   ┌─────────────────┐    ┌───────────────────────┐
   │   SSE Stream    │    │   Resend Email API    │
   │  /api/stream/   │    │  (Async notification) │
   │  tracking       │    └───────────────────────┘
   └─────────────────┘
```

---

## 5. Strategic Moats Summary

See [13-moat-activation-guide.md](./13-moat-activation-guide.md) for the full activation playbook.

| # | Moat | Status | Activation Trigger |
|---|------|--------|-------------------|
| 1 | Ghost Fleet Simulation | 🟡 Primed | Customer asks about delay scenarios |
| 2 | Zero-Trust UI | 🟢 **ACTIVE** | Live in production |
| 3 | Contract API (Developer Portal) | 🟡 Primed | Customer asks for TMS integration |
| 4 | Event Sourcing + Hash Chains | 🟢 **ACTIVE** | Live in production |
| 5 | Edge Auth (NFC/QR Hardware) | 🟡 Primed | Warehouse hardware request |
| 6 | Chaos Logistics | 🔴 Not started | First enterprise SLA customer |
| 7 | Compliance Kernel | 🟡 Primed | Customs dispute or audit export request |
| 8 | Self-Documenting PRs | 🔴 Not started | Team size > 5 engineers |

---

## 6. Directory Structure

```
c:/lozi/tac-xpress/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Login / Sign-up routes
│   ├── actions/                  # Server Actions
│   │   ├── shipments.ts          # createShipment (security perimeter)
│   │   └── demo.ts               # generateDemoData (transactional seed)
│   ├── api/
│   │   ├── webhooks/carrier/     # HMAC-verified carrier webhook
│   │   └── stream/tracking/      # SSE real-time events
│   └── dashboard/
│       ├── page.tsx              # Command Center
│       ├── shipments/[id]/       # Shipment detail + RealtimeTracker
│       ├── warehouse/            # Tablet dock view
│       ├── onboarding/           # 4-step guided setup
│       ├── customers/
│       ├── analytics/
│       └── invoices/
├── components/
│   ├── security/
│   │   └── SecureBoundary.tsx    # Zero-Trust UI component
│   ├── shipments/
│   │   ├── MapboxRoute.tsx       # Live satellite map
│   │   ├── RealtimeTracker.tsx   # SSE + polling event log
│   │   └── CreateShipmentDialog.tsx
│   └── ui/                       # Shadcn UI primitives
├── db/
│   └── schema/                   # Drizzle ORM table definitions
│       ├── organizations.ts
│       ├── users.ts
│       ├── shipments.ts
│       ├── tracking-events.ts
│       ├── warehouses.ts
│       ├── inventory.ts
│       └── auth.ts
├── drizzle/                      # SQL migration files
├── docs/                         # ← You are here
├── lib/
│   └── db.ts                     # Drizzle client + connection pool
├── hooks/                        # Custom React hooks (useRLS, etc.)
├── mocks/                        # cargo-data.ts (source of truth)
├── contracts/                    # Generated OpenAPI spec
└── ARCHITECTURE.md               # Short-form moat reference
```
