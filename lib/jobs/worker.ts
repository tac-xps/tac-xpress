import "server-only"
import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import { eq } from "drizzle-orm"
import { tickets } from "@/lib/db/schema"
import { claimJob, finishJob } from "./store"

/** Called by an authenticated scheduler or after a committed contact request. */
export async function processBackgroundJobs(limit = 2, ticketId?: string) {
  let processed = 0
  while (processed < limit) {
    const job = await claimJob(ticketId)
    if (!job) break
    try {
      const ticket = await db.query.tickets.findFirst({
        where: eq(tickets.id, job.payload.ticketId),
      })
      if (!ticket) throw new Error("Ticket no longer exists.")
      if (job.kind === "support_email") {
        // Resend retains idempotency keys for 24h. Do not auto-resend an uncertain old attempt.
        if (
          job.attempts > 1 &&
          Date.now() - new Date(job.created_at).getTime() > 23 * 60 * 60 * 1000
        )
          throw new Error(
            "Delivery needs manual review; provider idempotency window expired."
          )
        const { sendTicketNotification } =
          await import("@/app/actions/email-notifications")
        const result = await sendTicketNotification({
          to: ticket.customerEmail || ticket.guestEmail || "",
          ticketId: ticket.id,
          subject: ticket.subject,
          type: "ticket_created",
          idempotencyKey: `ticket-created/${job.id}`,
        })
        if (!result.success)
          throw new Error("Email provider did not accept the notification.")
      } else {
        const { triageTicket } = await import("@/app/actions/ai-triage")
        await triageTicket(
          ticket.id,
          ticket.subject,
          ticket.description,
          ticket.relatedAwb ?? undefined
        )
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
