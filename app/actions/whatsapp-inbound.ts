"use server"

import crypto from "crypto"
import * as Sentry from "@sentry/nextjs"

import { triageTicket } from "@/app/actions/ai-triage"
import { logAudit } from "@/lib/audit"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { isActiveWhatsAppTicketStatus } from "@/lib/support/tickets"
import {
  normalizeWhatsAppPhone,
  recordInboundWhatsAppActivity,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

function hashPhone(phone: string) {
  if (!process.env.PHONE_HASH_SECRET) return "[REDACTED]"

  const normalized = phone.replace(/\D/g, "").replace(/^0+/, "")
  if (normalized.length < 7) return "[INVALID]"

  return crypto
    .createHmac("sha256", process.env.PHONE_HASH_SECRET)
    .update(normalized)
    .digest("hex")
}

export async function captureWhatsAppError(
  error: Error | unknown,
  context: { phone?: string; action?: string }
) {
  Sentry.captureException(error, {
    contexts: {
      whatsapp: {
        phone_hash: context.phone ? hashPhone(context.phone) : undefined,
        action: context.action,
      },
    },
  })
}

const OPT_OUT_COMMANDS = ["stop", "unsubscribe", "opt out", "cancel"]
const OPT_IN_COMMANDS = ["start", "subscribe", "opt in"]

type InboundWhatsAppMessage = {
  id: string
  from: string
  timestamp?: string
  text?: {
    body?: string
  }
  body?: string
}

type InboundWhatsAppContact = {
  wa_id?: string
  profile?: {
    name?: string
  }
}

type TrackingEventSummary = {
  description: string | null
  location: string | null
  event_time: string | null
}

type QuickTrackingShipment = {
  status: string | null
  destination: string | null
  edd: string | null
  tracking_events?: TrackingEventSummary[] | null
}

const AWB_PATTERNS = [
  /(?:AWB|SHP)[-\s]?([a-zA-Z0-9]+)/i,
  /\b[a-zA-Z]{2,3}[-\s]?[a-zA-Z0-9]{7,}\b/i,
]

function extractAwb(text: string) {
  for (const pattern of AWB_PATTERNS) {
    const match = text.match(pattern)
    if (match) {
      return match[1] ? `AWB-${match[1]}` : match[0]
    }
  }

  return null
}

async function findCustomerByPhone(phone: string) {
  const exact = await supabaseAdmin
    .from("customers")
    .select("id, email")
    .eq("phone", phone)
    .maybeSingle()

  if (exact.data) {
    return exact.data
  }

  const prefixed = await supabaseAdmin
    .from("customers")
    .select("id, email")
    .eq("phone", `+${phone}`)
    .maybeSingle()

  return prefixed.data ?? null
}

async function findOpenWhatsAppTicket(phone: string) {
  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select("id, status, subject, related_awb")
    .eq("source", "whatsapp")
    .eq("customer_phone", phone)
    .order("updated_at", { ascending: false })
    .limit(5)

  if (error) {
    throw error
  }

  return (data ?? []).find((ticket: { status: string | null }) =>
    isActiveWhatsAppTicketStatus(ticket.status)
  )
}

async function insertInboundReply(input: {
  ticketId: string
  message: string
  senderName: string
  messageId: string
  timestamp: string
}) {
  const { error } = await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: input.ticketId,
    message: input.message,
    sender_type: "customer",
    sender_name: input.senderName,
    whatsapp_message_id: input.messageId,
    created_at: input.timestamp,
  })

  if (error) {
    throw error
  }
}

async function acknowledgeInboundMessage(input: {
  phone: string
  ticketId: string
  awbNumber: string | null
}) {
  if (input.awbNumber) {
    const summary = await getQuickTrackingSummary(input.awbNumber)
    if (summary) {
      await sendWhatsAppTextMessage({
        to: input.phone,
        text: summary,
        relatedTicketId: input.ticketId,
        relatedAwb: input.awbNumber,
        context: "whatsapp_tracking_ack",
      })
      return
    }
  }

  await sendWhatsAppTextMessage({
    to: input.phone,
    text: `Your message has been received. A TAC-XPRESS agent will reply shortly.\nTicket ID: ${input.ticketId.split("-")[0].toUpperCase()}`,
    relatedTicketId: input.ticketId,
    relatedAwb: input.awbNumber,
    context: "whatsapp_generic_ack",
  })
}

/**
 * Process an inbound WhatsApp message.
 * Handles opt-in/out, ticket creation or append, AI triage, and quick tracking replies.
 */
