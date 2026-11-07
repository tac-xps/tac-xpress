"use server"

import { db } from "@/lib/db"
import { hubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"
import {
  createHubSchema,
  updateHubSchema,
  deleteHubSchema,
} from "./validations"
import * as Sentry from "@sentry/nextjs"
import { logAuditInTransaction } from "@/lib/audit"

export const createHubAction = authActionClient
  .schema(createHubSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const [hub] = await tx.insert(hubs).values(parsedInput).returning()

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "create",
          entity: "hubs",
          entityId: hub.id,
          after: hub,
        })

        revalidatePath("/dashboard/hubs")
        return { success: true, hub, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to create hub" }
    }
  })

export const updateHubAction = authActionClient
  .schema(updateHubSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const { id, ...data } = parsedInput
        const before = await tx.query.hubs.findFirst({ where: eq(hubs.id, id) })
        if (!before) return { success: false, error: "Hub not found" }
        const [hub] = await tx
          .update(hubs)
          .set({ ...data })
          .where(eq(hubs.id, id))
          .returning()

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "update",
          entity: "hubs",
          entityId: id,
          before,
          after: hub,
        })

        revalidatePath("/dashboard/hubs")
        return { success: true, hub, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update hub" }
    }
  })

export const deleteHubAction = authActionClient
  .schema(deleteHubSchema)
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await db.transaction(async (tx) => {
        const before = await tx.query.hubs.findFirst({
          where: eq(hubs.id, parsedInput.id),
        })
        if (!before) return { success: false, error: "Hub not found" }
        await tx
          .update(hubs)
          .set({ deletedAt: new Date() })
          .where(eq(hubs.id, parsedInput.id))

        await logAuditInTransaction(tx, {
          userId: ctx.session.user.id,
          userEmail: ctx.session.user.email || "unknown",
          action: "delete",
          entity: "hubs",
          entityId: parsedInput.id,
          before,
          after: { deletedAt: new Date().toISOString() },
        })

        revalidatePath("/dashboard/hubs")
        return { success: true, error: undefined }
      })
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete hub" }
    }
  })
