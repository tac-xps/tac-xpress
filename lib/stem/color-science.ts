/**
 * Logistics STEM Engine: Perceptual Color Science & Dual-Layer Accessibility
 *
 * Implements rigorous mathematical models from:
 * - ITU-R BT.709 Relative Luminance
 * - WCAG 2.2 Contrast Standards (SC 1.4.3, 1.4.11)
 * - Accessible Perceptual Contrast Algorithm (APCA) Lc
 * - Evil Martians OKLCH Safe Chroma Bounds (C_safe)
 *
 * Complies with ASD-STE100 technical precision guidelines.
 */

/** Standard 11-step lightness levels for OKLCH design palettes. */
export const OKLCH_LIGHTNESS_STEPS = [
  0.95, 0.90, 0.80, 0.70, 0.60, 0.50, 0.40, 0.30, 0.20, 0.10, 0.05,
] as const

/**
 * Evil Martians safe chroma array (C_safe).
 * Clamping to these limits guarantees zero out-of-gamut clipping across all 360° hues in sRGB.
 */
export const OKLCH_SAFE_CHROMA = [
  0.011, 0.032, 0.061, 0.091, 0.140, 0.147, 0.130, 0.107, 0.090, 0.073, 0.054,
] as const

/** Standard hub corridor hue mapping in OKLCH degrees. */
export const CORRIDOR_HUES: Record<string, number> = {
  "DEL-IMF": 278, // North-East Express Corridor (Mineral Indigo)
  "IMF-DEL": 278,
  "GAU-CCU": 160, // Assam-Bengal Gateway (Emerald/Teal)
  "CCU-GAU": 160,
  "BOM-DEL": 215, // Western Trunk Line (Mineral Fjord)
  "DEL-BOM": 215,
  "BLR-IMF": 285, // Southern Peninsula to North-East Line (Deep Violet)
  "IMF-BLR": 285,
  "GAU-IMF": 215, // Intra-North-East Shuttle (Fjord)
  "IMF-GAU": 215,
  "CCU-IMF": 215, // Eastern Trunk Corridor (Fjord)
  "IMF-CCU": 215,
}

/**
 * Converts an 8-bit sRGB color channel (0-255) to linear RGB space.
 */
export function toLinearRgb(c8: number): number {
  const c = Math.max(0, Math.min(255, c8)) / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

/**
 * Computes relative luminance Y in linear space using ITU-R BT.709 coefficients.
 */
export function getRelativeLuminance(r8: number, g8: number, b8: number): number {
  const rLin = toLinearRgb(r8)
  const gLin = toLinearRgb(g8)
  const bLin = toLinearRgb(b8)
  return 0.2126729 * rLin + 0.7151522 * gLin + 0.072175 * bLin
}

/**
 * Computes WCAG 2.2 contrast ratio between two linear luminance values.
 * Returns ratio from 1.0 to 21.0.
 */
export function getWcagContrast(y1: number, y2: number): number {
  const lighter = Math.max(y1, y2)
  const darker = Math.min(y1, y2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG 2.2 threshold requirements. */
export const WCAG_THRESHOLDS = {
  normalTextAA: 4.5,
  largeTextAA: 3.0,
  uiComponentsAA: 3.0,
  normalTextAAA: 7.0,
  largeTextAAA: 4.5,
} as const

export type WcagRole = keyof typeof WCAG_THRESHOLDS

/**
 * Evaluates whether two luminances pass the contractual WCAG 2.2 requirement.
 */
export function isWcagCompliant(y1: number, y2: number, role: WcagRole = "normalTextAA"): boolean {
  return getWcagContrast(y1, y2) >= WCAG_THRESHOLDS[role]
}

/**
 * Calculates APCA estimated lightness contrast Lc between text and background
 * using the SAPC-APCA 0.0.98G standard algorithm.
 * Returns signed Lc value.
 */
export function getApcaContrast(textY: number, bgY: number): number {
  // Soft clamp for deep black / flare
  const yt = textY < 0.022 ? textY + Math.pow(0.022 - textY, 1.414) : textY
  const yb = bgY < 0.022 ? bgY + Math.pow(0.022 - bgY, 1.414) : bgY

  if (Math.abs(yb - yt) < 0.0005) return 0

  if (yb > yt) {
    // Dark text on light background
    const s = (Math.pow(yb, 0.56) - Math.pow(yt, 0.57)) * 1.14
    return s < 0.1 ? 0 : (s - 0.027) * 100
  } else {
    // Light text on dark background
    const s = (Math.pow(yb, 0.65) - Math.pow(yt, 0.62)) * 1.14
    return s > -0.1 ? 0 : (s + 0.027) * 100
  }
}

/**
 * APCA contrast thresholds (Readability Quality Gate).
 * Lc 90: Preferred body text
 * Lc 75: Minimum body text (14-16px normal weight)
 * Lc 60: Content text / badges / chips / table headers
 * Lc 45: Large headings (>= 18pt / 24px bold)
 * Lc 30: UI boundaries, icons, inactive indicators
 */
export const APCA_THRESHOLDS = {
  preferred_body: 90,
  body: 75,
  badge: 60,
  large: 45,
  graphics: 30,
} as const

export type ApcaRole = keyof typeof APCA_THRESHOLDS

/**
 * Verifies if the contrast between text and background satisfies APCA thresholds.
 */
export function isApcaCompliant(textY: number, bgY: number, role: ApcaRole): boolean {
  const lc = Math.abs(getApcaContrast(textY, bgY))
  return lc >= APCA_THRESHOLDS[role]
}

/**
 * Clamps requested chroma against the Evil Martians safe chroma curve.
 * Prevents sRGB display gamut clipping.
 */
export function clampSafeChroma(lightness: number, requestedChroma: number): number {
  const l = Math.max(0.05, Math.min(0.95, lightness))

  // Find adjacent lightness brackets
  let upperIdx = 0
  for (let i = 0; i < OKLCH_LIGHTNESS_STEPS.length; i++) {
    if (l >= OKLCH_LIGHTNESS_STEPS[i]) {
      upperIdx = i
      break
    }
  }

  const maxChroma = OKLCH_SAFE_CHROMA[upperIdx]
  return Math.min(requestedChroma, maxChroma)
}

/**
 * Derives the active corridor hue angle in degrees from origin and destination hub codes.
 */
export function getCorridorHue(origin?: string | null, destination?: string | null): number {
  if (!origin || !destination) {
    return 278 // Default Tac-Xpress Mineral Indigo hue
  }

  const origNorm = origin.trim().toUpperCase()
  const destNorm = destination.trim().toUpperCase()
  const key = `${origNorm}-${destNorm}`

  if (CORRIDOR_HUES[key]) {
    return CORRIDOR_HUES[key]
  }

  // Fallback: Deterministic positive hue from corridor string hash
  let hash = 0
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % 360
}

/**
 * Formats OKLCH CSS function string with optional alpha channel.
 */
export function formatOklch(l: number, c: number, h: number, alpha?: number): string {
  const roundedL = Number(l.toFixed(3))
  const roundedC = Number(c.toFixed(3))
  const roundedH = Number(h.toFixed(1))

  if (alpha !== undefined && alpha < 1) {
    return `oklch(${roundedL} ${roundedC} ${roundedH} / ${Number(alpha.toFixed(2))})`
  }
  return `oklch(${roundedL} ${roundedC} ${roundedH})`
}
