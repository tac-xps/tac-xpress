# WhatsApp relay guide

TAC-XPRESS uses WPBox/Lemin as the outbound relay. Configuration and template metadata live in `lib/whatsapp/config.ts`; sending, retries, dead-letter handoff, subscriber updates, and status correlation live in `lib/whatsapp/service.ts`.

## Requirements

- Configure relay credentials, Meta app secret, and verification token only in server-side environment variables.
- Verify Meta signatures in `app/api/webhooks/whatsapp/route.ts` before processing messages or statuses.
- Normalize phone numbers before send and record provider/Meta identifiers, template metadata, related AWB or ticket, and delivery state.
- Respect subscriber opt-out and the customer’s last inbound activity when deciding whether a proactive send is allowed.

## Failure handling

External-send failures are captured in the dead-letter path for replay and investigation. Do not retry by manually calling a provider endpoint from the browser; use the supported server workflow so logging and audit data stay consistent.
