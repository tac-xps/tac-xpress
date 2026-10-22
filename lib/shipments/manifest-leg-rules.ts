export type ManifestLegType = "pickup" | "line_haul" | "delivery"
export type CargoStatus = "pending" | "in-transit" | "delivered"

export function canAllocateShipmentToLeg(input: {
  legType: ManifestLegType
  status: CargoStatus
  hasPriorReceipt: boolean
  hasActiveAssignment: boolean
}): boolean {
  if (input.hasActiveAssignment || input.status === "delivered") return false

  if (input.legType === "pickup") {
    return input.status === "pending" && !input.hasPriorReceipt
  }

  if (input.legType === "delivery") {
    return input.status === "in-transit" && input.hasPriorReceipt
  }

  return (
    (input.status === "pending" && !input.hasPriorReceipt) ||
    (input.status === "in-transit" && input.hasPriorReceipt)
  )
}
