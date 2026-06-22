"use server"

import { revalidatePath } from "next/cache"
import { actionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { requireDashboardAction } from "@/lib/auth/guards"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { logAudit } from "@/lib/audit"

const deleteTicketSchema = z.object({
  id: z.string().uuid(),
})

export const deleteTicketAction = actionClient
  .schema(deleteTicketSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

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
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email,
        before: ticket,
      })

      revalidatePath("/dashboard/messages")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete ticket" }
    }
  })
