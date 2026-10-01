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
import { classifyWhatsAppMessage } from "@/lib/jev"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

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

  // Classify inbound message intent using Jev (or OpenAI / rule-based fallback)
  const classification = await classifyWhatsAppMessage(text)

  const consent = (classification.intent === "opt_out" || classification.isOptOut)
    ? false
    : classification.intent === "opt_in"
      ? true
      : undefined

  const awb = extractTrackingReference(text) ?? null

  const isUrgentComplaint =
    classification.intent === "complaint" || classification.isComplaint

  const result = await saveInboundMessage({
    messageId: message.id,
    phone,
    name: contact?.profile?.name?.slice(0, 200) || "WhatsApp contact",
    text,
    timestamp: new Date(message.timestamp * 1000),
    awb,
    consent,
    isComplaint: isUrgentComplaint,
  })

  if (result.duplicate) return result

  // If message was classified as an urgent complaint, escalate priority
  if (result.ticketId && isUrgentComplaint) {
    try {
      await db
        .update(tickets)
        .set({
          priority: "high",
          intakeCategory: "complaint",
          updatedAt: new Date(),
        })
        .where(eq(tickets.id, result.ticketId))
    } catch (err) {
      Sentry.captureException(err, { tags: { area: "whatsapp_priority_escalation" } })
      throw err
    }
  }

  // The inbox is durable before acknowledging the provider. An acknowledgement
  // failure must not repeat the customer message or the committed support work.
  after(async () => {
    try {
      let reply: string

      if (consent === false) {
        reply =
          "You have been unsubscribed from TAC-XPRESS notifications. Reply START to re-enable."
      } else if (consent === true) {
        reply =
          "TAC-XPRESS notifications are enabled. Reply STOP to unsubscribe."
      } else if (classification.intent === "complaint" || classification.isComplaint) {
        reply = `We have received your issue and flagged it for urgent staff intervention. An operations manager will investigate your shipment immediately. Reference: ${result.ticketId?.slice(0, 8).toUpperCase()}`
      } else if (awb && result.ticketId) {
        const [shipment] = await publicTrackingQuery(awb)
        if (shipment) {
          reply = `${awb}\nStatus: ${shipment.event?.status || "pending"}\nLast published update: ${shipment.event?.description || "Awaiting update"} at ${shipment.event?.location || shipment.origin}\n${getAppUrl()}/track?awb=${encodeURIComponent(awb)}`
        } else {
          reply = `Tracking reference ${awb} received. Updates will be published as soon as carrier scans occur. Ticket: ${result.ticketId.slice(0, 8).toUpperCase()}`
        }
      } else if (classification.intent === "tracking_request") {
        reply = `To track your consignment, please reply with your Airway Bill or Waybill number (e.g., TAC12345 or WB1002). Support Case: ${result.ticketId?.slice(0, 8).toUpperCase()}`
      } else if (classification.intent === "billing_inquiry") {
        reply = `Thank you for your billing inquiry. Our accounts desk will verify your records and respond shortly. Reference: ${result.ticketId?.slice(0, 8).toUpperCase()}`
      } else {
        reply = `Your message has been received. A TAC-XPRESS agent will review it. Ticket: ${result.ticketId?.slice(0, 8).toUpperCase()}`
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
