"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, ne, or, inArray } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"

import * as Sentry from "@sentry/nextjs"

import { addStaffSchema, editStaffSchema } from "./validations"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export const createStaffAction = authActionClient
  .schema(addStaffSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    // Only admins can create staff
    const authResult = await requireDashboardAction(["admin"])
    if (!authResult.ok) return authResult.response
    const { email, phone, name, role } = data
    const session = ctx.session

    try {
      const existingUser = await db.query.users.findFirst({
        where: or(eq(users.email, email), eq(users.phone, phone)),
      })

      if (existingUser) {
        if (existingUser.deletedAt) {
          const [restoredUser] = await db
            .update(users)
            .set({
              name,
              email,
              phone,
              role,
              deletedAt: null,
            })
            .where(eq(users.id, existingUser.id))
            .returning()
            
          await logAudit({
            userId: session.user.id,
            userEmail: session.user.email || "unknown",
            action: "restore",
            entity: "users",
            entityId: existingUser.id,
            before: existingUser,
            after: restoredUser,
          })
          revalidatePath("/dashboard/staff")
          return { success: true, staff: restoredUser, error: undefined }
        }
        
        // If they already exist as a customer, we could upgrade them, but safer to reject
        return {
          success: false,
          error: "A user with this email or phone already exists.",
        }
      }

      const [staff] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name,
          email,
          phone,
          role,
        })
        .returning()

      await logAudit({
        userId: session.user.id,
        userEmail: session.user.email || "unknown",
        action: "create",
        entity: "users",
        entityId: staff.id,
        after: staff,
      })

      revalidatePath("/dashboard/staff")
      return { success: true, staff, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      return {
        success: false,
        error: "Failed to add staff member. Please try again.",
      }
    }
  })

export const updateStaffAction = authActionClient
  .schema(editStaffSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const authResult = await requireDashboardAction(["admin"])
    if (!authResult.ok) return authResult.response
    const { id, email, phone, name, role } = data
    const session = ctx.session

    try {
      const before = await db.query.users.findFirst({
        where: and(eq(users.id, id), inArray(users.role, ["staff", "admin"])),
      })
      if (!before) return { success: false, error: "Staff member not found." }
      
      const duplicate = await db.query.users.findFirst({
        where: and(
          ne(users.id, id),
          email
            ? or(eq(users.email, email), eq(users.phone, phone || ""))
            : eq(users.phone, phone || "")
        ),
      })
      if (duplicate) {
        return {
          success: false,
          error: "A user with this email or phone already exists.",
        }
      }

      await db
        .update(users)
        .set({
          name,
          email,
          phone,
          role,
        })
        .where(eq(users.id, id))

      await logAudit({
        userId: session.user.id,
        userEmail: session.user.email || "unknown",
        action: "update",
        entity: "users",
        entityId: id,
        before,
        after: data,
      })

      revalidatePath("/dashboard/staff")
      return { success: true, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to update staff member." }
    }
  })

const deleteStaffSchema = z.object({
  id: z.string().uuid(),
})

export const deleteStaffAction = authActionClient
  .schema(deleteStaffSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const authResult = await requireDashboardAction(["admin"])
    if (!authResult.ok) return authResult.response
    const { id } = data
    const session = ctx.session

    if (id === session.user.id) {
      return { success: false, error: "You cannot revoke your own access." }
    }

    try {
      const before = await db.query.users.findFirst({
        where: and(eq(users.id, id), inArray(users.role, ["staff", "admin"])),
      })
      if (!before) return { success: false, error: "Staff member not found." }
      
      // Soft delete revokes access
      await db
        .update(users)
        .set({ deletedAt: new Date() })
        .where(eq(users.id, id))

      await logAudit({
        userId: session.user.id,
        userEmail: session.user.email || "unknown",
        action: "delete",
        entity: "users",
        entityId: id,
        before,
        after: { deletedAt: new Date().toISOString() },
      })

      revalidatePath("/dashboard/staff")
      return { success: true, error: undefined }
    } catch (error: any) {
      Sentry.captureException(error)
      return { success: false, error: "Failed to revoke access." }
    }
  })
