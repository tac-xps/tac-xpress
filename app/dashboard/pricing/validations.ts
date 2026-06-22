import { z } from "zod"

export const createPricingRuleSchema = z.object({
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  basePrice: z.coerce.number().min(0, "Base price cannot be negative"),
  pricePerKg: z.coerce.number().min(0, "Price per Kg cannot be negative"),
})
export const updatePricingRuleSchema = z.object({
  id: z.string().uuid(),
  serviceType: z.enum(["express_air", "standard_ocean", "road_freight"]),
  origin: z.string().min(2, "Origin must be at least 2 characters"),
  destination: z.string().min(2, "Destination must be at least 2 characters"),
  basePrice: z.coerce.number().min(0, "Base price cannot be negative"),
  pricePerKg: z.coerce.number().min(0, "Price per Kg cannot be negative"),
})
export const deletePricingRuleSchema = z.object({
  id: z.string().uuid(),
})

export type CreatePricingRuleValues = z.infer<typeof createPricingRuleSchema>
export type UpdatePricingRuleValues = z.infer<typeof updatePricingRuleSchema>

export const calculateEstimatedRateSchema = z.object({
  weightKg: z.number().positive(),
  serviceType: z.enum([
    "standard",
    "express",
    "sea",
    "express_air",
    "standard_ocean",
    "road_freight",
  ]),
  origin: z.string().optional(),
  destination: z.string().optional(),
})
export type CalculateEstimatedRateValues = z.infer<
  typeof calculateEstimatedRateSchema
>
