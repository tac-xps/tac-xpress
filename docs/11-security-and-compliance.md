# Security and Compliance

## Perimeter

- `proxy.ts` is the only request perimeter for Next.js 16.
- Production fails closed when `ARCJET_KEY` is unset or still a placeholder.
- Server Actions bypass Arcjet body parsing only where required for Next.js action semantics.

## Secret Handling

- `AUTH_SECRET` is the canonical dashboard auth secret.
- `PORTAL_SESSION_SECRET` signs customer portal cookies.
- `INVOICE_PDF_SIGNING_SECRET` signs public invoice PDF access.
- `WHATSAPP_APP_SECRET` verifies Meta webhook payloads.
- `WHATSAPP_VERIFY_TOKEN` is used only for Meta GET challenge verification.

## Error Handling

- Public and auth-facing routes must never return raw `message`, `stack`, or provider payloads.
- Diagnostics belong in Sentry or server logs, not client JSON responses.
- Portal-facing actions must return generic customer-safe errors.

## Ticket and Data Contracts

- `tickets.category` is reserved for canonical triage categories.
- `tickets.intake_category` preserves the original channel label.
- Repeated WhatsApp customer messages append to an active ticket instead of creating unlimited duplicate threads.

## Webhook Security

- WhatsApp webhook POST requests require a valid `x-hub-signature-256` HMAC signature.
- Invalid signatures return `403`.
- Invalid or missing secrets return `401`.

## Public Data Exposure Rules

- Public tracking only returns rows flagged as publicly trackable.
- Portal invoice downloads must verify the authenticated portal email matches the invoice owner.
- Dashboard data must stay behind NextAuth and role-aware guards.

## Operational Controls

- Use `WHATSAPP_ENABLED` as the outbound kill switch.
- Use Sentry for critical exception capture.
- Keep the dead-letter queue enabled for failed external side effects.
