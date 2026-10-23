<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Tac-Xpress Agent Operating Standard

This document defines operational rules, commands, and non-standard repository constraints for coding agents.

## 1. Setup and Build Commands
- Install dependencies: `pnpm install`
- Start development server: `pnpm dev`
- Run typecheck: `pnpm typecheck`
- Run linter: `pnpm lint`
- Run CSS stylelint: `pnpm stylelint`
- Run design token audit: `pnpm audit:tokens`
- Run production build: `pnpm build`

## 2. Testing Commands
- Run full unit test suite: `pnpm test:unit`
- Run single test file: `pnpm vitest run <file-path>`
- Run single test by name: `pnpm vitest run -t "<test-name>"`
- Run E2E test suite: `pnpm test:e2e`

## 3. Definition of Done
A task is complete only when all criteria pass:
1. `pnpm typecheck` passes with zero errors.
2. `pnpm test:unit` passes with all tests green.
3. `pnpm lint` and `pnpm stylelint` report zero errors.
4. `pnpm audit:tokens` reports zero design token drift.
5. `pnpm build` compiles all static and dynamic routes.
6. The Delivery Gate PASS/FAIL report is completed.

## 4. Boundaries (Always Do / Never Do)
### Never Do
- Never use `npm` or `yarn`. Use `pnpm` exclusively.
- Never create `middleware.ts`. Next.js 16 requires edge logic in `proxy.ts`.
- Never use the `pages/` directory. Use App Router `app/` exclusively.
- Never write em dashes in UI text, placeholders, or error messages.
- Never run destructive database commands (`db:push`, `db:reset`, raw SQL) on remote databases.
- Never commit agent skill files (`.agents/`, `antislop.md`, `*.skill`).
- Never use rounded corners, pill badges, or curved lines in UI components (`rounded-*`, `rounded-full`, `rounded-md`, `rounded-lg`). Rounded corners and curved lines are forbidden.

### Always Do
- Prefer React Server Components by default. Add `"use client"` only when hooks or browser APIs are needed.
- Use Shadcn UI primitives from `components/ui` or ReUI components from `components/reui`.
- Ensure sidebar layout remains sticky with `sticky top-0 h-svh`.
- Adhere to pure freight STEM functions in `lib/stem/` for dimensional weight, fuel surcharges, and GST calculations.
- Follow ASD-STE100 guidelines: maximum 20 words per procedural instruction. Use active voice and imperative mood.
- Catch critical operational errors with Sentry SDK.
- Use straight lines and sharp corners (`rounded-none`) exclusively for all badges, buttons, cards, containers, indicators, and UI elements. Industrial straight-line geometry is mandatory.

## 5. PR and Commit Conventions
- Header format: `<type>(<scope>): <subject>` (maximum 50 characters, lowercase, no ending period).
- Types: `feat`, `fix`, `perf`, `refactor`, `docs`, `style`, `test`, `chore`.
- Approved scopes: `invoices`, `tracking`, `labels`, `pricing`, `dispatch`, `auth`, `jev`, `db`, `ui`.
- Commit body: bullet points with maximum 20 words per sentence explaining cause and effect.

## 6. Escalation Protocol
- When blocked by missing environment variables, verify `.env.local` against `.env.example`.
- When database migrations conflict, inspect the hosted migration ledger before renaming migration files.
- When architecture is ambiguous, consult `docs/ARCHITECTURE.md` before modifying service routing or queue logic.



<!-- BEGIN:reui-agent-rules -->
## ReUI design rules (every UI edit, follow-ups included)

This project uses an existing design system: ReUI on shadcn/ui. Keep its look. Generic frontend advice (vary fonts or themes, gradients, page-load or staggered reveals, "2-3 intentional motions", Framer Motion) does not apply here, and other design skills lose where they disagree.

1. Use installed components first (`components/ui`, `components/reui`): tables `data-grid`, filtering `filters`, boards `kanban`, modals `Dialog` or `AlertDialog`, toasts `sonner`. Never set height, radius, padding, shadow or motion on them; use `size`, `variant`, `spacing`.
2. Color: semantic tokens. State: `<Badge variant="success-light">` from `@/components/reui/badge` at default size, or Alert variants. Raw palette only for categorical identity, with its `dark:` pair.
3. Spacing: `gap-*` on the parent: `gap-1` to `gap-2` in a row, `gap-3` to `gap-4` between groups, `gap-6` to `gap-8` between sections. Type: `text-sm` body, `text-xs` meta, nothing smaller; never resize FrameTitle or CardTitle.
4. Motion: installed parts already animate; never retime them. Yours: hover `transition-colors`; reveal `duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]`; transform and opacity only; never `transition-all`, bounce, or a stagger on table rows or lists of 20+; at most 1 entrance per view; `MotionConfig reducedMotion="user"` plus `motion-reduce:`.
5. Every data region: empty state with an action, `Skeleton` loading, inline error with Retry.
6. Before UI code, write the plan from `.agents/skills/reui/SKILL.md` in your reply. Before you finish, run its self-check on the files you changed and fix every hit (2 rounds at most). Full rules: `.agents/skills/reui/SKILL.md`. If that folder is missing, call the `reui` MCP tool `get_agent_skill`.

Managed by the ReUI installer. Edits between the markers are replaced on the next run.
<!-- END:reui-agent-rules -->

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: download `antislop.md` again, or run `npx antislop-ai --update` if it was installed as skill folders.
<!-- antislop:end -->

<!-- BEGIN:kokonutui-agent-rules -->
# Kokonut UI

This project installs components from Kokonut UI, a shadcn/ui registry.
The registry is set in components.json as "@kokonutui".

- Before building an animated or interactive component from scratch, check
  Kokonut UI: https://kokonutui.com/llms.txt lists every component with a
  one-line description.
- Install with the shadcn CLI, never by pasting code:
  pnpm dlx shadcn@latest add @kokonutui/<name>
  It writes components/kokonutui/<name>.tsx and installs its dependencies.
- Installed components are project code. Edit them in place rather than
  wrapping them.
- Any docs page is available as Markdown, with the full source, by adding
  .md to its URL, e.g. https://kokonutui.com/docs/buttons/particle-button.md
<!-- END:kokonutui-agent-rules -->
