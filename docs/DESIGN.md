# TAC-XPRESS design implementation guide

Current authority: 4 November 2026.

[The root design brief](../DESIGN.md) defines product identity, audience, and tone.
[AGENTS.md](../AGENTS.md) defines repository constraints. Installed component APIs own their control styling and overlay behavior.
`app/globals.css` owns exact token values and public type scales. `app/layout.tsx` owns font loading.
Use these sources together. Historical mockups do not override them.

## Product and visual identity

TAC-XPRESS serves the exclusive New Delhi and Imphal corridor in both directions (DEL ⇄ IMF).
Use factual, direct language for shippers, dispatchers, warehouse staff, and drivers.
Keep public editorial sections spacious and operational registers compact.
Keep substantial service guidance, AWB tracking, support, feedback, legal pages, and provisioned staff entry.

The current palette uses neutral light surfaces, obsidian dark surfaces, and teal primary actions.
The previous violet/lilac direction and slate/amber/cyan action palette are superseded.
Historical research remains in [UI-SOURCES.md](UI-SOURCES.md) and [the cargo research](../artifacts/cargo-2026/research.md).
Those documents record provenance rather than current styling requirements.

## Color and geometry

- Use `background`, `card`, `popover`, `surface`, and `muted` for their intended surfaces.
- Pair text with `foreground`, `muted-foreground`, or the surface's foreground token.
- Use `primary` and `primary-foreground` for primary actions. Use `ring` for visible keyboard focus.
- Keep semantic freight statuses distinct from the teal action accent.
- Use installed ReUI light Badge variants or Alert variants for state messages.
- Reserve brand blue for the logo and categorical colors for actual category identity.
- Use straight lines and zero-radius geometry for controls, containers, badges, and overlays.
- Let installed variants own heights, padding, shadows, and motion. Do not override them at call sites.

Do not duplicate raw palette values or unsupported contrast ratios here.
Measure actual rendered text and boundary pairs in both themes.
Target WCAG AA: 4.5:1 body text, 3:1 large text, and 3:1 required non-text boundaries.
A token audit or automated scan alone does not prove accessibility compliance.

## Typography

The loaded interface family is **Inter**, including headings, navigation, forms, and general copy.
The operational data family is **IBM Plex Mono**, reserved for AWBs, IDs, DEL/IMF codes, timestamps, and financial figures.
IBM Plex Sans is a superseded direction. Do not load another interface family to match historical examples.

- Use `text-sm` for operational body text and `text-xs` for metadata.
- Keep active interface text at least 12px. Print documents and illustrative mini-UI have separate physical requirements.
- Use tabular numerals for comparable numerical data.
- Preserve public display and section scales from the existing CSS tokens.
- Use sentence-case sans labels. Do not add tracked capitals or category eyebrows above headings.
- Keep breadcrumbs as navigation. Do not repeat their category label above the page title.
- Preserve installed CardTitle and FrameTitle sizes.

## Composition and responsive behavior

- Reuse installed shadcn/Radix and ReUI components from `components/ui` and `components/reui`.
- Retain the existing TanStack v8 DataTable contract, URL state, sorting, and server pagination.
- Give each register one surface owner. Pass `bordered={false}` when a surrounding region owns the surface.
- Preserve standalone table framing with the default `bordered` value.
- Do not introduce a second grid/filter system without a separately scoped compatibility migration.
- Keep the desktop sidebar `sticky top-0 h-svh`.
- Use parent `gap-*`: 1–2 for rows, 3–4 between groups, and 6–8 between sections.
- Let narrow layouts wrap actions and stack fields before they overflow.
- Keep physical documents unchanged. Put narrow-screen previews in labeled, keyboard-focusable horizontal scroll regions.

`.cargo-container` currently uses a 1440px maximum, increasing to 1680px from a 1920px viewport.
The homepage landing composition has its own existing 1320px container.
Preserve those distinct compositions. Do not force operational density onto public content.

## Information, states, and motion

- Give each public page a clear purpose and relevant next step.
- Name metric periods, limits, units, and denominators. Label latest-100 samples explicitly.
- Keep overlapping risk flags separate from exclusive shipment statuses.
- Use real record labels in selectors. Do not request internal IDs from users.
- Show loading Skeletons, actionable empty states, and inline errors with Retry for data regions.
- Associate field errors with controls and announce asynchronous failures.
- Retain entered values after a failed submission. Confirm only saved work.
- Explain actual finalization and removal consequences.
- Preserve installed overlay animation and reduced-motion handling.
- Limit custom motion to transform and opacity. Do not animate layout dimensions or blur.
- Use `transition-colors` for control hover states.
- Do not add decorative entrances or stagger register rows.

Homepage imagery illustrates services rather than owned aircraft, vehicles, or facilities.
Use Northeast Indian/Asian people when people assets are needed.
The hero reconciles playback after mount and stays paused under reduced motion.
Keep its explicit playback control. Do not add other automatic media.

## Verification

Run `pnpm typecheck`, `pnpm test:unit`, `pnpm lint`, `pnpm stylelint`, `pnpm audit:tokens`, and `pnpm build`.
Run ReUI self-checks and the Delivery Gate. Review the smallest connected diff with Ponytail Full.
Compare relevant viewport, theme, keyboard, loading, empty, error, and populated states.
Record unverified authenticated and hosted acceptance separately from local evidence.
