# WhatsApp Implementation Guide

Tac-Xpress uses WPBox/Lemin as the outbound relay and Meta as the inbound webhook source.

## Runtime Ownership

Shared config:

- `lib/whatsapp/config.ts`

Shared relay service:

- `lib/whatsapp/service.ts`

Inbound webhook:

- `app/api/webhooks/whatsapp/route.ts`

Primary callers:

- `app/dashboard/invoices/actions.ts`
- `app/dashboard/dispatch/whatsapp-actions.ts`
- `app/actions/ai-responder.ts`
- `app/actions/whatsapp-proactive.ts`
- `app/actions/whatsapp-inbound.ts`

## Environment Contract

- `WHATSAPP_ENABLED`
- `WPBOX_API_TOKEN`
- `WPBOX_BASE_URL`
- `WHATSAPP_APP_SECRET`
- `WHATSAPP_VERIFY_TOKEN`

`WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` are not required for the current WPBox-only outbound path.

## Phone Normalization

All outbound and subscriber writes normalize to E.164 digits without `+`.

Examples:

- `+918837364182` -> `918837364182`
- `08837364182` -> `918837364182`
- `8837364182` -> `918837364182`

No feature file should re-implement phone cleanup inline.

## Templates

Configured templates:

- invoice: `tac_express_corridor_invoice`, `en_US`
- driver route: configured in `lib/whatsapp/config.ts`
- shipment status update: configured in `lib/whatsapp/config.ts`

Invoice remains the default approved template:

- name: `tac_express_corridor_invoice`
- language: `en_US`

## Conversation Window

The 24-hour decision uses `whatsapp_subscribers.last_inbound_at`, not the last outbound send.

Behavior:

- within 24 hours of customer inbound activity: free-form text is allowed
- outside 24 hours: use an approved template

## Inbound Ticketing

- inbound customer messages upsert `whatsapp_subscribers`
- repeated messages append to an existing active WhatsApp ticket when possible
- new threads create a new ticket with `source='whatsapp'`
- raw intake is stored in `intake_category`
- canonical triage stays in `category`

## Outbound Logging

Every outbound send writes to `message_outbound` with:

- provider message id
- Meta or WAMID id when available
- message type
- template metadata
- related ticket id or AWB
- current status
- latest status timestamp
- failure reason

Webhook status callbacks update the same row through the correlated provider or Meta id.

## Failure Handling

- retries stay inside the shared relay service
- exhausted external failures flow into `dead_letter_queue`
- do not add feature-specific resend logic that bypasses the shared relay or the DLQ
