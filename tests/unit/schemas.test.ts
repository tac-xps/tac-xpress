import { describe, it, expect } from "vitest"
import { z } from "zod"
import {
  createShipmentSchema,
  updateShipmentSchema,
} from "../../app/dashboard/shipments/schemas"

describe("Shipment Schemas Validation", () => {
  describe("createShipmentSchema", () => {
    it("should reject empty data", () => {
      const result = createShipmentSchema.safeParse({})
      expect(result.success).toBe(false)
    })

    it("should require customerId as a valid UUID", () => {
      const result = createShipmentSchema.safeParse({
        customerId: "not-a-uuid",
        origin: "Delhi",
        destination: "Mumbai",
        serviceType: "express_air",
        weightKg: 10,
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(
          result.error.issues.some((i) => i.path.includes("customerId"))
        ).toBe(true)
      }
    })

    it("should validate correctly with valid data", () => {
      const validData = {
        customerId: "123e4567-e89b-12d3-a456-426614174000",
        origin: "Delhi",
        destination: "Mumbai",
        serviceType: "express_air",
        weightKg: 25,
        consignorName: "Acme Corp",
        consignorPhone: "9876543210",
        consignorAddress: "123 Test St",
        consigneeName: "Wayne Ent",
        consigneePhone: "9988776655",
        consigneeAddress: "456 Bat Cave",
        natureOfGoods: "electronics",
        packagingType: "corrugated_box",
        isFragile: true,
        insuranceOptIn: false,
      }

      const result = createShipmentSchema.safeParse(validData)
      expect(result.success).toBe(true)
    })
  })

  describe("updateShipmentSchema", () => {
    it("should require an id", () => {
      const result = updateShipmentSchema.safeParse({
        origin: "Delhi",
      })
      expect(result.success).toBe(false)
    })

    it("should allow updates with valid fields when id is present", () => {
      const result = updateShipmentSchema.safeParse({
        id: "123e4567-e89b-12d3-a456-426614174000",
        origin: "Delhi",
        destination: "Mumbai",
        serviceType: "express_air",
        weightKg: 25,
      })
      expect(result.success).toBe(true)
    })
  })
})
