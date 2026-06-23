---
name: TAC-Xpress
version: "1.1.0"
colors:
  background: "oklch(0.10 0.04 262)"
  foreground: "oklch(0.95 0.01 240)"
  primary: "oklch(0.91 0.14 192)"
  secondary: "oklch(0.44 0.10 257)"
  muted: "oklch(0.18 0.06 265)"
  accent: "oklch(0.22 0.07 266)"
  destructive: "oklch(0.6368 0.2078 25.3313)"
  border: "oklch(0.26 0.07 267)"
  status-pending: "oklch(80% 0.15 85deg)"
  status-transit: "oklch(72% 0.16 210deg)"
  status-delivered: "oklch(70% 0.18 145deg)"
  status-failed: "oklch(70% 0.2 25deg)"
typography:
  body-md:
    fontFamily: DM Sans, sans-serif
    fontSize: 1rem
rounded:
  sm: 0.125rem
  md: 0.25rem
  lg: 0.5rem
spacing:
  sm: 0.5rem
  md: 1rem
  lg: 1.5rem
---

## Overview

TAC-Xpress is a modern, enterprise-grade logistics and cargo delivery platform. The visual identity relies on sharp, high-contrast typography, premium components, and an emphasis on data density and usability.

## Colors

The brand uses a **deep navy + electric cyan** palette — authoritative, high-contrast, and purpose-built for mission-critical operations. The color language draws from tactical military operations centers: near-black backgrounds, navy gradient surfaces, and electric cyan as the primary action accent.

- **Primary:** Electric cyan `oklch(0.91 0.14 192)` — the core interaction color. Equivalent to `#2ef2ff`. Used for buttons, active nav, focus rings, chart-1. On dark navy backgrounds, this achieves ~8:1 contrast ratio.
- **Secondary:** Mid blue `oklch(0.44 0.10 257)` — secondary actions and chart-2.
- **Background:** Deep space navy `oklch(0.10 0.04 262)` — equivalent to `#080d27`. Near-black with a cold blue undertone.
- **Surfaces (Cards):** Dark navy `oklch(0.18 0.06 265)` — distinct from background with an electric cyan top accent line via `--card-accent`.
- **Sidebar:** `oklch(0.14 0.05 263)` — slightly lighter than background to establish layer hierarchy.
- **Mesh Gradient:** Cyan (`192°`) at top-left + mid-blue (`257°`) at top-right and bottom quadrants — creates a cool ambient glow reminiscent of holographic displays.
- **Status Colors:** Essential for logistics — Delivered (green), Transit (blue-cyan), Pending (amber), Failed (red).

## Design Hierarchy (Dark Mode)

```text
Layer 0: Page background    oklch(0.10) — near-black navy
Layer 1: Sidebar / header   oklch(0.14) — slightly lighter navy + blur
Layer 2: Cards              oklch(0.18) — dark navy panel + cyan top line
Layer 3: Inputs / popovers  oklch(0.22) — mid-dark navy surface
Layer 4: Accent / active    oklch(0.91 0.14 192) — electric cyan
```

## Typography

We use an editorial-style font stack: `DM Sans` for primary UI elements, `Lora` for expressive serifs, and `IBM Plex Mono` for data-dense tables and tracking numbers.

## Do's and Don'ts

- **Do** rely on Shadcn UI primitives for new components.
- **Do** stick strictly to the defined OKLCH color palette; do not introduce random hex colors.
- **Do** use `oklch(0.91 0.14 192)` (cyan) as the primary accent — not violet.
- **Do** maintain the standardized `rounded-lg` border radius for a soft but professional aesthetic.
- **Don't** use violet/purple hues — that palette has been replaced by the navy+cyan system.
- **Don't** use white as a primary button foreground — use `oklch(0.10 0.04 262)` (dark navy) on cyan buttons.