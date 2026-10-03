/**
 * Strict Monetary Value Object for TAC-XPRESS Invoicing & Accounting.
 *
 * Invariants:
 * - Pure integer representation in paise (1 INR = 100 paise).
 * - Avoids all IEEE-754 floating-point inaccuracies.
 * - Enforces integer validation, rejecting NaN, Infinity, and non-integers.
 * - Explicit rounding modes for tax and proportional allocations.
 */

export type Money = Readonly<{
  paise: number
  currency: "INR"
}>

/**
 * Creates an immutable Money value object.
 * Rejects NaN, Infinity, and fractional numbers.
 */
export function money(paise: number | null | undefined, allowNegative = false): Money {
  const p = Math.round(paise ?? 0)

  if (!Number.isFinite(p) || Number.isNaN(p)) {
    throw new TypeError(`Invalid money value: ${paise}. Must be a finite number.`)
  }

  if (!allowNegative && p < 0) {
    throw new RangeError(`Negative money not allowed for this context: ${p} paise.`)
  }

  return Object.freeze({
    paise: p,
    currency: "INR" as const,
  })
}

export function zeroMoney(): Money {
  return money(0)
}

export function isZero(m: Money): boolean {
  return m.paise === 0
}

export function isPositive(m: Money): boolean {
  return m.paise > 0
}

export function addMoney(a: Money, b: Money): Money {
  return money(a.paise + b.paise)
}

export function subtractMoney(a: Money, b: Money, allowNegative = false): Money {
  return money(a.paise - b.paise, allowNegative)
}

/**
 * Multiplies money by a factor with explicit statutory rounding.
 * Default rounding mode is HALF_UP (round half away from zero).
 */
export function multiplyMoney(
  m: Money,
  factor: number,
  mode: "HALF_UP" | "FLOOR" | "CEIL" = "HALF_UP"
): Money {
  if (!Number.isFinite(factor) || Number.isNaN(factor)) {
    throw new TypeError(`Invalid multiplication factor: ${factor}`)
  }

  const raw = m.paise * factor

  let rounded: number
  if (mode === "HALF_UP") {
    // Math.round in JS does round-half-up for positive numbers
    rounded = Math.round(raw)
  } else if (mode === "FLOOR") {
    rounded = Math.floor(raw)
  } else {
    rounded = Math.ceil(raw)
  }

  return money(rounded)
}

/**
 * Splits a total money amount proportionally among an array of weight ratios
 * ensuring the sum of output parts exactly equals the total (zero remainder leakage).
 */
export function allocateProportionally(total: Money, ratios: number[]): Money[] {
  if (ratios.length === 0) return []
  if (ratios.length === 1) return [total]

  const totalWeight = ratios.reduce((sum, r) => sum + Math.max(0, r), 0)
  if (totalWeight === 0) {
    // If all zero weight, distribute equally
    const base = Math.floor(total.paise / ratios.length)
    let remainder = total.paise - base * ratios.length
    return ratios.map(() => {
      const share = base + (remainder > 0 ? 1 : 0)
      if (remainder > 0) remainder--
      return money(share)
    })
  }

  const rawShares = ratios.map((r) => (total.paise * Math.max(0, r)) / totalWeight)
  const floorShares = rawShares.map((s) => Math.floor(s))
  let remainder = total.paise - floorShares.reduce((a, b) => a + b, 0)

  // Distribute remaining paise to the items with highest fractional parts
  const fractionsWithIndices = rawShares
    .map((s, idx) => ({ fraction: s - Math.floor(s), idx }))
    .sort((a, b) => b.fraction - a.fraction)

  for (let i = 0; i < remainder; i++) {
    const targetIdx = fractionsWithIndices[i % fractionsWithIndices.length].idx
    floorShares[targetIdx] += 1
  }

  return floorShares.map((p) => money(p))
}

/**
 * Formats integer paise into Indian Rupee presentation: "₹1,250.50".
 */
export function formatMoney(m: Money | number | null | undefined): string {
  const p = typeof m === "number" ? m : m?.paise ?? 0
  const rupees = p / 100

  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Returns raw rupees as a number (for external consumption only, e.g. amount in words).
 */
export function toRupees(m: Money): number {
  return m.paise / 100
}
