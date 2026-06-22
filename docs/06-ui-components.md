# 06 — UI Components

**Document:** Component Library & Design System Reference  
**Audience:** Frontend Engineers, Designers  
**Last Updated:** 2026-06-06

---

## Table of Contents

1. [Design System Philosophy](#1-design-system-philosophy)
2. [Zero-Curve Enforcement](#2-zero-curve-enforcement)
3. [Component Categories](#3-component-categories)
4. [Security Components](#4-security-components)
5. [Shipment Components](#5-shipment-components)
6. [Adding New Components](#6-adding-new-components)
7. [Storybook](#7-storybook)

---

## 1. Design System Philosophy

The Tac-Xpress design system is built on three principles:

1. **Zero-Curve** — No `rounded-md`, `rounded-lg`, or any border-radius on structural elements. The `rounded-none` class is the design language. This is enforced in CI via `pnpm audit:curves`.

2. **Mobile-First for Operations** — All warehouse and operational views must have minimum 44px touch targets. Dock workers use tablets with gloves. Every interactive element must be tappable with a fist.

3. **Security-Communicative** — UI components surface security context to users, not just hide buttons. When an action is restricted, users see *why* and *what role* they need to access it.

---

## 2. Zero-Curve Enforcement

The zero-curve audit runs as part of `pnpm audit:curves` in CI:

```bash
# This will FAIL if any component uses rounded-md, rounded-lg, etc.
pnpm audit:curves
```

**Allowed:** `rounded-none`, `rounded-full` (for avatar/badge circles only), `rounded-xl` (for card containers only — pre-approved exceptions).

**Not Allowed:** `rounded`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-2xl`, `rounded-3xl` on interactive elements.

---

## 3. Component Categories

### `components/ui/` — Shadcn UI Primitives

All base primitives come from **Shadcn UI**. Do not build primitive components from scratch if a Shadcn component exists.

To add a new Shadcn component:
```bash
pnpm dlx shadcn@latest add [component-name]
```

Key primitives in use:
- `Button` — All CTAs and actions
- `Dialog` — Modal overlays (CreateShipmentDialog)
- `Card` — Data containers
- `Form` + `Input` — React Hook Form integrated forms
- `Badge` — Status indicators
- `Sonner` (`toast`) — Success/error notifications

### `components/security/` — Zero-Trust Security Components

See [Section 4](#4-security-components).

### `components/shipments/` — Shipment Domain Components

See [Section 5](#5-shipment-components).

### `components/` (Root) — Layout & Application Shell

| Component | Purpose |
|-----------|---------|
| `app-shell.tsx` | Main layout wrapper |
| `app-sidebar.tsx` | Navigation sidebar (sticky, full viewport height) |
| `app-header.tsx` | Top navigation bar |
| `nav-user.tsx` | User avatar + role display |
| `dashboard.tsx` | Dashboard layout container |
| `theme-switcher.tsx` | Dark/light mode toggle |
| `logo.tsx` | Brand logo component |

### `components/cargo/` — Cargo-Specific Components

| Component | Purpose |
|-----------|---------|
| `route-network.tsx` | Static route visualization |
| `tracking-section.tsx` | Public tracking display |
| `invoice-document.tsx` | PDF invoice generator |
| `delta.tsx` | Change indicator for stats |
| `indicator.tsx` | Status dot indicator |

---

## 4. Security Components

### `SecureBoundary`

**File:** `components/security/SecureBoundary.tsx`

The primary capability enforcement component. Wraps any UI element to conditionally render based on the user's role and the operation they're attempting.

#### Props

```typescript
interface SecureBoundaryProps {
  /** The database table this action relates to */
  table: 'shipments' | 'tracking_events' | 'warehouses' | 'inventory' | 'users';
  /** The operation being guarded */
  operation: 'select' | 'insert' | 'update' | 'delete';
  /** What to render when access is denied ('hide' = nothing, 'boundary' = message) */
  fallback?: 'hide' | 'boundary' | React.ReactNode;
  children: React.ReactNode;
}
```

#### Examples

```tsx
// Simple hide — nothing rendered for unauthorized users
<SecureBoundary table="shipments" operation="delete">
  <DeleteShipmentButton shipmentId={id} />
</SecureBoundary>

// Boundary fallback — explains the restriction
<SecureBoundary table="shipments" operation="insert" fallback="boundary">
  <CreateShipmentDialog />
</SecureBoundary>

// Custom fallback
<SecureBoundary 
  table="users" 
  operation="insert"
  fallback={<p className="text-sm text-muted-foreground">Only admins can invite users</p>}
>
  <InviteUserButton />
</SecureBoundary>
```

#### Role → Operation Mapping

| Operation | Minimum Role |
|-----------|-------------|
| `select` | `viewer` |
| `insert` | `operator` |
| `update` | `operator` |
| `delete` | `manager` |

---

## 5. Shipment Components

### `MapboxRoute`

**File:** `components/shipments/MapboxRoute.tsx`

Interactive satellite map using Mapbox GL JS.

#### Props

```typescript
interface MapboxRouteProps {
  origin: string;            // Port name (matched to MOCK_COORDS lookup)
  destination: string;       // Port name
  currentLocation?: [number, number]; // [longitude, latitude]
}
```

#### Usage

```tsx
<MapboxRoute
  origin="Shanghai"
  destination="Los Angeles"
  currentLocation={[150.5, 25.3]}
/>
```

#### Features
- Satellite imagery with globe projection
- Dashed indigo route line between origin and destination
- Static grey markers at origin/destination (click for popup)
- Pulsing animated marker at current container location
- Toggle button cycles between `satellite-v9`, `dark-v11`, `streets-v12` styles
- Graceful fallback if `NEXT_PUBLIC_MAPBOX_TOKEN` is not set (blurred overlay with error message)

#### Adding New Ports

Ports are mapped to coordinates in `MOCK_COORDS` inside the component:

```typescript
const MOCK_COORDS: Record<string, [number, number]> = {
  'Singapore': [103.8198, 1.3521],
  'Rotterdam': [4.47917, 51.9225],
  'Long Beach': [-118.1937, 33.7701],
  // Add new ports here
};
```

---

### `RealtimeTracker`

**File:** `components/shipments/RealtimeTracker.tsx`

Live event log combining server-hydrated initial events with SSE real-time updates.

#### Props

```typescript
interface RealtimeTrackerProps {
  shipmentId: string;           // UUID
  initialEvents: TrackingEvent[]; // Server-fetched events passed as props
}
```

#### Usage (in a Server Component page)

```tsx
// Server Component fetches initial events
const events = await db.query.trackingEventLog.findMany({
  where: eq(trackingEventLog.shipmentId, shipment.id),
  orderBy: [desc(trackingEventLog.occurredAt)],
});

// Client Component receives them as props + connects SSE
<RealtimeTracker
  shipmentId={shipment.id}
  initialEvents={events.map(e => ({
    ...e,
    occurredAt: e.occurredAt.toISOString()
  }))}
/>
```

#### Connection States

| State | Icon | Description |
|-------|------|-------------|
| `connecting` | Spinning `Activity` | SSE connection being established |
| `live` | Pulsing `Wifi` (green) | Receiving live updates |
| `polling` | `WifiOff` (muted) | Fallback: reconnecting every 30s |

---

### `CreateShipmentDialog`

**File:** `components/shipments/CreateShipmentDialog.tsx`

Modal dialog for creating new shipments, wrapped in a `SecureBoundary` requiring at minimum `operator` role.

---

## 6. Adding New Components

Follow this checklist when creating a new UI component:

1. **Check Shadcn first:** `pnpm dlx shadcn@latest add [component]`
2. **Create the file** in the appropriate subdirectory of `components/`
3. **Write a Storybook story** in the same directory (`<component>.stories.tsx`)
4. **Cover 6 states minimum** in the story: default, loading, empty, error, disabled, and one role-specific state
5. **Run the curve audit:** `pnpm audit:curves` — fix any regressions
6. **Publish to Chromatic:** `chromatic --auto-accept-changes` for baseline

---

## 7. Storybook

The component explorer runs at `http://localhost:6006`:

```bash
pnpm storybook
```

All stories are tracked by Chromatic for visual regression. Any PR that changes UI must have Chromatic diffs approved by a reviewer before merge.

Key commands:
```bash
pnpm storybook          # Start dev server
pnpm build-storybook    # Build static site
pnpm chromatic:ci       # Upload to Chromatic (CI mode)
pnpm chromatic:baseline # Accept all changes as new baseline
```
