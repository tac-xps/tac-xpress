"use server"

import { revalidatePath } from "next/cache"
import { authActionClient } from "@/lib/safe-action"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { feedback } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { logAuditInTransaction } from "@/lib/audit"

const deleteFeedbackSchema = z.object({
  id: z.string().uuid(),
})

export const deleteFeedbackAction = authActionClient
  .schema(deleteFeedbackSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const before = await tx.query.feedback.findFirst({
          where: eq(feedback.id, parsedInput.id),
        })

        if (!before) {
          return { success: false, error: "Feedback not found" }
        }

        await tx.delete(feedback).where(eq(feedback.id, parsedInput.id))

        await logAuditInTransaction(tx, {
          action: "delete",
          entity: "feedback",
          entityId: parsedInput.id,
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email,
          before,
        })

        revalidatePath("/dashboard/feedback")
        return { success: true, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete feedback" }
    }
  })
