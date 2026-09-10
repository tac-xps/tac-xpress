"use server"

import * as Sentry from "@sentry/nextjs"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { revalidatePath } from "next/cache"
import { after } from "next/server"
import { z } from "zod"
import { headers } from "next/headers"
import { auth } from "@/auth"
import { requireDashboardSession } from "@/lib/auth/guards"
import { verifyPortalSession } from "@/app/actions/portal-auth"
import { logAudit } from "@/lib/audit"
import { saveContactTicket } from "@/lib/support/create-ticket"
import { processBackgroundJobs } from "@/lib/jobs/worker"
import {
  LANDING_TICKET_CATEGORIES,
  mapLandingCategoryToTriage,
} from "@/lib/support/tickets"

import arcjet, { slidingWindow, request } from "@arcjet/next"

const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  rules: [
    // Limit to 3 requests per 15 minutes by IP
    slidingWindow({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      interval: "15m",
      max: 3,
    }),
  ],
})

// ---------------------------------------------------------------------------

const createTicketSchema = z.object({
  customer_name: z.string().min(2, "Name required").max(120),
  customer_email: z.string().email("Valid email required").max(254),
  customer_phone: z.string().max(30).optional(),
  subject: z.string().min(5, "Subject too short").max(200),
  message: z.string().min(10, "Message too short").max(5000),
  category: z.enum(LANDING_TICKET_CATEGORIES),
  related_awb: z.string().max(40).optional(),
})

export async function createTicket(formData: FormData) {
  // --- Honeypot check: bots fill hidden fields, humans don't ---
  const honeypot = formData.get("website") as string | null
  if (honeypot && honeypot.length > 0) {
    // Silently pretend success — don't tell the bot it failed
    return { success: true }
  }

  const data = {
    customer_name: formData.get("customer_name") || undefined,
    customer_email: formData.get("customer_email") || undefined,
    customer_phone: formData.get("customer_phone") || undefined,
    subject: formData.get("subject") || undefined,
    message: formData.get("message") || undefined,
    category: formData.get("category") || undefined,
    related_awb: formData.get("related_awb") || undefined,
  }

  const parsed = createTicketSchema.safeParse(data)
  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors }
  }

  // --- Rate limit: email + IP (belt-and-suspenders) ---
  const decision = await (async () => {
    try { return await aj.protect(await request()) }
    catch (error) { Sentry.captureException(error, { tags: { area: "contact_rate_limit" } }); return null }
  })()

  if (!decision || decision.isDenied() || decision.isErrored()) {
    return {
      error: {
        _form: [
          "Too many tickets submitted. Please wait 15 minutes or contact us directly at support@tac-xpress.app",
        ],
      },
    }
  }

  let insertedTicket: { id: string }
  try {
    insertedTicket = await saveContactTicket(parsed.data)
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "create_ticket" } })
    return { error: { _form: ["We could not save your request. Please try again or contact our team directly."] } }
  }
  after(async () => {
    try { await processBackgroundJobs(2, insertedTicket.id) }
    catch (error) { Sentry.captureException(error, { tags: { area: "ticket_followup" } }) }
  })

  revalidatePath("/dashboard/messages")
  return { success: true, ticketId: insertedTicket.id }
}

export async function updateTicketStatus(
  ticketId: string,
  status: string,
  staffId?: string
) {
  const session = await requireDashboardSession()
  z.string().uuid().parse(ticketId)
  z.enum(["open", "in_progress", "awaiting_customer", "resolved"]).parse(status)
  const assignedStaffId = session.user.id

  const { data: before, error: lookupError } = await supabaseAdmin
    .from("tickets")
    .select("id, status, assigned_to, resolved_at, updated_at")
    .eq("id", ticketId)
    .single()
  if (lookupError) throw lookupError

  const { error } = await supabaseAdmin
    .from("tickets")
    .update({
      status,
      assigned_to: assignedStaffId,
      updated_at: new Date().toISOString(),
      resolved_at: status === "resolved" ? new Date().toISOString() : null,
    })
    .eq("id", ticketId)

  if (error) throw error

  await logAudit({
    action: "update_status",
    entity: "tickets",
    entityId: ticketId,
    userId: session.user.id,
    userEmail: session.user.email,
    before,
    after: { status, assigned_to: assignedStaffId },
  })

  revalidatePath("/dashboard/messages")
  return { success: true }
}

async function insertTicketReply(
  ticketId: string,
  message: string,
  senderType: "staff" | "customer",
  senderId: string,
  senderName: string,
  isInternal: boolean
) {
  const { error } = await supabaseAdmin.from("ticket_replies").insert({
    ticket_id: ticketId,
    message,
    sender_type: senderType,
    sender_id: senderId,
    sender_name: senderName,
    is_internal: isInternal,
  })

  if (error) throw error

  await supabaseAdmin
    .from("tickets")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", ticketId)
}

export async function addTicketReply(
  ticketId: string,
  message: string,
  senderType: "staff" | "customer",
  senderId: string,
  senderName: string,
  isInternal: boolean = false
) {
  const session = await requireDashboardSession()
  await insertTicketReply(
    z.string().uuid().parse(ticketId),
    z.string().trim().min(1).max(10000).parse(message),
    "staff",
    session.user.id,
    session.user.name || "Support team",
    isInternal
  )

  await logAudit({
    action: isInternal ? "add_internal_reply" : "add_reply",
    entity: "tickets",
    entityId: ticketId,
    userId: session.user.id,
    userEmail: session.user.email,
    metadata: { senderType: "staff", senderId: session.user.id },
  })

  revalidatePath("/dashboard/messages")
  return { success: true }
}

export async function getPortalTickets(email: string) {
  const session = await verifyPortalSession()
  if (!session || session.email !== email.toLowerCase()) {
    return []
  }

  const { data, error } = await supabaseAdmin
    .from("tickets")
    .select(
      `
      id,
      subject,
      status,
      created_at,
      updated_at,
      category,
      priority
    `
    )
    .ilike("customer_email", session.email.replaceAll("%", "\\%").replaceAll("_", "\\_"))
    .order("updated_at", { ascending: false })

  if (error) {
    Sentry.captureException(error, { tags: { area: "portal_tickets" } })
    throw new Error("Portal ticket lookup failed")
  }

  return data
}

export async function replyToTicketFromDashboard(
  ticketId: string,
  email: string,
  subject: string,
  message: string
) {
  const session = await requireDashboardSession()
  z.string().uuid().parse(ticketId)
  const reply = z.string().trim().min(1).max(10000).parse(message)
  const { data: ticket, error: ticketError } = await supabaseAdmin.from("tickets").select("id, customer_email, guest_email, subject").eq("id", ticketId).single()
  if (ticketError || !ticket) throw new Error("Support request not found")
  const recipient = z.string().email().safeParse(ticket.customer_email || ticket.guest_email)
  if (!recipient.success) throw new Error("This request has no valid reply email")
  const staffId = session.user.id
  const staffName = session.user.name || "Support team"

  // Log reply in DB
  await insertTicketReply(ticketId, reply, "staff", staffId, staffName, false)

  // Send the email to the customer
  const { sendTicketNotification } =
    await import("@/app/actions/email-notifications")
  const delivery = await sendTicketNotification({
    to: recipient.data,
    ticketId,
    subject: ticket.subject,
    type: "agent_replied",
    body: reply,
  })
  if (!delivery.success) throw new Error("The reply was saved, but email delivery was not accepted. Check email configuration and delivery logs before retrying.")

  // Update ticket status
  await updateTicketStatus(ticketId, "awaiting_customer", staffId)

  return { success: true }
}
