# 03 — Database Schema

**Document:** Database Schema Reference  
**Audience:** Backend Engineers, DBA  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [Overview](#1-overview)
2. [Schema Conventions](#2-schema-conventions)
3. [Tables](#3-tables)
   - [organizations](#31-organizations)
   - [users](#32-users)
   - [shipments](#33-shipments)
   - [tracking_event_log](#34-tracking_event_log)
   - [warehouses](#35-warehouses)
   - [inventory](#36-inventory)
   - [accounts / sessions / verification_tokens](#37-auth-tables)
4. [Materialized Views](#4-materialized-views)
5. [Row-Level Security Policies](#5-row-level-security-policies)
6. [Indexes](#6-indexes)
7. [Adding a New Table](#7-adding-a-new-table)

---

## 1. Overview

All schemas are defined in `db/schema/` using **Drizzle ORM**. The database is hosted on **Supabase PostgreSQL 16+**. Every table has Row-Level Security (RLS) enabled and is tenant-isolated via `org_id`.

The source of truth for schema shape is `mocks/cargo-data.ts`. Any schema that cannot render data from that file in Storybook is invalid.

---

## 2. Schema Conventions

| Convention | Example | Reason |
|-----------|---------|--------|
| Primary Keys | `uuid().defaultRandom()` | Globally unique, no enumeration risk |
| Timestamps | `timestamp({ withTimezone: true }).defaultNow()` | Timezone-aware audit trails |
| Tenant Isolation | `orgId: uuid().references(() => organizations.id)` | RLS enforcement |
| Soft Deletes | `deletedAt: timestamp({ withTimezone: true })` | Data recovery + audit |
| JSON Fields | `jsonb` with `.default({})` or `.default([])` | Flexible structured metadata |
| Monetary Values | `decimal({ precision: 15, scale: 2 })` | No floating point errors |

> [!CAUTION]
> Never use `serial` or integer IDs for user-facing entities. Always use UUID v4.

---

## 3. Tables

### 3.1 organizations

**File:** `db/schema/organizations.ts`  
The root tenant entity. Every piece of data in the system is scoped to an organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | Tenant identifier |
| `name` | `text` | NOT NULL | Display name |
| `slug` | `text` | UNIQUE, NOT NULL | URL-safe identifier |
| `plan` | `text` | default `'free'` | Subscription tier: `free`, `growth`, `enterprise` |
| `settings` | `jsonb` | default `{}` | Arbitrary org-level configuration |
| `created_at` | `timestamptz` | default now | Creation timestamp |
| `updated_at` | `timestamptz` | default now | Last modification timestamp |

---

### 3.2 users

**File:** `db/schema/users.ts`  
Registered platform users. Linked to exactly one organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | User identifier |
| `email` | `text` | UNIQUE, NOT NULL | Login email |
| `name` | `text` | NOT NULL | Display name |
| `avatar_url` | `text` | nullable | Profile picture URL |
| `org_id` | `uuid` | FK → organizations | Tenant assignment |
| `role` | `text` | default `'viewer'` | RBAC role: `admin`, `manager`, `operator`, `viewer` |
| `email_verified` | `timestamptz` | nullable | OAuth email verification timestamp |
| `created_at` | `timestamptz` | default now | |
| `updated_at` | `timestamptz` | default now | |

**Roles:**

| Role | Access Level |
|------|-------------|
| `admin` | Full org management, user invites, billing |
| `manager` | Shipment CRUD, team visibility, no billing |
| `operator` | Shipment create/update, no delete |
| `viewer` | Read-only dashboard access |

---

### 3.3 shipments

**File:** `db/schema/shipments.ts`  
The core entity. One row per container booking.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | Shipment identifier |
| `org_id` | `uuid` | FK → organizations | Tenant isolation |
| `container_id` | `text` | NOT NULL | e.g. `MSCU1234567` |
| `origin` | `text` | NOT NULL | Origin city/port |
| `destination` | `text` | NOT NULL | Destination city/port |
| `carrier` | `text` | | Carrier name (Maersk, COSCO, MSC) |
| `status` | `text` | default `'created'` | Current status (see lifecycle below) |
| `weight` | `decimal(12,2)` | | Cargo weight in kg |
| `volume` | `decimal(12,2)` | | Volume in m³ |
| `value` | `decimal(15,2)` | | Declared cargo value in USD |
| `estimated_arrival` | `timestamptz` | nullable | ETA |
| `created_by` | `uuid` | FK → users | Who created this booking |
| `created_at` | `timestamptz` | default now | |
| `updated_at` | `timestamptz` | default now | |
| `deleted_at` | `timestamptz` | nullable | Soft delete timestamp |

**Shipment Lifecycle:**

```
created → port_arrival → in_transit → customs_hold → released → delivered
```

---

### 3.4 tracking_event_log

**File:** `db/schema/tracking-events.ts`  
The immutable event ledger. Each row is cryptographically linked to the previous.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | Event identifier |
| `shipment_id` | `uuid` | FK → shipments, NOT NULL | Parent shipment |
| `type` | `text` | NOT NULL | Event type (`in_transit`, `customs_hold`, `released`, etc.) |
| `payload` | `jsonb` | default `{}` | Arbitrary structured event data |
| `occurred_at` | `timestamptz` | NOT NULL | When the event actually happened |
| `recorded_by` | `uuid` | FK → users | Who recorded this (null for webhook events) |
| `previous_hash` | `text` | nullable | SHA-256 hash of the prior event (null for genesis) |
| `event_hash` | `text` | NOT NULL | SHA-256 of `shipment_id + type + payload + occurred_at + previous_hash` |

> [!IMPORTANT]
> **Never update or delete rows in this table.** It is an immutable append-only log. RLS policies enforce no UPDATE/DELETE on this table. Any modification breaks the hash chain and invalidates the audit trail.

**Hash Computation:**
```typescript
const data = `${shipmentId}:${type}:${JSON.stringify(payload)}:${occurredAt.toISOString()}:${previousHash || ''}`;
const eventHash = crypto.createHash('sha256').update(data).digest('hex');
```

---

### 3.5 warehouses

**File:** `db/schema/warehouses.ts`  
Physical storage locations associated with an organization.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `org_id` | `uuid` | FK → organizations | Tenant isolation |
| `location` | `text` | NOT NULL | Human-readable location name |
| `capacity` | `integer` | | Capacity in cubic meters |
| `type` | `text` | | `port_facility`, `distribution_center`, `bonded` |
| `status` | `text` | default `'active'` | `active` or `inactive` |
| `created_at` | `timestamptz` | default now | |
| `updated_at` | `timestamptz` | default now | |

---

### 3.6 inventory

**File:** `db/schema/inventory.ts`  
SKU-level stock records associated with a warehouse.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, default random | |
| `warehouse_id` | `uuid` | FK → warehouses | Parent warehouse |
| `sku` | `text` | NOT NULL | Stock-keeping unit code |
| `quantity` | `integer` | NOT NULL | Current quantity on hand |
| `min_threshold` | `integer` | | Reorder alert threshold |
| `created_at` | `timestamptz` | default now | |
| `updated_at` | `timestamptz` | default now | |

---

### 3.7 Auth Tables

**File:** `db/schema/auth.ts`  
Managed automatically by the `@auth/supabase-adapter`. Do not modify manually.

- `accounts` — OAuth provider tokens
- `sessions` — Active user sessions
- `verification_tokens` — Magic link / email verification

---

## 4. Materialized Views

### `shipment_status_summary`

**File:** `drizzle/0003_shipment_status_summary_view.sql`

Holds the latest status for each shipment, refreshed automatically by a database trigger on every INSERT/UPDATE/DELETE to `tracking_event_log`.

```sql
CREATE MATERIALIZED VIEW shipment_status_summary AS
  SELECT DISTINCT ON (shipment_id)
    shipment_id,
    type AS latest_status,
    occurred_at AS last_event_at,
    payload AS last_payload
  FROM tracking_event_log
  ORDER BY shipment_id, occurred_at DESC;

-- Auto-refresh trigger
CREATE OR REPLACE FUNCTION refresh_shipment_status_summary()
RETURNS trigger AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY shipment_status_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_refresh_status_summary
  AFTER INSERT OR UPDATE OR DELETE ON tracking_event_log
  FOR EACH STATEMENT EXECUTE FUNCTION refresh_shipment_status_summary();
```

---

## 5. Row-Level Security Policies

Every table has RLS enabled. The core pattern is:

```sql
-- Enable RLS
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;

-- Organization isolation policy
CREATE POLICY "org_isolation" ON shipments
  USING (org_id = (SELECT org_id FROM users WHERE id = auth.uid()));

-- Tracking event log: read only for members, no delete ever
CREATE POLICY "read_own_events" ON tracking_event_log
  FOR SELECT USING (
    shipment_id IN (
      SELECT id FROM shipments WHERE org_id = (
        SELECT org_id FROM users WHERE id = auth.uid()
      )
    )
  );
```

> [!WARNING]
> Do not bypass RLS by using the `service_role` key for user-facing queries. The service role key is reserved for admin background tasks only (e.g., webhook ingestion).

---

## 6. Indexes

Key indexes for query performance:

```sql
-- Shipments by org (primary query)
CREATE INDEX idx_shipments_org_id ON shipments(org_id);

-- Tracking events by shipment (timeline query)
CREATE INDEX idx_events_shipment_id ON tracking_event_log(shipment_id);
CREATE INDEX idx_events_occurred_at ON tracking_event_log(occurred_at DESC);

-- Inventory by warehouse
CREATE INDEX idx_inventory_warehouse_id ON inventory(warehouse_id);
```

---

## 7. Adding a New Table

Follow this checklist when adding a new table to the schema:

1. **Create the Drizzle schema file** in `db/schema/<table-name>.ts`
2. **Export from** `db/schema/index.ts`
3. **Enable RLS** in a new migration SQL file
4. **Add org isolation policy** — every table must have `org_id`
5. **Add relevant indexes** for primary query patterns
6. **Update `mocks/cargo-data.ts`** if the table affects UI data shapes
7. **Run `pnpm db:generate`** to generate the Drizzle migration
8. **Run `pnpm db:push`** to apply to your dev database
9. **Update this document** with the new table definition
