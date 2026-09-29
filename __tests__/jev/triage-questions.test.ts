import { describe, it, expect } from "vitest"
import { derivePriority } from "@/lib/jev/triage-questions"

describe("derivePriority", () => {
  it("returns critical for lost cargo regardless of urgency", () => {
    expect(
      derivePriority({
        category: "lost",
        urgencyScore: 0,
        isBillingDispute: 0,
        isFrustrated: 0,
      })
    ).toBe("critical")
  })

  it("returns critical for urgency score 2", () => {
    expect(
      derivePriority({
        category: "general",
        urgencyScore: 2,
        isBillingDispute: 0,
        isFrustrated: 0,
      })
    ).toBe("critical")
  })

  it("returns high for damage with elevated urgency", () => {
    expect(
      derivePriority({
        category: "damage",
        urgencyScore: 1,
        isBillingDispute: 0,
        isFrustrated: 0.5,
      })
    ).toBe("high")
  })

  it("returns high for frustrated billing dispute", () => {
    expect(
      derivePriority({
        category: "billing",
        urgencyScore: 0,
        isBillingDispute: 0.9,
        isFrustrated: 0.8,
      })
    ).toBe("high")
  })

  it("returns medium for standard delay", () => {
    expect(
      derivePriority({
        category: "delay",
        urgencyScore: 0,
        isBillingDispute: 0,
        isFrustrated: 0,
      })
    ).toBe("medium")
  })

  it("returns low for a calm general inquiry", () => {
    expect(
      derivePriority({
        category: "general",
        urgencyScore: 0,
        isBillingDispute: 0,
        isFrustrated: 0,
      })
    ).toBe("low")
  })
})
