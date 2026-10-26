# Hallmark Anti-AI-Slop Standard & Engineering Directive

Tac-Xpress enforces the Together AI Hallmark design methodology (`Nutlope/hallmark`) to eliminate generic AI-generated aesthetics, template convergence, and machine-made visual slop.

## 1. The Hallmark Floor (Non-Negotiable Invariants)

1. **Tokens at Root**: Every color and font must resolve through tokens declared at `:root` or `@theme` / `tokens.css`. No literal color or `font-family` past token definitions (Gate 48).
2. **Strict Property Transitions**: Never use `transition: all`. Never animate `width`, `height`, `top`, or `left`. Animate exclusively `transform` and `opacity`, or use `transition-colors` (Gate 10a).
3. **No Italic Hacks**: Never set one italic word inside an otherwise roman heading (Gate 38i).
4. **Viewport Clipping**: `overflow-x: clip` is mandatory on both `html` and `body`. Never use `overflow-x: hidden` or `width: 100vw` (Gate 34).
5. **Robust Grid Tracks**: Image-bearing grid tracks must use `minmax(0, 1fr)`. Display headings must carry `overflow-wrap: break-word; min-width: 0` (Gate 50).
6. **Instant Focus**: Every interactive element must have `:focus-visible`, appearing instantly without lag (Gate 26a, 15).
7. **Accessibility & Reduced Motion**: All motion must respect `prefers-reduced-motion: reduce`. Content must be completely visible without scripting (Gate 27, 62).
8. **Truthful Evidence**: Never invent metrics, testimonials, logo walls, or customer case counts (Gate 46a).
9. **Zero Eyebrow Reflex**: Never place short inert labels or ordinal category tags stacked over a heading (Gate 54). Open sections directly with the heading or semantic statement.
10. **Zero Tracked-Caps Labels**: Labels, captions, table headers, tags, chips, and nav links must be set in the body face, sentence or lower case, untracked (`tracking-normal`). Tracked uppercase (`uppercase tracking-wider text-xs`) is forbidden as an AI tell (Gate 67).
11. **Zero Template Punctuation**: Never join strings with middle dots (`A · B · C`). Never glue arrows to link text (`Link →`). Never place decorative status dots before plain labels (Gate 63).
12. **Single Containment Layer**: Never nest cards inside cards (`bg-card` inside `bg-card`) (Gate 4).
13. **Calm Surfaces**: Never use purple-to-blue gradients, mesh/aurora blooms, or emoji icons (Gate 2a, 29, 30a).
14. **Screen Word Budget**: Maximum ~80 words per 900px viewport. The hero consists of a headline (<=7 words), one sentence (<=12 words), and actions (Gate 58).
15. **Centered & Capped Grid**: Container max width is capped (`max-w-6xl` or `max-w-7xl`). At 1920px, gutters expand while grids hold their measure (Gate 44d).
16. **Monospace Discipline**: Monospace (`font-mono`) is reserved strictly for actual code, AWB consignment numbers, numerical telemetry, IATA airport codes, and coordinates. Monospace is forbidden as a costume for plain text labels (Gate 64).

## 2. Sloplint Verification

Run Hallmark's static gate verification before any delivery:
```bash
node .agents/skills/hallmark/scripts/sloplint.mjs <target-files>
```
All Floor gates must report 0 `FAIL`. All Reflex gates must be resolved or justified.
