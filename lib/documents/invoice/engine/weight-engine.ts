export interface WeightCalculationInput {
  actualWeightKg: number
  dimensions?: {
    l?: number | null
    w?: number | null
    h?: number | null
  }
  pieces?: number
  serviceMode?: "express_air" | "surface" | string
}

export interface WeightResult {
  actualWeightKg: number
  volumetricWeightKg: number
  chargeableWeightKg: number
  weightBasis: "ACTUAL" | "VOLUMETRIC"
  divisor: number
  formulaDescription: string
}

/**
 * Pure calculation engine for Actual, Volumetric, and Chargeable weights.
 *
 * Invariants:
 * - Air standard volumetric divisor: 5000 cm³/kg (IATA rule).
 * - Surface road freight divisor: 4500 cm³/kg (Indian logistics standard).
 * - Chargeable weight is the exact mathematical maximum of Actual vs Volumetric.
 * - Explicitly tags weight basis for complete customer transparency.
 */
export function calculateConsignmentWeights(input: WeightCalculationInput): WeightResult {
  const actualWeight = Math.max(0, input.actualWeightKg || 0)
  const pieces = Math.max(1, input.pieces || 1)
  const isAir = input.serviceMode === "express_air"
  const divisor = isAir ? 5000 : 4500

  const l = Math.max(0, input.dimensions?.l || 0)
  const w = Math.max(0, input.dimensions?.w || 0)
  const h = Math.max(0, input.dimensions?.h || 0)

  let volumetricWeight = 0

  if (l > 0 && w > 0 && h > 0) {
    const totalVolumeCubicCm = l * w * h * pieces
    // Round to 2 decimal places
    volumetricWeight = Math.round((totalVolumeCubicCm / divisor) * 100) / 100
  }

  const chargeableWeight = Math.max(actualWeight, volumetricWeight)
  const weightBasis: "ACTUAL" | "VOLUMETRIC" =
    volumetricWeight > actualWeight ? "VOLUMETRIC" : "ACTUAL"

  const formulaDescription =
    volumetricWeight > 0
      ? `(${l}×${w}×${h} cm × ${pieces} pkgs) ÷ ${divisor} = ${volumetricWeight} kg`
      : "No dimensions recorded; billed on gross actual weight."

  return {
    actualWeightKg: actualWeight,
    volumetricWeightKg: volumetricWeight,
    chargeableWeightKg: chargeableWeight,
    weightBasis,
    divisor,
    formulaDescription,
  }
}
