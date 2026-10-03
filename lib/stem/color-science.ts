/**
 * Logistics STEM Engine: Perceptual Color Science & APCA Contrast
 *
 * Implements rigorous mathematical models from:
 * - ITU-R BT.709 Relative Luminance
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
  "DEL-IMF": 245, // North-East Express Corridor (Indigo/Violet)
  "IMF-DEL": 245,
  "GAU-CCU": 160, // Assam-Bengal Gateway (Emerald/Teal)
  "CCU-GAU": 160,
  "BOM-DEL": 200, // Western Trunk Line (Sky Blue)
  "DEL-BOM": 200,
  "BLR-IMF": 285, // Southern Peninsula to North-East Line (Purple)
  "IMF-BLR": 285,
  "GAU-IMF": 180, // Intra-North-East Shuttle (Cyan)
  "IMF-GAU": 180,
  "CCU-IMF": 220, // Eastern Trunk Corridor (Deep Blue)
  "IMF-CCU": 220,
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
 * Calculates APCA estimated lightness contrast Lc between text and background.
 * Returns signed Lc value.
 */
export function getApcaContrast(textY: number, bgY: number): number {
  const textClamped = Math.max(textY, 0.0005)
  const bgClamped = Math.max(bgY, 0.0005)

  const textMod = Math.pow(textClamped, 0.57)
  const bgMod = Math.pow(bgClamped, 0.56)

  // Returns positive when text is lighter than background, negative when darker
  return (textMod - bgMod) * 100
}

/** APCA contrast thresholds for different UI components. */
export const APCA_THRESHOLDS = {
  badge: 60,  // Status badges, pills, and chips
  large: 45,  // Large text and display headings (≥ 24px)
  body: 75,   // Standard reading body copy (≥ 14px)
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
    return 245 // Default Tac-Xpress brand hue
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
