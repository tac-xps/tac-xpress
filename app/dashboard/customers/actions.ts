"use server"

import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { and, eq, ne, or } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"

import * as Sentry from "@sentry/nextjs"

import { addCustomerSchema, editCustomerSchema } from "./validations"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export async function createCustomerAction(
  data: z.infer<typeof addCustomerSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = addCustomerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }
  const { email, phone, name, address, city, state, pinCode } = parsed.data

  try {
    const existingUser = await db.query.users.findFirst({
      where: and(
        eq(users.role, "customer"),
        email
          ? or(eq(users.email, email), eq(users.phone, phone))
          : eq(users.phone, phone)
      ),
    })

    if (existingUser) {
      if (existingUser.deletedAt) {
        const [restoredCustomer] = await db
          .update(users)
          .set({
            name,
            email: email || null,
            phone,
            address,
            city,
            state,
            pinCode,
            deletedAt: null,
          })
          .where(eq(users.id, existingUser.id))
          .returning()
        await logAudit({
          userId: authResult.session.user.id,
          userEmail: authResult.session.user.email || "unknown",
          action: "restore",
          entity: "customers",
          entityId: existingUser.id,
          before: existingUser,
          after: restoredCustomer,
        })
        revalidatePath("/dashboard/customers")
        return { success: true, customer: restoredCustomer, error: undefined }
      }
      return {
        success: false,
        error: "A customer with this email or phone already exists.",
      }
    }

    const [customer] = await db
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name,
        email: email || null,
        phone,
        address,
        city,
        state,
        pinCode,
        role: "customer",
      })
      .returning()

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "create",
      entity: "customers",
      entityId: customer.id,
      after: customer,
    })

    revalidatePath("/dashboard/customers")
    return { success: true, customer, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    const errCode =
      error.code || error?.cause?.code || error?.cause?.PostgresError?.code
    if (errCode === "23505") {
      if (email) {
        // Check if the user is soft-deleted
        const existingUser = await db.query.users.findFirst({
          where: and(eq(users.email, email), eq(users.role, "customer")),
        })

        if (existingUser && existingUser.deletedAt !== null) {
          // Restore and update the customer
          const [restoredCustomer] = await db
            .update(users)
            .set({
              name,
              phone,
              address,
              city,
              state,
              pinCode,
              deletedAt: null,
            })
            .where(eq(users.id, existingUser.id))
            .returning()

          revalidatePath("/dashboard/customers")
          return { success: true, customer: restoredCustomer, error: undefined }
        }
      }

      // Unique violation but not soft-deleted (or no email provided)
      return {
        success: false,
        error: "A user with this email already exists.",
      }
    }
    return {
      success: false,
      error: "Failed to create customer. Please try again.",
    }
  }
}

export async function updateCustomerAction(
  data: z.infer<typeof editCustomerSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = editCustomerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }
  const { id, email, phone, name, address, city, state, pinCode } = parsed.data

  try {
    const before = await db.query.users.findFirst({ where: and(eq(users.id, id), eq(users.role, "customer")) })
    if (!before) return { success: false, error: "Customer not found." }
    const duplicate = await db.query.users.findFirst({
      where: and(
        eq(users.role, "customer"),
        ne(users.id, id),
        email
          ? or(eq(users.email, email), eq(users.phone, phone || ""))
          : eq(users.phone, phone || "")
      ),
    })
    if (duplicate) {
      return {
        success: false,
        error: "A customer with this email or phone already exists.",
      }
    }

    await db
      .update(users)
      .set({
        name,
        email: email || null,
        phone,
        address,
        city,
        state,
        pinCode,
      })
      .where(eq(users.id, id))

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "update",
      entity: "customers",
      entityId: id,
      before,
      after: parsed.data,
    })

    revalidatePath("/dashboard/customers")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    const errCode =
      error.code || error?.cause?.code || error?.cause?.PostgresError?.code
    if (errCode === "23505") {
      return { success: false, error: "A user with this email already exists." }
    }
    return { success: false, error: "Failed to update customer." }
  }
}

const deleteCustomerSchema = z.object({
  id: z.string().uuid(),
})

export async function deleteCustomerAction(data: { id: string }) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = deleteCustomerSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: "Invalid form data" }
  }
  const { id } = parsed.data

  try {
    const before = await db.query.users.findFirst({ where: and(eq(users.id, id), eq(users.role, "customer")) })
    if (!before) return { success: false, error: "Customer not found." }
    // Soft delete
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id))

    await logAudit({
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "delete",
      entity: "customers",
      entityId: id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/customers")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete customer." }
  }
}
