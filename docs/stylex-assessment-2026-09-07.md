# StyleX assessment and compact square UI

Reviewed 7 September 2026 against the live official documentation and this checkout: Next.js 16.2.11 App Router, React 19.2.4, Tailwind CSS 4, shadcn Radix/CVA and Tailark compositions.

## Decision and implementation

Keep Tailwind and shadcn as the styling and component system. StyleX is technically compatible with this Next.js version, but it is a compiler and style-composition system, not a component/block library. Introducing it would not replace the accessible behavior supplied by Radix, nor make Tailark blocks work without adaptation. This change needs a coherent shape and density contract, which the existing tokens and component variants can provide.

Implemented:

- Zero radius tokens across the entire existing Tailwind radius scale and the shadcn root radius. Corrected local pill/pixel utilities instead of applying a universal important override.
- Square controls, cards, badges, avatar frames, overlays, chart bars, map popup/control frames and printed manifest labels. Icon outlines, geographic accuracy circles and illustration geometry remain meaningful graphics.
- Shared button heights of 24/28/32/36px for extra-small/small/default/large; corresponding icon sizes. Removed the mobile rule that forced every size to 44px.
- Reduced public primary actions from 48–56px to 36px. Compacted sign-in, customer selectors, pricing actions, scanner actions and sidebar navigation; paired inputs remain aligned with their actions.
- Preserved semantic status colors, readable text, native forms, reduced motion, focus rings and typed variant APIs. No new runtime, compiler, client boundary or dependency was added.

## What the documentation establishes

