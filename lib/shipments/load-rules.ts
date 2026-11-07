import { normalizeFreightCity } from "@/lib/schemas/freight-route"

type LoadCargo = { origin: string; destination: string; weightKg: number }

export function assertLoadCapacity(
  cargo: Pick<LoadCargo, "weightKg">[],
  capacityKg: number | null
) {
  if (!capacityKg || !Number.isFinite(capacityKg) || capacityKg <= 0) {
    throw new Error(
      "Set a positive vehicle payload capacity before assigning cargo"
    )
  }
  if (
    cargo.some((item) => !Number.isFinite(item.weightKg) || item.weightKg <= 0)
  ) {
    throw new Error("Every shipment needs a valid gross weight")
  }
  if (cargo.reduce((total, item) => total + item.weightKg, 0) > capacityKg) {
    throw new Error("Selected cargo exceeds the vehicle payload capacity")
  }
}

export function assertManifestRoute(
  cargo: Pick<LoadCargo, "origin" | "destination">[],
  origin: { location: string },
  destination: { location: string }
) {
  const from = normalizeFreightCity(origin.location)
  const to = normalizeFreightCity(destination.location)
  if (!from || !to || from === to) {
    throw new Error("Choose opposite New Delhi and Imphal hub locations")
  }
  if (
    cargo.some(
      (item) =>
        normalizeFreightCity(item.origin) !== from ||
        normalizeFreightCity(item.destination) !== to
    )
  ) {
    throw new Error(
      "Every shipment must follow the selected manifest direction"
    )
  }
}

export function assertDispatchRoute(
  cargo: Pick<LoadCargo, "origin" | "destination">[]
) {
  const first = cargo[0]
  if (!first) throw new Error("Select at least one shipment")
  assertManifestRoute(
    cargo,
    { location: first.origin },
    { location: first.destination }
  )
}
