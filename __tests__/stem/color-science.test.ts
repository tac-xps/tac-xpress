import { describe, expect, it } from "vitest"
import {
  toLinearRgb,
  getRelativeLuminance,
  getWcagContrast,
  isWcagCompliant,
  getApcaContrast,
  isApcaCompliant,
  clampSafeChroma,
  getCorridorHue,
  formatOklch,
  APCA_THRESHOLDS,
  WCAG_THRESHOLDS,
  OKLCH_LIGHTNESS_STEPS,
  OKLCH_SAFE_CHROMA,
} from "@/lib/stem/color-science"

describe("Logistics STEM Color Science Engine", () => {
  describe("toLinearRgb & Relative Luminance", () => {
    it("converts pure black and pure white accurately", () => {
      expect(toLinearRgb(0)).toBe(0)
      expect(toLinearRgb(255)).toBeCloseTo(1.0, 5)

      expect(getRelativeLuminance(0, 0, 0)).toBe(0)
      expect(getRelativeLuminance(255, 255, 255)).toBeCloseTo(1.0, 4)
    })

    it("verifies ITU-R BT.709 spectral weighting coefficients", () => {
      const greenLuminance = getRelativeLuminance(0, 255, 0)
      const redLuminance = getRelativeLuminance(255, 0, 0)
      const blueLuminance = getRelativeLuminance(0, 0, 255)

      expect(greenLuminance).toBeCloseTo(0.7152, 3)
      expect(redLuminance).toBeCloseTo(0.2127, 3)
      expect(blueLuminance).toBeCloseTo(0.0722, 3)

      expect(greenLuminance).toBeGreaterThan(redLuminance)
      expect(redLuminance).toBeGreaterThan(blueLuminance)
    })
  })

  describe("WCAG 2.2 Contractual Verification", () => {
    it("computes accurate WCAG contrast ratios", () => {
      const whiteY = 1.0
      const blackY = 0.0
      expect(getWcagContrast(whiteY, blackY)).toBeCloseTo(21.0, 1)

      // 4.5:1 ratio check
      expect(isWcagCompliant(0.9, 0.1, "normalTextAA")).toBe(true)
      expect(isWcagCompliant(0.5, 0.4, "normalTextAA")).toBe(false)
    })
  })

  describe("APCA Contrast & Readability Gate Verification", () => {
    it("computes high contrast for light text on dark background", () => {
      const textLuminance = 0.95
      const bgLuminance = 0.02
      const lc = Math.abs(getApcaContrast(textLuminance, bgLuminance))

      expect(lc).toBeGreaterThan(80)
      expect(isApcaCompliant(textLuminance, bgLuminance, "badge")).toBe(true)
      expect(isApcaCompliant(textLuminance, bgLuminance, "large")).toBe(true)
      expect(isApcaCompliant(textLuminance, bgLuminance, "body")).toBe(true)
    })

    it("detects insufficient contrast for low-contrast pairs", () => {
      const textLuminance = 0.40
      const bgLuminance = 0.35
      const lc = Math.abs(getApcaContrast(textLuminance, bgLuminance))

      expect(lc).toBeLessThan(APCA_THRESHOLDS.badge)
      expect(isApcaCompliant(textLuminance, bgLuminance, "badge")).toBe(false)
    })
  })

  describe("OKLCH Safe Chroma Bounds", () => {
    it("clamps requested chroma to Evil Martians safe boundaries", () => {
      expect(clampSafeChroma(0.95, 0.15)).toBe(0.011)
      expect(clampSafeChroma(0.60, 0.20)).toBe(0.140)
      expect(clampSafeChroma(0.60, 0.05)).toBe(0.05)
    })
  })

  describe("Corridor Hue Mapping", () => {
    it("returns correct hue angles for known core corridors", () => {
      expect(getCorridorHue("DEL", "IMF")).toBe(278)
      expect(getCorridorHue("GAU", "CCU")).toBe(160)
      expect(getCorridorHue("BOM", "DEL")).toBe(215)
      expect(getCorridorHue("BLR", "IMF")).toBe(285)
    })

    it("defaults to Mineral Indigo hue when hubs are missing", () => {
      expect(getCorridorHue(null, null)).toBe(278)
      expect(getCorridorHue("", "")).toBe(278)
    })

    it("generates deterministic hue within [0, 360) for arbitrary hubs", () => {
      const hue = getCorridorHue("HYD", "AMD")
      expect(hue).toBeGreaterThanOrEqual(0)
      expect(hue).toBeLessThan(360)
    })
  })

  describe("formatOklch", () => {
    it("formats standard OKLCH strings correctly", () => {
      expect(formatOklch(0.65, 0.12, 278)).toBe("oklch(0.65 0.12 278)")
      expect(formatOklch(0.65, 0.12, 278, 0.8)).toBe("oklch(0.65 0.12 278 / 0.8)")
    })
  })
})
