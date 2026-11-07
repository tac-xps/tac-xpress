import { db } from "@/lib/db"
import { freightRouteSchema } from "@/lib/schemas/freight-route"

export type ServiceType =
  | "standard"
  | "express"
  | "express_air"
  | "road_freight"

export interface RateCalculationParams {
  weightKg: number
  serviceType: ServiceType
  origin: string
  destination: string
}

export async function calculateEstimatedRate({
  weightKg,
  serviceType,
  origin,
  destination,
}: RateCalculationParams): Promise<number> {
  const route = freightRouteSchema.parse({ origin, destination })
  if (!Number.isFinite(weightKg) || weightKg <= 0)
    throw new Error("Enter a positive weight.")
  if (
    !["standard", "express", "express_air", "road_freight"].includes(
      serviceType
    )
  ) {
    throw new Error("Choose air or surface cargo.")
  }
  const dbServiceType =
    serviceType === "express" || serviceType === "express_air"
      ? "express_air"
      : "road_freight"
  const originCode = route.origin === "New Delhi" ? "del" : "imf"
  const destinationCode = route.destination === "New Delhi" ? "del" : "imf"
  const rule = await db.query.pricingRules.findFirst({
    where: (
      rules,
      { sql }
    ) => sql`(LOWER(${rules.origin}) = ${route.origin.toLowerCase()} OR LOWER(${rules.origin}) = ${originCode} OR LOWER(${rules.origin}) = ${route.origin === "New Delhi" ? "delhi" : "imphal"})
      AND (LOWER(${rules.destination}) = ${route.destination.toLowerCase()} OR LOWER(${rules.destination}) = ${destinationCode} OR LOWER(${rules.destination}) = ${route.destination === "New Delhi" ? "delhi" : "imphal"})
      AND ${rules.serviceType} = ${dbServiceType} AND ${rules.deletedAt} IS NULL`,
    orderBy: (rules, { desc }) => [desc(rules.createdAt), desc(rules.id)],
  })
  if (!rule)
    throw new Error(
      "No active pricing rule is configured for this corridor and service."
    )
  return Number(
    (Math.max(rule.basePrice, weightKg * rule.pricePerKg) / 100).toFixed(2)
  )
}
