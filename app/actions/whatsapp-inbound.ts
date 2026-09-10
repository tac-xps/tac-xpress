import "server-only"
import { after } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { inboundMessageSchema } from "@/lib/whatsapp/webhook-schema"
import { publicTrackingQuery } from "@/lib/tracking/public-query"
import { getAppUrl } from "@/lib/config/app-url"
import {
  normalizeWhatsAppPhone,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"
import { saveInboundMessage } from "@/lib/whatsapp/inbound-store"
import { extractTrackingReference } from "@/lib/support/chat-request"

interface Contact {
  wa_id?: string
  profile?: { name?: string }
}

export async function processInboundMessage(value: unknown, contact?: Contact) {
  const message = inboundMessageSchema.parse(value)
  const phone = normalizeWhatsAppPhone(message.from)
  const text =
    message.text?.body ||
    message.body ||
    `[${message.type || "Unsupported"} message received; review in WhatsApp]`
  const command = text.trim().toLowerCase()
  const consent = ["stop", "unsubscribe", "opt out", "cancel"].includes(command)
    ? false
    : ["start", "subscribe", "opt in"].includes(command)
      ? true
      : undefined
  const awb = extractTrackingReference(text) ?? null
  const result = await saveInboundMessage({
    messageId: message.id,
    phone,
    name: contact?.profile?.name?.slice(0, 200) || "WhatsApp contact",
    text,
    timestamp: new Date(message.timestamp * 1000),
    awb,
    consent,
  })
  if (result.duplicate) return result
  // The inbox is durable before acknowledging the provider. An acknowledgement
  // failure must not repeat the customer message or the committed support work.
  after(async () => {
    try {
      let reply =
        consent === false
          ? "You have been unsubscribed from TAC-XPRESS notifications. Reply START to re-enable."
          : consent === true
            ? "TAC-XPRESS notifications are enabled. Reply STOP to unsubscribe."
            : `Your message has been received. A TAC-XPRESS agent will review it. Ticket: ${result.ticketId?.slice(0, 8).toUpperCase()}`
      if (awb && result.ticketId) {
        const [shipment] = await publicTrackingQuery(awb)
        if (shipment)
          reply = `${awb}\nStatus: ${shipment.event?.status || "pending"}\nLast published update: ${shipment.event?.description || "Awaiting update"} at ${shipment.event?.location || shipment.origin}\n${getAppUrl()}/track?awb=${encodeURIComponent(awb)}`
      }
      await sendWhatsAppTextMessage({
        to: phone,
        text: reply,
        relatedTicketId: result.ticketId ?? undefined,
        relatedAwb: awb ?? undefined,
        context: "whatsapp_inbound_ack",
      })
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "whatsapp_acknowledgement" },
      })
    }
  })
  return result
}
