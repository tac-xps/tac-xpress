import { describe, expect, it } from "vitest"
import { chargedWeight } from "@/lib/shipment-weight"
import { cargoFileExtension, safeCargoFilename } from "@/lib/documents/cargo-file"
import { containsPattern, parseRecordQuery } from "@/lib/table-query"
import { createManifestSchema } from "@/app/dashboard/manifests/schemas"
describe("operational input boundaries", () => {
  it("uses volumetric weight for air and actual weight for surface, including fractions", () => {
    expect(chargedWeight({ weightKg: 1.25, serviceType: "express_air", dimensionsL: 40, dimensionsW: 50, dimensionsH: 60 })).toBe(24)
    expect(chargedWeight({ weightKg: 1.25, serviceType: "road_freight", dimensionsL: 40, dimensionsW: 50, dimensionsH: 60 })).toBe(1.25)
    expect(chargedWeight({ weightKg: 0.75, serviceType: "express_air" })).toBe(0.75)
  })
  it("does not accept renamed HTML or mismatched file signatures", () => {
    expect(cargoFileExtension(new TextEncoder().encode("<script>alert(1)</script>"), "application/pdf")).toBeNull()
    expect(cargoFileExtension(new TextEncoder().encode("%PDF-1.7"), "image/png")).toBeNull()
    expect(cargoFileExtension(new TextEncoder().encode("%PDF-1.7"), "application/pdf")).toBe("pdf")
    expect(safeCargoFilename("../../unsafe\"name.html", "pdf")).toMatch(/^[a-zA-Z0-9_-]+\.pdf$/)
  })
  it("treats SQL wildcard characters literally and bounds URL inputs", () => {
    expect(containsPattern("50%_\\")).toBe("%50\\%\\_\\\\%")
    expect(parseRecordQuery({ q: "a".repeat(200), sort: "DROP TABLE", order: "invalid" }, ["createdAt"])).toMatchObject({ q: "a".repeat(100), sort: "createdAt", order: "desc" })
  })
  it("rejects duplicate shipment assignments before writing a manifest", () => {
    const id = "11111111-1111-4111-8111-111111111111"
    expect(createManifestSchema.safeParse({ originHubId: id, destinationHubId: id, vehicleId: id, driverId: id, shipmentIds: [id, id] }).success).toBe(false)
  })
})
