"use server"

import { db } from "@/lib/db"
import { hubs } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"
import {
  createHubSchema,
  updateHubSchema,
  deleteHubSchema,
} from "./validations"
import * as Sentry from "@sentry/nextjs"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export const createHubAction = actionClient
  .schema(createHubSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const [hub] = await db.insert(hubs).values(parsedInput).returning()

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "create",
        entity: "hubs",
        entityId: hub.id,
        after: hub,
      })

      revalidatePath("/dashboard/hubs")
      return { success: true, hub, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to create hub" }
    }
  })

export const updateHubAction = actionClient
  .schema(updateHubSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const { id, ...data } = parsedInput
      const before = await db.query.hubs.findFirst({ where: eq(hubs.id, id) })
      if (!before) return { success: false, error: "Hub not found" }
      const [hub] = await db
        .update(hubs)
        .set({ ...data })
        .where(eq(hubs.id, id))
        .returning()

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "update",
        entity: "hubs",
        entityId: id,
        before,
        after: hub,
      })

      revalidatePath("/dashboard/hubs")
      return { success: true, hub, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update hub" }
    }
  })

export const deleteHubAction = actionClient
  .schema(deleteHubSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) return authResult.response

    try {
      const before = await db.query.hubs.findFirst({
        where: eq(hubs.id, parsedInput.id),
      })
      if (!before) return { success: false, error: "Hub not found" }
      await db
        .update(hubs)
        .set({ deletedAt: new Date() })
        .where(eq(hubs.id, parsedInput.id))

      await logAudit({
        userId: authResult.session.user.id,
        userEmail: authResult.session.user.email || "unknown",
        action: "delete",
        entity: "hubs",
        entityId: parsedInput.id,
        before,
        after: { deletedAt: new Date().toISOString() },
      })

      revalidatePath("/dashboard/hubs")
      return { success: true, error: undefined }
    } catch (error) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to delete hub" }
    }
  })
