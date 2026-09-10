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
