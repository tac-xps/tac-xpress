<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Tac-Xpress Agent IDE Rules

This file provides the core guidelines and context for AI agents working in this repository. 

## 1. Core Stack
- **Framework:** Next.js (App Router, Server Components default)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4, Shadcn UI
- **Database:** Supabase & Drizzle ORM
- **Error Tracking:** Sentry SDK

## 2. Next.js App Router Conventions
- Prefer React Server Components (RSC) by default.
- Only add `"use client"` at the top of a file when hooks (`useState`, `useEffect`) or browser APIs are strictly required.
- Do NOT use `pages/` directory routing; stick to `app/`.
- Do NOT use `middleware.ts`. Next.js 16 requires the `proxy.ts` file convention. All edge interception logic must go in `proxy.ts` exporting a `proxy` function.

## 3. UI and Component Guidelines
- We use **Shadcn UI**. Do not build complex primitive components from scratch if a Shadcn component exists. Use `npx shadcn@latest add [component]` or the agent shadcn skills.
- The sidebar layout should always be sticky and full viewport height (`sticky top-0 h-svh`).
- Tailwind CSS v4 is used. Reference `.agents/skills/tailwind-4-docs` for breaking changes and new variants.

## 4. Workflows & State
- **Sentry Integration:** All critical errors must be caught and logged via Sentry. Sentry source maps are handled by the Next.js Webpack plugin natively. 
- Always ensure `.env.local` variables are present before initiating background test processes.

## 5. Development Workflow (For Agents)
- Check `.agents/skills` for existing capabilities (e.g., Sentry setup, Gstack QA) before writing generic bash scripts.
- Use `pnpm` exclusively. Avoid `npm` or `yarn`.
- When doing major restructuring, always generate an `implementation_plan.md` artifact and request user approval before deleting source files.

## 6. Architecture & Subsystems
- **System Map:** See `docs/ARCHITECTURE.md` for a comprehensive breakdown of the WhatsApp Meta API integration, Supabase Auth (Magic Links), Resend Email notification pipeline, and the AI Triage + Auto-Responder engines. Always read this file before modifying support, routing, or messaging logic.
