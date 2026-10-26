/**
 * Pure STEM freight calculation engine for Tac-Xpress.
 *
 * Implements IATA air freight dimensional standards, surface road divisors,
 * pure integer-paise GST statutory splits, fuel surcharge index calculations,
 * and SLA risk metrics without side effects or external network dependencies.
 */

export interface CargoDimensions {
  lengthCm: number
  widthCm: number
  heightCm: number
  pieces?: number
}

export interface FreightPricingInput {
  chargedWeightKg: number
  ratePerKgPaise: number
  minimumChargePaise: number
  fuelSurchargePercent: number
  docketFeePaise?: number
  handlingFeePaise?: number
}

export interface FreightPricingResult {
  baseFreightPaise: number
  fuelSurchargePaise: number
  docketFeePaise: number
  handlingFeePaise: number
  subtotalTaxablePaise: number
}

export interface GstSplitResult {
  taxablePaise: number
  gstRatePercent: number
  totalTaxPaise: number
  cgstPaise: number
  sgstPaise: number
  igstPaise: number
  totalPaise: number
}

/**
 * Air freight volumetric weight divisor defined by IATA standards (5000 cm³/kg).
 */
export const AIR_VOLUMETRIC_DIVISOR = 5000

/**
 * Surface road transport volumetric weight divisor (4500 cm³/kg).
 */
export const SURFACE_VOLUMETRIC_DIVISOR = 4500

/**
 * Compute volumetric weight for air cargo using standard IATA formula.
 *
 * Formula: ceil((L × W × H × pieces) / 5000)
 */
export function calculateAirVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  pieces = 1
): number {
  const l = Math.max(0, lengthCm)
  const w = Math.max(0, widthCm)
  const h = Math.max(0, heightCm)
  const p = Math.max(1, Math.floor(pieces))

  if (l === 0 || w === 0 || h === 0) return 0
  return Math.ceil((l * w * h * p) / AIR_VOLUMETRIC_DIVISOR)
}

/**
 * Compute volumetric weight for surface cargo.
 *
 * Formula: ceil((L × W × H × pieces) / 4500)
 */
export function calculateSurfaceVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  pieces = 1
): number {
  const l = Math.max(0, lengthCm)
  const w = Math.max(0, widthCm)
  const h = Math.max(0, heightCm)
  const p = Math.max(1, Math.floor(pieces))

  if (l === 0 || w === 0 || h === 0) return 0
  return Math.ceil((l * w * h * p) / SURFACE_VOLUMETRIC_DIVISOR)
}

/**
 * Calculate billable (chargeable) weight.
 *
 * Standard freight invariant: chargeable weight is maximum of actual and volumetric weight.
 */
export function calculateChargedWeight(
  actualGrossWeightKg: number,
  volumetricWeightKg: number
): number {
  const actual = Math.max(0, actualGrossWeightKg)
  const volumetric = Math.max(0, volumetricWeightKg)
  return Math.max(actual, volumetric)
}

/**
 * Calculate commercial freight pricing in integer paise.
 *
 * Prevents floating point errors by keeping all amounts in integer paise.
 */
export function calculateFreightPricing(
  input: FreightPricingInput
): FreightPricingResult {
  const weight = Math.max(0, input.chargedWeightKg)
  const calculatedBase = Math.round(weight * input.ratePerKgPaise)
  const baseFreightPaise = Math.max(calculatedBase, input.minimumChargePaise)

  const fuelRate = Math.max(0, input.fuelSurchargePercent) / 100
  const fuelSurchargePaise = Math.round(baseFreightPaise * fuelRate)

  const docketFeePaise = Math.max(0, input.docketFeePaise ?? 0)
  const handlingFeePaise = Math.max(0, input.handlingFeePaise ?? 0)

  const subtotalTaxablePaise =
    baseFreightPaise + fuelSurchargePaise + docketFeePaise + handlingFeePaise

  return {
    baseFreightPaise,
    fuelSurchargePaise,
    docketFeePaise,
    handlingFeePaise,
    subtotalTaxablePaise,
  }
}

/**
 * Calculate Indian Goods and Services Tax (GST) in integer paise.
 *
 * Handles intra-state (CGST + SGST split without odd paise loss) and
 * inter-state (IGST) statutory rates.
 */
export function calculateGstPaise(
  taxableSubtotalPaise: number,
  gstRatePercent = 18,
  isInterState = false
): GstSplitResult {
  const taxablePaise = Math.max(0, Math.round(taxableSubtotalPaise))
  const rate = Math.max(0, Math.min(28, gstRatePercent))

  const totalTaxPaise = Math.round((taxablePaise * rate) / 100)

  let cgstPaise = 0
  let sgstPaise = 0
  let igstPaise = 0

  if (isInterState) {
    igstPaise = totalTaxPaise
  } else {
    cgstPaise = Math.floor(totalTaxPaise / 2)
    sgstPaise = totalTaxPaise - cgstPaise
  }

  return {
    taxablePaise,
    gstRatePercent: rate,
    totalTaxPaise,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalPaise: taxablePaise + totalTaxPaise,
  }
}

/**
 * Calculate telemetry scale weight variance percentage.
 *
 * Flags shipments exceeding 5% variance for physical inspection.
 */
export function calculateWeightVariance(
  scaleWeightKg: number,
  declaredWeightKg: number
): {
  variancePercent: number
  requiresInspection: boolean
} {
  const declared = Math.max(0, declaredWeightKg)
  const scale = Math.max(0, scaleWeightKg)

  if (declared === 0) {
    return {
      variancePercent: 0,
      requiresInspection: scale > 0,
    }
  }

  const variancePercent =
    Math.round((Math.abs(scale - declared) / declared) * 10000) / 100

  return {
    variancePercent,
    requiresInspection: variancePercent > 5.0,
  }
}

/**
 * Calculate SLA breach risk score (0.00 to 1.00+).
 *
 * Score >= 0.85 indicates critical SLA breach alert.
 * Score >= 0.70 indicates at-risk alert.
 */
export function calculateSlaBreachRisk(
  elapsedMinutes: number,
  scheduledMinutes: number,
  corridorRiskFactor = 1.0
): {
  riskScore: number
  severity: "normal" | "at_risk" | "breached"
} {
  const elapsed = Math.max(0, elapsedMinutes)
  const scheduled = Math.max(1, scheduledMinutes)
  const riskFactor = Math.max(0.5, Math.min(2.0, corridorRiskFactor))

  const riskScore = Math.round((elapsed / scheduled) * riskFactor * 100) / 100

  let severity: "normal" | "at_risk" | "breached" = "normal"
  if (riskScore >= 0.85) {
    severity = "breached"
  } else if (riskScore >= 0.7) {
    severity = "at_risk"
  }

  return {
    riskScore,
    severity,
  }
}
