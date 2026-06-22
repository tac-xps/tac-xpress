import { describe, it, expect } from "vitest"
import {
  formatDate,
  formatChartAxisTick,
  formatChartTooltipDate,
  formatCompactCurrency,
  formatFullCurrency,
  formatCompactNumber,
  formatInteger,
  formatPercent,
} from "../../lib/format"

describe("Formatting Utilities", () => {
  describe("formatDate", () => {
    it("should format as month", () => {
      expect(formatDate("2026-06-12", "month")).toBe("Jun")
    })

    it("should format as day-month", () => {
      expect(formatDate("2026-06-12", "day-month")).toBe("Jun 12")
    })

    it("should format as full", () => {
      expect(formatDate("2026-06-12", "full")).toBe("Jun 12, 2026")
    })
  })

  describe("formatChartAxisTick", () => {
    it("should format short period as weekday", () => {
      expect(formatChartAxisTick("2026-06-12", 7)).toBe("Fri")
    })

    it("should format long period as day-month", () => {
      expect(formatChartAxisTick("2026-06-12", 30)).toBe("Jun 12")
    })
  })

  describe("formatChartTooltipDate", () => {
    it("should format with short weekday", () => {
      expect(formatChartTooltipDate("2026-06-12", "short")).toBe("Fri, Jun 12")
    })

    it("should format with long weekday", () => {
      expect(formatChartTooltipDate("2026-06-12", "long")).toBe(
        "Friday, Jun 12"
      )
    })
  })

  describe("Currency and Number Formatting", () => {
    it("formatCompactCurrency should format properly", () => {
      expect(formatCompactCurrency(1500)).toBe("$1.5K")
      // Node's ICU compact notation varies across platforms:
      // Linux/CI produces "$1.0M", Windows/macOS may produce "$1M"
      expect(formatCompactCurrency(1000000)).toMatch(/^\$1(\.0)?M$/)
    })

    it("formatFullCurrency should format with 2 decimals", () => {
      // NOTE: $1,500.00 since US locale is set
      expect(formatFullCurrency(1500)).toBe("$1,500.00")
    })

    it("formatCompactNumber should format large numbers", () => {
      expect(formatCompactNumber(1500)).toBe("1.5K")
    })

    it("formatInteger should group thousands", () => {
      expect(formatInteger(1500000)).toBe("1,500,000")
    })

    it("formatPercent should format percentages", () => {
      expect(formatPercent(45.6789, 2)).toBe("45.68%")
      expect(formatPercent(45.6789, 0)).toBe("46%")
    })
  })
})
