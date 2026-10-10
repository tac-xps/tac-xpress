# TAC-XPRESS design system

## Intent

Enough information to act confidently, with enough space to think. Nordic Lagom describes restraint, balance and usefulness. TAC-XPRESS remains an Indian cargo business; it does not borrow a Scandinavian cultural identity. Public content explains how to prepare, book, track and resolve a shipment. The operations workspace belongs only to provisioned admins and staff. Customers need no account.

## Source system

Use Tailark Veil compositions for public sections and official shadcn Radix components for controls and dashboard layouts. Consult [UI-SOURCES.md](UI-SOURCES.md) for documentation coverage, registry snapshots and adaptations. Do not mix competing decorative UI kits into active routes.

## Public cargo direction — 7 September 2026

The public frontend retains the user's Cargo Home 4 composition: cinematic transport imagery, expansive typography, substantial service content and dark story sections. The subsequent Nocturne rail reference refines the colors into ivory/lilac light surfaces, near-black violet dark surfaces and restrained violet actions. The operations workspace uses the same semantic color family with Nordic Lagom density and flat functional surfaces.

- Public and staff surfaces inherit the same light/dark semantic tokens. Inverse sections and quiet lilac feature bands explicitly rebind the existing Tailwind aliases. Status colors remain distinct from the violet action accent.
- DM Sans remains the loaded typeface. Public display type scales from 48 to 96px, section headings from 36 to 60px, with tighter display tracking. These are explicit public display tokens rather than operational text sizes.
- Maximum public container: 1440px; fluid 20–64px side space. All surfaces and controls have square corners, including actions, fields, badges, avatars, overlays and chart bars.
- Five original generated cargo render concepts supply hero, air, surface, packing and warehouse imagery. They illustrate the services; they do not document TAC-XPRESS-owned aircraft, vehicles or facilities.
- Use Next Image with responsive sizes and fixed aspect containers. Only the homepage hero is preloaded. Other imagery is lazy-loaded. Do not add a runtime 3D engine, autoplay video, scroll hijacking or an entrance animation that hides content.
- Hover/focus image enlargement is small and disabled under reduced motion. Sticky navigation changes its surface after scrolling; its subscription is cleaned up.
- Preserve the real AWB GET form, public support flows and provisioned staff entry. No invented fares, sea freight, fleet claims or testimonials.

See [the reference and research notes](../artifacts/cargo-2026/research.md), [the implementation plan](../implementation_plan.md), and [the image manifest](../artifacts/cargo-2026/image-manifest.json).

## Nordic Mineral — Nocturne Obsidian & Luminous Nordic Teal specification

The visual system implements the 2026 "Nocturne Obsidian & Luminous Nordic Teal" architecture: Radix Slate (H 256) neutral structure, Radix Teal (H 180) primary brand accent in light mode, Nocturne Obsidian (H 255, C <= 0.010) deep bedrock in dark mode, and Luminous Nordic Teal (H 178, C 0.135) for high-contrast jewel actions.

### Material and surface hierarchy

- Light canvas uses Radix Slate Cloud (`--mn-cloud: oklch(0.982 0.002 256)`).
- Card surfaces use Crisp Paper (`--mn-paper: oklch(0.993 0.002 256)`).
- Secondary muted containers use Radix Slate Mist (`--mn-mist: oklch(0.936 0.006 256)`).
- Structural borders use Hairline Stone (`--mn-stone: oklch(0.889 0.010 256)`).
- Form and input boundaries use Stone Strong (`--mn-stone-strong: oklch(0.601 0.020 256)`), exceeding 3.0:1 non-text contrast against cloud.
- Text primary uses dense blue-neutral Ink (`--mn-ink: oklch(0.256 0.011 264)`), exceeding 14.5:1 on cloud canvas.
- Text secondary uses calibrated Slate (`--mn-slate: oklch(0.498 0.018 256)`), satisfying APCA |Lc| >= 75 body text on paper card.
- Dark canvas uses Nocturne Obsidian (`--background: oklch(0.125 0.007 255)`), providing authentic depth without blue mud.
- Dark surface containers use Graphite Surface (`--surface: oklch(0.150 0.008 255)`), receding calmly behind content.
- Dark card containers use Tactile Basalt Card (`--card: oklch(0.180 0.010 255)`), providing clean micro-elevation without washed-out gray slabs.
- Dark popover containers use Distinct Popover Basalt (`--popover: oklch(0.220 0.012 255)`).
- Dark strong borders use Obsidian Stone Strong (`oklch(0.500 0.015 255)`), exceeding 3.1:1 non-text contrast against card.
- Dark text primary uses Cloud White (`oklch(0.982 0.002 256)`), achieving >17.8:1 contrast on card.
- Dark text secondary uses Cool Slate (`oklch(0.740 0.016 256)`), achieving >8.1:1 contrast on card.

### Color discipline and semantic separation

