# Developer Experience Setup

This document outlines the tools, configuration, and workflows established for the TAC-XPRESS engineering team.

## Architecture & Structure
- **`app/`**: Next.js App Router components (Pages, Layouts).
- **`components/`**: Reusable UI elements (Shadcn, generic).
- **`features/`**: Domain-specific logic, grouping components, hooks, and services by feature.
- **`actions/`**: Typed server actions (`next-safe-action`).
- **`hooks/`**: Custom React hooks.
- **`providers/`**: Context providers (e.g., PostHog, Themes).
- **`lib/`**: Generic utilities (e.g., `sanitize.ts`).
- **`tests/`**: Unit and E2E tests.
- **`stories/`**: Storybook components.
- **`mocks/`**: MSW mock API handlers.
- **`monitoring/`**: Custom Sentry/PostHog wrappers or dashboards.

## Local Development Workflow
1. `pnpm install`
2. `pnpm run dev` to start the Next.js server.
3. `pnpm run storybook` to launch the component sandbox.

## Testing Workflow
- **Unit**: `pnpm run test:unit` (Vitest + RTL).
- **E2E**: `pnpm run test:e2e` (Playwright).
- **Accessibility**: `pnpm run test:a11y` (Axe-Core via Playwright).

## Quality Gates (Husky)
On `git commit`, Husky runs:
1. `commitlint` to enforce Conventional Commits.
2. `lint-staged` to format and lint staged files via ESLint, Stylelint, and Prettier.

## Monitoring & Security
- **Sentry**: Captures runtime frontend/backend errors. Ensure `NEXT_PUBLIC_SENTRY_DSN` is set.
- **PostHog**: Tracks analytics and session replay. Ensure `NEXT_PUBLIC_POSTHOG_KEY` is set.
- **Arcjet**: Protects routes using bot detection and rate limiting via `middleware.ts`.
- **DOMPurify**: Sanitizes user-generated HTML in `lib/sanitize.ts`.

## Troubleshooting
If builds fail due to typing in tests, ensure all `@types/*` are correctly resolved and Vitest types are in `tsconfig.json`.
