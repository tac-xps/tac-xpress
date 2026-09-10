# Cargo frontend redesign — 7 September 2026

Status: implemented and verified locally. Not deployed.

## Result

The public frontend now follows the Cargo Home 4 composition through an original TAC-XPRESS visual system: a cinematic air/road hero, oversized DM Sans headings, warm white service cards, orange tracking and editorial sections, asymmetric charcoal story content, tactile packing imagery and a stronger grouped footer.

The work covers the homepage, services, both service detail routes, shipping guide, about, contact, tracking, feedback, terms styling and staff sign-in. Customers continue to use public tracking and contact. The dashboard remains for provisioned admins and staff and retains its Nordic Lagom operations design.

The [implementation plan](../implementation_plan.md) records the audit, impact map, performance budget, alternatives and edge cases. The [research notes](../artifacts/cargo-2026/research.md) connect observed reference patterns and September sources to specific decisions. [UI-SOURCES.md](UI-SOURCES.md) retains Tailark and shadcn provenance; no additional UI library was installed.

## Design and behavior review

| Area | Implementation and review |
| --- | --- |
| Identity | TAC-XPRESS logo, New Delhi–Northeast route and Imphal story retained. No reference logos, copied media, sea-freight service or invented credibility claims. |
| Hero | Original terminal artwork, two clear planning/tracking actions, text-safe shading and responsive type. Tall mobile crops request enough source pixels. |
| Services | Three image-led compositions distinguish the two actual cargo services from the preparation guide. Detailed service pages retain acceptance and planning information. |
| Tracking | The orange desk submits an actual GET form to public tracking. Invalid references reach the real server validation. No customer account is introduced. |
| Content | Booking, preparation, documentation, special handling, recorded tracking events, FAQ and contact remain substantive and scannable. |
| Navigation | Official shadcn Sheet, visible focus, skip link and grouped footer. Opaque server-rendered navigation remains readable without JavaScript; transparent hero treatment activates after hydration at the top. |
| Motion | Small focus/hover image zoom only, disabled under reduced motion. No hidden-on-scroll content, preloader, runtime 3D engine or autoplay media. |
| Scope | Public semantic color aliases are rebound inside public surfaces. Operational dashboard tokens and role guards were not replaced by the cinematic theme. |

## Assets

Five original renders were generated with the built-in image generator: hero, air, surface, packing and warehouse. They are conceptual imagery, not documentary evidence of an owned fleet or facility. The [manifest](../artifacts/cargo-2026/image-manifest.json) includes exact prompts, mode, original paths and public paths. PNG sources are preserved in `artifacts/cargo-2026/originals/`.

The delivered WebP files total 683,498 bytes before Next's responsive optimization; individual images range from 59,460 to 240,412 bytes. Only the homepage hero is preloaded. Fixed media containers prevent image-driven layout movement.

## Verification

| Check | Result |
| --- | --- |
| Production build | Passed, Next 16.2.11 / Turbopack, including TypeScript and route generation. |
| Standalone typecheck | Passed. |
| Scoped ESLint | Passed for public components, touched pages and frontend tests. |
| Stylelint | Passed. |
| Formatting | Passed for the public components, sign-in and frontend tests. |
| Existing public/access checks | 53 passed in development, including protected route/API denials. |
| Production frontend browser suite | 50 passed: 11 public/sign-in routes at 320/768/1440px; image loading, dark pages, focus restoration, reduced motion and native tracking submission. |
| Original media delivery | Five optimized assets, each below the 450KB image budget. |

Screenshots are in `docs/audit-evidence/cargo-2026-09-07/`. Build, lint and browser outputs are in `artifacts/cargo-2026/`. No messages were sent through the support or AI forms.

The subsequent editorial corrections name the feedback page accurately and label the footer link “Terms & conditions” to match its destination. They do not change the validated interactive flows.

## Local loading sample

After the browser suite finished, a fresh Edge context with browser cache disabled measured the final production build. The server and image optimizer had already been exercised. One sample per scenario is recorded in [production-loading.json](../artifacts/cargo-2026/production-loading.json).

| Scenario | LCP | Recorded layout shift | Load event | Same-origin script transfer |
| --- | ---: | ---: | ---: | ---: |
| Desktop, 1440 × 1000 | 964ms | 0 | 1183ms | 542660 bytes |
| Mobile, 390 × 844, 4Mbps / 40ms latency / 4× CPU slowdown | 1768ms | 0 | 4151ms | 507907 bytes |

These are local observations, not Lighthouse scores, field Core Web Vitals, interaction-latency certification or deployed performance guarantees. The global application runtime remains material to the total script transfer; deployed performance remains a release check.

Final visual captures: [desktop hero](audit-evidence/cargo-2026-09-07/hero-desktop.png), [mobile hero](audit-evidence/cargo-2026-09-07/hero-mobile-simulated-fast-4g.png), [complete desktop page](audit-evidence/cargo-2026-09-07/complete-desktop.png), and [complete mobile page](audit-evidence/cargo-2026-09-07/complete-mobile-simulated-fast-4g.png).

Earlier evidence in this pass: 53 existing development browser/access cases passed; all 14 new cases passed across the initial run and its targeted correction. Standalone typecheck, scoped ESLint and Stylelint passed. The final production build and browser checks cover the subsequent image sizing and navigation fallback refinements.

Observed intermediate issues are retained in the evidence:

- A no-JavaScript heading assertion assumed whitespace around a line break; it was corrected to match the accessible heading robustly.
- Playwright's no-JavaScript pointer action stalled while waiting for scroll stability in production. The native fallback is verified using implicit keyboard form submission; the JavaScript-enabled journey separately verifies the submit button.
- The first production preview used the development Arcjet placeholder and correctly returned 503. Restarting with the existing configured local key restored public rendering. No key was printed or changed.
- The local production perimeter reports missing trusted client-IP metadata. Public read-only pages follow the existing error policy; protected requests remain closed. This is not deployed perimeter acceptance.
- An in-app browser tab retained a stale connection-error document after the server restart. A fresh tab loaded the production preview successfully.

## Release boundary

This report verifies a local frontend implementation. It does not clear the broader production gates in [the project audit](nordic-lagom-audit-2026-09-07.md#open-release-gates): actual website origin/deployment configuration, multi-leg cargo lifecycle, schema/recovery baseline, authenticated staff/provider journeys and operational ownership.

The final build and preview explicitly disable the two test bypass flags. The existing `.env.local` file is preserved. No live support messages, staff sign-ins, hosted data mutations, source deletion, commit, push or deployment were performed in this frontend pass.
