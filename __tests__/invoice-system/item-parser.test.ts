import { describe, it, expect } from "vitest"
import { parseConsignmentManifest } from "@/lib/documents/invoice/engine/item-parser"

describe("Manifest Item Parser", () => {
  it("handles empty description with fallback", () => {
    const items = parseConsignmentManifest("", { totalPieces: 3, totalWeightKg: 15 })
    expect(items.length).toBe(1)
    expect(items[0].description).toBe("General Commercial Freight")
    expect(items[0].quantity).toBe(3)
    expect(items[0].confidence).toBe("derived")
  })

  it("parses explicit numbered multi-line descriptions", () => {
    const text = "1. 2 x Electronics Monitor (4.5kg)\n2. 3 pcs Power Supply (3.0kg)"
    const items = parseConsignmentManifest(text)
    expect(items.length).toBe(2)
    expect(items[0].description).toBe("Electronics Monitor")
    expect(items[0].quantity).toBe(2)
    expect(items[0].weightKg).toBe(4.5)
    expect(items[0].confidence).toBe("explicit")

    expect(items[1].description).toBe("Power Supply")
    expect(items[1].quantity).toBe(3)
    expect(items[1].weightKg).toBe(3.0)
    expect(items[1].confidence).toBe("explicit")
  })

  it("aggregates identical items cleanly", () => {
    const text = "1 x Running Shoes Box (1.2kg)\n1 x Running Shoes Box (1.2kg)\n1 x Running Shoes Box (1.2kg)"
    const items = parseConsignmentManifest(text)
    expect(items.length).toBe(1)
    expect(items[0].description).toBe("Running Shoes Box")
    expect(items[0].quantity).toBe(3)
    expect(items[0].weightKg).toBeCloseTo(3.6, 2)
  })

  it("handles freeform unnumbered text safely", () => {
    const text = "Industrial equipment parts for manufacturing unit"
    const items = parseConsignmentManifest(text, { totalPieces: 4, totalWeightKg: 40 })
    expect(items.length).toBe(1)
    expect(items[0].description).toBe("Industrial equipment parts for manufacturing unit")
    expect(items[0].quantity).toBe(4)
    expect(items[0].confidence).toBe("derived")
  })
})
