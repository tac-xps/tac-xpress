import { describe, expect, it } from "vitest"
import {
  calculateStemVolumetricWeight,
  calculateStemChargedWeight,
  chargedWeight,
} from "@/lib/shipment-weight"

describe("Logistics STEM Volumetric & Charged Weight Engine", () => {
  describe("calculateStemVolumetricWeight", () => {
    it("computes express air cargo volume using IATA 5000 divisor", () => {
      // 50 x 40 x 30 cm = 60,000 cm³ / 5000 = 12 kg
      const vol = calculateStemVolumetricWeight(50, 40, 30, "express_air")
      expect(vol).toBe(12)
    })

    it("computes road freight volume using 4000 divisor", () => {
      // 50 x 40 x 30 cm = 60,000 cm³ / 4000 = 15 kg
      const vol = calculateStemVolumetricWeight(50, 40, 30, "road_freight")
      expect(vol).toBe(15)
    })

    it("applies ceiling to fractional volumetric weights", () => {
      // 45 x 35 x 25 cm = 39,375 cm³ / 5000 = 7.875 -> ceil = 8 kg
      const volAir = calculateStemVolumetricWeight(45, 35, 25, "express_air")
      expect(volAir).toBe(8)

      // 39,375 cm³ / 4000 = 9.84375 -> ceil = 10 kg
      const volRoad = calculateStemVolumetricWeight(45, 35, 25, "road_freight")
      expect(volRoad).toBe(10)
    })

    it("handles zero and negative dimensions gracefully", () => {
      expect(calculateStemVolumetricWeight(0, 40, 30, "express_air")).toBe(0)
      expect(calculateStemVolumetricWeight(-10, 40, 30, "road_freight")).toBe(0)
    })
  })

  describe("calculateStemChargedWeight", () => {
    it("bills on gross weight when actual weight exceeds dimensional weight", () => {
      // Volumetric = 12 kg, Actual = 20 kg -> Charged = 20 kg
      const charged = calculateStemChargedWeight(20, 50, 40, 30, "express_air")
      expect(charged).toBe(20)
    })

    it("bills on volumetric weight when dimensional weight exceeds actual weight", () => {
      // Volumetric = 12 kg, Actual = 5 kg -> Charged = 12 kg
      const charged = calculateStemChargedWeight(5, 50, 40, 30, "express_air")
      expect(charged).toBe(12)
    })

    it("verifies road freight chargeable weight selection", () => {
      // Volumetric = 15 kg, Actual = 10 kg -> Charged = 15 kg
      const charged = calculateStemChargedWeight(10, 50, 40, 30, "road_freight")
      expect(charged).toBe(15)
    })
  })

  describe("chargedWeight backwards compatibility", () => {
    it("maintains compatibility for legacy operational boundary contract", () => {
      expect(
        chargedWeight({
          weightKg: 1.25,
          serviceType: "express_air",
          dimensionsL: 40,
          dimensionsW: 50,
          dimensionsH: 60,
        })
      ).toBe(24)

      expect(
        chargedWeight({
          weightKg: 1.25,
          serviceType: "road_freight",
          dimensionsL: 40,
          dimensionsW: 50,
          dimensionsH: 60,
        })
      ).toBe(1.25)
    })
  })
})
