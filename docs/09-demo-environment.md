# 09 — Demo Environment

**Document:** Demo Data Generation & Customer Onboarding Flow  
**Audience:** Sales, Founders, Engineers  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [Why We Have a Demo Environment](#1-why-we-have-a-demo-environment)
2. [The Onboarding Flow (4 Steps)](#2-the-onboarding-flow-4-steps)
3. [The Demo Data Generator](#3-the-demo-data-generator)
4. [What Gets Created](#4-what-gets-created)
5. [The 10-Minute Demo Script](#5-the-10-minute-demo-script)
6. [Pricing Strategy](#6-pricing-strategy)
7. [The 90-Day Customer Acquisition Plan](#7-the-90-day-customer-acquisition-plan)
8. [Resetting Demo Data](#8-resetting-demo-data)

---

## 1. Why We Have a Demo Environment

A freight forwarder won't sign up for a blank dashboard. They need to see their *type* of data flowing through the system before they commit. A CLI seed script creates dead air during a demo — you SSH, run a command, switch back to the browser. Five minutes of awkwardness.

The server action approach creates magic: click "Inject Demo Data" → 3 seconds → the dashboard populates with 5 shipments, Mapbox routes, and tracking timelines. The customer sees the product working *before* they've given you any data.

---

## 2. The Onboarding Flow (4 Steps)

**File:** `app/dashboard/onboarding/page.tsx`  
**URL:** `/dashboard/onboarding`

| Step | Title | What Happens | Customer Sees |
|------|-------|-------------|---------------|
| 1 | Welcome | Confirm org auto-provisioned | "You're the admin of [Company] Organization" |
| 2 | Integrations | API key setup instructions | Code blocks for Mapbox, Resend, Webhook env vars |
| 3 | Demo Data | Trigger server action | Spinner → "5 shipments created" success message |
| 4 | Launch | Redirect to dashboard | Fully populated Command Center |

### Navigation

- Each step renders with a `slide-in-from-right-4` Tailwind animation for a polished feel.
- "Back" buttons on steps 2-3 allow navigation without data loss.
- The "Inject Demo Data" button (Step 3) is disabled during loading with a "Generating..." label.
- Step 4 auto-redirects to `/dashboard` on button click via `router.push('/dashboard')`.

---

## 3. The Demo Data Generator

**File:** `app/actions/demo.ts`  
**Function:** `generateDemoData()`

This is a Next.js Server Action — no API endpoint, no CLI, no separate process.

### Authorization

Only `admin` or `manager` roles can trigger this action. Calling it as a `viewer` throws `'Forbidden'`.

### Transaction Architecture

The entire generation runs inside a single **Drizzle transaction**:

```typescript
const result = await db.transaction(async (tx) => {
  // 1. Create 3 warehouses
  // 2. Create 3 inventory SKUs
  // 3. Create 5 shipments with realistic routes
  // 4. Create 18 tracking events with SHA-256 hash chains
  return { shipments: 5, events: 18, warehouses: 3, inventory: 3 };
});
```

If **any** insert fails, the entire transaction rolls back. The dashboard is never left in a broken half-seeded state. The customer sees either a fully populated dashboard or an error message — never a hybrid.

### Calling the Action

```typescript
import { generateDemoData } from '@/app/actions/demo';

// From a Client Component
const result = await generateDemoData();
// Returns: { success: true, shipments: 5, events: 18, warehouses: 3, inventory: 3 }
```

### Post-Action

After generation, `revalidatePath('/dashboard')` is called to bust the Next.js cache and immediately show the new data on redirect.

---

## 4. What Gets Created

### Shipments (5)

| Container ID | Route | Carrier | Final Status |
|-------------|-------|---------|-------------|
| `CSQU1122334` | Shanghai → Los Angeles | COSCO | `in_transit` |
| `MSKU9988776` | Singapore → Rotterdam | Maersk | `customs_hold` |
| `MSCU1234567` | Shenzhen → Long Beach | MSC | `released` |
| `HLXU9876543` | Hamburg → New York | Hapag-Lloyd | `created` |
| `ONEU5544332` | Busan → Seattle | ONE | `delivered` |

This spread gives the dashboard all 5 meaningful statuses simultaneously — perfect for demonstrating the full lifecycle in one view.

### Warehouses (3)

| Location | Type |
|----------|------|
| Port of Long Beach — Terminal 1 | `port_facility` |
| Rotterdam Maasvlakte | `distribution_center` |
| Shanghai Yangshan Bonded Zone | `bonded` |

### Inventory (3 SKUs — linked to Long Beach warehouse)

| SKU | Quantity | Min Threshold | Alert? |
|-----|----------|--------------|--------|
| `ELEC-2024-X1` | 1,500 | 500 | No |
| `AUTO-PARTS-V8` | 300 | 100 | No |
| `TEXTILE-ROLL-B` | 80 | 200 | ⚠️ Yes (Low Stock) |

The `TEXTILE-ROLL-B` SKU is intentionally below threshold to demonstrate the low-stock alert UI.

### Tracking Events (18 total)

Events are distributed across shipments with realistic timing (historically backdated using negative `offsetHours`). Each event is cryptographically linked via SHA-256 hash chain.

---

## 5. The 10-Minute Demo Script

### Minute 0-1: The Hook
**You:** "Show me your current tracking spreadsheet."  
**Them:** *Opens Excel with 200 rows, 15 columns, 3 manual tabs*  
**You:** "Now watch this."  
*[Open the Tac-Xpress dashboard — already populated via demo data]*

### Minute 1-3: The Dashboard
- Point to 5 active shipments: "Shanghai to LA, Singapore to Rotterdam — real ports, real carriers."
- Show the Mapbox satellite view with the pulsing container location marker.
- Point to the stats cards: "3 in transit, 1 at customs, 1 delivered."

### Minute 3-5: The Security Moment
- Open an **Incognito window**, log in as a test `viewer` account.
- Same dashboard, but the "Create Shipment" button is gone. The "Edit" actions are gone.
- **You:** *"This isn't CSS hiding. This is cryptographic capability tokens. Your warehouse worker literally cannot submit a request they're not authorized for — even if they bypass the browser and call the API directly. Our database policies reject it."*

### Minute 5-7: The Audit Trail
- Click any shipment → show the tracking timeline.
- Point to the hash values: *"Every event has a SHA-256 hash linked to the one before it. Tamper with one event and every subsequent hash breaks."*
- **You:** *"If customs disputes your delivery time, this hash chain is court-admissible evidence. No spreadsheet can give you this."*

### Minute 7-9: The Warehouse View
- Switch to tablet viewport in browser devtools (or grab the tablet).
- Navigate to `/dashboard/warehouse`.
- Point to the large buttons, the status-filtered list.
- **You:** *"Your dock worker taps 'Scan In'. They see exactly what they need. Nothing more."*

### Minute 9-10: The Close
**You:** *"Track 5 containers through Tac-Xpress for 30 days. No credit card, no contract. If your team doesn't demand to keep it, you owe us nothing."*

---

## 6. Pricing Strategy

| Tier | Price | Target Customer | Key Feature |
|------|-------|----------------|-------------|
| **Freemium** | $0/mo | Solo freight forwarders | 10 shipments/month, 3 users, 1 carrier |
| **Growth** | $299/mo | 10-50 employee companies | Unlimited shipments, all carriers, Mapbox |
| **Enterprise** | $1,499/mo | 50+ employee logistics firms | Ghost Fleet, custom RLS, white-label, audit exports |

**The math for Growth:** A freight forwarder paying a junior employee $500/month to manually update tracking spreadsheets will switch to $299/month that saves that employee's time and adds court-admissible audit trails. The ROI conversation writes itself.

---

## 7. The 90-Day Customer Acquisition Plan

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1-2 | Customer acquisition | 10 demos booked, 3 free trials started |
| 3-4 | First paying customer | $299 MRR confirmed |
| 5-6 | Feedback loop | Feature list from real usage |
| 7-8 | Next moat activation | Ghost Fleet or Contract API based on customer need |
| 9-10 | Infrastructure scale | Performance review, Sentry alert tuning |
| 11-12 | Enterprise pipeline | 2 enterprise conversations initiated |

### LinkedIn Outreach Template

**Connection Request Message:**
> Hi [Name], I saw you're at [Company] handling freight forwarding for [region]. We just launched Tac-Xpress — it gives freight forwarders real-time container tracking with cryptographic audit trails that hold up in customs disputes. Would you be open to a 10-minute demo next week?

**Follow-up (if no response after 3 days):**
> Quick follow-up — I know you're busy. I can show you something in 10 minutes that will make your customs dispute process significantly easier. Available Tuesday or Thursday?

### Target Criteria for First Customer
- Freight forwarder or NVOCC
- Ships 10-200 containers per month
- Currently using spreadsheets or a legacy TMS
- Has experienced at least one customs dispute in the past 12 months

---

## 8. Resetting Demo Data

There is currently no "reset demo" button. To clear demo data during development:

```typescript
// In Drizzle Studio (pnpm db:studio) or Supabase SQL editor:
DELETE FROM tracking_event_log WHERE shipment_id IN (
  SELECT id FROM shipments WHERE container_id IN (
    'CSQU1122334', 'MSKU9988776', 'MSCU1234567', 'HLXU9876543', 'ONEU5544332'
  )
);

DELETE FROM shipments WHERE container_id IN (
  'CSQU1122334', 'MSKU9988776', 'MSCU1234567', 'HLXU9876543', 'ONEU5544332'
);

DELETE FROM inventory WHERE sku IN ('ELEC-2024-X1', 'AUTO-PARTS-V8', 'TEXTILE-ROLL-B');

DELETE FROM warehouses WHERE location IN (
  'Port of Long Beach - Terminal 1',
  'Rotterdam Maasvlakte',
  'Shanghai Yangshan Bonded Zone'
);
```

> [!TIP]
> A future enhancement is adding a `is_demo` boolean flag to shipments and warehouses, making it trivial to `DELETE WHERE is_demo = true` without needing to hard-code container IDs.
