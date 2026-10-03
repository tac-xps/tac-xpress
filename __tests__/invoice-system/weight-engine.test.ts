import { describe, it, expect } from "vitest"
import { calculateConsignmentWeights } from "@/lib/documents/invoice/engine/weight-engine"

describe("Weight Calculation Engine", () => {
  it("calculates air cargo volumetric weight using divisor 5000", () => {
    // 50 x 40 x 30 cm = 60,000 cm3
    // 60,000 / 5000 = 12.0 kg
    const res = calculateConsignmentWeights({
      actualWeightKg: 10,
      dimensions: { l: 50, w: 40, h: 30 },
      pieces: 1,
      serviceMode: "express_air",
    })

    expect(res.divisor).toBe(5000)
    expect(res.actualWeightKg).toBe(10)
    expect(res.volumetricWeightKg).toBe(12)
    expect(res.chargeableWeightKg).toBe(12)
    expect(res.weightBasis).toBe("VOLUMETRIC")
  })

  it("calculates surface cargo volumetric weight using divisor 4500", () => {
    // 50 x 40 x 30 cm = 60,000 cm3
    // 60,000 / 4500 = 13.33 kg
    const res = calculateConsignmentWeights({
      actualWeightKg: 15,
      dimensions: { l: 50, w: 40, h: 30 },
      pieces: 1,
      serviceMode: "surface",
    })

    expect(res.divisor).toBe(4500)
    expect(res.actualWeightKg).toBe(15)
    expect(res.volumetricWeightKg).toBe(13.33)
    expect(res.chargeableWeightKg).toBe(15)
    expect(res.weightBasis).toBe("ACTUAL")
  })

  it("handles missing or zero dimensions gracefully", () => {
    const res = calculateConsignmentWeights({
      actualWeightKg: 8.5,
      serviceMode: "express_air",
    })

    expect(res.volumetricWeightKg).toBe(0)
    expect(res.chargeableWeightKg).toBe(8.5)
    expect(res.weightBasis).toBe("ACTUAL")
  })
})
