import { describe, expect, it } from "vitest"
import {
  getRelativeLuminance,
  getWcagContrast,
  getApcaContrast,
  isWcagCompliant,
  isApcaCompliant,
} from "@/lib/stem/color-science"

/**
 * Helper to convert OKLCH tuple to relative luminance Y using standard OKLCH -> linear sRGB matrix.
 */
function oklchToLuminance(L: number, C: number, H: number): number {
  const rad = (H * Math.PI) / 180
  const a = C * Math.cos(rad)
  const b = C * Math.sin(rad)

  const l_ = Math.pow(L + 0.3963377774 * a + 0.2158037573 * b, 3)
  const m_ = Math.pow(L - 0.1055613458 * a - 0.0638541728 * b, 3)
  const s_ = Math.pow(L - 0.0894841775 * a - 1.291485548 * b, 3)

  const rLin = Math.max(0, Math.min(1, 4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_))
  const gLin = Math.max(0, Math.min(1, -1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_))
  const bLin = Math.max(0, Math.min(1, -0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_))

  return 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin
}

describe("Nordic Mineral — Cloud White / Blue Basalt Semantic Contrast Matrix", () => {
  // ── Light Theme Tokens (Cloud White & Blue-Neutral Ink) ──
  const yCloud = oklchToLuminance(0.985, 0.006, 95)
  const yPaper = oklchToLuminance(0.995, 0.003, 95)
  const yMist = oklchToLuminance(0.955, 0.008, 95)
  const yStone = oklchToLuminance(0.900, 0.010, 95)
  const yStoneStrong = oklchToLuminance(0.630, 0.015, 250)
  const yInk = oklchToLuminance(0.230, 0.012, 250)
  const ySlate = oklchToLuminance(0.470, 0.012, 250)
  const yWhite = oklchToLuminance(0.995, 0.003, 95)

  const yIndigo = oklchToLuminance(0.510, 0.140, 278)
  const yIndigoHover = oklchToLuminance(0.440, 0.140, 278)
  const yIndigoWash = oklchToLuminance(0.940, 0.028, 278)

  const yFjord = oklchToLuminance(0.500, 0.075, 215)
  const yFjordWash = oklchToLuminance(0.945, 0.018, 215)

  const yMoss = oklchToLuminance(0.490, 0.060, 138)
  const yMossWash = oklchToLuminance(0.940, 0.016, 138)

  const yOchre = oklchToLuminance(0.530, 0.105, 68)
  const yOchreWash = oklchToLuminance(0.952, 0.026, 78)

  const yClay = oklchToLuminance(0.500, 0.110, 32)
  const yClayWash = oklchToLuminance(0.950, 0.016, 35)

  // ── Dark Theme Tokens (Blue Basalt H 255) ──
  const yBasaltBg = oklchToLuminance(0.240, 0.030, 255)
  const yBasaltCard = oklchToLuminance(0.290, 0.035, 255)
  const yBasaltPopover = oklchToLuminance(0.320, 0.035, 255)
  const yBasaltBorderStrong = oklchToLuminance(0.580, 0.018, 245)
  const yBasaltFg = oklchToLuminance(0.940, 0.012, 95)
  const yBasaltMutedFg = oklchToLuminance(0.760, 0.018, 240)

  const yBasaltPrimary = oklchToLuminance(0.730, 0.105, 278)
  const yBasaltPrimaryFg = oklchToLuminance(0.200, 0.025, 255)
  const yBasaltIndigoWash = oklchToLuminance(0.300, 0.040, 278)

  const yBasaltFjord = oklchToLuminance(0.740, 0.065, 215)
  const yBasaltFjordWash = oklchToLuminance(0.300, 0.030, 215)

  const yBasaltMoss = oklchToLuminance(0.740, 0.065, 138)
  const yBasaltMossWash = oklchToLuminance(0.300, 0.030, 138)

  const yBasaltOchre = oklchToLuminance(0.760, 0.090, 72)
  const yBasaltOchreWash = oklchToLuminance(0.310, 0.040, 72)

  const yBasaltClay = oklchToLuminance(0.730, 0.095, 32)
  const yBasaltClayWash = oklchToLuminance(0.300, 0.040, 32)

  describe("Light Theme: Contractual WCAG 2.2 Compliance", () => {
    it("ensures primary text meets AAA on Cloud canvas and Paper card", () => {
      expect(getWcagContrast(yInk, yCloud)).toBeGreaterThan(15.0)
      expect(getWcagContrast(yInk, yPaper)).toBeGreaterThan(16.0)
      expect(isWcagCompliant(yInk, yCloud, "normalTextAAA")).toBe(true)
    })

    it("ensures secondary slate text meets AA on Cloud canvas, Paper card, and Mist surface", () => {
      expect(getWcagContrast(ySlate, yCloud)).toBeGreaterThan(6.0)
      expect(getWcagContrast(ySlate, yPaper)).toBeGreaterThan(6.5)
      expect(getWcagContrast(ySlate, yMist)).toBeGreaterThan(5.5)
      expect(isWcagCompliant(ySlate, yCloud, "normalTextAA")).toBe(true)
    })

    it("ensures primary action button meets AA with white text", () => {
      expect(getWcagContrast(yWhite, yIndigo)).toBeGreaterThan(5.5)
      expect(getWcagContrast(yWhite, yIndigoHover)).toBeGreaterThan(7.0)
      expect(isWcagCompliant(yWhite, yIndigo, "normalTextAA")).toBe(true)
    })

    it("ensures status text meets AA on their calibrated wash backgrounds", () => {
      expect(getWcagContrast(yFjord, yFjordWash)).toBeGreaterThan(4.5)
      expect(getWcagContrast(yMoss, yMossWash)).toBeGreaterThan(4.5)
      expect(getWcagContrast(yOchre, yOchreWash)).toBeGreaterThan(4.5)
      expect(getWcagContrast(yClay, yClayWash)).toBeGreaterThan(4.5)
      expect(getWcagContrast(yIndigo, yIndigoWash)).toBeGreaterThan(4.5)
    })

    it("ensures control borders satisfy WCAG 2.2 SC 1.4.11 (>= 3.0:1) on Cloud and Paper", () => {
      expect(getWcagContrast(yStoneStrong, yCloud)).toBeGreaterThanOrEqual(3.0)
      expect(getWcagContrast(yStoneStrong, yPaper)).toBeGreaterThanOrEqual(3.0)
    })
  })

  describe("Dark Theme (Blue Basalt): Contractual WCAG 2.2 Compliance", () => {
    it("ensures foreground text meets AAA on Blue Basalt background and card", () => {
      expect(getWcagContrast(yBasaltFg, yBasaltBg)).toBeGreaterThan(13.0)
      expect(getWcagContrast(yBasaltFg, yBasaltCard)).toBeGreaterThan(11.0)
      expect(isWcagCompliant(yBasaltFg, yBasaltBg, "normalTextAAA")).toBe(true)
    })

    it("ensures muted foreground text meets AA on Blue Basalt background and card", () => {
      expect(getWcagContrast(yBasaltMutedFg, yBasaltBg)).toBeGreaterThan(7.0)
      expect(getWcagContrast(yBasaltMutedFg, yBasaltCard)).toBeGreaterThan(6.0)
      expect(isWcagCompliant(yBasaltMutedFg, yBasaltCard, "normalTextAA")).toBe(true)
    })

    it("ensures dark primary action button uses ink text and achieves AA", () => {
      expect(getWcagContrast(yBasaltPrimaryFg, yBasaltPrimary)).toBeGreaterThan(7.0)
      expect(isWcagCompliant(yBasaltPrimaryFg, yBasaltPrimary, "normalTextAA")).toBe(true)
    })

    it("ensures dark strong border satisfies WCAG 2.2 SC 1.4.11 (>= 3.0:1) on Blue Basalt card and bg", () => {
      expect(getWcagContrast(yBasaltBorderStrong, yBasaltCard)).toBeGreaterThanOrEqual(3.0)
      expect(getWcagContrast(yBasaltBorderStrong, yBasaltBg)).toBeGreaterThanOrEqual(3.0)
    })

    it("ensures dark status text meets AA on their calibrated dark wash backgrounds", () => {
      expect(getWcagContrast(yBasaltFjord, yBasaltFjordWash)).toBeGreaterThan(5.0)
      expect(getWcagContrast(yBasaltMoss, yBasaltMossWash)).toBeGreaterThan(5.0)
      expect(getWcagContrast(yBasaltOchre, yBasaltOchreWash)).toBeGreaterThan(5.5)
      expect(getWcagContrast(yBasaltClay, yBasaltClayWash)).toBeGreaterThan(5.0)
      expect(getWcagContrast(yBasaltPrimary, yBasaltIndigoWash)).toBeGreaterThan(5.0)
    })
  })

  describe("Readability Quality Gate: APCA Lc Verification", () => {
    it("ensures primary light text reaches preferred body threshold (Lc >= 90)", () => {
      const lc = Math.abs(getApcaContrast(yInk, yPaper))
      expect(lc).toBeGreaterThanOrEqual(90)
      expect(isApcaCompliant(yInk, yPaper, "preferred_body")).toBe(true)
    })

    it("ensures secondary light text reaches body threshold (Lc >= 75)", () => {
      const lc = Math.abs(getApcaContrast(ySlate, yPaper))
      expect(lc).toBeGreaterThanOrEqual(75)
      expect(isApcaCompliant(ySlate, yPaper, "body")).toBe(true)
    })

    it("ensures light status badges reach badge threshold (Lc >= 60)", () => {
      expect(Math.abs(getApcaContrast(yFjord, yFjordWash))).toBeGreaterThanOrEqual(60)
      expect(Math.abs(getApcaContrast(yMoss, yMossWash))).toBeGreaterThanOrEqual(60)
      expect(Math.abs(getApcaContrast(yOchre, yOchreWash))).toBeGreaterThanOrEqual(60)
      expect(Math.abs(getApcaContrast(yClay, yClayWash))).toBeGreaterThanOrEqual(60)
    })

    it("ensures dark foreground text reaches preferred body threshold (Lc >= 90)", () => {
      const lc = Math.abs(getApcaContrast(yBasaltFg, yBasaltBg))
      expect(lc).toBeGreaterThanOrEqual(90)
      expect(isApcaCompliant(yBasaltFg, yBasaltBg, "preferred_body")).toBe(true)
    })
  })
})
