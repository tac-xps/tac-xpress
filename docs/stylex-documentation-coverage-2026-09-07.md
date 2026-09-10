# StyleX documentation coverage

Reviewed 7 September 2026. Every row represents a retrieved and read article. Assessment and adoption decision: [StyleX assessment](stylex-assessment-2026-09-07.md).

| Page | Review focus / project implication |
| --- | --- |
| [Introduction](https://stylexjs.com/docs/learn) | Atomic extraction, conditional composition and reusable component fit; no app-specific performance assumption. |
| [API Reference](https://stylexjs.com/docs/api) | Configuration, JavaScript APIs and static type index cross-checked against the navigation. |
| [Thinking in StyleX](https://stylexjs.com/docs/learn/thinking-in-stylex) | Local ownership, deterministic longhand resolution, composition cost and CSS loading tradeoffs. |
| [Installation](https://stylexjs.com/docs/learn/installation) | Runtime/compiler/linter responsibilities; extraction must be present once at the root. |
| [Create StyleX App](https://stylexjs.com/docs/learn/installation/create) | Scaffolding options and official templates; unnecessary for this existing checkout. |
| [Next.js](https://stylexjs.com/docs/learn/installation/nextjs) | Babel plus PostCSS, next/babel, aliases and extraction; Turbopack support from 16.0.3. |
| [Bun](https://stylexjs.com/docs/learn/installation/bun) | Bun production esbuild adapter requires metadata; development has a dedicated plugin. |
| [Vite](https://stylexjs.com/docs/learn/installation/vite) | CSS entry, virtual CSS and hot reload runtime; component-entry frameworks need explicit handling. |
| [Vite + React](https://stylexjs.com/docs/learn/installation/vite/vite-react) | Plugin before React for Fast Refresh; append extracted styles to emitted CSS. |
| [Vite + React Server Components](https://stylexjs.com/docs/learn/installation/vite/vite-rsc) | Separate RSC, SSR and client environments; each receives aggregated styles. |
| [React Router (RSC)](https://stylexjs.com/docs/learn/installation/vite/react-router) | React Router RSC plugin ordering and development CSS helper; not this router. |
| [SvelteKit](https://stylexjs.com/docs/learn/installation/vite/sveltekit) | SvelteKit plugin enforcement and head stylesheet; no applicable app migration. |
| [RedwoodSDK](https://stylexjs.com/docs/learn/installation/vite/redwoodsdk) | Worker/client environments need persisted CSS rules and framework-owned injection. |
| [Waku](https://stylexjs.com/docs/learn/installation/vite/waku) | CSS-only development and persisted multi-environment rules with React compiler setup. |
| [Webpack](https://stylexjs.com/docs/learn/installation/webpack) | Babel loader and CSS extraction plugin must cooperate with unplugin. |
| [Rspack](https://stylexjs.com/docs/learn/installation/rspack) | Rspack CSS extractor, JS loader and unplugin integration. |
| [Esbuild](https://stylexjs.com/docs/learn/installation/esbuild) | Build metadata lets extraction locate the CSS output. |
| [PostCSS](https://stylexjs.com/docs/learn/installation/postcss) | Separate JS transform and CSS generation; shared Babel config, discovery and caching. |
| [CLI](https://stylexjs.com/docs/learn/installation/cli) | Pre-transform source directories with JSON/JSON5 configuration; extra pipeline stage. |
| [Defining styles](https://stylexjs.com/docs/learn/styling-ui/defining-styles) | Static analyzability, required defaults, pseudo states/elements and constrained dynamic functions. |
| [Using styles](https://stylexjs.com/docs/learn/styling-ui/using-styles) | Same-property application order, longhand precedence, variants, arrays and null unsetting. |
| [Defining variables](https://stylexjs.com/docs/learn/theming/defining-variables) | Named token exports, direct module rules, custom names, derived variable dependency checks. |
| [Using variables](https://stylexjs.com/docs/learn/theming/using-variables) | Token imports reference CSS identifiers; they are not ordinary JavaScript values. |
| [Creating themes](https://stylexjs.com/docs/learn/theming/creating-themes) | Subtree themes; unspecified values documented as resetting, contrary to another recipe. |
| [Types for Variables](https://stylexjs.com/docs/learn/theming/variable-types) | CSS @property typing differs from TypeScript; advanced animation and calculation uses. |
| [Variants](https://stylexjs.com/docs/learn/recipes/variants) | Variant maps and condition composition; retained equivalent existing CVA ownership. |
| [Context-driven styles](https://stylexjs.com/docs/learn/recipes/context-driven-styles) | Context avoids prop drilling; useful concept already present in Radix/sidebar state. |
| [Variables for descendant styles](https://stylexjs.com/docs/learn/recipes/descendant-styles) | Ancestor variables let descendants explicitly consume state-derived values. |
| [Reset Theme](https://stylexjs.com/docs/learn/recipes/reset-themes) | Empty theme resets a group according to this page; verify against overrides recipe. |
| [Merge Themes](https://stylexjs.com/docs/learn/recipes/merge-themes) | Same-group themes are documented as mutually exclusive; compose source constants instead. |
| [Light and Dark Themes](https://stylexjs.com/docs/learn/recipes/light-dark-themes) | Light/dark/system themes or light-dark() with color-scheme and browser limits. |
| [Theme overrides](https://stylexjs.com/docs/learn/recipes/shareable-tokens) | Partial nested inheritance and env merging conflict with other theme/API guidance. |
| [Static types](https://stylexjs.com/docs/learn/static-types) | Allowed property/value contracts, exclusion contracts and TypeScript limitations. |
| [@stylexjs/babel-plugin](https://stylexjs.com/docs/api/configuration/babel-plugin) | Style resolution, aliases, test/debug modes, token retention and layer ordering. |
| [@stylexjs/eslint-plugin](https://stylexjs.com/docs/api/configuration/eslint-plugin) | Compiler is forgiving; validity, unused styles, shorthand, extension and token limits matter. |
| [@stylexjs/unplugin](https://stylexjs.com/docs/api/configuration/unplugin) | Bundler adapters, emitted assets, cascade positioning, virtual modules and dependency handling. |
| [@stylexjs/postcss-plugin](https://stylexjs.com/docs/api/configuration/postcss-plugin) | Include/exclude precedence, source discovery, cwd, Babel alignment and layer/debug options. |
| [stylex.create](https://stylexjs.com/docs/api/javascript/create) | Compile static namespaces and constrained dynamic definitions. |
| [stylex.props](https://stylexjs.com/docs/api/javascript/props) | Convert composition to React props; JSX shorthand only targets lowercase host elements. |
| [stylex.attrs](https://stylexjs.com/docs/api/javascript/attrs) | Non-React class and serialized style attributes; unnecessary for React components here. |
| [stylex.defineConsts](https://stylexjs.com/docs/api/javascript/defineConsts) | Compile-time shared constants; no runtime themeability and specific module export rules. |
| [stylex.defineVars](https://stylexjs.com/docs/api/javascript/defineVars) | Hashed or stable CSS custom properties; derived values evaluated during compilation. |
| [stylex.createTheme](https://stylexjs.com/docs/api/javascript/createTheme) | Create a theme from a variable group and apply it at an element boundary. |
| [stylex.when.*](https://stylexjs.com/docs/api/javascript/when) | Marker-based ancestors, descendants and siblings; attribute states and priority order. |
| [stylex.env.*](https://stylexjs.com/docs/api/javascript/env) | Experimental compile-time environment; declaration/config agreement is not checked. |
| [@stylexjs/atoms](https://stylexjs.com/docs/api/javascript/atoms) | Inline atom syntax, static/dynamic composition; missing compilation throws at runtime. |
| [stylex.keyframes](https://stylexjs.com/docs/api/javascript/keyframes) | Keyframe extraction, deduplication and variable-based sharing between files. |
| [stylex.viewTransitionClass](https://stylexjs.com/docs/api/javascript/viewTransitionClass) | View-transition pseudo-element classes; media-query support currently absent in definitions. |
| [stylex.positionTry](https://stylexjs.com/docs/api/javascript/positionTry) | Anchor-position fallback rules limited to allowed positioning and sizing properties. |
| [stylex.firstThatWorks](https://stylexjs.com/docs/api/javascript/firstThatWorks) | Ordered fallback values; first browser-supported value takes effect. |
| [stylex.types.*](https://stylexjs.com/docs/api/javascript/types) | CSS @property helpers for color, length, numeric, temporal and transform types. |
| [StyleXStyles&lt;&gt;](https://stylexjs.com/docs/api/types/StyleXStyles) | Accept nested styles and falsy conditions; constrain known properties with TS caveats. |
| [StyleXStylesWithout&lt;&gt;](https://stylexjs.com/docs/api/types/StyleXStylesWithout) | Exclude selected layout/style properties from an extension contract. |
| [StaticStyles&lt;&gt;](https://stylexjs.com/docs/api/types/StaticStyles) | Forbid dynamic inline styles while retaining nested static composition. |
| [Theme&lt;&gt;](https://stylexjs.com/docs/api/types/Theme) | Theme typing and optional nominal identity for a particular variable group. |
| [VarGroup&lt;&gt;](https://stylexjs.com/docs/api/types/VarGroup) | Token-group shape, constrained values and optional distinct nominal identities. |
| [LLM Resources](https://stylexjs.com/docs/llm-resources) | Installation/authoring guides cross-read with specific APIs; examples need ESM/pnpm adaptation. |
| [Ecosystem](https://stylexjs.com/docs/ecosystem) | Third-party integrations and tooling listed; no unreviewed converter added to the app. |
| [Acknowledgements](https://stylexjs.com/docs/acknowledgements) | Project contributors and antecedents; no implementation dependency. |
