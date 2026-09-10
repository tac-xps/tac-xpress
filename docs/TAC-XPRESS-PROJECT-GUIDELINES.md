# TAC-XPRESS contributor guidelines

## Build with the current stack

Use Next.js App Router, strict TypeScript, Tailwind CSS v4, Shadcn primitives, Drizzle, Supabase, Sentry, and pnpm. Prefer Server Components; add `"use client"` only when browser APIs or hooks are required. Use `proxy.ts`, not `middleware.ts`.

## Protect boundaries

Use shared dashboard guards for staff actions and APIs. Customers use public tracking and contact; customer business records require staff authorization. Keep service keys server-only. Validate webhook signatures and mutation input. Capture unexpected failures in Sentry.

## Design rules

Follow [DESIGN.md](./DESIGN.md) and [UI components](./06-ui-components.md). Use semantic tokens and existing Shadcn components. The dashboard sidebar remains sticky and full viewport height. People imagery must represent Northeast Indian/Asian people.

## Finish work well

Run the required checks, update active docs with behavior changes, add tests for sensitive workflows, and preserve unrelated user changes in a dirty worktree.

