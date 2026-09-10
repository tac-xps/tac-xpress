# Security and compliance

## Perimeter and identity

`proxy.ts` is the Next.js perimeter. It applies Arcjet, protects dashboard navigation, hides test-only paths, and fails closed in production when its key is absent. Server actions and route handlers still enforce their own role, ownership, or integration checks.

## Data protection

- Service-role credentials remain server-only.
- The earlier hosted audit verified RLS on all 20 public tables; 19 had no ordinary Data API policies. Profiles used owner-only policies with client role edits prohibited. Recheck these privileges before release; the current redesign pass did not rerun every advisor. Service-role/owner queries require application authorization independently of RLS.
- Public tracking and documents return least-privilege projections or expiring signed URLs.
- Webhooks verify HMAC signatures before processing bodies.
- Logs and Sentry events must not include secrets, magic links, tokens, or unnecessary personal data.

## Operational controls

Use generic user-facing auth errors, current non-deleted staff roles and expiring document-purpose tokens, durable rate limiting for public abuse paths, audit records for material staff actions, and dependency review before release.

See [the current production audit](nordic-lagom-audit-2026-09-07.md) for verified repairs and outstanding controls. The earlier hosted audit found leaked-password protection disabled; recheck it before release. The old hosted migration baseline remains unreconciled.




