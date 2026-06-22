import { describe, it, expect, vi } from "vitest"
import { calculateEstimatedRate } from "../../lib/pricing"

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      pricingRules: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
    },
  },
}))

describe("calculateEstimatedRate", () => {
  it("should return 0 for zero or negative weight", async () => {
    expect(
      await calculateEstimatedRate({ weightKg: 0, serviceType: "standard" })
    ).toBe(0)
    expect(
      await calculateEstimatedRate({ weightKg: -5, serviceType: "standard" })
    ).toBe(0)
  })

  it("should calculate standard rate (road_freight @ 40 INR/kg)", async () => {
    // 10 kg * 4000 cents/kg = 40000 cents = 400 INR
    expect(
      await calculateEstimatedRate({ weightKg: 10, serviceType: "standard" })
    ).toBe(400)
  })

  it("should calculate express rate (express_air @ 160 INR/kg)", async () => {
    // 10 kg * 16000 cents/kg = 160000 cents = 1600 INR
    expect(
      await calculateEstimatedRate({ weightKg: 10, serviceType: "express" })
    ).toBe(1600)
  })

  it("should calculate sea rate (standard_ocean @ 20 INR/kg)", async () => {
    // 10 kg * 2000 cents/kg = 20000 cents = 200 INR
    expect(
      await calculateEstimatedRate({ weightKg: 10, serviceType: "sea" })
    ).toBe(200)
  })

  it("should round correctly to 2 decimal places", async () => {
    // 10.33 kg * 4000 cents/kg = 41320 cents = 413.20 INR
    expect(
      await calculateEstimatedRate({ weightKg: 10.33, serviceType: "standard" })
    ).toBe(413.2)
  })
})
