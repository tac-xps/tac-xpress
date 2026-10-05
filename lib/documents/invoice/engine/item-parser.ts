import type { ManifestItem } from "../domain/types"

interface ParseOptions {
  totalPieces?: number
  totalWeightKg?: number
  defaultUnit?: string
}

/**
 * Parses raw shipment content descriptions and packaging metadata into
 * structured, auditable ManifestItem entities.
 *
 * Invariants:
 * - Distinguishes explicit user-provided structures from derived package assumptions.
 * - Never invents false package semantics.
 * - Automatically aggregates identical descriptions.
 */
export function parseConsignmentManifest(
  rawDescription: string | null | undefined,
  options: ParseOptions = {}
): ManifestItem[] {
  const text = (rawDescription || "").trim()
  const pieces = Math.max(1, options.totalPieces ?? 1)
  const totalWeight = options.totalWeightKg ?? 0
  const defaultUnit = options.defaultUnit || "pcs"

  if (!text) {
    return [
      {
        id: "manifest-1",
        description: "General Commercial Freight",
        quantity: pieces,
        unit: defaultUnit,
        weightKg: totalWeight > 0 ? totalWeight : undefined,
        source: "system",
        confidence: "derived",
        confidenceReason: "No content description provided; generated default manifest item.",
      },
    ]
  }

  // Check for multi-item patterns: newlines, semicolons, or numbered lists (1., 2., 3.)
  const delimiters = /\r?\n|;|\s*•\s*|\s*\|\s*/
  const candidateLines = text
    .split(delimiters)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)

  // If candidateLines has 1 line, check for comma-delimited items like "3 x Shoes, 2 x Bags"
  let lines = candidateLines
  if (candidateLines.length === 1 && candidateLines[0].includes(",")) {
    const commaSplit = candidateLines[0].split(",").map((s) => s.trim()).filter((s) => s.length > 0)
    // Only accept comma splitting if at least one item looks like an item count (e.g. "2x", "1 pc", "4 box")
    if (commaSplit.some((s) => /^\d+\s*(?:x|pcs|box|pkgs|units?)/i.test(s))) {
      lines = commaSplit
    }
  }

  const rawParsed: ManifestItem[] = []

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx]

    // Strip leading numbering: "1.", "1)", "[1]"
    const cleanedLine = line.replace(/^\s*(?:\[\d+\]|\d+[\.\)\-\:]\s*)/, "").trim()

    // Match patterns like:
    // "2 x Electronics (4.5kg)"
    // "3 pcs Cotton Garments"
    // "5 boxes Machine Spare Parts @ 10kg"
    const countMatch = cleanedLine.match(
      /^(\d+)\s*(?:x|pcs|pieces|units?|boxes?|pkgs?|cartons?|nos?|sets?)?\s*[-:]?\s*(.+)$/i
    )

    // Match trailing weight like: "(4.5 kg)", "4.5kg", "[4.5 KG]"
    const weightMatch = cleanedLine.match(/(?:[\(\[\{]|\s+@?\s*)(\d+(?:\.\d+)?)\s*(?:kg|kgs|kilograms?)(?:[\)\]\}]|\s*$)/i)

    let quantity = 1
    let description = cleanedLine
    let weightKg: number | undefined
    let isExplicit = false

    if (countMatch && countMatch[1] && countMatch[2]) {
      const parsedQty = parseInt(countMatch[1], 10)
      if (!Number.isNaN(parsedQty) && parsedQty > 0) {
        quantity = parsedQty
        description = countMatch[2].trim()
        isExplicit = true
      }
    }

    if (weightMatch && weightMatch[1]) {
      const parsedWeight = parseFloat(weightMatch[1])
      if (!Number.isNaN(parsedWeight) && parsedWeight > 0) {
        weightKg = parsedWeight
        // Remove the matched weight text from description
        description = description.replace(weightMatch[0], "").trim()
      }
    }

    // Clean any remaining brackets or commas
    description = description.replace(/^[-–—:,]\s*/, "").replace(/[,\s]+$/, "").trim()

    if (!description) {
      description = `Consignment Package ${idx + 1}`
    }

    rawParsed.push({
      id: `manifest-${idx + 1}`,
      description,
      quantity,
      unit: defaultUnit,
      weightKg,
      source: isExplicit ? "user_input" : "parser",
      confidence: isExplicit ? "explicit" : "derived",
      confidenceReason: isExplicit
        ? "Explicit item count or packaging specifier identified in text."
        : "Derived from freeform description line.",
    })
  }

  // Aggregate identical items: if multiple items share identical description (case-insensitive)
  const aggregatedMap = new Map<string, ManifestItem>()

  for (const item of rawParsed) {
    const key = item.description.toLowerCase().trim()
    const existing = aggregatedMap.get(key)
    if (existing) {
      existing.quantity += item.quantity
      if (item.weightKg !== undefined) {
        existing.weightKg = (existing.weightKg ?? 0) + item.weightKg
      }
    } else {
      aggregatedMap.set(key, { ...item })
    }
  }

  const aggregated = Array.from(aggregatedMap.values())

  // Final check: if single item parsed and pieces > 1 and item qty is 1, adjust quantity to pieces
  if (aggregated.length === 1 && aggregated[0].quantity === 1 && pieces > 1) {
    aggregated[0].quantity = pieces
    if (totalWeight > 0 && aggregated[0].weightKg === undefined) {
      aggregated[0].weightKg = totalWeight
    }
  }

  return aggregated
}
