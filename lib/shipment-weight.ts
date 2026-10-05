type CargoWeight = {
  weightKg: number
  serviceType: string
  dimensionsL?: number | null
  dimensionsW?: number | null
  dimensionsH?: number | null
}

/** Air cargo uses the documented 5000 cm³/kg divisor. Persist the server calculation. */
export function chargedWeight(cargo: CargoWeight) {
  const volume =
    cargo.serviceType === "express_air"
      ? Math.ceil(
          ((cargo.dimensionsL || 0) *
            (cargo.dimensionsW || 0) *
            (cargo.dimensionsH || 0)) /
            5000
        )
      : 0
  return Math.max(cargo.weightKg, volume)
}

/**
 * STEM compliant dimensional weight calculation for multimodal transport.
 * Air: 5000 cm³/kg (IATA standard).
 * Surface/Road: 4000 cm³/kg (or 4500 cm³/kg regional standard).
 */
export function calculateStemVolumetricWeight(
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  serviceType: string,
  divisorOverride?: number
): number {
  if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) return 0
  const isAir = serviceType === "express_air" || serviceType === "express"
  const divisor = divisorOverride || (isAir ? 5000 : 4000)
  return Math.ceil((lengthCm * widthCm * heightCm) / divisor)
}

/**
 * Computes charged weight as the maximum of gross weight and dimensional weight.
 */
export function calculateStemChargedWeight(
  grossWeightKg: number,
  lengthCm: number,
  widthCm: number,
  heightCm: number,
  serviceType: string,
  divisorOverride?: number
): number {
  const vol = calculateStemVolumetricWeight(
    lengthCm,
    widthCm,
    heightCm,
    serviceType,
    divisorOverride
  )
  return Math.max(Math.max(0, grossWeightKg), vol)
}

