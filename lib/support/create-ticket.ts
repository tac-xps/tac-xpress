import "server-only"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { logAuditInTransaction } from "@/lib/audit"
import { enqueueTicketJobs } from "@/lib/jobs/store"
import {
  mapLandingCategoryToTriage,
  type LandingTicketCategory,
} from "./tickets"

interface ContactInput {
  customer_name: string
  customer_email: string
  customer_phone?: string
  subject: string
  message: string
  category: LandingTicketCategory
  related_awb?: string
}
export async function saveContactTicket(input: ContactInput) {
  return db.transaction(async (tx) => {
    const [ticket] = await tx
      .insert(tickets)
      .values({
        customerName: input.customer_name,
        customerEmail: input.customer_email,
        customerPhone: input.customer_phone,
        guestEmail: input.customer_email,
        subject: input.subject,
        message: input.message,
        description: input.message,
        category: mapLandingCategoryToTriage(input.category),
        intakeCategory: input.category,
        relatedAwb: input.related_awb,
        source: "landing",
        status: "open",
        priority: "medium",
      })
      .returning({ id: tickets.id })
    await logAuditInTransaction(tx, {
      action: "create",
      entity: "tickets",
      entityId: ticket.id,
      userEmail: input.customer_email,
      after: { status: "open", source: "landing", category: input.category },
    })
    await enqueueTicketJobs(tx, ticket.id)
    return ticket
  })
}