**Compilation and composition.** StyleX extracts atomic CSS ahead of time. Locally resolvable style applications can compile away; composition across component boundaries retains a small merge runtime. Identical declarations can deduplicate. This is a promising design-system approach, but its performance claims do not establish that migrating this particular app would reduce its bundle. That requires an actual before/after build. [Introduction](https://stylexjs.com/docs/learn), [Thinking in StyleX](https://stylexjs.com/docs/learn/thinking-in-stylex).

**Predictable ownership.** Styles belong with the component applying them. Later applications of the same property win, while the default property-specificity mode gives longhands precedence over shorthands. Existing `cn`/Tailwind merging is not interchangeable with `stylex.props`. Our practical improvement is to let Button own its size scale and eliminate competing call-site dimensions. [Using styles](https://stylexjs.com/docs/learn/styling-ui/using-styles), [Babel options](https://stylexjs.com/docs/api/configuration/babel-plugin).

**Static and dynamic values.** Style definitions must be statically analyzable. Runtime values use constrained arrow functions that emit CSS custom properties; ordinary variants should remain static. Conditions require a default branch. `null` removes an earlier applied property and is not a useful non-default condition. Imported token references must follow the compiler's supported module rules. Existing shipment state and button variants do not need runtime-generated styles. [Defining styles](https://stylexjs.com/docs/learn/styling-ui/defining-styles).

**Tokens and themes.** `defineConsts` inlines static shared values, while `defineVars` creates themeable CSS variables. Named exports live in supported `.stylex.*` files and must be imported directly. Stable custom variable names are possible, but give up collision protection. Typed CSS variables generate `@property`; those are distinct from TypeScript prop constraints. These distinctions would matter in any future migration of the public, inverse, accent and staff themes. [Defining variables](https://stylexjs.com/docs/learn/theming/defining-variables), [Constants API](https://stylexjs.com/docs/api/javascript/defineConsts), [Types for variables](https://stylexjs.com/docs/learn/theming/variable-types).

**Next.js integration.** The official setup uses the runtime plus Babel and PostCSS plugins, the `next/babel` preset, a single CSS extraction directive, aligned aliases and appropriate include globs. The guide explicitly supports both Webpack and Turbopack from Next.js 16.0.3. Production runtime injection should remain disabled; tree-shake compensation protects token imports. This app also has a separate Storybook pipeline, which would need the same compilation contract. [Next.js installation](https://stylexjs.com/docs/learn/installation/nextjs), [PostCSS configuration](https://stylexjs.com/docs/api/configuration/postcss-plugin).

**Coexistence needs a policy.** StyleX plugins support named cascade layers positioned before or after other layers. Unlayered CSS still outranks normal layered declarations. The app currently has Tailwind layers plus scoped public rules and vendor map CSS. Combining style spreads with independent class/style props risks overwriting one set; a migration must define a single composition owner per element. We corrected the existing sources rather than adding another precedence system. [Unplugin options](https://stylexjs.com/docs/api/configuration/unplugin), [Authoring guide](https://stylexjs.com/docs/llm-resources).

**Type and lint boundaries.** The compiler can accept invalid styles, so the documented lint rules remain necessary. `StyleXStyles` can constrain allowed properties and values; `StyleXStylesWithout` blocks selected ones; `StaticStyles` disallows dynamic inline styles. TypeScript's structural typing still has documented unknown-key limitations. Theme and variable-group types can use nominal identities. None of these APIs alone proves accessibility or business correctness. [Static types](https://stylexjs.com/docs/learn/static-types), [ESLint configuration](https://stylexjs.com/docs/api/configuration/eslint-plugin).

**Interactions and browser features.** Context and marker-based relational selectors support state-dependent styling without arbitrary descendant rules. The existing Radix state attributes and context already supply those states here. Keyframes, view-transition classes, anchor-position fallbacks and ordered CSS fallbacks are available, but none is needed to reduce control size. Adding animation would not improve shipment operations, and the view-transition API page currently excludes media queries within those definitions. [Relational selectors](https://stylexjs.com/docs/api/javascript/when), [View transitions](https://stylexjs.com/docs/api/javascript/viewTransitionClass), [Position fallbacks](https://stylexjs.com/docs/api/javascript/positionTry).

## Documentation discrepancies worth resolving before adoption

1. **Theme inheritance:** Creating themes, Reset Theme and Merge Themes say unspecified variables return to defaults and themes for one group do not merge. Theme overrides instead describes unspecified variables inheriting through nested themes. Do not assume these are equivalent; verify the exact pinned compiler output with nested dark/accent fixtures before adopting. [Creating themes](https://stylexjs.com/docs/learn/theming/creating-themes), [Reset Theme](https://stylexjs.com/docs/learn/recipes/reset-themes), [Merge Themes](https://stylexjs.com/docs/learn/recipes/merge-themes), [Theme overrides](https://stylexjs.com/docs/learn/recipes/shareable-tokens).
2. **Evolving authoring constraints:** Older conceptual guidance says styles live apart from markup and variable files only export variables. The current Atoms and Constants APIs explicitly add inline atoms and shared constants. Read the relevant API alongside broad conceptual guidance. Atoms throw if their compile-time transform is missing. [Atoms](https://stylexjs.com/docs/api/javascript/atoms), [Constants](https://stylexjs.com/docs/api/javascript/defineConsts).
3. **Experimental configuration:** `env` is explicitly experimental; its TypeScript declaration does not verify agreement with Babel configuration. Its API describes pure functions returning strings/numbers while the Theme overrides recipe uses an object-returning merger. Avoid making it the production token authority without a pinned-version compiler check. [Environment API](https://stylexjs.com/docs/api/javascript/env), [Theme overrides](https://stylexjs.com/docs/learn/recipes/shareable-tokens).
4. **Examples require adaptation:** Installation snippets vary by bundler. Esbuild/Bun need output metadata; Vite framework pages differ in plugin order and hot-reload plumbing; PostCSS can discover dependencies or use explicit globs. The LLM quick guide is not a substitute for the specific Next.js and plugin references. This repository uses pnpm and ESM configuration, so package-manager and CommonJS snippets cannot be pasted indiscriminately.

## Future migration acceptance criteria

A future StyleX experiment should start with one isolated, representative component and its Storybook story, with pinned package versions. Confirm server-rendered CSS with JavaScript disabled, production extraction, HMR, portal themes, keyboard states, Radix attributes, dark/inverse/accent nesting and deterministic Tailwind interoperability. Compare emitted CSS/JS size, build time and browser rendering before widening adoption. Do not replace shadcn/Radix behavior or Tailark section content as part of the styling experiment.

## Review coverage

The companion coverage table records all 59 pages linked by the documentation navigation: the complete Learn and API sections plus LLM resources, ecosystem and acknowledgements. The actual article bodies were retrieved and read; this is not only a link inventory. Blog archives, playground applications and third-party linked projects are outside this documentation review. See [the page-by-page coverage](stylex-documentation-coverage-2026-09-07.md).

## Verification

Validation results and local evidence are recorded in [the square UI verification report](square-ui-verification-2026-09-07.md). These changes do not close the separate authenticated staging, provider, recovery or deployment acceptance gates from the project audit.
