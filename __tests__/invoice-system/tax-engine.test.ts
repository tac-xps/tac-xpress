import { describe, it, expect } from "vitest"
import { money } from "@/lib/documents/invoice/domain/money"
import { calculateInvoiceTaxes } from "@/lib/documents/invoice/engine/tax-engine"

describe("GST Tax Engine", () => {
  it("determines interstate supply when supplier is Delhi (07) and recipient is Manipur (14)", () => {
    const res = calculateInvoiceTaxes({
      supplierStateCode: "07",
      recipientStateCode: "14",
      placeOfSupplyStateCode: "14",
      rawChargeLines: [
        {
          id: "line-1",
          classificationCode: "996512",
          label: "Express Air Freight",
          taxableAmount: money(100000), // 1,000 INR
        },
      ],
      defaultGstRate: 18,
    })

    expect(res.decision.supplyType).toBe("interstate")
    expect(res.decision.placeOfSupplyStateCode).toBe("14")
    expect(res.igst.paise).toBe(18000) // 180 INR
    expect(res.cgst.paise).toBe(0)
    expect(res.sgst.paise).toBe(0)
    expect(res.totalInvoiceValue.paise).toBe(118000) // 1,180 INR
  })

  it("determines intrastate supply when supplier and recipient are both Delhi (07)", () => {
    const res = calculateInvoiceTaxes({
      supplierStateCode: "07",
      recipientStateCode: "07",
      placeOfSupplyStateCode: "07",
      rawChargeLines: [
        {
          id: "line-1",
          classificationCode: "996511",
          label: "Surface Freight",
          taxableAmount: money(100000),
        },
      ],
      defaultGstRate: 18,
    })

    expect(res.decision.supplyType).toBe("intrastate")
    expect(res.igst.paise).toBe(0)
    expect(res.cgst.paise).toBe(9000) // 9% = 90 INR
    expect(res.sgst.paise).toBe(9000) // 9% = 90 INR
    expect(res.totalInvoiceValue.paise).toBe(118000)
  })

  it("reconciles line item rounding with zero discrepancy", () => {
    // 3 lines with fractions: 3333 paise (33.33 INR) * 18% = 599.94 paise -> 600
    const res = calculateInvoiceTaxes({
      supplierStateCode: "07",
      placeOfSupplyStateCode: "14",
      rawChargeLines: [
        { id: "1", classificationCode: "996512", label: "Part 1", taxableAmount: money(3333) },
        { id: "2", classificationCode: "996519", label: "Part 2", taxableAmount: money(3333) },
        { id: "3", classificationCode: "998540", label: "Part 3", taxableAmount: money(3334) },
      ],
      defaultGstRate: 18,
    })

    expect(res.subtotalTaxable.paise).toBe(10000) // 100 INR
    expect(res.totalTax.paise).toBe(1800) // 18 INR
    const sumLineTaxes = res.lines.reduce((acc, l) => acc + l.taxAmount.paise, 0)
    expect(sumLineTaxes).toBe(1800) // exact match!
  })
})
