# Authentication and Authorization

## Dual-Auth Model

Tac-Xpress deliberately uses two authentication flows:

- Internal dashboard users authenticate with NextAuth credentials at `/signin`.
- Customer portal users authenticate with Supabase-generated email links and the signed `portal_session` cookie.

Do not merge these flows implicitly. They protect different surfaces and use different session material.

## Dashboard Auth

Entry points:

- `/signin`
- `/api/auth/*`

Implementation:

- `auth.config.ts`
- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`

Rules:

- `AUTH_SECRET` is the canonical secret in production.
- `NEXTAUTH_SECRET` is only a compatibility alias.
- Production now fails closed when neither is configured.
- Credentials authenticate against Supabase Auth and then attach the app role from the `users` table.

Authorization:

- `proxy.ts` redirects unauthenticated dashboard requests to `/signin`.
- `requireDashboardSession`, `requireDashboardAction`, and `requireDashboardApi` guard server components, actions, and routes.
- Customer-role users are redirected away from dashboard routes.

## Portal Auth

Entry points:

- `/portal`
- `/auth/callback`
- `app/actions/auth.ts`
- `app/actions/portal-auth.ts`

Rules:

- `PORTAL_SESSION_SECRET` signs the `portal_session` cookie.
- Portal sessions last 24 hours.
- Portal access is verified against AWB plus customer email.
- The login endpoint returns the same failure message for not-found and email-mismatch cases to reduce enumeration risk.

## Public Auth-Adjacent Flows

- Landing page ticket submission is anonymous but rate limited.
- Public tracking is anonymous but constrained to rows marked publicly trackable.
- Signed invoice PDF generation uses HMAC signatures and never returns raw server errors to clients.

## Operational Guidance

- Use NextAuth for staff and admin workflows only.
- Use Supabase link-based flows for customer portal access.
- Never expose raw provider, database, or stack errors from auth routes.
- Keep auth secrets and portal secrets distinct.
