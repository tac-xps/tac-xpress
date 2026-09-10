# Nocturne rail: TAC-XPRESS color adaptation

## Reading of the supplied file

The supplied `pasted-text.txt` is a Markdown design specification with YAML front matter named **Nocturne rail**. It describes a Railway-inspired, dark-only editorial system. Its strongest transferable ideas are quiet near-black layers, restrained accent use, legible UI hierarchy, border-led elevation and illustration-local gradients. The supplied hex values are treated as reference inputs, not independently verified pixel measurements of the current [Railway website](https://railway.com/).

The file does not define a light theme. It also conflicts internally on card radius and calls the primary control both solid and pill-adjacent. The user's explicit square-button instruction overrides every radius recommendation. All existing radius tokens, Button variants and action dimensions are preserved.

## Adopt, adapt and leave out

| File area | Application to this project |
| --- | --- |
| Dark palette | Adopt the near-black violet canvas and layered panel hierarchy. Raise subdued copy and interactive borders where contrast requires it. |
| Light palette | Add a complementary ivory/lilac theme, white panels and deep violet-gray ink. It is a new counterpart, not an inverted screenshot. |
| Violet action accent | Use the supplied dark violet on light surfaces; use lighter violet with dark text in dark mode. Keep semantic shipment colors independent. |
| Pink/teal accents | Keep them within the chart family and existing semantic roles, rather than introducing decorative highlights everywhere. |
| Gradients | Recolor the existing hero readability scrim toward twilight ink. Add a subtle, bounded radial lift around one story image, a lower image fade and a thin gradient step rail. |
| Elevation | Use borders and a small neutral-violet shadow tint. No background blur, glass panels or large glowing dashboard surfaces. |
| Typography | Keep loaded DM Sans and IBM Plex Mono, existing display/body hierarchy and readable line heights. The reference's 16px body at line-height 1 is too compressed for explanatory cargo content. Adding four competing font families would add complexity without helping operations. |
| Composition | Keep the existing useful cargo sections and staff queues. The ordered shipping explanation borrows the rail's visual continuity without copying Railway's developer pipeline. |
| Motion | Keep existing short interactions and reduced-motion behavior. No parallax, scroll listeners, flashing statuses or marquee loops are added. |
| Geometry | Keep all square corners and the existing compact 24/28/32/36px Button scale. |

## Implemented palette

| Role | Light | Dark |
| --- | --- | --- |
| Canvas | `#F7F6F9` | `#13111C` |
| Card | `#FFFFFF` | `#1C1A28` |
| Raised popover | `#FFFFFF` | `#242131` |
| Primary text | `#252130` | `#F7F7F8` |
| Secondary text | `#625D70` | `#B1ACBF` |
| Primary action | `#59497A` | `#BBA5E0` |
| Primary action text | `#FFFFFF` | `#21182E` |
| Decorative border | `#DAD6E2` | `#3A3448` |
| Control boundary | `#80788E` | `#817B92` |
| Focus ring | `#735697` | `#C8B3EB` |
| Selected sidebar row | `#DFD8E9` | `#30283F` |

Public inverse sections stay dark in both modes so that text on transport imagery remains readable. Former orange feature bands now use quiet lilac in light mode and a deeper violet panel in dark mode. Fields within those bands follow the current card/text/input tokens instead of keeping a hardcoded cream fill in dark mode.

## Contrast rationale

Measured with sRGB relative luminance through Culori, before browser validation:

| Pair | Light ratio | Dark ratio |
| --- | ---: | ---: |
| Body text / canvas | 14.57:1 | 17.44:1 |
| Secondary text / canvas | 5.88:1 | 8.47:1 |
| Secondary text / muted panel | 5.37:1 | 6.74:1 |
| Primary action text / fill | 7.90:1 | 7.75:1 |
| Input boundary / card | 4.20:1 | 4.22:1 |
| Focus ring / canvas | 5.56:1 | 9.87:1 |

The reference's `#6B7280` on `#13111C` measures 3.86:1, so it is unsuitable as normal-sized secondary copy. Decorative borders are deliberately quieter; actual input boundaries and focus rings use the stronger tokens. Semantic status colors retain text labels and are not used as the sole source of meaning.

## Implementation boundaries

Changes are limited to the semantic colors and bounded effects in `app/globals.css`, two class hooks in public story/shipping components, solid secondary text for sidebar group labels, explicit theme-aware chart-axis text, and design documentation. Browser checks exposed the old sidebar label opacity at 4.07:1 on the new light sidebar; using the solid text token resolves that compositing issue. No fonts, images, package versions, runtime listeners, client boundaries, source-file deletions, data mutations or access changes were introduced. The shared Button source is verified against its pre-change SHA-256 hash, and every radius token remains zero.

Validation evidence is recorded under `artifacts/nocturne-color` and `docs/audit-evidence/nocturne-2026-09-07`. Public and isolated staff preview checks remain local evidence, separate from authenticated staging and production release gates.

## Final local verification

- Next.js production build and the isolated Storybook build both passed against the final source.
- All 54 existing public accessibility, cargo frontend and workspace design checks passed in Edge: responsive routes at 320/768/1440px, dark-mode content, keyboard navigation, tracking validation, no-JavaScript content, reduced motion and workspace command search.
- Eight additional homepage/workspace checks across light/dark themes at 320/1440px confirmed the actual compiled canvas/accent values, no horizontal overflow, no visible rounded corners and no WCAG A/AA violations reported by Axe.
- Both scrolled desktop shipment-desk states also passed Axe after the sticky header's background transition completed; final screenshots capture that settled state.
- Stylelint and targeted ESLint passed. The shared Button SHA-256 matches the pre-change value, and the complete set of CSS radius declarations matches the pre-change snapshot.
- Screenshots were visually reviewed for the public hero, shipment desk and staff overview in both themes. The staff overview uses clearly labelled simulated records; it is not evidence of authenticated production operations.

The initial development preview served stale CSS and was excluded from the final evidence. During cache relocation, Windows traversed generated dependency junctions; installed packages were restored with `pnpm install --frozen-lockfile --force`. Package versions and the lockfile were unchanged. Final browser evidence comes from the fresh production build with both E2E bypass flags disabled.