export async function processInboundMessage(
  message: InboundWhatsAppMessage,
  contact?: InboundWhatsAppContact | null
) {
  const rawPhone = contact?.wa_id || message.from
  const name = contact?.profile?.name || "Unknown"
  const text = message.text?.body || message.body || ""
  const messageId = message.id
  const epochSeconds = Number(message.timestamp)
  const timestamp = Number.isFinite(epochSeconds)
    ? new Date(epochSeconds * 1000).toISOString()
    : new Date().toISOString()

  const normalizedPhone = normalizeWhatsAppPhone(rawPhone)
  const lowerText = text.toLowerCase().trim()

  if (OPT_OUT_COMMANDS.includes(lowerText)) {
    await recordInboundWhatsAppActivity({
      phone: normalizedPhone,
      name,
      timestamp,
      optedIn: false,
    })
    await sendWhatsAppTextMessage({
      to: normalizedPhone,
      text: "You have been unsubscribed from TAC-XPRESS notifications. Reply START to re-enable.",
      context: "whatsapp_opt_out",
    }).catch((error) =>
      captureWhatsAppError(error, {
        action: "whatsapp_opt_out",
        phone: normalizedPhone,
      })
    )
    return { action: "opt_out" }
  }

  if (OPT_IN_COMMANDS.includes(lowerText)) {
    await recordInboundWhatsAppActivity({
      phone: normalizedPhone,
      name,
      timestamp,
      optedIn: true,
    })
    await sendWhatsAppTextMessage({
      to: normalizedPhone,
      text: "Welcome back to TAC-XPRESS. You will now receive tracking updates and support replies here.",
      context: "whatsapp_opt_in",
    }).catch((error) =>
      captureWhatsAppError(error, {
        action: "whatsapp_opt_in",
        phone: normalizedPhone,
      })
    )
    return { action: "opt_in" }
  }

  await recordInboundWhatsAppActivity({
    phone: normalizedPhone,
    name,
    timestamp,
    optedIn: true,
  })

  const awbNumber = extractAwb(text)
  const customer = await findCustomerByPhone(normalizedPhone)
  const existingTicket = await findOpenWhatsAppTicket(normalizedPhone)

  let ticketId = existingTicket?.id

  if (existingTicket) {
    const ticketUpdate = {
      status:
        existingTicket.status === "awaiting_customer"
          ? ("open" as const)
          : existingTicket.status,
      related_awb: existingTicket.related_awb || awbNumber,
      updated_at: timestamp,
    }

    const { error } = await supabaseAdmin
      .from("tickets")
      .update(ticketUpdate)
      .eq("id", existingTicket.id)

    if (error) {
      throw error
    }

    await logAudit({
      action: "update",
      entity: "tickets",
      entityId: existingTicket.id,
      userId: customer?.id ?? null,
      userEmail: customer?.email ?? `${normalizedPhone}@whatsapp.placeholder`,
      after: ticketUpdate,
      metadata: {
        source: "whatsapp",
        related_awb: ticketUpdate.related_awb,
      },
    })
  } else {
    const ticketInsert = {
      subject: `WhatsApp: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
      message: text,
      description: text,
      customer_email:
        customer?.email ?? `${normalizedPhone}@whatsapp.placeholder`,
      customer_phone: normalizedPhone,
      customer_name: name,
      customer_id: customer?.id ?? null,
      source: "whatsapp",
      intake_category: awbNumber ? "shipment" : "general",
      category: "general",
      related_awb: awbNumber,
      status: "open" as const,
      priority: "medium",
      created_at: timestamp,
    }

    const { data: ticket, error } = await supabaseAdmin
      .from("tickets")
      .insert(ticketInsert)
      .select("id, subject, message")
      .single()

    if (error || !ticket) {
      captureWhatsAppError(error || new Error("Failed to create ticket"), {
        action: "whatsapp_ticket_creation",
        phone: normalizedPhone,
      })
      return { action: "error", error }
    }

    ticketId = ticket.id

    await logAudit({
      action: "create",
      entity: "tickets",
      entityId: ticket.id,
      userId: customer?.id ?? null,
      userEmail: customer?.email ?? `${normalizedPhone}@whatsapp.placeholder`,
      after: {
        ...ticketInsert,
        id: ticket.id,
      },
      metadata: {
        source: "whatsapp",
      },
    })

    triageTicket(
      ticket.id,
      ticket.subject,
      ticket.message ?? text,
      awbNumber ?? undefined
    ).catch((error) => {
      Sentry.captureException(error, {
        extra: { context: "whatsapp_ai_triage", ticketId: ticket.id },
      })
    })
  }

  if (!ticketId) {
    return { action: "error", error: "Missing ticket identifier" }
  }

  await insertInboundReply({
    ticketId,
    message: text,
    senderName: name,
    messageId,
    timestamp,
  })

  await acknowledgeInboundMessage({
    phone: normalizedPhone,
    ticketId,
    awbNumber,
  }).catch((error) =>
    captureWhatsAppError(error, {
      phone: normalizedPhone,
      action: "whatsapp_acknowledgement",
    })
  )

  return {
    action: existingTicket ? "ticket_updated" : "ticket_created",
    ticketId,
  }
}

async function getQuickTrackingSummary(awb: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from("shipments")
    .select(
      `
      status,
      destination,
      edd,
      tracking_events (
        description,
        location,
        event_time
      )
    `
    )
    .eq("awb_number", awb)
    .order("event_time", {
      referencedTable: "tracking_events",
      ascending: false,
    })
    .limit(1, { referencedTable: "tracking_events" })
    .single()
  const shipment = data as QuickTrackingShipment | null

  if (!shipment) return null

  const latest = shipment.tracking_events?.[0]
  const etaLine = shipment.edd ? `\nETA: ${shipment.edd}` : ""
  const lastUpdate = latest
    ? `\nLast update: ${latest.description} at ${latest.location}`
    : ""

  return `${awb}\nStatus: ${shipment.status}${lastUpdate}${etaLine}\n\nTrack live: ${process.env.NEXT_PUBLIC_APP_URL}/portal/track`
}
