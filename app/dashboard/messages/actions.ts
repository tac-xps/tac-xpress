"use server"

import { revalidatePath } from "next/cache"
import { authActionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"

import {
  createTicketSchema,
  updateTicketSchema,
  deleteTicketSchema,
} from "./schema"

export const createTicketAction = authActionClient
  .schema(createTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const [ticket] = await tx
          .insert(tickets)
          .values({
            ...parsedInput,
            source: "dashboard",
            status: "open",
          })
          .returning()

        await logAuditInTransaction(tx, {
          action: "create",
          entity: "tickets",
          entityId: ticket.id,
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email,
          after: ticket,
        })

        revalidatePath("/dashboard/messages")
        return { success: true, ticket, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to create ticket" }
    }
  })

export const updateTicketAction = authActionClient
  .schema(updateTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const before = await tx.query.tickets.findFirst({
          where: eq(tickets.id, parsedInput.id),
        })

        if (!before) {
          return { success: false, error: "Ticket not found" }
        }

        const [updatedTicket] = await tx
          .update(tickets)
          .set({
            status: parsedInput.status,
            priority: parsedInput.priority,
            assignedTo: parsedInput.assignedTo,
            category: parsedInput.category,
          })
          .where(eq(tickets.id, parsedInput.id))
          .returning()

        await logAuditInTransaction(tx, {
          action: "update",
          entity: "tickets",
          entityId: parsedInput.id,
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email,
          before,
          after: updatedTicket,
        })

        revalidatePath("/dashboard/messages")
        return { success: true, ticket: updatedTicket, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update ticket" }
    }
  })

export const deleteTicketAction = authActionClient
  .schema(deleteTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const ticket = await tx.query.tickets.findFirst({
          where: eq(tickets.id, parsedInput.id),
        })
        if (!ticket) {
          return { success: false, error: "Ticket not found" }
        }

        await tx.delete(tickets).where(eq(tickets.id, parsedInput.id))

        await logAuditInTransaction(tx, {
          action: "delete",
          entity: "tickets",
          entityId: parsedInput.id,
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email,
          before: ticket,
        })

        revalidatePath("/dashboard/messages")
        return { success: true, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete ticket" }
    }
  })
