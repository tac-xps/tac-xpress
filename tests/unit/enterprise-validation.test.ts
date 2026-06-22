import { describe, expect, it } from "vitest"

import {
  createManifestSchema,
  scanShipmentSchema,
} from "@/app/dashboard/manifests/schemas"
import { isValidLogisticsPhone } from "@/lib/validation/phone"

const UUIDS = {
  origin: "123e4567-e89b-12d3-a456-426614174000",
  destination: "123e4567-e89b-12d3-a456-426614174001",
  vehicle: "123e4567-e89b-12d3-a456-426614174002",
  driver: "123e4567-e89b-12d3-a456-426614174003",
  shipment: "123e4567-e89b-12d3-a456-426614174004",
}

describe("enterprise input validation", () => {
  it("accepts Indian mobile numbers in local and international formats", () => {
    expect(isValidLogisticsPhone("9876543210")).toBe(true)
    expect(isValidLogisticsPhone("+91 98765 43210")).toBe(true)
  })

  it("allows an empty optional phone but rejects malformed numbers", () => {
    expect(isValidLogisticsPhone("  ")).toBe(true)
    expect(isValidLogisticsPhone("12345")).toBe(false)
    expect(isValidLogisticsPhone("not-a-phone")).toBe(false)
  })

  it("requires complete manifest assignments and at least one shipment", () => {
    expect(
      createManifestSchema.safeParse({
        originHubId: UUIDS.origin,
        destinationHubId: UUIDS.destination,
        vehicleId: UUIDS.vehicle,
        driverId: UUIDS.driver,
        shipmentIds: [UUIDS.shipment],
      }).success
    ).toBe(true)

    expect(
      createManifestSchema.safeParse({
        originHubId: UUIDS.origin,
        destinationHubId: UUIDS.destination,
        vehicleId: UUIDS.vehicle,
        driverId: UUIDS.driver,
        shipmentIds: [],
      }).success
    ).toBe(false)
  })

  it("rejects malformed scanner payloads", () => {
    expect(
      scanShipmentSchema.safeParse({ manifestId: "invalid", awbNumber: "" })
        .success
    ).toBe(false)
  })
})
