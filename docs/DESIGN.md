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

## Nordic Mineral — Cloud White / Blue Basalt specification

The visual system implements the "Nordic Mineral — Cloud White / Blue Basalt" architecture. An airy structural white canvas inspired by Pantone's 2026 Cloud Dancer pairs with a technical medium-deep Blue Basalt dark mode.

### Material and surface hierarchy

- Light canvas uses soft architectural Cloud White (`--mn-cloud: oklch(0.985 0.006 95)`).
- Card surfaces use Crisp Paper (`--mn-paper: oklch(0.995 0.003 95)`).
- Secondary muted containers use Cool Mist (`--mn-mist: oklch(0.955 0.008 95)`).
- Structural borders use Hairline Stone (`--mn-stone: oklch(0.900 0.010 95)`).
- Form and input boundaries use Stone Strong (`--mn-stone-strong: oklch(0.630 0.015 250)`).
- Text primary uses dense blue-neutral Ink (`--mn-ink: oklch(0.230 0.012 250)`).
- Text secondary uses restrained blue-slate (`--mn-slate: oklch(0.470 0.012 250)`).
- Dark canvas uses Blue Basalt (`--background: oklch(0.240 0.030 255)`).
- Dark surface containers use Lifted Basalt (`--surface: oklch(0.270 0.030 255)`).
- Dark card containers use Elevated Basalt Card (`--card: oklch(0.290 0.035 255)`).
- Dark popover containers use Distinct Popover Basalt (`--popover: oklch(0.320 0.035 255)`).
- Dark strong borders use Stone 580 (`oklch(0.580 0.018 245)`), exceeding 3.0:1 non-text contrast against cards.

### Color discipline and semantic separation

- Primary UI accent uses Mineral Indigo H 278 (`oklch(0.510 0.140 278)` in light, `oklch(0.730 0.105 278)` in dark).
- Brand Blue (`--tx-brand-blue: oklch(0.48 0.15 255)`) remains reserved strictly for the TAC-XPRESS logo.
- Interactive highlights use Mist wash (`--accent`), separating interaction from semantic status.
- Cargo in-transit uses Fjord H 215 (`oklch(0.500 0.075 215)` in light, `oklch(0.740 0.065 215)` in dark).
- Delivered cargo uses Botanical Moss H 138 (`oklch(0.490 0.060 138)` in light, `oklch(0.740 0.065 138)` in dark).
- Warning and pending reviews use Ochre H 68/72 (`oklch(0.530 0.105 68)` in light, `oklch(0.760 0.090 72)` in dark).
- Exceptions and cancellations use Clay H 32 (`oklch(0.500 0.110 32)` in light, `oklch(0.730 0.095 32)` in dark).

### Elevation and shadows

- Light mode uses restrained blue-neutral shadows tinted with ink (`oklch(0.230 0.012 250 / ...)`).
- Dark mode eliminates pure black RGB shadows and uses Blue-Basalt dark shadow tokens (`--mn-shadow-dark: oklch(0.120 0.025 255)`).
- Dark hierarchy relies on surface lightness progression rather than heavy black shadows.

### Categorical data visualization palette

1. Series 1: Mineral Indigo (`oklch(0.510 0.140 278)`)
2. Series 2: Moss (`oklch(0.490 0.060 138)`)
3. Series 3: Ochre (`oklch(0.530 0.105 68)`)
4. Series 4: Clay (`oklch(0.500 0.110 32)`)
5. Series 5: Fjord (`oklch(0.500 0.075 215)`)

### Geometry hierarchy

- Architectural containers, cards, tables, and panels use 0px (`rounded-none`).
- Interactive controls (buttons, inputs, selects, tabs, chips) use 3px (`--radius-control: 3px`).
- Overlays (dialogs, popovers, dropdown menus, tooltips) use 6px (`--radius-overlay: 6px`).
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
