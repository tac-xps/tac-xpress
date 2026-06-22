import { supabaseAdmin } from "@/lib/supabase/clients"
import { NextResponse } from "next/server"
import { sendTicketNotification } from "@/app/actions/email-notifications"
import * as Sentry from "@sentry/nextjs"
import { logAudit } from "@/lib/audit"
import { withRetry } from "@/lib/queue"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const now = new Date().toISOString()
  const opsNotificationEmail =
    process.env.OPS_NOTIFICATION_EMAIL?.trim() || null
  // Idempotency window: skip tickets processed within the last 5 minutes
  const idempotencyWindow = new Date(Date.now() - 5 * 60 * 1000).toISOString()
  let processed = 0

  async function insertOpsNotification(input: {
    ticketId?: string
    type: "sla_breached" | "shipment_at_risk"
    payload: Record<string, unknown>
  }) {
    if (!opsNotificationEmail) {
      Sentry.captureMessage("OPS_NOTIFICATION_EMAIL is not configured", {
        level: "warning",
        tags: { area: "sla_cron" },
        extra: {
          type: input.type,
          ticketId: input.ticketId,
        },
      })
      return
    }

    const notificationPayload = {
      ticket_id: input.ticketId ?? null,
      recipient_email: opsNotificationEmail,
      type: input.type,
      payload: input.payload,
    }

    const { error } = await supabaseAdmin
      .from("notifications")
      .insert(notificationPayload)

    if (error) {
      throw error
    }
  }

  // 1. First-response breaches: no reply yet, deadline passed
  const { data: frBreaches } = await supabaseAdmin
    .from("tickets")
    .select(
      "id, customer_email, guest_email, subject, sla_deadline_first_response, priority, assigned_team, sla_breach_processed_at"
    )
    .is("first_reply_at", null)
    .lt("sla_deadline_first_response", now)
    .eq("sla_breached", false)
    .in("status", ["open", "in_progress"])
    .or(
      `sla_breach_processed_at.is.null,sla_breach_processed_at.lt.${idempotencyWindow}`
    )

  for (const ticket of frBreaches || []) {
    const ticketUpdate = {
      sla_breached: true,
      sla_breach_type: "first_response" as const,
      sla_at_risk: false,
      sla_breach_processed_at: now,
    }

    await supabaseAdmin.from("tickets").update(ticketUpdate).eq("id", ticket.id)

    await insertOpsNotification({
      ticketId: ticket.id,
      type: "sla_breached",
      payload: {
        breach_type: "first_response",
        deadline: ticket.sla_deadline_first_response,
        priority: ticket.priority,
        assigned_team: ticket.assigned_team,
      },
    })

    await logAudit({
      action: "update",
      entity: "tickets",
      entityId: ticket.id,
      userEmail: "sla-cron@system",
      before: {
        sla_breached: false,
      },
      after: ticketUpdate,
      metadata: {
        breach_type: "first_response",
      },
    })

    // Email customer about escalation (with retry for reliability)
    const recipientEmail = ticket.customer_email || ticket.guest_email
    if (recipientEmail && ticket.subject) {
      withRetry(
        () =>
          sendTicketNotification({
            to: recipientEmail,
            ticketId: ticket.id,
            subject: ticket.subject,
            type: "sla_breach",
          }),
        "sla_breach_email_fr",
        { ticketId: ticket.id, type: "first_response" }
      )
    }

    processed++
  }

  // 2. Resolution breaches: still open, resolution deadline passed
  const { data: resBreaches } = await supabaseAdmin
    .from("tickets")
    .select(
      "id, customer_email, guest_email, subject, sla_deadline_resolution, priority, assigned_team, sla_breach_processed_at"
    )
    .lt("sla_deadline_resolution", now)
    .eq("sla_breached", false)
    .not("status", "in", '("resolved")')
    .or(
      `sla_breach_processed_at.is.null,sla_breach_processed_at.lt.${idempotencyWindow}`
    )

  for (const ticket of resBreaches || []) {
    const ticketUpdate = {
      sla_breached: true,
      sla_breach_type: "resolution" as const,
      sla_at_risk: false,
      sla_breach_processed_at: now,
    }

    await supabaseAdmin.from("tickets").update(ticketUpdate).eq("id", ticket.id)

    await insertOpsNotification({
      ticketId: ticket.id,
      type: "sla_breached",
      payload: {
        breach_type: "resolution",
        deadline: ticket.sla_deadline_resolution,
        priority: ticket.priority,
        assigned_team: ticket.assigned_team,
      },
    })

    await logAudit({
      action: "update",
      entity: "tickets",
      entityId: ticket.id,
      userEmail: "sla-cron@system",
      before: {
        sla_breached: false,
      },
      after: ticketUpdate,
      metadata: {
        breach_type: "resolution",
      },
    })

    // Email customer about escalation (with retry for reliability)
    const recipientEmail = ticket.customer_email || ticket.guest_email
    if (recipientEmail && ticket.subject) {
      withRetry(
        () =>
          sendTicketNotification({
            to: recipientEmail,
            ticketId: ticket.id,
            subject: ticket.subject,
            type: "sla_breach",
          }),
        "sla_breach_email_res",
        { ticketId: ticket.id, type: "resolution" }
      )
    }

    processed++
  }

  // 3. Predictive SLA for Shipments: EDD within 24 hours, but not delivered
  const twentyFourHoursFromNow = new Date(
    Date.now() + 24 * 60 * 60 * 1000
  ).toISOString()
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()

  const { data: atRiskShipments } = await supabaseAdmin
    .from("shipments")
    .select("id, awb_number, status, edd, sla_at_risk, sla_at_risk_alerted_at")
    .in("status", ["pending", "in_transit"])
    .lt("edd", twentyFourHoursFromNow)
    .gt("edd", now)
    .or(
      `sla_at_risk_alerted_at.is.null,sla_at_risk_alerted_at.lt.${fourHoursAgo}`
    )

  for (const shipment of atRiskShipments || []) {
    const shipmentUpdate = {
      sla_at_risk: true,
      sla_at_risk_alerted_at: now,
    }

    await supabaseAdmin
      .from("shipments")
      .update(shipmentUpdate)
      .eq("id", shipment.id)

    // Only insert notification if it hasn't been alerted recently
    await insertOpsNotification({
      type: "shipment_at_risk",
      payload: {
        awb: shipment.awb_number,
        edd: shipment.edd,
        status: shipment.status,
      },
    })

    await logAudit({
      action: "update",
      entity: "shipments",
      entityId: shipment.id,
      userEmail: "sla-cron@system",
      before: {
        sla_at_risk: shipment.sla_at_risk,
        sla_at_risk_alerted_at: shipment.sla_at_risk_alerted_at,
      },
      after: shipmentUpdate,
      metadata: {
        awb_number: shipment.awb_number,
      },
    })

    processed++
  }

  return NextResponse.json({
    success: true,
    processed,
    first_response_breaches: frBreaches?.length || 0,
    resolution_breaches: resBreaches?.length || 0,
    shipments_at_risk: atRiskShipments?.length || 0,
    checked_at: now,
  })
}
