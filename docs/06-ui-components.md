# UI components and visual QA

## Component model

Tailark Veil supplies the public section patterns; `components/ui` contains official shadcn Radix primitives. [UI-SOURCES.md](UI-SOURCES.md) records exact adaptations. Use those primitives before creating custom substitutes. Domain compositions belong beside their domain: logistics status and tracking in `components/logistics`, operational tables in their dashboard feature, and shell/navigation in the shared application shell.

## Nordic Lagom workspace rules

- Use semantic tokens such as `bg-card`, `text-muted-foreground`, and `border-border`; do not introduce raw palette colors for product UI.
- Prefer `gap-*` for layout, 6px control radius, 8px card radius, and 12px overlay radius.
- Use opaque cards, hairline borders, restrained shadows, and sentence-case labels.
- Use `Badge` variants for semantic operational status. Do not hand-roll status pills.
- Use `Empty`, `Skeleton`, `Alert`, `sonner`, `Dialog`, `Sheet`, and `Field` primitives rather than lookalike markup.

## Required states

Every shared primitive or domain composition documents and tests: default, hover/focus, disabled, loading, empty, error, compact mobile, and dark mode. Form controls expose `aria-invalid`; dialogs and sheets have accessible titles; icon-only buttons have labels.

## Storybook

Stories live in `stories/` or beside the component when the feature needs local fixtures. Storybook is the visual contract for reusable primitives; Chromatic review is required for intentional baseline changes. Run:

```bash
pnpm storybook
pnpm build-storybook
```

## Dashboard patterns

Use dense, scannable tables with mono identifiers, tabular numbers, stable row height, filter state in URLs where appropriate, and explicit empty/loading/error treatments. The sticky sidebar remains `sticky top-0 h-svh`; responsive operation pages preserve 44px targets.


