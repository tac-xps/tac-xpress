# Frontend skill toolkit and focused UI audit

Date: 4 November 2026. Application: `tac-xps/tac-xpress`. Local root: `C:\tac-xpress`.

## Repository separation and installation

The connected GitHub MCP read the application repository and the external skill repositories. It did not install skills or change GitHub content. Codex's skill installer copied the selected skills into `C:\Users\stack\.codex\skills`; the application repository remains separate. New sessions can discover these installed skills.

| Investigated source | Skill and installation reference | Decision |
| --- | --- | --- |
| [UI UX Pro Max](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | `.claude/skills/ui-ux-pro-max/SKILL.md`; upstream CLI: `uipro init --ai codex`. Codex installer: `install-skill-from-github.py --repo nextlevelbuilder/ui-ux-pro-max-skill --path .claude/skills/ui-ux-pro-max`. | Installed globally. Its searchable UX guidance adds targeted research. Existing `DESIGN.md` and ReUI still govern the product. |
| [Anthropic Frontend Design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | `skills/frontend-design/SKILL.md`; the upstream README documents Claude plugin installation. Codex can install this directory with its skill installer. | Skipped. Its visual direction overlaps the existing Hallmark, antislop, and ReUI rules. |
| [Design Taste Frontend](https://github.com/Leonxlnx/taste-skill) | `skills/taste-skill/SKILL.md`; upstream: `npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"`. Codex's installer can copy the skill directory. | Skipped. Its dealt palettes, compositions, and app styles conflict with the established design authority for this refinement. |
| [Improve UI](https://github.com/ibelick/ui-skills) | `skills/improve-ui/SKILL.md`; Codex installer: `install-skill-from-github.py --repo ibelick/ui-skills --path skills/improve-ui`. | Installed globally for future read-only audits. Its own instructions prohibit source edits, so it was not invoked for this implementation. |
| [Frontend UI Engineering](https://github.com/addyosmani/agent-skills) | `skills/frontend-ui-engineering/SKILL.md`; upstream: `npx skills add addyosmani/agent-skills --skill frontend-ui-engineering`. Codex installer can copy the skill directory. | Installed globally. Use its accessibility and verification guidance only where it agrees with ReUI and repository rules. |
| [Browser Testing with DevTools](https://github.com/addyosmani/agent-skills/tree/main/skills/browser-testing-with-devtools) | `skills/browser-testing-with-devtools/SKILL.md`; upstream per-skill Skills CLI installation. Requires Chrome DevTools MCP. | Skipped. This checkout already has Playwright browser tests; Chrome DevTools MCP is not configured. |

The [OpenAI skills repository](https://github.com/openai/skills) now marks itself deprecated and points to current Codex skill and plugin guidance. The built-in Codex skill installer was used here. The GitHub MCP connection was already active and successfully read both the application and external repositories; no extra repository connection was made.

## Focused audit and refinement

Audited surface: the live public homepage navigation at `http://localhost:3000/`. The local browser rendered its desktop navigation and booking link. Source tracing showed `LogisticsHome` imports `LandingNav`, which renders the installed Kokonut `MorphicNavbar`. Both the desktop anchor handler and the mobile booking handler explicitly requested smooth scrolling, bypassing reduced-motion preference. This was also identified as UI-09 in the earlier source audit.

The correction changes those two calls to use immediate scrolling when `prefers-reduced-motion: reduce` matches. Standard motion keeps smooth scrolling. No layout, component styling, route, pricing, freight calculation, or data path changed. The edit is limited to `components/kokonutui/morphic-navbar.tsx` and `components/public/landing/landing-nav.tsx`.

Other earlier audit findings require their own current runtime and source checks. In particular, the mobile drawer's modal focus behavior and the homepage's operational claims are not cleared by this change.

## Verification and delivery gate

The browser reached the booking section from the desktop navigation, with no captured console errors. A Chromium regression test emulated reduced motion and verified immediate scrolling from desktop Features and mobile Book Consignment. The focused test passed (1/1). `git diff --check` passed for the changed UI files. The ReUI C1-C4 scan found no new prohibited structure, state color, or motion pattern. The ReUI audit checklist found no new component or API to validate.

**Delivery gate: PASS for this local navigation change.** `pnpm verify` exited 0: typecheck, lint (0 errors, 75 warnings), stylelint, token audit (0 violations), 505 unit tests, and the production build passed. The one focused Chromium test passed. Production or staging readiness is outside this local UI check.

An optional Prettier check reports all three touched source files. The same check reports their `HEAD` versions, so the existing formatting is outside this surgical change.
