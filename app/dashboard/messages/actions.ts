"use server"

import { revalidatePath } from "next/cache"
import { authActionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { db } from "@/lib/db"
import { tickets } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { logAudit } from "@/lib/audit"

import {
  createTicketSchema,
  updateTicketSchema,
  deleteTicketSchema,
} from "./schema"

export const createTicketAction = authActionClient
  .schema(createTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const [ticket] = await db
        .insert(tickets)
        .values({
          ...parsedInput,
          source: "dashboard",
          status: "open",
        })
        .returning()

      await logAudit({
        action: "create",
        entity: "tickets",
        entityId: ticket.id,
        userId: ctx.session.user.id,
        userEmail: ctx.session.user.email,
        after: ticket,
      })

      revalidatePath("/dashboard/messages")
      return { success: true, ticket, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to create ticket" }
    }
  })

export const updateTicketAction = authActionClient
  .schema(updateTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const before = await db.query.tickets.findFirst({
        where: eq(tickets.id, parsedInput.id),
      })

      if (!before) {
        return { success: false, error: "Ticket not found" }
      }

      const [updatedTicket] = await db
        .update(tickets)
        .set({
          status: parsedInput.status,
          priority: parsedInput.priority,
          assignedTo: parsedInput.assignedTo,
          category: parsedInput.category,
        })
        .where(eq(tickets.id, parsedInput.id))
        .returning()

      await logAudit({
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
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update ticket" }
    }
  })

export const deleteTicketAction = authActionClient
  .schema(deleteTicketSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      const { data: ticket, error: lookupError } = await supabaseAdmin
        .from("tickets")
        .select("id, status, category, priority, assigned_to, created_at")
        .eq("id", parsedInput.id)
        .maybeSingle()

      if (lookupError) throw lookupError
      if (!ticket) {
        return { success: false, error: "Ticket not found" }
      }

      const { error } = await supabaseAdmin
        .from("tickets")
        .delete()
        .eq("id", parsedInput.id)

      if (error) {
        throw error
      }

      await logAudit({
        action: "delete",
        entity: "tickets",
        entityId: parsedInput.id,
        userId: ctx.session.user.id,
        userEmail: ctx.session.user.email,
        before: ticket,
      })

      revalidatePath("/dashboard/messages")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete ticket" }
    }
  })
