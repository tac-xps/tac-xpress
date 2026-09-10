# Square UI verification — 7 September 2026

The public website and staff workspace now share square geometry and compact actions. The shared Button scale is 24/28/32/36px. Public primary actions use 36px, regular actions use 32px, and text-based service links no longer expand to 42px through local padding. Customer lookup triggers and adjacent quick-add actions align at 36px. Multiline menu content remains content-sized.

## Local validation

| Check | Result | Evidence |
| --- | --- | --- |
| Next.js production build, including TypeScript | Passed on final application source | `artifacts/square-ui-stylex/build-verified.log` |
| ESLint | Full run had zero errors; existing project warnings remain. New diagnostics and final touched files also checked. | `artifacts/square-ui-stylex/lint.log`, `final-touched-lint.log` |
| CSS lint | `pnpm exec stylelint app/globals.css` passed | Terminal verification |
| Public browser cases | All 50 cases passed across the final run and one corrected focused retest | `public-tests-final.log`, `reduced-motion-retest.log` |
| Isolated operations preview | Four cases passed: 320/768/1440px, dark theme, sidebar, command search, accessibility | `workspace-tests.log` |
| Computed geometry | 24 route/viewport combinations: zero visible elements with nonzero corner radii, zero shared actions over 36px, zero horizontal page overflow | `geometry-results.json`, `geometry-audit-final.log` |
| Portaled UI | Public mobile navigation, assistant sheet, staff mobile sidebar and dark command dialog had zero rounded elements | `overlay-results.json` |
| Visual inspection | Public and staff desktop/mobile captures inspected | `home-320.png`, `home-1440.png`, `workspace-320.png`, `workspace-1440.png` under `artifacts/square-ui-stylex` |

Browser evidence uses Microsoft Edge through Playwright. The public build runs locally at `http://localhost:3000`, with both E2E bypass flags explicitly disabled. The staff overview is a clearly labelled Storybook simulation, not an authenticated production session. Public tests cover 11 routes, three viewport widths, AA accessibility, dark themes, image loading, keyboard navigation, JavaScript-disabled content and native AWB validation. The support assistant was opened without submitting a message.

The final full public run passed 49 cases and exposed a brittle reduced-motion assertion. Inspection showed `transition-property: none` and `transform: none`, while the global reduced-motion reset retained `transition-duration: 0.001s`. The test now checks disabled transition properties and absent zoom rather than an exact duration. The focused case then passed. No production motion behavior was weakened to satisfy the test.

## Scope and limits

The radius change corrects theme tokens, literal utility classes, chart-bar props, printed manifest labels and vendor map control frames. Geographic accuracy circles, icon paths and illustration geometry retain their meaning. No global important radius override was added. No styling package, runtime or client boundary was introduced.

The computed audit covers the listed public routes, isolated overview and four overlay states. It does not claim live execution of every authenticated data-dependent page, map provider or booking form. The broader audit's authenticated staging, provider acceptance, recovery and deployment gates remain open. This report records local UI validation, not production release authorization.

See the [StyleX assessment](stylex-assessment-2026-09-07.md), [59-page documentation coverage](stylex-documentation-coverage-2026-09-07.md), and [current design contract](DESIGN.md).
