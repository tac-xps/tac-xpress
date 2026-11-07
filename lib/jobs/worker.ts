import "server-only"
import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { tickets } from "@/lib/db/schema"
import { claimJob, finishJob } from "./store"
import { z } from "zod"

export interface ProcessJobsOptions {
  maxDurationMs?: number
}

/** Called by an authenticated scheduler or after a committed contact request. */
export async function processBackgroundJobs(
  limit = 2,
  ticketId?: string,
  options?: ProcessJobsOptions
) {
  const startTime = Date.now()
  // Reserve a 15-second safety margin to prevent serverless function timeouts mid-execution
  const maxDurationMs = options?.maxDurationMs ?? 45_000
  let processed = 0
  while (processed < limit) {
    if (processed > 0 && Date.now() - startTime > maxDurationMs - 15_000) {
      break
    }
    const job = await claimJob(ticketId)
    if (!job) break
    try {
      const ticket = await db.query.tickets.findFirst({
        where: eq(tickets.id, job.payload.ticketId),
      })
      if (!ticket) {
        await finishJob(job, false, "Ticket no longer exists.", true)
        processed++
        continue
      }
      if (job.kind === "support_email") {
        // Resend retains idempotency keys for 24h. Do not auto-resend an uncertain old attempt.
        if (
          job.attempts > 1 &&
          Date.now() - new Date(job.created_at).getTime() > 23 * 60 * 60 * 1000
        ) {
          const message =
            "Delivery needs manual review; provider idempotency window expired."
          Sentry.captureMessage(message, {
            level: "warning",
            tags: { area: "background_job", kind: job.kind },
            extra: {
              jobId: job.id,
              attempts: job.attempts,
              createdAt: job.created_at,
            },
          })
          await finishJob(job, false, message, true)
          processed++
          continue
        }
        const { sendTicketNotification } =
          await import("@/app/actions/email-notifications")
        const recipient = z
          .string()
          .email()
          .safeParse(ticket.customerEmail || ticket.guestEmail || "")
        if (!recipient.success)
          throw new Error(
            "Ticket notification recipient is missing or invalid."
          )
        const result = await sendTicketNotification({
          to: recipient.data,
          ticketId: ticket.id,
          subject: ticket.subject,
          type:
            job.payload.notificationType === "sla_breach"
              ? "sla_breach"
              : "ticket_created",
          idempotencyKey: `ticket-created/${job.id}`,
        })
        if (!result.success || result.skipped)
          throw new Error(
            result.error || "Email provider did not accept the notification."
          )
      } else if (job.kind === "support_triage") {
        const { triageTicket } = await import("@/app/actions/ai-triage")
        await triageTicket(
          ticket.id,
          ticket.subject,
          ticket.description,
          ticket.relatedAwb ?? undefined
        )
      } else {
        throw new Error("Unsupported background job kind.")
      }
      await finishJob(job, true)
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "background_job", kind: job.kind },
      })
      await finishJob(
        job,
        false,
        error instanceof Error ? error.message : "Background operation failed."
      )
    }
    processed++
  }
  return { processed }
}
