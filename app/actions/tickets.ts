"use server"

import * as Sentry from "@sentry/nextjs"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { headers } from "next/headers"
import { auth } from "@/auth"
import { requireDashboardSession } from "@/lib/auth/guards"
import { verifyPortalSession } from "@/app/actions/portal-auth"
import { logAudit } from "@/lib/audit"
import {
  LANDING_TICKET_CATEGORIES,
  mapLandingCategoryToTriage,
} from "@/lib/support/tickets"

// ---------------------------------------------------------------------------
// In-memory rate limiter (swap for Upstash Redis in multi-instance deployments)
// ---------------------------------------------------------------------------
const ticketRateLimits = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_MAX = 3
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes

function checkTicketRateLimit(key: string): boolean {
  const now = Date.now()
  const entry = ticketRateLimits.get(key)
  if (!entry || now > entry.resetAt) {
    ticketRateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

// ---------------------------------------------------------------------------

const createTicketSchema = z.object({
  customer_name: z.string().min(2, "Name required"),
  customer_email: z.string().email("Valid email required"),
  customer_phone: z.string().optional(),
  subject: z.string().min(5, "Subject too short"),
  message: z.string().min(10, "Message too short"),
  category: z.enum(LANDING_TICKET_CATEGORIES),
  related_awb: z.string().optional(),
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
  const headerStore = await headers()
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"

  const emailKey = `email:${parsed.data.customer_email.toLowerCase()}`
  const ipKey = `ip:${clientIp}`

  if (!checkTicketRateLimit(emailKey) || !checkTicketRateLimit(ipKey)) {
    return {
      error: {
        _form: [
          "Too many tickets submitted. Please wait 15 minutes or contact us directly at support@tac-xpress.app",
        ],
      },
    }
  }

  const { data: insertedTicket, error } = await supabaseAdmin
    .from("tickets")
    .insert({
      ...parsed.data,
      description: parsed.data.message,
      category: mapLandingCategoryToTriage(parsed.data.category),
      intake_category: parsed.data.category,
      guest_email: parsed.data.customer_email,
      source: "landing",
      status: "open",
      priority: "medium",
    })
    .select("id")
    .single()

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "create_ticket" },
      extra: {
        category: parsed.data.category,
        mappedCategory: mapLandingCategoryToTriage(parsed.data.category),
      },
    })
    return {
      error: {
        _form: [
          "We could not submit your ticket right now. Please try again or email support@tac-xpress.app.",
        ],
      },
    }
  }

  await logAudit({
    action: "create",
    entity: "tickets",
    entityId: insertedTicket.id,
    userEmail: parsed.data.customer_email,
    after: {
      id: insertedTicket.id,
      category: mapLandingCategoryToTriage(parsed.data.category),
      status: "open",
      priority: "medium",
      source: "landing",
    },
  })

  // Non-blocking triage
  import("@/app/actions/ai-triage").then(({ triageTicket }) => {
    triageTicket(
      insertedTicket.id,
      parsed.data.subject,
      parsed.data.message,
      parsed.data.related_awb
    ).catch(console.error)
  })

  // Non-blocking email notification
  import("@/app/actions/email-notifications")
    .then(({ sendTicketNotification }) => {
      sendTicketNotification({
        to: parsed.data.customer_email,
        ticketId: insertedTicket.id,
        subject: parsed.data.subject,
        type: "ticket_created",
      }).catch((err: unknown) =>
        console.error("[Email] ticket_created failed:", err)
      )
    })
    .catch(() => {
      /* email-notifications may not exist yet */
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
  const assignedStaffId = staffId || session.user.id

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
    ticketId,
    message,
    senderType,
    senderId,
    senderName,
    isInternal
  )

  await logAudit({
    action: isInternal ? "add_internal_reply" : "add_reply",
    entity: "tickets",
    entityId: ticketId,
    userId: session.user.id,
    userEmail: session.user.email,
    metadata: { senderType, senderId },
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
    .eq("customer_email", email)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching portal tickets:", error)
    return []
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
  const authSession = await auth()
  const staffId = session.user.id
  const staffName = authSession?.user?.name || "Support Agent"

  // Log reply in DB
  await insertTicketReply(ticketId, message, "staff", staffId, staffName, false)

  // Send the email to the customer
  const { sendTicketNotification } =
    await import("@/app/actions/email-notifications")
  await sendTicketNotification({
    to: email,
    ticketId,
    subject,
    type: "agent_replied",
    body: message,
  })

  // Update ticket status
  await updateTicketStatus(ticketId, "awaiting_customer", staffId)

  return { success: true }
}
