# API Reference

This project is action-heavy. The most important public and operational interfaces are listed below.

## Route Handlers

### `GET /api/health`

- Auth: dashboard session or `Authorization: Bearer <CRON_SECRET>`
- Purpose: database and integration configuration health
- Reports: database, OpenRouter, WhatsApp relay status

### `GET|POST /api/auth/[...nextauth]`

- Auth: NextAuth-managed
- Purpose: dashboard session lifecycle
- Failure mode: returns generic `Authentication service unavailable` on server errors

### `GET /api/public/invoice-pdf?id=<uuid>&sig=<hmac>`

- Auth: signed public request
- Purpose: render or fetch the WhatsApp invoice PDF artifact
- Failure mode: returns generic `Failed to generate invoice PDF`

### `GET|POST /api/webhooks/whatsapp`

- GET purpose: Meta webhook verification challenge
- POST purpose: inbound customer messages and delivery status updates
- Security: `x-hub-signature-256` HMAC verification with `WHATSAPP_APP_SECRET`

## Server Actions

### Portal and Public

- `createTicket(formData)` creates a public landing-page support ticket.
- `authenticatePortalAccess(formData)` creates a customer portal session.
- `getPortalShipments(page)` lists shipments for the portal session email.
- `getPortalInvoices()` lists invoices for the portal session email.
- `downloadInvoice(invoiceId)` returns a short-lived signed invoice URL when the session owns the invoice.
- `trackAwb(formData)` returns public shipment tracking when the AWB is publicly trackable.

### Support and AI

- `triageTicket(ticketId, subject, description, awb?)` classifies category and priority.
- `generateAutoReply(ticketId, category, shipmentData)` writes the AI reply and optional customer notifications.
- `updateTicketStatus(ticketId, status, staffId?)` changes the support workflow status.
- `replyToTicketFromDashboard(ticketId, email, subject, message)` writes a ticket reply and sends email.

### WhatsApp

- `sendInvoiceViaWhatsApp({ invoiceId, phone })` sends the invoice template through the shared relay.
- `messageDriverAction(manifestId, driverId)` sends the driver route template.
- `notifyShipmentUpdate(awb, newStatus)` sends free-form or template updates based on the last inbound customer activity.
- `processInboundMessage(message, contact)` records subscriber activity, appends or creates tickets, and acknowledges the message.

## Shared Internal Contracts

Ticket contract:

- `tickets.category`: canonical triage value
- `tickets.intake_category`: raw intake label

WhatsApp contract:

- one shared relay at `lib/whatsapp/service.ts`
- normalized E.164 digits without `+`
- outbound log row in `message_outbound`
- status correlation through provider and Meta ids
