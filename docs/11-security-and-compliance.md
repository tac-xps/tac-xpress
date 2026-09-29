# Security and compliance

## Perimeter and identity

`proxy.ts` is the Next.js perimeter. It applies Arcjet, protects dashboard navigation, hides test-only paths, and fails closed in production when its key is absent. Server actions and route handlers still enforce their own role, ownership, or integration checks.

### Matcher-Excluded Routes Protections
Several routes are excluded from the `proxy.ts` global matcher (`api/auth`, `api/cron`, `api/webhooks`, `api/public`, `ingest`, `_next`, `monitoring`) for performance or architectural reasons. They enforce their own protections:
- **`api/auth`**: Managed entirely by NextAuth, utilizing its built-in CSRF, state validation, and specific credential rate limits.
- **`api/cron`**: Protected by a strict `CRON_SECRET` bearer token check.
- **`api/webhooks`**: Enforces strict HMAC signature validation (e.g., `WHATSAPP_APP_SECRET`) on payloads and uses per-route Arcjet `slidingWindow` rate limits.
- **`api/public`**: Validates expiring document-purpose HMAC signatures (`x-internal-document-token`) and applies per-route Arcjet `slidingWindow` rate limits (e.g., PDF generation).
- **`ingest`**: Exclusively used by PostHog telemetry proxy.
- **`_next` / `monitoring`**: Static assets and Sentry tunnel; protections managed by Vercel and Sentry respectively.

## Data protection

- Service-role credentials remain server-only.
- The earlier hosted audit verified RLS on all 20 public tables; 19 had no ordinary Data API policies. Profiles used owner-only policies with client role edits prohibited. Recheck these privileges before release; the current redesign pass did not rerun every advisor. Service-role/owner queries require application authorization independently of RLS.
- Public tracking and documents return least-privilege projections or expiring signed URLs.
- Webhooks verify HMAC signatures before processing bodies.
- Logs and Sentry events must not include secrets, magic links, tokens, or unnecessary personal data.

## Operational controls

Use generic user-facing auth errors, current non-deleted staff roles and expiring document-purpose tokens, durable rate limiting for public abuse paths, audit records for material staff actions, and dependency review before release.

See [the current production audit](nordic-lagom-audit-2026-09-07.md) for verified repairs and outstanding controls. The earlier hosted audit found leaked-password protection disabled; recheck it before release. The old hosted migration baseline remains unreconciled.




