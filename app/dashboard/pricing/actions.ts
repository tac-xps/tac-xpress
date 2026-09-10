"use server"

import { db } from "@/lib/db"
import { pricingRules } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { authActionClient } from "@/lib/safe-action"
import {
  createPricingRuleSchema,
  updatePricingRuleSchema,
  deletePricingRuleSchema,
  calculateEstimatedRateSchema,
} from "./validations"
import { calculateEstimatedRate } from "@/lib/pricing"
import { logAudit } from "@/lib/audit"

export const getEstimatedRateAction = authActionClient
  .schema(calculateEstimatedRateSchema)
  .action(async ({ parsedInput, ctx }) => {
    const rate = await calculateEstimatedRate(parsedInput)
    return { success: true, rate, error: undefined }
  })

export const createPricingRuleAction = authActionClient
  .schema(createPricingRuleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session
    const { serviceType, origin, destination, basePrice, pricePerKg } = data

  try {
    const basePriceInCents = Math.round(basePrice * 100)
    const pricePerKgInCents = Math.round(pricePerKg * 100)

    const [rule] = await db
      .insert(pricingRules)
      .values({
        serviceType,
        origin,
        destination,
        basePrice: basePriceInCents,
        pricePerKg: pricePerKgInCents,
      })
      .returning()

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "create",
      entity: "pricing_rules",
      entityId: rule.id,
      after: rule,
    })

    revalidatePath("/dashboard/pricing")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    return {
      success: false,
      error: error.message || "Failed to create pricing rule",
    }
  }
})

export const updatePricingRuleAction = authActionClient
  .schema(updatePricingRuleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session
    const { id, serviceType, origin, destination, basePrice, pricePerKg } = data

  try {
    const before = await db.query.pricingRules.findFirst({
      where: eq(pricingRules.id, id),
    })
    if (!before) return { success: false, error: "Pricing rule not found" }
    const basePriceInCents = Math.round(basePrice * 100)
    const pricePerKgInCents = Math.round(pricePerKg * 100)

    await db
      .update(pricingRules)
      .set({
        serviceType,
        origin,
        destination,
        basePrice: basePriceInCents,
        pricePerKg: pricePerKgInCents,
      })
      .where(eq(pricingRules.id, id))

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "update",
      entity: "pricing_rules",
      entityId: id,
      before,
      after: data,
    })

    revalidatePath("/dashboard/pricing")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to update pricing rule" }
  }
})

export const deletePricingRuleAction = authActionClient
  .schema(deletePricingRuleSchema)
  .action(async ({ parsedInput: data, ctx }) => {
    const session = ctx.session
    const { id } = data

  try {
    const before = await db.query.pricingRules.findFirst({
      where: eq(pricingRules.id, id),
    })
    if (!before) return { success: false, error: "Pricing rule not found" }
    await db
      .update(pricingRules)
      .set({ deletedAt: new Date() })
      .where(eq(pricingRules.id, id))

    await logAudit({
      userId: session.user.id,
      userEmail: session.user.email || "unknown",
      action: "delete",
      entity: "pricing_rules",
      entityId: id,
      before,
      after: { deletedAt: new Date().toISOString() },
    })

    revalidatePath("/dashboard/pricing")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to delete pricing rule" }
  }
})