- Primary UI accent in light mode uses Radix Teal H 180 (`oklch(0.461 0.146 180)`).
- Primary UI accent in dark mode uses Luminous Nordic Teal H 178 (`oklch(0.680 0.135 178)`), paired with deep obsidian ink text (`oklch(0.125 0.007 255)`) achieving 7.57:1 AAA contrast.
- Neutral foundation provenance: [oklch.fyi/color-palettes/slate](https://oklch.fyi/color-palettes/slate) (H 256°).
- Dark environment provenance: 2026 Nocturne Obsidian & Graphite standard (H 255°, C 0.007–0.010).
- Brand Blue (`--tx-brand-blue: oklch(0.48 0.15 255)`) remains reserved strictly for the TAC-XPRESS logo.
- Interactive highlights use Mist wash (`--accent`), separating interaction from semantic status.
- Cargo in-transit uses Fjord H 215 (`oklch(0.500 0.075 215)` in light, `oklch(0.740 0.065 215)` in dark).
- Delivered cargo uses Botanical Moss H 138 (`oklch(0.490 0.060 138)` in light, `oklch(0.740 0.065 138)` in dark).
- Warning and pending reviews use Ochre H 68/72 (`oklch(0.530 0.105 68)` in light, `oklch(0.760 0.090 72)` in dark).
- Exceptions and cancellations use Clay H 32 (`oklch(0.500 0.110 32)` in light, `oklch(0.730 0.095 32)` in dark).

### Elevation and shadows

- Light mode uses restrained blue-neutral shadows tinted with ink (`oklch(0.230 0.012 250 / ...)`).
- Dark mode uses Nocturne Obsidian dark shadow tokens (`--mn-shadow-dark: oklch(0.080 0.005 255)`), avoiding artificial navy-blue cast.
- Dark hierarchy relies on subtle surface lightness stepping (0.125 -> 0.150 -> 0.180 -> 0.220) rather than heavy black cast shadows.

### Categorical data visualization palette

1. Series 1: Radix Teal (`oklch(0.461 0.146 180)`)
2. Series 2: Moss (`oklch(0.490 0.060 138)`)
3. Series 3: Ochre (`oklch(0.530 0.105 68)`)
4. Series 4: Clay (`oklch(0.500 0.110 32)`)
5. Series 5: Fjord (`oklch(0.500 0.075 215)`)

### Geometry hierarchy

- Every surface, control, overlay, container, and interactive element uses 0px (`rounded-none`). No exceptions.
- All `--radius-*` tokens resolve to `0px`. Do not reintroduce any non-zero radius value.
- All active controls use a two-tone focus ring with 4px soft bloom.

### Dual-layer accessibility standards

- Layer 1 (WCAG 2.2 AA): Body text contrast >= 4.5:1. Large text >= 3.0:1. UI boundaries >= 3.0:1.
- Layer 2 (SAPC-APCA 0.0.98G): Preferred body text |Lc| >= 90. Minimum body text |Lc| >= 75. Badges and content |Lc| >= 60.

### Enforcement pipeline

- Stylelint rejects raw hex codes, RGB/RGBA functions, and named colors in CSS (`pnpm run stylelint`).
- Design Token Audit scans TSX files to block Tailwind spectrum classes (`pnpm run audit:tokens`).

## Operations typography and space

- DM Sans for headings and interface text; sentence case and normal letter spacing.
- IBM Plex Mono for AWBs and compact machine identifiers; tabular numerals for comparable values.
- Four-pixel spacing scale. Action heights: extra-small 24px, small 28px, default 32px and large 36px; icon buttons use the same scale. Public primary actions and paired form fields use 36px. Preserve at least 24px targets, separation between adjacent actions and visible keyboard focus. Avoid local height/padding overrides when a shared size variant fits.
- Every radius token is zero. Do not reintroduce pill utilities, arbitrary pixel radii or rounded chart bars. Preserve the geometry of icons, map paths and illustrations.
- Responsive content containers, bounded readable paragraphs and horizontal table scrolling inside their own region.
- The desktop sidebar remains sticky and full viewport height. Mobile navigation uses the shadcn Sheet.
- Operations navigation uses a consolidated active state: 10% primary wash background, primary foreground text, and a crisp 3px orthogonal indicator bar on the active route.

## Information and interaction

- A public page has one clear purpose and primary next step, supported by substantial explanatory sections.
- A dashboard page starts with a title, useful context and relevant actions. Queues show actual work; metrics name their period and denominator.
- Search and sorting operate on the server across matching records where offered. Exports explicitly say when they cover only the current page.
- Use named hubs, drivers, vehicles and customers in selectors. Do not ask people to paste internal IDs.
- File selection does not imply upload. Documents attach to a saved record and show success, failure and retry states.
- Finalization and removal explain the actual consequence. Never show success for skipped provider work.

## Accessibility and motion

Visible keyboard focus, labelled controls, named dialogs, meaningful headings, text errors, AA contrast and 320px layouts are release checks. Respect reduced motion; no continuous animation is required for operational comprehension. Light and dark themes use the same hierarchy.

## Evidence boundary

The Storybook operations preview uses clearly marked simulated records and has no live mutations. Local public and isolated UI checks do not constitute authenticated staging or production acceptance. Consult the latest audit report for the checks actually performed and open release gates.
