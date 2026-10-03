import { describe, expect, it } from "vitest"
import {
  toLinearRgb,
  getRelativeLuminance,
  getApcaContrast,
  isApcaCompliant,
  clampSafeChroma,
  getCorridorHue,
  formatOklch,
  APCA_THRESHOLDS,
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
      // Pure Green should produce higher luminance than Pure Red, which is higher than Pure Blue
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

  describe("APCA Contrast & Threshold Verification", () => {
    it("computes high contrast for light text on dark background", () => {
      const textLuminance = 0.95
      const bgLuminance = 0.02
      const lc = getApcaContrast(textLuminance, bgLuminance)

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
      // At lightness 0.95, maximum safe chroma is 0.011
      expect(clampSafeChroma(0.95, 0.15)).toBe(0.011)

      // At lightness 0.60, maximum safe chroma is 0.140
      expect(clampSafeChroma(0.60, 0.20)).toBe(0.140)

      // Requested chroma below the limit should remain unchanged
      expect(clampSafeChroma(0.60, 0.05)).toBe(0.05)
    })
  })

  describe("Corridor Hue Mapping", () => {
    it("returns correct hue angles for known core corridors", () => {
      expect(getCorridorHue("DEL", "IMF")).toBe(245)
      expect(getCorridorHue("GAU", "CCU")).toBe(160)
      expect(getCorridorHue("BOM", "DEL")).toBe(200)
      expect(getCorridorHue("BLR", "IMF")).toBe(285)
    })

    it("defaults to brand hue when hubs are missing", () => {
      expect(getCorridorHue(null, null)).toBe(245)
      expect(getCorridorHue("", "")).toBe(245)
    })

    it("generates deterministic hue within [0, 360) for arbitrary hubs", () => {
      const hue = getCorridorHue("HYD", "AMD")
      expect(hue).toBeGreaterThanOrEqual(0)
      expect(hue).toBeLessThan(360)
    })
  })

  describe("formatOklch", () => {
    it("formats standard OKLCH strings correctly", () => {
      expect(formatOklch(0.65, 0.12, 245)).toBe("oklch(0.65 0.12 245)")
      expect(formatOklch(0.65, 0.12, 245, 0.8)).toBe("oklch(0.65 0.12 245 / 0.8)")
    })
  })
})
