# 07 — Real-Time Tracking

**Document:** Event Sourcing, Hash Chains, SSE & Webhooks  
**Audience:** Full-Stack Engineers  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [The Tracking Architecture](#1-the-tracking-architecture)
2. [Event Sourcing & Immutable Log](#2-event-sourcing--immutable-log)
3. [SHA-256 Hash Chain](#3-sha-256-hash-chain)
4. [Materialized View & Auto-Refresh](#4-materialized-view--auto-refresh)
5. [Server-Sent Events (SSE)](#5-server-sent-events-sse)
6. [Carrier Webhook Integration](#6-carrier-webhook-integration)
7. [Email Notifications](#7-email-notifications)
8. [Adding a New Event Type](#8-adding-a-new-event-type)

---

## 1. The Tracking Architecture

```
┌─────────────────────────────────────────────────────────┐
│  Event Sources                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ UI Action    │  │ Carrier Hook │  │ Demo Seed    │  │
│  │ (Operator)   │  │ (HMAC Auth)  │  │ (Server Act) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼─────────────────┼─────────────────┼───────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────┐
│  tracking_event_log (PostgreSQL — APPEND ONLY)          │
│  id | shipment_id | type | payload | occurred_at        │
│  previous_hash | event_hash (SHA-256)                   │
└──────────────────────────┬──────────────────────────────┘
                           │ DB Trigger: AFTER INSERT
                           ▼
┌─────────────────────────────────────────────────────────┐
│  shipment_status_summary (Materialized View)            │
│  Latest status per shipment — refreshed automatically   │
└──────────────────────────┬──────────────────────────────┘
                           │ SSE Poll (5s interval)
                           ▼
┌─────────────────────────────────────────────────────────┐
│  /api/stream/tracking (SSE Endpoint)                    │
│  Pushes `event: update` when new hash detected          │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│  RealtimeTracker Component (Browser)                    │
│  Merges initial SSR events + live SSE events            │
└─────────────────────────────────────────────────────────┘
```

---

## 2. Event Sourcing & Immutable Log

The `tracking_event_log` table is an **append-only, immutable ledger**. It is the authoritative record of everything that has happened to every container.

### Core Properties

- **Immutability:** RLS policies block UPDATE and DELETE operations on this table.
- **Append-only:** The only permitted operation is INSERT.
- **Temporal accuracy:** `occurred_at` captures *when the event happened* (may differ from `created_at` for backdated imports and webhook ingestion).
- **Cryptographic integrity:** Every row is linked to the previous via SHA-256 hash.

### Event Types

| Type | Description | Who Generates |
|------|-------------|---------------|
| `created` | Shipment booking confirmed | Operator (UI) |
| `port_arrival` | Container arrives at origin port | Carrier Webhook / Operator |
| `in_transit` | Vessel departs with container | Carrier Webhook |
| `customs_hold` | Container held for inspection | Carrier Webhook / Operator |
| `customs_cleared` | Customs inspection passed | Carrier Webhook |
| `port_arrival` | Arrives at destination port | Carrier Webhook |
| `released` | Released from port, available for pickup | Operator |
| `delivered` | Final delivery confirmed | Operator |

---

## 3. SHA-256 Hash Chain

Each event's hash is computed from its own data **plus** the hash of the previous event. This creates a cryptographically linked chain.

### Hash Computation

```typescript
function computeEventHash(
  shipmentId: string,
  type: string,
  payload: any,
  occurredAt: Date,
  previousHash: string | null
): string {
  const data = [
    shipmentId,
    type,
    JSON.stringify(payload),
    occurredAt.toISOString(),
    previousHash || ''           // Empty string for genesis event
  ].join(':');
  
  return crypto.createHash('sha256').update(data).digest('hex');
}
```

### Genesis Event

The first event for every shipment has `previous_hash = null`. This is the genesis block. Its hash is computed with an empty string in place of the previous hash.

### Chain Validation (Future)

To verify an entire chain is untampered:

```typescript
function validateChain(events: TrackingEvent[]): boolean {
  const sorted = events.sort((a, b) => 
    new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
  );

  for (let i = 0; i < sorted.length; i++) {
    const expected = computeEventHash(
      sorted[i].shipmentId,
      sorted[i].type,
      sorted[i].payload,
      new Date(sorted[i].occurredAt),
      i === 0 ? null : sorted[i - 1].eventHash
    );
    
    if (expected !== sorted[i].eventHash) return false;
  }
  return true;
}
```

### Audit Court Admissibility

The hash chain provides evidence-grade auditability for customs disputes. To use it:
1. Export all events for the shipment as JSON.
2. Run `validateChain()` to confirm no tampering.
3. The genesis hash anchors the entire chain — any modification to any event invalidates all subsequent hashes.

---

## 4. Materialized View & Auto-Refresh

The `shipment_status_summary` materialized view holds the latest event for each shipment. It is refreshed automatically by a PostgreSQL trigger on every write to `tracking_event_log`.

### Why a Materialized View?

Getting "latest status per shipment" with a `DISTINCT ON` query across a growing event log has O(n) complexity. The materialized view pre-computes this and the trigger keeps it current, making dashboard queries O(1).

### Migration File

`drizzle/0003_shipment_status_summary_view.sql`

### Querying the View

```typescript
// In Drizzle (raw SQL for the materialized view)
const latestStatuses = await db.execute(sql`
  SELECT * FROM shipment_status_summary
  WHERE shipment_id = ANY(${shipmentIds}::uuid[])
`);
```

---

## 5. Server-Sent Events (SSE)

### How It Works

The SSE endpoint at `/api/stream/tracking` runs a server-side poll loop:

1. Client opens an `EventSource` connection with `?shipmentId=<uuid>`.
2. Server immediately sends `event: connected\ndata: ok\n\n`.
3. Every 5 seconds, server queries `tracking_event_log` for the latest event.
4. If the latest `event_hash` differs from the last seen hash, server pushes `event: update`.
5. When the client navigates away, the `AbortSignal` fires and the poll interval is cleared.

### Connection Lifecycle

```
Client: new EventSource('/api/stream/tracking?shipmentId=<id>')
Server: event: connected\ndata: ok\n\n
  [5 seconds pass]
Server: [polls DB — no new events]
  [5 seconds pass]
Server: event: update\ndata: {"type":"customs_cleared",...}\n\n
Client: eventSource.onerror → reconnect in 30s
```

### Performance Considerations

- Each open SSE connection holds one server-side poll interval.
- In production, if many users view the same shipment, consider moving to Supabase Realtime (PostgreSQL logical replication → WebSockets) for fan-out efficiency.

---

## 6. Carrier Webhook Integration

Carriers push events to `POST /api/webhooks/carrier`. See [05-api-reference.md](./05-api-reference.md#31-post-apiwebhookscarrier) for the full webhook specification.

### HMAC Verification Process

```typescript
// 1. Read raw body (before any parsing)
const rawBody = await req.text();

// 2. Get signature from header
const signature = req.headers.get('x-carrier-signature');

// 3. Compute expected signature
const hmac = crypto.createHmac('sha256', process.env.CARRIER_WEBHOOK_SECRET!)
  .update(rawBody)
  .digest('hex');

// 4. Timing-safe comparison (prevents timing attacks)
const isValid = crypto.timingSafeEqual(
  Buffer.from(hmac),
  Buffer.from(signature)
);
```

> [!CAUTION]
> Always use `crypto.timingSafeEqual()` for HMAC comparison. Never use `===`. String comparison leaks timing information that can be exploited.

### Supported Carriers

| Carrier | Webhook Format | Auth Method |
|---------|---------------|-------------|
| Maersk | Custom JSON | HMAC-SHA256 |
| MSC | Custom JSON | HMAC-SHA256 |
| COSCO | Custom JSON | HMAC-SHA256 |
| Hapag-Lloyd | Custom JSON | HMAC-SHA256 |

All carriers must be onboarded with the same `CARRIER_WEBHOOK_SECRET`. For per-carrier secrets (future), add a `carrier` field lookup table.

---

## 7. Email Notifications

When a carrier webhook is processed successfully, Resend sends an async email to all admin users in the organization:

```typescript
resend.emails.send({
  from: 'Tac-Xpress <updates@tac-xpress.dev>',
  to: adminEmails,
  subject: `Shipment Update: Container ${containerId} is ${type}`,
  html: `
    <p>Your container <strong>${containerId}</strong> 
    status changed to <strong>${type}</strong>.</p>
    <a href="${dashboardUrl}/shipments/${shipmentId}">View Live Tracking</a>
  `,
}).catch(console.error); // Fire-and-forget — don't block the webhook response
```

**Fire-and-forget pattern:** The email is sent asynchronously and errors are swallowed with `catch(console.error)`. This ensures webhook processing is never blocked by email delivery failures.

---

## 8. Adding a New Event Type

1. **Define the type string** — Choose a lowercase snake_case key (e.g., `temperature_alert`).
2. **Add to the lifecycle documentation** in this file (Section 2 table).
3. **Add to the UI status display** in `app/dashboard/shipments/[id]/page.tsx`.
4. **Add to warehouse filter** in `app/dashboard/warehouse/page.tsx` if dock workers should see it.
5. **Update demo data** in `app/actions/demo.ts` if it should appear in the demo flow.
6. **Update `mocks/cargo-data.ts`** to include the new status in mock data. This is the Golden Rule.
