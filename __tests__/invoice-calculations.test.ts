import { describe, expect, it } from "vitest"
import { calculateInvoice, toPaise } from "@/lib/invoices/calculations"

const base = { freightCharge: 10000, pickupCharge: 0, packingCharge: 0, docketCharge: 125, insuranceCharge: 0, otherCharges: 0, gstRate: 5, interstate: false, advancePaid: 0 }
describe("invoice financial boundaries", () => {
  it("includes docket charges and splits odd tax paise without losing money", () => {
    const value = calculateInvoice(base)
    expect(value.subtotal).toBe(10125)
    expect(value.cgst + value.sgst + value.igst).toBe(506)
    expect(value.amount).toBe(10631)
    expect(value.balanceDue).toBe(value.amount)
  })
  it("preserves interstate tax classification", () => {
    expect(calculateInvoice({ ...base, interstate: true })).toMatchObject({ cgst: 0, sgst: 0, igst: 506 })
  })
  it("derives full settlement from the canonical total", () => {
    expect(calculateInvoice({ ...base, paid: true })).toMatchObject({ advancePaid: 10631, balanceDue: 0, status: "paid" })
  })
  it.each([Infinity, NaN, -1, 2147483648, 1.1])("rejects invalid stored amounts %s", freightCharge => {
    expect(() => calculateInvoice({ ...base, freightCharge })).toThrow()
  })
  it("rejects overpayment and unsafe rates", () => {
    expect(() => calculateInvoice({ ...base, advancePaid: 20000 })).toThrow(/exceed/)
    expect(() => calculateInvoice({ ...base, gstRate: 100 })).toThrow(/GST/)
    expect(() => toPaise(Infinity)).toThrow()
  })
})
