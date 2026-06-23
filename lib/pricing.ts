import { db } from "@/lib/db"

export type ServiceType =
  | "standard"
  | "express"
  | "sea"
  | "express_air"
  | "standard_ocean"
  | "road_freight"

export interface RateCalculationParams {
  weightKg: number
  serviceType: ServiceType
  origin?: string
  destination?: string
}

/**
 * Calculates the estimated shipping rate based on weight and service type.
 * Queries the pricingRules database table for dynamic rates.
 *
 * Fixes applied:
 * - Case-insensitive origin/destination matching via LOWER()
 * - Soft-deleted rules are excluded (deletedAt IS NULL)
 */
// Helper to map full city names to common 3-letter codes used in pricing rules
function getCityCode(city: string): string {
  const normalized = city.toLowerCase().trim()
  if (normalized.includes("delhi")) return "DEL"
  if (normalized.includes("imphal")) return "IMF"
  if (normalized.includes("mumbai") || normalized.includes("bombay"))
    return "BOM"
  if (normalized.includes("bangalore") || normalized.includes("bengaluru"))
    return "BLR"
  if (normalized.includes("chennai") || normalized.includes("madras"))
    return "MAA"
  if (normalized.includes("kolkata") || normalized.includes("calcutta"))
    return "CCU"
  if (normalized.includes("hyderabad")) return "HYD"
  if (normalized.includes("pune")) return "PNQ"
  if (normalized.includes("ahmedabad")) return "AMD"
  return normalized
}

export async function calculateEstimatedRate({
  weightKg,
  serviceType,
  origin,
  destination,
}: RateCalculationParams): Promise<number> {
  if (!weightKg || weightKg <= 0) {
    return 0
  }

  let dbServiceType: "express_air" | "standard_ocean" | "road_freight" =
    "road_freight"
  if (serviceType === "express" || serviceType === "express_air")
    dbServiceType = "express_air"
  if (serviceType === "sea" || serviceType === "standard_ocean")
    dbServiceType = "standard_ocean"

  let basePrice = 0 // cents
  let pricePerKg = 4000 // 40 INR default in cents for road

  if (origin && destination) {
    // Normalize to lowercase for case-insensitive matching
    const originLower = origin.trim().toLowerCase()
    const destinationLower = destination.trim().toLowerCase()

    // Also try matching the 3-letter codes (e.g. "new delhi" -> "del")
    const originCode = getCityCode(origin).toLowerCase()
    const destCode = getCityCode(destination).toLowerCase()

    const rule = await db.query.pricingRules.findFirst({
      where: (rules, { sql }) =>
        sql`(LOWER(${rules.origin}) = ${originLower} OR LOWER(${rules.origin}) = ${originCode})
          AND (LOWER(${rules.destination}) = ${destinationLower} OR LOWER(${rules.destination}) = ${destCode})
          AND ${rules.serviceType} = ${dbServiceType}
          AND ${rules.deletedAt} IS NULL`,
    })

    if (rule) {
      basePrice = rule.basePrice
      pricePerKg = rule.pricePerKg
    } else {
      // Fallback multipliers when no exact rule found
      if (dbServiceType === "express_air") pricePerKg = 16000 // 160 INR
      if (dbServiceType === "standard_ocean") pricePerKg = 2000 // 20 INR
      if (dbServiceType === "road_freight") pricePerKg = 4000 // 40 INR
    }
  } else {
    if (dbServiceType === "express_air") pricePerKg = 16000
    if (dbServiceType === "standard_ocean") pricePerKg = 2000
    if (dbServiceType === "road_freight") pricePerKg = 4000
  }

  const rateCents = Math.max(basePrice, weightKg * pricePerKg)
  return Number((rateCents / 100).toFixed(2))
}
