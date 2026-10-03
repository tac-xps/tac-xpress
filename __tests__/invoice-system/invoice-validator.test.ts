import { describe, it, expect } from "vitest"
import { generateTestInvoice } from "../fixtures/invoice-fixture-generator"
import { validateInvoiceDocument } from "@/lib/documents/invoice/engine/invoice-validator"

describe("Invoice Preflight Validator", () => {
  it("passes validation with GREEN risk level for valid standard invoice", () => {
    const doc = generateTestInvoice("standard_air_unpaid")
    const result = validateInvoiceDocument(doc)

    expect(result.valid).toBe(true)
    expect(result.riskLevel).toBe("GREEN")
    expect(result.errors.length).toBe(0)
    expect(result.readability.meetsFloors).toBe(true)
    expect(result.readability.qrSizeMm).toBe(20)
  })

  it("handles multi-item surface partial payment safely", () => {
    const doc = generateTestInvoice("multi_item_surface_partial")
    const result = validateInvoiceDocument(doc)

    expect(result.valid).toBe(true)
    expect(result.riskLevel).toBe("GREEN")
    expect(doc.commercial.financials.balanceDue.paise).toBe(
      doc.commercial.financials.totalInvoiceValue.paise - doc.commercial.financials.advancePaid.paise
    )
  })

  it("flags RED error when financial mismatch is injected", () => {
    const doc = generateTestInvoice("standard_air_unpaid")
    // Tamper with balance
    doc.commercial.financials.balanceDue = { paise: 999999, currency: "INR" }

    const result = validateInvoiceDocument(doc)
    expect(result.valid).toBe(false)
    expect(result.riskLevel).toBe("RED")
    expect(result.errors.some((e) => e.code === "FINANCIAL_MATH_MISMATCH")).toBe(true)
  })

  it("flags RED error when AWB number is missing", () => {
    const doc = generateTestInvoice("standard_air_unpaid")
    doc.shipment.awbNumber = ""

    const result = validateInvoiceDocument(doc)
    expect(result.valid).toBe(false)
    expect(result.riskLevel).toBe("RED")
    expect(result.errors.some((e) => e.code === "AWB_NUMBER_MISSING")).toBe(true)
  })

  it("handles extreme 20 unique items via Page 2 continuation with valid preflight", () => {
    const doc = generateTestInvoice("extreme_20_unique_items")
    const result = validateInvoiceDocument(doc)

    expect(result.valid).toBe(true)
    expect(result.budget.requiresContinuationPage).toBe(true)
    expect(result.budget.pageCount).toBe(2)
    // Page 1 geometry remains safe and valid
    expect(result.budget.usedHeightMm).toBeLessThanOrEqual(270)
  })
})
