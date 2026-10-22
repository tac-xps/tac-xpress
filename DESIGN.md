# Tac-Xpress Design Direction (DESIGN.md)

This document supplies brand identity and design direction for **Tac-Xpress**.
It serves as the design foundation for AI agents and developers.
Combined with the `antislop` filter, it prevents generic AI defaults and guarantees a purposeful, industrial-grade user experience.

---

## 1. Brand Identity & Product Brief

- **Product:** Tac-Xpress (Tactical Express Logistics & Multi-modal Freight Orchestration).
- **Core Domain:** Air and ground cargo forwarding, dispatch manifests, hub telemetry, real-time AWB tracking, GST E-Way compliance, and corridor pricing in India.
- **Personality:** Tactical, Aerospace-clean, Mission-critical, High-precision, Industrial.
- **Audience:** Logistics dispatchers, hub warehouse supervisors, fleet drivers, and commercial cargo shippers.
- **Tone:** Authoritative, direct, factual, zero conversational fluff.

---

## 2. Liveliness Dials

Per the Antislop Liveliness Toolkit:
- **ENERGY: 2 (Confident)**
  High-contrast status badges, distinct card boundaries, and focused amber telemetry accents without garish glows or decorative rainbow gradients.
- **RHYTHM: 2 (Structured Multi-Density)**
  High-density data tables and telemetry strips paired with spacious, legible form layouts. Section compositions follow operational logistics workflows.
- **MOTION: 2 (Micro-Responsive)**
  Snappy transitions (`duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`). Zero bouncy reveals. Transforms and opacity only. Respects `prefers-reduced-motion: reduce`.

---

## 3. Color Palette & Science

All colors follow OKLCH perceptual uniformity and strict WCAG AA contrast (minimum 4.5:1 for body text, 3:1 for large text and UI boundaries). Tested via `contrast-check.py`.

### 3.1 Dark Mode (Primary Tactical Mode)
- **Base Background:** Slate-950 (`#090d16` / `oklch(14% 0.02 260)`)
- **Panel & Surface:** Slate-900 (`#0f172a` / `oklch(20% 0.03 260)`)
- **Card Elevated:** Slate-850 (`#131e33` / `oklch(23% 0.04 260)`)
- **Borders & Dividers:** Slate-800 (`#1e293b` / `oklch(27% 0.03 260)`)
- **Text Primary:** Pure Crisp White (`#f8fafc` / `oklch(98% 0.01 260)`) — Contrast ratio > 15:1
- **Text Muted:** Slate-400 (`#94a3b8` / `oklch(71% 0.02 260)`) — Contrast ratio > 5.5:1

### 3.2 Light Mode (Supported Full-Fidelity Mode)
- **Base Background:** Slate-50 (`#f8fafc` / `oklch(98% 0.01 260)`)
- **Card Surface:** Pure White (`#ffffff`)
- **Borders & Dividers:** Slate-200 (`#e2e8f0` / `oklch(92% 0.01 260)`)
- **Text Primary:** Slate-900 (`#0f172a` / `oklch(20% 0.03 260)`) — Contrast ratio > 15:1
- **Text Muted:** Slate-600 (`#475569` / `oklch(45% 0.03 260)`) — Contrast ratio > 5.8:1

### 3.3 Status & Categorical Accents
- **Primary Industrial Accent:** Safety Amber (`#f59e0b` / `oklch(75% 0.16 70)`) — Used for primary CTAs, active dispatch triggers, and warning states.
- **Telemetry Accent:** Signal Cyan (`#06b6d4` / `oklch(78% 0.14 210)`) — Used for GPS coordinates and live transit telemetry.
- **Success State:** Emerald (`#10b981` / `oklch(72% 0.17 160)`) — Used for `DELIVERED`, `PAID`, `VERIFIED`.
- **Exception State:** Crimson (`#ef4444` / `oklch(63% 0.22 25)`) — Used for `FAILED`, `CANCELLED`, `DISCREPANCY`.

---

## 4. Typography Standards

- **Primary Body & Headings:** `Inter`, `-apple-system`, `sans-serif`. Clean, legible, high x-height.
- **STEM & Telemetry Mono:** `Geist Mono`, `JetBrains Mono`, `monospace`.
  Mandatory for:
  - Waybill numbers (e.g., `AWB-2026-90412`)
  - GPS coordinates (e.g., `26.1445° N, 91.7362° E`)
  - Cargo volumetric weight (`cm³ / 5000 = kg`)
  - Currency and tax calculations (`₹12,450.00 + 18% GST`)
- **Tabular Figures:** Always apply `tabular-nums` / `font-mono` on numbers in data grids to prevent layout jitter during live updates.
- **Type Scale:**
  - `text-2xl` font-semibold: Page titles
  - `text-lg` font-semibold: Card headers
  - `text-sm`: Standard body and data table cells
  - `text-xs`: Metadata, timestamp labels, badge chips

---

## 5. Layout & Components

- **Component Library:** ReUI built on Shadcn UI (`components/ui`, `components/reui`).
- **Data Grids:** Use `data-grid` for shipments, invoices, and hub lists.
- **Border Radius:** Deliberate hierarchy (`rounded-md` for buttons and badges, `rounded-lg` for cards, `rounded-xl` for modal dialogs). No pill cards or pill inputs.
- **Shadows:** Grounded matte surfaces (`shadow-xs` / `shadow-sm` on elevated flyouts). Zero floating blurred blobs.
- **Every Data Region:**
  1. Empty state: Shows icon, explanatory text, and primary creation button.
  2. Loading state: Animated `Skeleton` placeholder matching exact table/card dimensions.
  3. Error state: Inline alert with error message and Retry action button.

---

## 6. Copywriting & Content Rules

- No marketing hype words: Never use "seamless", "unlock", "game-changing", "revolutionary", or "cutting-edge".
- No em dashes (`—`) in UI copy: Use commas, colons, or parentheses.
- Concrete CTAs: "Create Dispatch Manifest", "Generate Tax Invoice", "Track Consignment".
- Evidence over claims: Only display verified telemetry, active SLA transit hours, and real GSTIN numbers.
