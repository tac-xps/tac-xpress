"use server"

import { db } from "@/lib/db"
import { pricingRules } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { actionClient } from "@/lib/safe-action"
import {
  createPricingRuleSchema,
  updatePricingRuleSchema,
  deletePricingRuleSchema,
  calculateEstimatedRateSchema,
} from "./validations"
import { calculateEstimatedRate } from "@/lib/pricing"
import { requireDashboardAction } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"

export const getEstimatedRateAction = actionClient
  .schema(calculateEstimatedRateSchema)
  .action(async ({ parsedInput }) => {
    const authResult = await requireDashboardAction()
    if (!authResult.ok) {
      return {
        success: false,
        error: authResult.response.error,
        rate: undefined,
      }
    }

    const rate = await calculateEstimatedRate(parsedInput)
    return { success: true, rate, error: undefined }
  })

export async function createPricingRuleAction(
  data: z.infer<typeof createPricingRuleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = createPricingRuleSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: "Invalid form data" }
  const { serviceType, origin, destination, basePrice, pricePerKg } =
    parsed.data

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
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
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
}

export async function updatePricingRuleAction(
  data: z.infer<typeof updatePricingRuleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = updatePricingRuleSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: "Invalid form data" }
  const { id, serviceType, origin, destination, basePrice, pricePerKg } =
    parsed.data

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
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
      action: "update",
      entity: "pricing_rules",
      entityId: id,
      before,
      after: parsed.data,
    })

    revalidatePath("/dashboard/pricing")
    return { success: true, error: undefined }
  } catch (error: any) {
    Sentry.captureException(error)
    return { success: false, error: "Failed to update pricing rule" }
  }
}

export async function deletePricingRuleAction(
  data: z.infer<typeof deletePricingRuleSchema>
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  const parsed = deletePricingRuleSchema.safeParse(data)
  if (!parsed.success) return { success: false, error: "Invalid form data" }
  const { id } = parsed.data

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
      userId: authResult.session.user.id,
      userEmail: authResult.session.user.email || "unknown",
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
}
