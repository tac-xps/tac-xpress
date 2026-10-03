import { describe, it, expect } from "vitest"
import { generateTestInvoice } from "../fixtures/invoice-fixture-generator"
import { calculateDocumentLayoutBudget } from "@/lib/documents/invoice/engine/layout-engine"

describe("Document Layout Engine", () => {
  it("computes safe layout budget for standard single-item invoice", () => {
    const doc = generateTestInvoice("standard_air_unpaid")
    const budget = calculateDocumentLayoutBudget(doc)

    expect(budget.printableHeightMm).toBe(281)
    expect(budget.contentTargetMm).toBe(270)
    expect(budget.safetyReserveMm).toBe(11)
    expect(budget.requiresContinuationPage).toBe(false)
    expect(budget.pageCount).toBe(1)
    expect(budget.riskState).toBe("Safe")
    expect(budget.remainingHeightMm).toBeGreaterThan(11)
  })

  it("activates Manifest Continuation Page 2 when manifest exceeds 20 unique items", () => {
    const doc = generateTestInvoice("extreme_20_unique_items")
    const budget = calculateDocumentLayoutBudget(doc)

    expect(budget.requiresContinuationPage).toBe(true)
    expect(budget.pageCount).toBe(2)
    expect(budget.visiblePage1ManifestLimit).toBe(3)
    // Even with 20 items, Page 1 remains strictly bounded under 270mm!
    expect(budget.usedHeightMm).toBeLessThanOrEqual(270)
  })

  it("safely aggregates 20 identical items into 1 row without overflowing or requiring continuation", () => {
    const doc = generateTestInvoice("identical_20_items")
    const budget = calculateDocumentLayoutBudget(doc)

    expect(doc.shipment.manifest.length).toBe(1)
    expect(budget.requiresContinuationPage).toBe(false)
    expect(budget.pageCount).toBe(1)
    expect(budget.riskState).toBe("Safe")
  })
})
