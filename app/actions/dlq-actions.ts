"use server"

import { db } from "@/lib/db"
import { deadLetterQueue, backgroundJobs, tickets } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"
import * as Sentry from "@sentry/nextjs"
import { revalidatePath } from "next/cache"

export interface DlqActionResponse {
  success: boolean
  error?: string
  message?: string
}

/**
 * Manually retry a failed dead-letter queue item.
 * Restricted to staff and admin dashboard roles.
 */
export async function retryDlqItem(dlqId: string): Promise<DlqActionResponse> {
  const authCheck = await requireDashboardAction(["admin", "staff"])
  if (!authCheck.ok) {
    return { success: false, error: authCheck.response.error }
  }

  // Atomic claim: increment retryCount to lock this item from concurrent execution
  const [claimed] = await db
    .update(deadLetterQueue)
    .set({
      retryCount: sql`${deadLetterQueue.retryCount} + 1`,
    })
    .where(eq(deadLetterQueue.id, dlqId))
    .returning()

  if (!claimed) {
    return { success: false, error: "DLQ item not found or already in recovery." }
  }

  const item = claimed
  const payload = (item.payload ?? {}) as Record<string, any>

  try {
    let reprocessed = false

    // Route to the appropriate recovery handler based on the recorded action
    if (item.action === "ai_auto_reply_generation") {
      if (payload.ticketId && payload.category) {
        let awb = payload.awb
        if (!awb) {
          const t = await db.query.tickets.findFirst({
            where: eq(tickets.id, payload.ticketId),
            columns: { relatedAwb: true },
          })
          awb = t?.relatedAwb ?? undefined
        }
        const { generateAutoReply } = await import("@/app/actions/ai-responder")
        const replyResult = await generateAutoReply(payload.ticketId, payload.category, awb)
        if (!replyResult) {
          throw new Error("AI auto-reply generation returned null or failed safety guardrail.")
        }
        reprocessed = true
      }
    } else if (
      item.action === "ai_triage_openai" ||
      item.action === "ai_triage_jev" ||
      item.action === "ai_triage_db_update"
    ) {
      if (payload.ticketId) {
        const { triageTicket } = await import("@/app/actions/ai-triage")
        const ticket = await db.query.tickets.findFirst({
          where: eq(tickets.id, payload.ticketId),
        })
        if (ticket) {
          await triageTicket(
            ticket.id,
            ticket.subject,
            ticket.description || ticket.message || "",
            ticket.relatedAwb ?? undefined
          )
          reprocessed = true
        } else {
          throw new Error(`Ticket ${payload.ticketId} not found in database.`)
        }
      }
    } else if (item.action === "whatsapp_relay_send") {
      if (payload.to && payload.text) {
        const { sendWhatsAppTextMessage } = await import("@/lib/whatsapp/service")
        const relayResult = await sendWhatsAppTextMessage({
          to: payload.to,
          text: payload.text,
          relatedTicketId: payload.relatedTicketId,
          relatedAwb: payload.relatedAwb,
          context: "dlq_retry",
        })
        if (!relayResult.success) {
          throw new Error(relayResult.error || "WhatsApp relay message failed to send.")
        }
        reprocessed = true
      }
    } else if (
      item.action === "support_email" ||
      item.action === "support_triage" ||
      item.action === "sla_breach_email_fr" ||
      item.action === "sla_breach_email_res"
    ) {
      if (payload.ticketId) {
        await db.execute(
          sql`insert into background_jobs (kind, dedupe_key, payload, status) values (${item.action}, ${payload.ticketId}, ${JSON.stringify(payload)}::jsonb, 'pending') on conflict (kind, dedupe_key) do update set status = 'pending', attempts = 0, available_at = now()`
        )
        reprocessed = true
      }
    } else if (payload.ticketId) {
      // Generic background job re-enqueue fallback
      await db.execute(
        sql`insert into background_jobs (kind, dedupe_key, payload, status) values ('support_triage', ${payload.ticketId}, ${JSON.stringify(payload)}::jsonb, 'pending') on conflict (kind, dedupe_key) do update set status = 'pending', attempts = 0, available_at = now()`
      )
      reprocessed = true
    }

    if (!reprocessed) {
      throw new Error(`No automated retry strategy available for action "${item.action}".`)
    }

    // Write audit log safely before removing DLQ item
    await logAudit({
      action: "dlq_item_retried",
      entity: "dead_letter_queue",
      entityId: dlqId,
      userId: authCheck.session.user.id,
      userEmail: authCheck.session.user.email ?? null,
      metadata: {
        originalAction: item.action,
        retryCount: item.retryCount,
        success: true,
      },
    }).catch((auditErr) => {
      console.error("[DLQ] Failed to write audit log:", auditErr)
      Sentry.captureException(auditErr)
    })

    // On success: delete from DLQ
    await db.delete(deadLetterQueue).where(eq(deadLetterQueue.id, dlqId))

    revalidatePath("/dashboard/jobs")
    revalidatePath("/dashboard/communications")

    return {
      success: true,
      message: `Successfully reprocessed ${item.action}.`,
    }
  } catch (error: any) {
    const errorMessage = error?.message || "Retry attempt failed."
    Sentry.captureException(error, {
      tags: { area: "dlq_retry", action: item.action },
      extra: { dlqId },
    })

    // Update retry count and error in DLQ
    await db
      .update(deadLetterQueue)
      .set({
        error: errorMessage,
      })
      .where(eq(deadLetterQueue.id, dlqId))

    revalidatePath("/dashboard/jobs")

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Dismiss a DLQ item without retrying (operator acknowledges the failure as unrecoverable).
 */
export async function dismissDlqItem(dlqId: string): Promise<DlqActionResponse> {
  const authCheck = await requireDashboardAction(["admin", "staff"])
  if (!authCheck.ok) {
    return { success: false, error: authCheck.response.error }
  }

  const [item] = await db
    .select({ id: deadLetterQueue.id, action: deadLetterQueue.action })
    .from(deadLetterQueue)
    .where(eq(deadLetterQueue.id, dlqId))
    .limit(1)

  if (!item) {
    return { success: false, error: "DLQ item not found." }
  }

  await logAudit({
    action: "dlq_item_dismissed",
    entity: "dead_letter_queue",
    entityId: dlqId,
    userId: authCheck.session.user.id,
    userEmail: authCheck.session.user.email ?? null,
    metadata: {
      action: item.action,
    },
  }).catch((auditErr) => {
    console.error("[DLQ] Failed to write audit log for dismissal:", auditErr)
    Sentry.captureException(auditErr)
  })

  await db.delete(deadLetterQueue).where(eq(deadLetterQueue.id, dlqId))

  revalidatePath("/dashboard/jobs")
  revalidatePath("/dashboard/communications")

  return { success: true, message: "DLQ item dismissed." }
}
