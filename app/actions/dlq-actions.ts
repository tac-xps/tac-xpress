"use server"

import { db } from "@/lib/db"
import { deadLetterQueue, tickets } from "@/lib/db/schema"
import { and, eq, isNull, sql } from "drizzle-orm"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAuditInTransaction } from "@/lib/audit"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { revalidatePath } from "next/cache"
import { queryRows } from "@/lib/jobs/store"

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

  // Expired claims stay closed: a crashed sender may already have reached its provider.
  const recoveryToken = crypto.randomUUID()
  const [claimed] = await db
    .update(deadLetterQueue)
    .set({
      retryCount: sql`${deadLetterQueue.retryCount} + 1`,
      recoveryToken,
      lockedUntil: new Date(Date.now() + 5 * 60 * 1000),
    })
    .where(
      and(eq(deadLetterQueue.id, dlqId), isNull(deadLetterQueue.recoveryToken))
    )
    .returning()

  if (!claimed) {
    return {
      success: false,
      error:
        "DLQ item unavailable or claimed. Review provider history before recovering an expired claim.",
    }
  }

  const item = claimed
  let reprocessed = false

  try {
    const payload = z
      .object({
        ticketId: z.string().uuid().optional(),
        category: z.string().optional(),
        awb: z.string().optional(),
      })
      .parse(item.payload ?? {})

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
        const replyResult = await generateAutoReply(
          payload.ticketId,
          payload.category,
          awb,
          {
            enqueueDlqOnFailure: false,
          }
        )
        if (!replyResult) {
          throw new Error(
            "AI auto-reply generation returned null or failed safety guardrail."
          )
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
      throw new Error(
        "Review WhatsApp provider history before creating another delivery attempt. Automatic resend is disabled for uncertain sends."
      )
    } else if (
      item.action === "support_email" ||
      item.action === "support_triage" ||
      item.action === "sla_breach_email_fr" ||
      item.action === "sla_breach_email_res"
    ) {
      if (payload.ticketId) {
        const slaEmail =
          item.action === "sla_breach_email_fr" ||
          item.action === "sla_breach_email_res"
        const kind = slaEmail ? "support_email" : item.action
        const dedupeKey = slaEmail
          ? `${item.action}/${payload.ticketId}`
          : payload.ticketId
        const jobPayload = slaEmail
          ? { ...payload, notificationType: "sla_breach" }
          : payload
        const queued = await db.execute(
          sql`insert into background_jobs (kind, dedupe_key, payload, status) values (${kind}, ${dedupeKey}, ${JSON.stringify(jobPayload)}::jsonb, 'pending') on conflict (kind, dedupe_key) do update set status = 'pending', attempts = least(background_jobs.attempts, 4), available_at = now() where background_jobs.status = 'failed' and (background_jobs.kind = 'support_triage' or background_jobs.created_at > now() - interval '23 hours') returning id`
        )
        if (!queryRows(queued).length)
          throw new Error(
            "Existing job is active, completed, or outside the safe email retry window. Review its delivery history."
          )
        reprocessed = true
      }
    }

    if (!reprocessed) {
      throw new Error(
        `No automated retry strategy available for action "${item.action}".`
      )
    }

    await db.transaction(async (tx) => {
      const deleted = await tx
        .delete(deadLetterQueue)
        .where(
          and(
            eq(deadLetterQueue.id, dlqId),
            eq(deadLetterQueue.recoveryToken, recoveryToken)
          )
        )
        .returning({ id: deadLetterQueue.id })
      if (!deleted.length)
        throw new Error(
          "DLQ recovery ownership was lost. Review the completed operation."
        )
      await logAuditInTransaction(tx, {
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
      })
    })

    revalidatePath("/dashboard/jobs")
    revalidatePath("/dashboard/communications")

    return {
      success: true,
      message: `Successfully reprocessed ${item.action}.`,
    }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Retry attempt failed."
    Sentry.captureException(error, {
      tags: { area: "dlq_retry", action: item.action },
      extra: { dlqId },
    })

    // Update retry count and error in DLQ
    await db
      .update(deadLetterQueue)
      .set({
        error: errorMessage,
        ...(reprocessed ? {} : { recoveryToken: null, lockedUntil: null }),
      })
      .where(
        and(
          eq(deadLetterQueue.id, dlqId),
          eq(deadLetterQueue.recoveryToken, recoveryToken)
        )
      )

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
export async function dismissDlqItem(
  dlqId: string
): Promise<DlqActionResponse> {
  const authCheck = await requireDashboardAction(["admin", "staff"])
  if (!authCheck.ok) {
    return { success: false, error: authCheck.response.error }
  }

  const [item] = await db
    .select({
      id: deadLetterQueue.id,
      action: deadLetterQueue.action,
      retryCount: deadLetterQueue.retryCount,
    })
    .from(deadLetterQueue)
    .where(eq(deadLetterQueue.id, dlqId))
    .limit(1)

  if (!item) {
    return { success: false, error: "DLQ item not found." }
  }

  const deleted = await db.transaction(async (tx) => {
    const rows = await tx
      .delete(deadLetterQueue)
      .where(
        and(
          eq(deadLetterQueue.id, dlqId),
          isNull(deadLetterQueue.recoveryToken),
          eq(deadLetterQueue.retryCount, item.retryCount)
        )
      )
      .returning({ id: deadLetterQueue.id })
    if (!rows.length) return false
    await logAuditInTransaction(tx, {
      action: "dlq_item_dismissed",
      entity: "dead_letter_queue",
      entityId: dlqId,
      userId: authCheck.session.user.id,
      userEmail: authCheck.session.user.email ?? null,
      metadata: {
        action: item.action,
      },
    })
    return true
  })

  if (!deleted) {
    return {
      success: false,
      error: "DLQ item is currently being retried. Please wait.",
    }
  }

  revalidatePath("/dashboard/jobs")
  revalidatePath("/dashboard/communications")

  return { success: true, message: "DLQ item dismissed." }
}
