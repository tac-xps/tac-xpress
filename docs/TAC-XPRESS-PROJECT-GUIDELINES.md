# Tac-Xpress Project Guidelines
## Comprehensive Development Roadmap & Architecture Decisions
### Version: 1.0 | Effective: 2026-06-05 | Owner: CTO

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Philosophy](#2-architecture-philosophy)
3. [Technology Stack](#3-technology-stack)
4. [Project Phases & Milestones](#4-project-phases--milestones)
5. [Feature Modules](#5-feature-modules)
6. [Data Architecture](#6-data-architecture)
7. [API Design Standards](#7-api-design-standards)
8. [Security & Compliance](#8-security--compliance)
9. [Performance Standards](#9-performance-standards)
10. [Development Workflow](#10-development-workflow)
11. [Quality Gates](#11-quality-gates)
12. [Deployment Strategy](#12-deployment-strategy)
13. [Monitoring & Observability](#13-monitoring--observability)
14. [Appendix: Decision Log](#14-appendix-decision-log)

---

## 1. Executive Summary

Tac-Xpress is a next-generation logistics and cargo management platform. We are not building a dashboard. We are building a **mission-critical operations system** that freight forwarders, warehouse operators, and supply chain managers depend on for real-time decision-making.

### Current Status
- **UI Foundation:** Complete. 43 components, 165 Chromatic snapshots, zero-curve design system, automated visual regression.
- **Contract Foundation:** Complete. Mock-driven backend contracts (Zod, TypeScript, tRPC, OpenAPI) generated from UI mocks.
- **Next Phase:** Backend implementation, database schema, authentication, real-time tracking, and core business logic.

### The Golden Rule
> **The UI mock is the single source of truth for all data contracts.** Any backend schema that cannot render in Storybook is invalid.

---

## 2. Architecture Philosophy

### 2.1 Frontend-First Contract Generation
Traditional API-first development causes drift. We invert the flow:
1. UI defines exact data shapes in `mocks/cargo-data.ts`
2. Storybook renders with mock data (165 snapshots validate this)
3. Contract generator emits backend schemas
4. Backend implements against generated contracts
5. Chromatic catches any drift immediately

### 2.2 Zero-Trust UI Consistency
Every component must pass:
- Visual regression (Chromatic)
- Zero-curve audit (`audit:curves`)
- State matrix coverage (6 states minimum)
- Tiered viewport testing (375/1280/1440)

### 2.3 Event-Driven Real-Time Architecture
Logistics is real-time. The platform must handle:
- GPS tracking updates (WebSocket/SSE)
- Status change notifications
- Alert thresholds (delay, temperature, route deviation)
- Multi-user collaboration (operational dashboards)

### 2.4 Multi-Tenant SaaS Design
From day one, the platform supports:
- Organization isolation (tenants)
- Role-based access control (RBAC)
- White-label capabilities (custom branding per tenant)
- API keys for third-party integrations

---

## 3. Technology Stack

### 3.1 Frontend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Next.js | 15+ | App Router, SSR/SSG, API routes |
| Language | TypeScript | 5.6+ | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first, zero-curve enforcement |
| Components | shadcn/ui | latest | Base primitives |
| State | Zustand | latest | Global state |
| Queries | TanStack Query | 5.x | Server state, caching |
| Forms | React Hook Form + Zod | latest | Type-safe forms |
| Charts | Recharts | latest | Data visualization |
| Maps | MapLibre GL | latest | Freight tracking maps |
| Testing | Storybook + Chromatic | 8.x | Visual regression |
| Testing | Playwright | latest | E2E testing |

### 3.2 Backend
| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Runtime | Node.js | 22 LTS | Server runtime |
| Framework | tRPC / Server Actions | 11.x / Next 15 | Type-safe APIs |
| ORM | Drizzle ORM | latest | Type-safe database |
| Database | PostgreSQL | 16+ | Primary datastore |
| Cache | Redis | 7.x | Caching (optional, rely on Vercel Data Cache) |
| Queue | Supabase Edge Functions / Inngest | latest | Serverless background jobs |
| Search | Meilisearch | latest | Full-text search |
| Real-Time | Supabase Realtime | latest | PostgreSQL logical replication WebSockets |
| Auth | NextAuth.js v5 | beta | Authentication |
| File Storage | Supabase Storage / S3 | — | Documents, images |

### 3.3 Infrastructure
| Layer | Technology | Purpose |
|-------|-----------|---------|
| Hosting | Vercel | Frontend + Edge functions + Serverless APIs |
| Database | Supabase | Managed PostgreSQL, Storage, Edge Functions |
| CI/CD | GitHub Actions | Automated pipelines |
| Monitoring | Sentry SDK | Sole APM, error tracking, and performance SDK |
| Logging | Pino + Sentry | Structured logging |

---

## 4. Project Phases & Milestones

### Phase 0: Foundation (COMPLETE)
- [x] Design system (zero-curve, Tailwind 4)
- [x] Storybook + Chromatic baseline (165 snapshots)
- [x] Mock-driven contract generation
- [x] CI/CD pipeline (visual regression, contract sync)

### Phase 1: Core Platform (Weeks 1-4)
- [ ] Database schema (from generated contracts)
- [ ] Authentication & authorization (NextAuth + RBAC)
- [ ] Organization/tenant isolation
- [ ] User management (invite, roles, permissions)
- [ ] Dashboard shell (sidebar, navigation, layout)
- [ ] Settings & preferences

### Phase 2: Shipment Management (Weeks 5-8)
- [ ] Shipment CRUD (create, read, update, delete)
- [ ] Shipment lifecycle workflow (draft → booked → in-transit → delivered)
- [ ] Document management (BOL, commercial invoice, packing list)
- [ ] Carrier integration APIs (Maersk, DHL, FedEx)
- [ ] Rate calculation engine
- [ ] Quote generation & approval

### Phase 3: Real-Time Tracking (Weeks 9-12)
- [ ] GPS tracking integration (AIS for ocean, GPS for land)
- [ ] Status update pipeline (WebSocket → Redis → UI)
- [ ] Alert engine (delay, deviation, temperature)
- [ ] ETA prediction (ML-based)
- [ ] Map visualization ( vessel positions, route overlay)

### Phase 4: Warehouse & Inventory (Weeks 13-16)
- [ ] Warehouse management (locations, zones, bins)
- [ ] Inventory tracking (SKU-level, batch/lot tracking)
- [ ] Receiving & put-away workflows
- [ ] Pick, pack, ship workflows
- [ ] Cycle counting & adjustments

### Phase 5: Analytics & Reporting (Weeks 17-20)
- [ ] Operational dashboards (KPIs, trends)
- [ ] Custom report builder
- [ ] Export (PDF, Excel, CSV)
- [ ] Scheduled reports (email delivery)
- [ ] Cost analysis & profitability

### Phase 6: Integrations & API (Weeks 21-24)
- [ ] Public REST API (from OpenAPI spec)
- [ ] Webhook system (event subscriptions)
- [ ] ERP integrations (SAP, Oracle NetSuite)
- [ ] E-commerce integrations (Shopify, WooCommerce)
- [ ] Customs/EDI integrations

### Phase 7: Scale & Polish (Weeks 25-28)
- [ ] Performance optimization (caching, CDN)
- [ ] Mobile app (React Native / PWA)
- [ ] White-label customization
- [ ] Multi-language support (i18n)
- [ ] SOC 2 compliance audit

---

## 5. Feature Modules

### 5.1 Authentication & Authorization
```
Auth Module
├── Login (email/password, SSO)
├── Registration (invite-only for beta)
├── Password reset
├── MFA (TOTP, SMS)
├── Session management
├── Role definitions:
│   ├── Super Admin (platform level)
│   ├── Org Admin (tenant level)
│   ├── Manager (full access within org)
│   ├── Operator (shipment CRUD, no settings)
│   ├── Viewer (read-only)
│   └── API (service account)
└── Permission matrix (resource × action × role)
```

### 5.2 Shipment Management
```
Shipment Module
├── Shipment entity
│   ├── Header (id, status, type, mode)
│   ├── Parties (shipper, consignee, notify)
│   ├── Routing (origin, destination, via)
│   ├── Cargo (items, HS codes, dimensions)
│   ├── Documents (BOL, invoice, certificate)
│   ├── Tracking (milestones, events)
│   └── Financial (quote, invoice, payment)
├── Shipment lifecycle
│   ├── Draft → Quoted → Booked →
│   ├── In-Transit (pickup, origin, transit, destination) →
│   ├── Customs (clearance) →
│   ├── Delivered → Archived
├── Bulk operations (import CSV, batch update)
├── Templates (save recurring shipment configs)
└── Search & filter (full-text, faceted)
```

### 5.3 Real-Time Tracking
```
Tracking Module
├── Data ingestion
│   ├── Carrier APIs (polling)
│   ├── GPS devices (Webhook/Ingest)
│   ├── AIS maritime tracking
│   └── Manual updates
├── Event pipeline
│   ├── Event normalization
│   ├── Rule engine (alert thresholds)
│   ├── Notification dispatch (email, SMS, push)
│   └── Supabase Realtime broadcast
├── Map visualization
│   ├── Vessel positions (live)
│   ├── Route overlay (planned vs actual)
│   ├── Geofencing (port, warehouse zones)
│   └── Weather overlay
└── Predictive analytics
    ├── ETA calculation
    ├── Delay probability
    └── Route optimization suggestions
```

### 5.4 Warehouse Management
```
WMS Module
├── Location hierarchy
│   ├── Warehouse → Zone → Aisle → Rack → Shelf → Bin
├── Inventory
│   ├── SKU master data
│   ├── Batch/lot tracking
│   ├── Serial number tracking
│   └── Expiry date management
├── Inbound
│   ├── ASN (Advanced Shipping Notice)
│   ├── Receiving
│   ├── Put-away (suggested locations)
│   └── Quality check
├── Outbound
│   ├── Order allocation
│   ├── Picking (wave, batch, zone)
│   ├── Packing (label generation)
│   └── Shipping (carrier handoff)
└── Cycle counting
    ├── Scheduled counts
    ├── Ad-hoc counts
    └── Variance reporting
```

### 5.5 Analytics & Reporting
```
Analytics Module
├── Operational KPIs
│   ├── On-time delivery rate
│   ├── Average transit time
│   ├── Cost per kg/m³
│   ├── Carrier performance score
│   └── Warehouse utilization
├── Dashboards
│   ├── Executive summary
│   ├── Operations center
│   ├── Finance overview
│   └── Customer portal
├── Reports
│   ├── Standard (shipment summary, invoice aging)
│   ├── Custom (drag-drop builder)
│   └── Scheduled (cron-based email)
└── Data export
    ├── PDF (branded)
    ├── Excel (pivot tables)
    └── CSV (raw data)
```

---

## 6. Data Architecture

### 6.1 Database Schema (Drizzle ORM)

Core entities derived from mock contracts, implemented using Drizzle ORM to maintain absolute type safety:

```typescript
import { pgTable, uuid, text, timestamp, decimal, jsonb, integer, date } from 'drizzle-orm/pg-core';

// Organizations (multi-tenant)
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').unique().notNull(),
  plan: text('plan').default('free').notNull(),
  settings: jsonb('settings').default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  orgId: uuid('org_id').references(() => organizations.id),
  role: text('role').default('viewer').notNull(),
  emailVerified: timestamp('email_verified', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Shipments (from cargo-zod.ts contract)
export const shipments = pgTable('shipments', {
  id: text('id').primaryKey(), // SHP-YYYY-NNN format
  orgId: uuid('org_id').references(() => organizations.id),
  origin: text('origin').notNull(),
  destination: text('destination').notNull(),
  status: text('status').default('draft').notNull(),
  carrier: text('carrier'),
  containerId: text('container_id'),
  estimatedArrival: timestamp('estimated_arrival', { withTimezone: true }),
  weight: decimal('weight', { precision: 12, scale: 2 }),
  volume: decimal('volume', { precision: 12, scale: 2 }),
  value: decimal('value', { precision: 15, scale: 2 }),
  cargoItems: jsonb('cargo_items').default([]),
  documents: jsonb('documents').default([]),
  trackingEvents: jsonb('tracking_events').default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Additional tables: tracking_events, warehouses, inventory...
```

### 6.2 Data Flow Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   External APIs  │     │   GPS/AIS Feed   │     │   Manual Input   │
│  (Carrier, EDI)  │     │  (Real-time)     │     │  (Web/Mobile)    │
└────────┬────────┘     └────────┬────────┘     └────────┬────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        Ingestion Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ API Gateway │  │ Supabase RT │  │ File Upload │  │ Webhook   │ │
│  │ (tRPC)      │  │ (WebSockets)│  │ (Supabase)  │  │ Receiver  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘ │
└─────────┼────────────────┼────────────────┼────────────────┼───────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Processing Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ Edge        │  │ Rule Engine │  │ Normalizer  │  │ Enricher  │ │
│  │ Functions   │  │ (Alerts)    │  │ (Schema)    │  │ (Geo, etc)│ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └─────┬─────┘ │
└─────────┼────────────────┼────────────────┼────────────────┼───────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Storage Layer                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │ PostgreSQL  │  │ Redis       │  │ Meilisearch │  │ Supabase  │ │
│  │ (Primary)   │  │ (Cache)     │  │ (Search)    │  │ Storage   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 7. API Design Standards

### 7.1 tRPC Router Structure
```
routers/
├── _app.ts              # Main router composition
├── auth.ts              # Authentication (NextAuth callbacks)
├── user.ts              # User management
├── org.ts               # Organization/tenant
├── shipment.ts          # Shipment CRUD + lifecycle
├── tracking.ts          # Real-time tracking data
├── document.ts          # File uploads & management
├── warehouse.ts         # WMS operations
├── inventory.ts         # Stock management
├── report.ts            # Analytics & reporting
├── webhook.ts           # Webhook management
└── integration.ts       # Third-party connectors
```

### 7.2 API Response Standards
```typescript
// Standard response wrapper
type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
};

// Error codes
enum ErrorCode {
  UNAUTHORIZED = 'AUTH_001',
  FORBIDDEN = 'AUTH_002',
  NOT_FOUND = 'RES_001',
  VALIDATION_ERROR = 'VAL_001',
  RATE_LIMITED = 'RATE_001',
  INTERNAL_ERROR = 'INT_001',
}
```

### 7.3 Pagination
```typescript
// Cursor-based for real-time feeds
// Offset-based for stable lists
const paginationInput = z.object({
  cursor: z.string().optional(),     // For infinite scroll
  page: z.number().min(1).optional(), // For traditional pagination
  limit: z.number().min(1).max(100).default(50),
});
```

### 7.4 Data Fetching & Mutation Boundaries
With Next.js 15+ App Router, strictly observe these boundaries:
- **React Server Components (RSC):** Default for all read-only data fetching directly from Drizzle.
- **Server Actions + Zod:** Primary method for UI-triggered data mutations.
- **tRPC / Public API:** Reserved for highly complex client-side state interactions, external APIs, or mobile app consumption.

---

## 8. Security & Compliance

### 8.1 Authentication
- NextAuth.js v5 with Credentials + OAuth providers
- JWT sessions with 24h expiry
- Refresh token rotation
- MFA enforced for admin roles

### 8.2 Authorization
- RBAC with permission matrix
- Row-level security (RLS) in PostgreSQL
- Organization isolation at query level
- API key authentication for service accounts

### 8.3 Data Protection
- AES-256 encryption at rest
- TLS 1.3 in transit
- PII redaction in logs
- GDPR-compliant data deletion

### 8.4 Compliance Roadmap
| Standard | Target Date | Status |
|----------|-------------|--------|
| SOC 2 Type I | Q4 2026 | Planned |
| ISO 27001 | Q1 2027 | Planned |
| GDPR Compliance | Q3 2026 | In Progress |
| CCPA Compliance | Q3 2026 | In Progress |

---

## 9. Performance Standards

### 9.1 Frontend
| Metric | Target | Measurement |
|--------|--------|-------------|
| First Contentful Paint | < 1.5s | Lighthouse |
| Largest Contentful Paint | < 2.5s | Lighthouse |
| Time to Interactive | < 3.5s | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Storybook build time | < 60s | CI |

### 9.2 Backend
| Metric | Target | Measurement |
|--------|--------|-------------|
| API response time (p95) | < 200ms | Datadog |
| Database query time (p95) | < 50ms | pg_stat_statements |
| WebSocket latency | < 100ms | Custom |
| Background job processing | < 5s | BullMQ |

### 9.3 Scalability Targets
- 10,000 concurrent users
- 1,000,000 shipments/month
- 100,000 tracking events/day
- 99.9% uptime SLA

---

## 10. Development Workflow

### 10.1 Branch Strategy
```
main          ← production, protected
├── develop   ← integration branch
│   ├── feature/shipment-crud
│   ├── feature/real-time-tracking
│   └── bugfix/curve-violation
└── hotfix/security-patch
```

### 10.2 Commit Convention
```
type(scope): description

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation
- style: Formatting (no code change)
- refactor: Code restructuring
- test: Adding tests
- chore: Maintenance
- ci: CI/CD changes

Examples:
feat(shipment): add bulk import from CSV
fix(ui): remove rogue rounded-md from phone-input
docs(api): update OpenAPI spec for tracking endpoints
```

### 10.3 PR Requirements
- [ ] All CI checks pass (lint, test, build, chromatic, contract-sync)
- [ ] Storybook story for every modified component
- [ ] `@state-contract` header present
- [ ] Zero-curve audit passes
- [ ] Code review by 1+ engineer
- [ ] Chromatic visual diff approved (if UI changed)
- [ ] Figma diff link attached (if visual change intentional)

---

## 11. Quality Gates

### 11.1 Automated Gates (CI)
| Gate | Tool | Block Merge? |
|------|------|-------------|
| TypeScript compilation | `tsc --noEmit` | ✅ Yes |
| Linting | ESLint + Prettier | ✅ Yes |
| Tailwind curve check | `audit:curves` | ✅ Yes |
| Contract sync | `generate:contracts` | ✅ Yes |
| Unit tests | Vitest | ✅ Yes |
| E2E tests | Playwright | ✅ Yes |
| Visual regression | Chromatic | ⚠️ Human approval |
| Build verification | `next build` | ✅ Yes |
| Component Health | `component-health-score.ts` | ⚠️ Flag if < 60 |
| Enforcement Validation | Red Team Mutation Testing | ✅ Yes (Scheduled) |

### 11.2 Manual Gates
- Architecture Decision Record (ADR) for breaking changes
- Security review for auth/data changes
- Performance review for query changes
- Accessibility audit (WCAG 2.1 AA)

---

## 12. Deployment Strategy

### 12.1 Environments
| Environment | Branch | Purpose |
|-------------|--------|---------|
| Local | any | Development |
| Preview | PR | Visual review, QA |
| Staging | develop | Integration testing |
| Production | main | Live users |

### 12.2 Deployment Flow
```
Developer → PR → Preview Deploy → Chromatic Review → Merge → Staging → E2E → Production
```

### 12.3 Database Migrations
- Drizzle ORM migrations
- Zero-downtime deployments (expand/contract pattern)
- Migration run in CI before app deployment
- Rollback plan for every migration

---

## 13. Monitoring & Observability

### 13.1 Metrics
| Category | Metrics |
|----------|---------|
| Application | Request rate, error rate, latency (RED) |
| Business | Active shipments, on-time %, revenue |
| Infrastructure | CPU, memory, disk, DB connections |
| Security | Failed logins, API abuse, data access |

### 13.2 Alerting
| Severity | Condition | Response |
|----------|-----------|----------|
| P0 | Service down | Page on-call immediately |
| P1 | Error rate > 5% | Slack alert via Sentry, investigate within 30min |
| P2 | Latency p95 > 500ms | Sentry Issue created, investigate within 4h |
| P3 | Disk usage > 80% | Ticket created, investigate within 24h |

### 13.3 Logging Standards
```typescript
// Sentry explicitly handles error and performance tracing
Sentry.captureException(error, {
  tags: {
    event: 'shipment.created',
    shipmentId: 'SHP-2026-001',
    orgId: 'org_123'
  }
});

// Structured logging with Pino for stdout
logger.info({
  event: 'shipment.created',
  shipmentId: 'SHP-2026-001',
  orgId: 'org_123',
  userId: 'user_456',
  carrier: 'Maersk Line',
  durationMs: 145,
});
```

---

## 14. Appendix: Decision Log

| Date | Decision | Context | Impact |
|------|----------|---------|--------|
| 2026-06-05 | Mock-driven contracts | Prevent API drift | Backend schema from UI mocks |
| 2026-06-05 | Zero-curve design system | Brand consistency | `rounded-none` enforcement |
| 2026-06-05 | Tiered viewport strategy | Reduce snapshot bloat | 115 → ~52 snapshots |
| 2026-06-05 | Chromatic visual regression | Catch UI drift | 165 snapshot baseline |
| 2026-06-05 | tRPC + Drizzle ORM | Type safety end-to-end | No runtime type mismatches |
| 2026-06-05 | Multi-tenant from day one | SaaS scalability | Org isolation in schema |

---

## Quick Reference: Next Actions

### This Week (Backend Sprint Kickoff)
1. [ ] Set up PostgreSQL + Drizzle ORM
2. [ ] Implement auth (NextAuth + RBAC)
3. [ ] Create database migrations from contracts
4. [ ] Build tRPC routers for shipment CRUD
5. [ ] Seed database with mock data

### Next Week
1. [ ] Dashboard shell (sidebar, navigation)
2. [ ] Shipment list view (table + filters)
3. [ ] Shipment detail view (timeline + documents)
4. [ ] Real-time tracking pipeline (Redis + Socket.io)

### Month 1 Goal
- Working shipment CRUD
- Real-time status updates
- Document upload/download
- Basic analytics dashboard

---

*This document is a living standard. Update it with every architectural decision.*
*Version controlled alongside the codebase.*
