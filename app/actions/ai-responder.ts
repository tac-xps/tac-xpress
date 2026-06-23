"use server"

import { OpenAI } from "openai"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { withRetry } from "@/lib/queue"
import { logAudit } from "@/lib/audit"
import { z } from "zod"
import { safeParse } from "@/lib/validation/guard"
import {
  normalizeWhatsAppPhone,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.app",
    "X-Title": "TAC-XPRESS",
  },
})

const autoReplyInputSchema = z.object({
  ticketId: z.string().uuid("Invalid ticket ID"),
  category: z.enum(["delay", "damage", "billing", "general", "lost"]),
})

/**
 * Whitelist only safe, system-generated fields from shipment data
 * to prevent user-controlled fields from being injected into the LLM prompt.
 */
function sanitizeShipmentForLLM(data: any): string {
  if (!data) return "No shipment data available."
  const safe = {
    awb_number: data.awb_number,
    status: data.status,
    origin: data.origin,
    destination: data.destination,
    edd: data.edd,
    service_type: data.service_type,
    weight_kg: data.weight_kg,
    booking_date: data.booking_date,
  }
  return JSON.stringify(safe)
}

const AUTO_REPLY_PROMPT = `You are a professional logistics support agent for TAC-XPRESS. 
Respond to the customer in a helpful, concise tone (max 150 words).

Rules:
- Acknowledge their specific issue using the shipment tracking data provided.
- If delay: explain current status, apologize, provide new ETA if available.
- If damage: apologize, initiate claim process, ask for photos.
- If billing: reference specific charges, explain breakdown, offer dispute form.
- If lost: escalate immediately, do not promise resolution timeline.
- Never hallucinate tracking events. Only use provided data.
- Sign as "TAC-XPRESS Support Team".

Return ONLY the response text. No JSON, no markdown headers.`

export async function generateAutoReply(
  ticketId: string,
  category: string,
  shipmentData: Record<string, unknown> | null
) {
  // Validate inputs
  const input = safeParse(autoReplyInputSchema, { ticketId, category })

  const globalEnabled = process.env.AI_AUTO_REPLY_ENABLED === "true"

  // Fetch ticket to check per-ticket opt-out and WhatsApp source
  const { data: ticket } = await supabaseAdmin
    .from("tickets")
    .select("ai_auto_reply_enabled, source, customer_phone")
    .eq("id", input.ticketId)
    .single()

  const ticketEnabled = ticket?.ai_auto_reply_enabled !== false // defaults to true if null/undefined

  if (!globalEnabled || !ticketEnabled) {
    console.log(
      `[AI Responder] Skipped: Auto-reply disabled. Global: ${globalEnabled}, Ticket: ${ticketEnabled}`
    )
    return null
  }

  // Sanitize shipment data — only pass safe system-generated fields to LLM
  const safeShipmentContext = sanitizeShipmentForLLM(shipmentData)

  const completion = await withRetry(
    () =>
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: "system", content: AUTO_REPLY_PROMPT },
          {
            role: "user",
            content: `Category: ${input.category}\nShipment: ${safeShipmentContext}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
    "ai_auto_reply_generation",
    { ticketId: input.ticketId, category: input.category }
  )

  if (!completion) return null // DLQ handled it

  const replyContent = completion.choices[0].message.content
  if (!replyContent) return null // Content filter or rate limit returned null

  const reply = replyContent

  // Insert as ticket reply
  await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: input.ticketId,
    message: reply,
    sender_type: "ai",
    sender_name: "TAC-XPRESS AI Agent",
    is_internal: false,
    created_at: new Date().toISOString(),
  })

  // Update ticket status
  await supabaseAdmin
    .from("tickets")
    .update({
      status: "awaiting_customer",
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.ticketId)

  // Send email notification to customer
  const { data: fullTicket } = await supabaseAdmin
    .from("tickets")
    .select("customer_email, guest_email, subject, user_id")
    .eq("id", input.ticketId)
    .single()

  const recipientEmail = fullTicket?.customer_email || fullTicket?.guest_email
  if (recipientEmail && fullTicket?.subject) {
    // Check profile email_notifications preference for registered users
    let shouldEmail = true
    if (fullTicket?.user_id) {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email_notifications")
        .eq("id", fullTicket.user_id)
        .single()
      if (profile?.email_notifications === false) shouldEmail = false
    }

    if (shouldEmail) {
      import("@/app/actions/email-notifications")
        .then(({ sendTicketNotification }) => {
          sendTicketNotification({
            to: recipientEmail,
            ticketId: input.ticketId,
            subject: fullTicket.subject,
            type: "ai_replied",
            body: reply,
          }).catch((err: unknown) =>
            console.error("[Email] ai_replied failed:", err)
          )
        })
        .catch(() => {})
    }
  }

  // A4: If ticket originated from WhatsApp, echo the AI reply back to the customer
  if (ticket?.source === "whatsapp" && ticket?.customer_phone) {
    const normalizedPhone = normalizeWhatsAppPhone(ticket.customer_phone)
    const { data: sub } = await supabaseAdmin
      .from("whatsapp_subscribers")
      .select("opted_in")
      .eq("phone", normalizedPhone)
      .single()

    if (sub?.opted_in !== false) {
      sendWhatsAppTextMessage({
        to: ticket.customer_phone!,
        text: reply,
        relatedTicketId: input.ticketId,
        context: "ai_auto_reply",
      }).catch(() => undefined)
    }
  }

  // Log to audit
  await logAudit({
    action: "ai_auto_reply",
    entity: "tickets",
    entityId: input.ticketId,
    userEmail: "ai-responder@system",
    metadata: {
      category: input.category,
      shipment: shipmentData?.awb_number,
      prompt_length: AUTO_REPLY_PROMPT.length,
      reply_length: reply.length,
    },
    after: {
      status: "awaiting_customer",
      auto_reply_generated: true,
    },
  })

  return reply
}
