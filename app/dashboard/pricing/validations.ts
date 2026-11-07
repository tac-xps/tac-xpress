import { z } from "zod"
import { freightRouteSchema } from "@/lib/schemas/freight-route"

export const createPricingRuleSchema = freightRouteSchema.safeExtend({
  serviceType: z.enum(["express_air", "road_freight"]),
  basePrice: z.coerce.number().min(0, "Base price cannot be negative"),
  pricePerKg: z.coerce.number().min(0, "Price per Kg cannot be negative"),
})
export const updatePricingRuleSchema = createPricingRuleSchema.safeExtend({
  id: z.string().uuid(),
})
export const deletePricingRuleSchema = z.object({
  id: z.string().uuid(),
})

export type CreatePricingRuleValues = z.infer<typeof createPricingRuleSchema>
export type UpdatePricingRuleValues = z.infer<typeof updatePricingRuleSchema>

export const calculateEstimatedRateSchema = freightRouteSchema.safeExtend({
  weightKg: z.number().positive(),
  serviceType: z.enum(["standard", "express", "express_air", "road_freight"]),
})
export type CalculateEstimatedRateValues = z.infer<
  typeof calculateEstimatedRateSchema
>
