import { describe, it, expect } from "vitest"
import {
  money,
  addMoney,
  subtractMoney,
  multiplyMoney,
  allocateProportionally,
  formatMoney,
  toRupees,
} from "@/lib/documents/invoice/domain/money"

describe("Money Value Object", () => {
  it("creates immutable integer paise representation", () => {
    const m = money(125050)
    expect(m.paise).toBe(125050)
    expect(m.currency).toBe("INR")
    expect(() => {
      // @ts-expect-error test immutability
      m.paise = 200
    }).toThrow()
  })

  it("rejects negative amounts unless explicit allowNegative flag is set", () => {
    expect(() => money(-500)).toThrow(RangeError)
    const allowed = money(-500, true)
    expect(allowed.paise).toBe(-500)
  })

  it("rejects NaN and Infinity", () => {
    expect(() => money(NaN)).toThrow(TypeError)
    expect(() => money(Infinity)).toThrow(TypeError)
  })

  it("performs addition and subtraction accurately", () => {
    const a = money(1000)
    const b = money(250)
    expect(addMoney(a, b).paise).toBe(1250)
    expect(subtractMoney(a, b).paise).toBe(750)
  })

  it("multiplies with statutory HALF_UP rounding", () => {
    const m = money(105) // 1.05 INR
    // 105 * 0.18 = 18.9 -> 19
    const tax = multiplyMoney(m, 0.18, "HALF_UP")
    expect(tax.paise).toBe(19)

    const m2 = money(102)
    // 102 * 0.18 = 18.36 -> 18
    const tax2 = multiplyMoney(m2, 0.18, "HALF_UP")
    expect(tax2.paise).toBe(18)
  })

  it("splits money proportionally with zero leakage", () => {
    const total = money(100) // 100 paise
    // Split into 3 equal parts: 100 / 3 = 33.33...
    const parts = allocateProportionally(total, [1, 1, 1])
    expect(parts.length).toBe(3)
    const sum = parts.reduce((acc, p) => acc + p.paise, 0)
    expect(sum).toBe(100) // exactly 100 paise, no 1-paise leakage!
    expect(parts.map((p) => p.paise)).toEqual([34, 33, 33])
  })

  it("formats Indian rupees correctly", () => {
    expect(formatMoney(money(125050))).toBe("₹1,250.50")
    expect(formatMoney(money(50000000))).toBe("₹5,00,000.00")
  })

  it("converts to float rupees for external consumers", () => {
    expect(toRupees(money(125050))).toBe(1250.5)
  })
})
