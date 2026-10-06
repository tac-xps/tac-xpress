"use server"

import { db } from "@/lib/db"
import { users, invoices, shipments } from "@/lib/db/schema"
import { and, desc, eq, ne, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"

import * as Sentry from "@sentry/nextjs"

import { addCustomerSchema, editCustomerSchema } from "./validations"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export const createCustomerAction = authActionClient
  .schema(addCustomerSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const { email, phone, name, address, city, state, pinCode } = data
    const session = ctx.session

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
          userId: session.user.id,
          userEmail: session.user.email || "unknown",
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
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

export const updateCustomerAction = authActionClient
  .schema(editCustomerSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const { id, email, phone, name, address, city, state, pinCode } = data
    const session = ctx.session

  try {
    const before = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.role, "customer")),
    })
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
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "update",
      entity: "customers",
      entityId: id,
      before,
      after: data,
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
})

const deleteCustomerSchema = z.object({
  id: z.string().uuid(),
})

export const deleteCustomerAction = authActionClient
  .schema(deleteCustomerSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const { id } = data
    const session = ctx.session

  try {
    const before = await db.query.users.findFirst({
      where: and(eq(users.id, id), eq(users.role, "customer")),
    })
    if (!before) return { success: false, error: "Customer not found." }
    // Soft delete
    await db
      .update(users)
      .set({ deletedAt: new Date() })
      .where(eq(users.id, id))

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
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
})

const getCustomerLedgerSchema = z.object({
  id: z.string().uuid(),
})

export const getCustomerLedgerAction = authActionClient
  .schema(getCustomerLedgerSchema)
  .action(async ({ parsedInput }) => {
    try {
      const { id } = parsedInput

      const customer = await db.query.users.findFirst({
        where: and(eq(users.id, id), eq(users.role, "customer")),
      })

      if (!customer) {
        throw new Error("Customer not found")
      }

      const [customerInvoices, aggregateSums] = await Promise.all([
        db
          .select({
            id: invoices.id,
            amount: invoices.amount,
            advancePaid: invoices.advancePaid,
            balanceDue: invoices.balanceDue,
            status: invoices.status,
            createdAt: invoices.createdAt,
            awbNumber: shipments.awbNumber,
          })
          .from(invoices)
          .leftJoin(shipments, eq(invoices.shipmentId, shipments.id))
          .where(eq(invoices.customerId, id))
          .orderBy(desc(invoices.createdAt))
          .limit(50),
        db
          .select({
            totalBilled: sql<number>`sum(${invoices.amount})`,
            totalAdvance: sql<number>`sum(${invoices.advancePaid})`,
            totalDue: sql<number>`sum(${invoices.balanceDue})`,
          })
          .from(invoices)
          .where(eq(invoices.customerId, id)),
      ])

      const totalBilled = Number(aggregateSums[0]?.totalBilled) || 0
      const totalAdvance = Number(aggregateSums[0]?.totalAdvance) || 0
      const totalDue = Number(aggregateSums[0]?.totalDue) || 0

      return {
        customer,
        invoices: customerInvoices,
        totals: {
          totalBilled,
          totalAdvance,
          totalDue,
        },
      }
    } catch (error: any) {
      Sentry.captureException(error)
      throw new Error(error?.message || "Failed to retrieve customer ledger.")
    }
  })

