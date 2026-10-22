import { describe, expect, it } from "vitest"
import { canAllocateShipmentToLeg } from "@/lib/shipments/manifest-leg-rules"

describe("manifest leg allocation rules", () => {
  const base = {
    hasActiveAssignment: false,
    hasPriorReceipt: false,
    status: "pending" as const,
  }

  it("allows pickup as the first leg for pending cargo", () => {
    expect(canAllocateShipmentToLeg({ ...base, legType: "pickup" })).toBe(true)
  })

  it("allows line haul as the first leg for pending cargo", () => {
    expect(canAllocateShipmentToLeg({ ...base, legType: "line_haul" })).toBe(
      true
    )
  })

  it("allows the next line-haul or delivery leg only after a receipt", () => {
    for (const legType of ["line_haul", "delivery"] as const) {
      expect(
        canAllocateShipmentToLeg({
          ...base,
          legType,
          status: "in-transit",
          hasPriorReceipt: true,
        })
      ).toBe(true)
      expect(
        canAllocateShipmentToLeg({
          ...base,
          legType,
          status: "in-transit",
          hasPriorReceipt: false,
        })
      ).toBe(false)
    }
  })

  it("rejects active assignments, delivered cargo, and pickup retries", () => {
    expect(
      canAllocateShipmentToLeg({
        ...base,
        legType: "line_haul",
        hasActiveAssignment: true,
      })
    ).toBe(false)
    expect(
      canAllocateShipmentToLeg({
        ...base,
        legType: "delivery",
        status: "delivered",
        hasPriorReceipt: true,
      })
    ).toBe(false)
    expect(
      canAllocateShipmentToLeg({
        ...base,
        legType: "pickup",
        hasPriorReceipt: true,
      })
    ).toBe(false)
  })
})
