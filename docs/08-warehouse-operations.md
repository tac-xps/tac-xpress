# 08 — Warehouse Operations

**Document:** Warehouse Management, Inventory & Mobile UX  
**Audience:** Operations Engineers, Dock Supervisors, Frontend Engineers  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [Overview](#1-overview)
2. [Warehouse View — Dock Worker Interface](#2-warehouse-view--dock-worker-interface)
3. [Inventory Management](#3-inventory-management)
4. [Mobile-First Design Standards](#4-mobile-first-design-standards)
5. [Shipment Status Filtering](#5-shipment-status-filtering)
6. [SecureBoundary in Warehouse Context](#6-secureboundary-in-warehouse-context)
7. [Planned: NFC/QR Edge Auth (Moat #5)](#7-planned-nfcqr-edge-auth-moat-5)

---

## 1. Overview

The warehouse module serves one specific user: the **dock worker**. This person is standing on a warehouse floor, wearing gloves, operating a 10-inch Android tablet in direct sunlight. They need to:

1. See which containers are arriving today.
2. Confirm receipt ("Scan In").
3. Mark containers ready for dispatch.
4. Know exactly what their role allows — without training.

Every UI decision in this module is made for this person, not for a manager at a desktop.

---

## 2. Warehouse View — Dock Worker Interface

**File:** `app/dashboard/warehouse/page.tsx`  
**URL:** `/dashboard/warehouse`  
**Render:** Server Component (reads org-scoped shipments from DB)

### Page Sections

#### Header Strip
- Full-width indigo (`bg-indigo-600`) header with rounded bottom corners (`rounded-b-3xl`).
- Displays current page title and a live activity pulse indicator.
- Contains two primary action buttons: **Scan In** and **NFC/QR**.
- Buttons are `h-16` (64px) — well above the 44px minimum touch target.

#### Shipment Action Cards
- Filtered to only show shipments in actionable statuses (see [Section 5](#5-shipment-status-filtering)).
- Each card displays:
  - **Container ID** (large, bold — readable at distance)
  - **Status badge** (amber/warning color for attention)
  - **Origin port** and **Carrier**
  - Two action buttons: **Clear Customs** and **Dispatch**
- Cards are wrapped in `<Link>` for tap-to-detail navigation.
- Cards have `active:scale-95 transition-transform` for immediate touch feedback.

### Route

```
/dashboard/warehouse
```

### Access Control

This page is accessible by all authenticated users (including `viewer` role for read-only). The **action buttons** (Clear Customs, Dispatch) are wrapped in `<SecureBoundary table="tracking_events" operation="insert">` — they only render for users with `operator` or higher roles.

---

## 3. Inventory Management

**Schema:** `db/schema/inventory.ts`

Inventory rows are linked to a specific `warehouse_id` (not directly to the organization). Each SKU tracks:

- Current `quantity` on hand
- `min_threshold` — triggers a visual alert when quantity drops below this value

### Querying Inventory for a Warehouse

```typescript
const stock = await db.query.inventory.findMany({
  where: eq(inventory.warehouseId, warehouseId),
  orderBy: [asc(inventory.sku)],
});
```

### Threshold Alerts (UI)

```tsx
// In any inventory list component
{item.quantity < item.minThreshold && (
  <Badge variant="destructive">Low Stock</Badge>
)}
```

---

## 4. Mobile-First Design Standards

All components in the warehouse module **must** pass these standards before merge:

### Touch Target Minimums

| Element | Minimum Size | Implementation |
|---------|-------------|----------------|
| Primary action buttons | `h-16` (64px) | `className="h-16"` |
| Secondary action buttons | `h-12` (48px) | `className="h-12"` |
| Navigation links (cards) | Full card tap area | `<Link>` wrapping entire card |
| Icon-only buttons | `w-11 h-11` (44px) | Minimum per WCAG 2.5.5 |

### Viewport Testing

Warehouse UI must be tested on these viewports before merge:

| Viewport | Label | CSS Breakpoint |
|----------|-------|---------------|
| 375px | Mobile (min) | default |
| 768px | Tablet portrait | `md:` |
| 1024px | Tablet landscape | `lg:` |

### Typography Scale for Dock Readability

| Element | Size | Weight | Notes |
|---------|------|--------|-------|
| Container ID | `text-lg` | `font-bold` | Readable at arm's length |
| Status badge | `text-xs` | `font-bold uppercase` | High contrast |
| Port/Carrier label | `text-sm` | `font-medium` | Secondary info |
| Section header | `text-2xl` | `font-heading` | Page-level orientation |

### Color Contrast

All status colors must meet WCAG AA (4.5:1 contrast ratio minimum):

| Status | Background | Text | Usage |
|--------|-----------|------|-------|
| Action required | `bg-amber-100` | `text-amber-800` | Most statuses |
| Cleared / Good | `bg-green-100` | `text-green-800` | `released`, `delivered` |
| Alert / Hold | `bg-red-100` | `text-red-800` | `customs_hold` |
| In Transit | `bg-indigo-100` | `text-indigo-800` | `in_transit` |

---

## 5. Shipment Status Filtering

The warehouse view only shows shipments that require dock worker action:

```typescript
const activeShipments = await db.query.shipments.findMany({
  where: inArray(shipments.status, [
    'customs_hold',   // Needs clearance documentation
    'port_arrival',   // Arrived, needs receiving
    'released',       // Available for pickup / dispatch
    'created',        // Newly booked, pending port arrival
  ]),
});
```

**Excluded from warehouse view:**
- `in_transit` — On the water, no dock action possible
- `delivered` — Closed, no action needed
- `archived` — Historical record only

---

## 6. SecureBoundary in Warehouse Context

The warehouse view uses `SecureBoundary` to ensure dock workers with `viewer` role can **see** shipments but cannot **act** on them:

```tsx
<SecureBoundary table="tracking_events" operation="insert" fallback="boundary">
  <div className="grid grid-cols-2 gap-2">
    <Button variant="secondary">Clear Customs</Button>
    <Button>Dispatch</Button>
  </div>
</SecureBoundary>
```

When a `viewer` role accesses this page, the action buttons are replaced with a clear explanation of what role is needed. This is the Zero-Trust model in action — security communicates, not just hides.

---

## 7. Planned: NFC/QR Edge Auth (Moat #5)

> **Status:** 🟡 Primed — activate on customer hardware request.

The "Scan In" and "NFC / QR" buttons in the warehouse header are currently UI placeholders. When **Moat #5 (Edge Auth)** is activated, these will:

1. **NFC Button** — Trigger a Web NFC API read (`navigator.nfc.scan()`) to authenticate dock workers via badge swipe. The badge ID is verified against a Supabase Edge Function.

2. **QR Button** — Launch the device camera via `html5-qrcode` (already installed in `package.json`) to scan a container QR label and auto-populate the tracking event form.

**Activation requirements:**
- Customer requests physical badge reader hardware
- Deploy `supabase/functions/verify-nfc-badge` Edge Function
- Add `badge_tokens` table to schema with RLS
- Wire `html5-qrcode` library (already in `package.json`) to the Scan In button

The `html5-qrcode` library is already a dependency — no new installs required for the QR path.
