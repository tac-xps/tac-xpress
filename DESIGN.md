# Tac-Xpress Design Direction (DESIGN.md)

This document supplies brand identity and design direction for **Tac-Xpress**.
It serves as the design foundation for AI agents and developers.
Combined with the `antislop` filter, it prevents generic AI defaults and guarantees a purposeful, industrial-grade user experience.

---

Current authority: 4 November 2026. Preserve this identity, the repository rules, and the executed tokens.

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
  High-contrast status badges, distinct card boundaries, and restrained teal action accents without garish glows or decorative rainbow gradients.
- **RHYTHM: 2 (Structured Multi-Density)**
  High-density data tables and telemetry strips paired with spacious, legible form layouts. Section compositions follow operational logistics workflows.
- **MOTION: 2 (Micro-Responsive)**
  Snappy transitions (`duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`). Zero bouncy reveals. Transforms and opacity only. Respects `prefers-reduced-motion: reduce`.

---

## 3. Color system and authority

The executed system uses crisp alpine slate light surfaces, tactical carbon dark surfaces, and aviation cobalt primary actions.
`app/globals.css` owns exact light, dark, inverse, status, and chart values.
Use semantic tokens instead of copying palette values into components or documentation.

- Canvas and surfaces: `background`, `surface`, `card`, `popover`, `muted`.
- Text: `foreground`, `muted-foreground`, and each surface's foreground token.
- Actions: `primary`, `primary-foreground`, `accent`, `ring`.
- Freight states: existing `status-*` tokens and ReUI light Badge variants.
- Brand blue remains reserved for the logo. It is not the primary action accent.

The previous slate/amber/cyan direction is superseded. Do not restore it from historical notes.
Contrast targets are WCAG AA, not blanket claims of compliance. Verify actual rendered color pairs.
See [the implementation guide](docs/DESIGN.md) for component and responsive rules.

---

## 4. Typography Standards

- **Primary Body & Headings:** `Inter`, `-apple-system`, `sans-serif`. Clean, legible, high x-height.
- **STEM & Telemetry Mono:** `IBM Plex Mono`, `monospace`.
  Mandatory for:
  - Waybill numbers (e.g., `AWB-2026-90412`)
  - Recorded shipment coordinates
  - Cargo volumetric weight (`cm³ / 5000 = kg`)
  - Currency and tax calculations (`₹12,450.00 + 18% GST`)
- **Tabular Figures:** Always apply `tabular-nums` / `font-mono` on numbers in data grids to prevent layout jitter during live updates.
- **Digital type floor:** Use 12px as the minimum size for interface text. Reserve smaller sizes for print layouts and illustrative mini-UI.
- **Type Scale:**
  - `text-2xl` font-semibold: Page titles
  - `text-lg` font-semibold: Card headers
  - `text-sm`: Standard body and data table cells
  - `text-xs`: Metadata, timestamp labels, badge chips

---

## 5. Layout & Components

- **Component Library:** ReUI built on Shadcn UI (`components/ui`, `components/reui`).
- **Registers:** Reuse the installed TanStack v8 DataTable and its adapters. Preserve sorting and server pagination.
- **Surface ownership:** Use `bordered={false}` inside an existing register surface. Keep the standalone default.
- **Registry compatibility:** Do not replace working registers with a different grid API without a separately scoped migration.
- **Geometry & Border Radius:** Zero border radius (`rounded-none`). Rounded corners, curved lines, and pill containers are strictly forbidden. Use precision straight lines, razor-sharp rectangular borders, and industrial technical geometry exclusively.
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

---

## 7. Hallmark Anti-AI-Slop Invariants

Enforced via `node .agents/skills/hallmark/scripts/sloplint.mjs`:
- **Floor 54 & 67 (No Eyebrows, No Tracked Caps)**: Do not place small uppercase category labels stacked over headings. Keep metadata in normal sentence case, body face, untracked.
- **Floor 63 (No Template Punctuation)**: Do not join strings with middle dots (`A · B · C`). Do not glue arrows to links (`Learn more ->`).
- **Floor 4 (Single Containment Layer)**: Never nest cards inside cards (`bg-card` inside `bg-card`).
- **Floor 10a (No transition: all)**: Explicit transitions only (`transition-colors`, `transition-transform`, `transition-opacity`).
- **Reflex 64 (Monospace Discipline)**: Reserve `font-mono` exclusively for AWB tracking numbers, airport IATA codes (`DEL`, `IMF`), timestamps, and financial figures. Never dress plain prose in monospace.
