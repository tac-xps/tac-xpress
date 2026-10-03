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

## Operations color and material

- Crisp white canvas, pure white cards, quiet cool-slate borders and deep slate text in the light theme (Hue 255°).
- Nordic Deep Slate canvas (L = 0.210), lifted slate cards (L = 0.260) and high-contrast text (|Lc| >= 90) in the dark theme.
- Vibrant Nordic blue primary actions in dark mode (L = 0.680); deep slate primary actions in light mode. Functional shipment status colors remain separate.
- Semantic CSS variables in `app/globals.css` are authoritative and calibrated via Evil Martians Harmony and APCA.
- Borders and spacing provide structure. Operational tables, forms and metric surfaces remain flat. Avoid page-wide saturated gradients, glass cards and oversized metric tiles.

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
