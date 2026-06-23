# TAC-XPRESS Premium Enterprise Theme Implementation Plan

## CTO direction

The product will use a snow-white light theme and a lifted sky-blue slate dark
theme. The application should feel precise, calm, and operationally trustworthy.
Gradients and glass effects are supporting materials, not the primary surface
language.

## Design principles

1. Semantic tokens own color decisions. Application components do not select raw
   Tailwind palette colors for product states.
2. Opaque surfaces carry dense operational content. Glass is reserved for the
   shell, overlays, and selected marketing moments.
3. Light mode uses crisp white cards on a cool snow canvas. Dark mode uses layered
   blue-slate surfaces and never approaches pure black.
4. Elevation is communicated with a coordinated combination of border, tonal
   separation, and restrained shadow.
5. DM Sans is the interface family. IBM Plex Mono is reserved for identifiers,
   timestamps, and numeric data. Lora remains available for scoped editorial use.
6. Radius follows a controlled hierarchy: controls, cards, and overlays share the
   same family without becoming excessively rounded.

## Implementation waves

### Wave 1: Foundation

- Consolidate Tailwind v4, Shadcn, animation, font, color, radius, and shadow
  tokens in `app/globals.css`.
- Replace the legacy animation plugin with `tw-animate-css` and import
  `shadcn/tailwind.css`.
- Correct the `next/font` variable mapping to avoid self-referential custom
  properties.
- Introduce semantic surface, strong-border, and feedback foreground tokens.
- Keep logistics states distinct from the brand primary color.

### Wave 2: Core primitives

- Update Button, Card, Badge, Input, Textarea, Select, Tabs, Dialog, Sheet, and
  Sidebar styling through their component sources.
- Remove the need for broad post-hoc `[data-slot]` component overrides.
- Preserve component behavior, accessibility attributes, and Radix composition.

### Wave 3: Application shell

- Replace the dashboard photograph and additive blend mode with a semantic app
  canvas.
- Use restrained glass in the sticky header and sidebar only.
- Preserve the full-height sticky sidebar and existing responsive behavior.

### Wave 4: Surface migration

- Migrate page-local raw colors and one-off shadows incrementally by domain:
  dashboard, shipments/dispatch, invoices/customers, tracking/warehouse, portal,
  then public pages.
- Consolidate repeated status treatments into Badge variants and shared logistics
  components.

## Acceptance criteria

- Core text and action color pairs meet WCAG 2 AA.
- Light and dark modes maintain equivalent visual hierarchy.
- Dark mode remains visibly blue and lifted rather than near-black.
- No dashboard photograph competes with operational data.
- Core Shadcn controls share one radius, focus, border, and elevation language.
- Theme switching has no flash, invalid CSS variables, or hydration regression.
- Typecheck, lint, stylelint, unit tests, and production build pass.
- Light/dark screenshots are reviewed at mobile and desktop widths.
