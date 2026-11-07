import { beforeEach, describe, expect, it, vi } from "vitest"
import {
  createPricingRuleSchema,
  calculateEstimatedRateSchema,
} from "@/app/dashboard/pricing/validations"

const lookup = vi.hoisted(() => vi.fn())
vi.mock("@/lib/db", () => ({
  db: { query: { pricingRules: { findFirst: lookup } } },
}))
import { calculateEstimatedRate } from "@/lib/pricing"

beforeEach(() => lookup.mockReset())

describe("corridor pricing boundaries", () => {
  const quote = {
    origin: "DEL",
    destination: "IMF",
    serviceType: "express_air" as const,
    weightKg: 10,
  }
  it("normalizes the bilateral corridor and rejects other routes and sea service", () => {
    expect(calculateEstimatedRateSchema.parse(quote)).toMatchObject({
      origin: "New Delhi",
      destination: "Imphal",
    })
    for (const input of [
      { ...quote, origin: "Other city" },
      { ...quote, destination: "New Delhi" },
      { ...quote, serviceType: "standard_ocean" },
      { ...quote, origin: undefined },
    ])
      expect(calculateEstimatedRateSchema.safeParse(input).success).toBe(false)
    expect(
      createPricingRuleSchema.safeParse({
        ...quote,
        basePrice: 10,
        pricePerKg: 1,
        destination: "Other city",
      }).success
    ).toBe(false)
  })
  it("rejects unsupported routes before querying rates", async () => {
    await expect(
      calculateEstimatedRate({ ...quote, destination: "Other city" })
    ).rejects.toThrow()
    expect(lookup).not.toHaveBeenCalled()
  })
  it("uses configured prices and never invents a fallback quote", async () => {
    lookup.mockResolvedValueOnce({ basePrice: 62500, pricePerKg: 12500 })
    expect(await calculateEstimatedRate(quote)).toBe(1250)
    lookup.mockResolvedValueOnce(undefined)
    await expect(calculateEstimatedRate(quote)).rejects.toThrow(
      /No active pricing rule/
    )
  })
})
