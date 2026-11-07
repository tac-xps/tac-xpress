# WhatsApp relay guide

TAC-XPRESS uses WPBox/Lemin as the outbound relay. Configuration and template metadata live in `lib/whatsapp/config.ts`; sending, retries, dead-letter handoff, subscriber updates, and status correlation live in `lib/whatsapp/service.ts`.

## Requirements

- Set `WHATSAPP_ENABLED=true`, `WPBOX_API_TOKEN`, and `WPBOX_USER_ID` for outbound LeminAI messaging. Keep credentials server-side.
- `WPBOX_BASE_URL` defaults to `https://chat.leminai.com`. The sender posts to `/api/wpbox/sendmessage` or `/api/wpbox/sendtemplatemessage`.
- Configure and approve the template names and languages from `lib/whatsapp/config.ts` in the provider account.
- `WHATSAPP_APP_SECRET` and `WHATSAPP_VERIFY_TOKEN` apply to the separate Meta webhook, not outbound LeminAI requests.
- Verify Meta signatures in `app/api/webhooks/whatsapp/route.ts` before processing messages or statuses. Keep this endpoint fail closed.
- Confirm LeminAI's callback payload and authentication contract before connecting it to this endpoint. Outbound credentials do not prove callback compatibility.
- Normalize phone numbers before send and record provider/Meta identifiers, template metadata, related AWB or ticket, and delivery state.
- Respect subscriber opt-out and the customer’s last inbound activity when deciding whether a proactive send is allowed.

## Configuration evidence

The 2026-11-03 local check found messaging enabled, a relay token, and a user ID. The omitted base URL uses the LeminAI default.
Neither Meta webhook credential was present. Integrations and health report outbound setup separately from Meta callback setup.
This check did not send messages, validate account credentials, confirm template approval, or prove delivery receipts.
The public provider portal redirects to sign-in; its callback authentication contract was unavailable without account documentation.

`WHATSAPP_API_TOKEN` and `WHATSAPP_PHONE_NUMBER_ID` in `.env.example` are not read by the current outbound sender.
The older template catalogue under `docs/old_docs` is historical planning, not evidence that every listed event is implemented.

## Release scope review, 2026-11-03

The [original send mechanism decision](old_docs/decisions/2026-05-17-whatsapp-sends-mechanism.md) explicitly defers provider delivery callbacks.
Its follow-up table treats authenticated delivery callbacks as a separate, nonblocking integration surface.
The template catalogue specifies outbound message content. It does not define callback headers, signatures, payloads, or replay rules.
Preserve the working outbound sender and the fail-closed Meta endpoint. Do not invent a LeminAI callback adapter from outbound credentials.
This review closes the documentation investigation. Callback implementation and provider receipt acceptance remain deferred features.

## Failure handling

External-send failures are captured in the dead-letter path for replay and investigation. Do not retry by manually calling a provider endpoint from the browser; use the supported server workflow so logging and audit data stay consistent.
