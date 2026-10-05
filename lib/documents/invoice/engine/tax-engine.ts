import {
  type Money,
  money,
  addMoney,
  subtractMoney,
  multiplyMoney,
  zeroMoney,
} from "../domain/money"
import type { ChargeLine, TaxDecision, TaxAudit } from "../domain/types"
import { TAX_POLICIES } from "../domain/master-data"

export interface TaxEngineInput {
  supplierStateCode: string
  supplierGSTIN?: string
  recipientStateCode?: string
  recipientGSTIN?: string
  placeOfSupplyStateCode?: string
  rawChargeLines: Array<{
    id: string
    classificationCode: string // SAC
    label: string
    taxableAmount: Money
    customGstRate?: number
  }>
  defaultGstRate?: number
}

export interface TaxEngineOutput {
  decision: TaxDecision
  audit: TaxAudit
  lines: ChargeLine[]
  subtotalTaxable: Money
  totalTax: Money
  igst: Money
  cgst: Money
  sgst: Money
  totalInvoiceValue: Money
}

/**
 * Statutory GST Calculation & Place of Supply Decision Engine.
 *
 * Implements:
 * - Place of Supply derivation under IGST Act Section 10 & 12.
 * - Pure integer-paise calculations with HALF_UP statutory rounding.
 * - Exact line-item tax reconciliation preventing rounding drift.
 * - Comprehensive compliance audit trail.
 */
export function calculateInvoiceTaxes(input: TaxEngineInput): TaxEngineOutput {
  const supplierState = (input.supplierStateCode || "07").trim()
  const defaultRate = input.defaultGstRate ?? 18

  // 1. Determine Place of Supply State Code
  // B2B: Registered recipient location (IGST Act Sec 12(8)(a))
  // B2C: Place of delivery / handover (IGST Act Sec 12(8)(b))
  let placeOfSupply = input.placeOfSupplyStateCode?.trim()

  if (!placeOfSupply) {
    if (input.recipientGSTIN && input.recipientGSTIN.length >= 2) {
      placeOfSupply = input.recipientGSTIN.substring(0, 2)
    } else if (input.recipientStateCode) {
      placeOfSupply = input.recipientStateCode.trim()
    } else {
      // Default to destination hub state (Manipur: 14)
      placeOfSupply = "14"
    }
  }

  // 2. Determine Supply Classification: Interstate vs Intrastate
  const isInterstate = supplierState !== placeOfSupply
  const supplyType: "interstate" | "intrastate" = isInterstate ? "interstate" : "intrastate"
  const policyId = isInterstate ? "POL_GST_18_INTER" : "POL_GST_18_INTRA"
  const policy = TAX_POLICIES[policyId]

  // 3. Compute Line-Level Taxes
  const filterEmptyLines = input.rawChargeLines.filter((l) => l.taxableAmount.paise > 0)
  const effectiveLines =
    filterEmptyLines.length > 0
      ? filterEmptyLines
      : [
          {
            id: "line-default",
            classificationCode: "996511",
            label: "Freight Transportation Services",
            taxableAmount: zeroMoney(),
          },
        ]

  let sumTaxable = zeroMoney()
  const preliminaryLines: Array<{
    id: string
    classificationCode: string
    label: string
    taxableAmount: Money
    taxRate: number
    taxAmount: Money
  }> = []

  for (const line of effectiveLines) {
    const rate = line.customGstRate ?? defaultRate
    const lineTax = multiplyMoney(line.taxableAmount, rate / 100, "HALF_UP")

    sumTaxable = addMoney(sumTaxable, line.taxableAmount)
    preliminaryLines.push({
      id: line.id,
      classificationCode: line.classificationCode,
      label: line.label,
      taxableAmount: line.taxableAmount,
      taxRate: rate,
      taxAmount: lineTax,
    })
  }

  // 4. Exact Rounding Reconciliation
  // Calculate theoretical tax on subtotal
  const theoreticalTotalTax = multiplyMoney(sumTaxable, defaultRate / 100, "HALF_UP")
  const sumOfLineTaxes = preliminaryLines.reduce(
    (acc, l) => addMoney(acc, l.taxAmount),
    zeroMoney()
  )

  const roundingAdjustment = subtractMoney(theoreticalTotalTax, sumOfLineTaxes, true)

  // Apply any adjustment paise to the line with largest taxable value
  if (roundingAdjustment.paise !== 0 && preliminaryLines.length > 0) {
    let maxIdx = 0
    let maxVal = -1
    for (let i = 0; i < preliminaryLines.length; i++) {
      if (preliminaryLines[i].taxableAmount.paise > maxVal) {
        maxVal = preliminaryLines[i].taxableAmount.paise
        maxIdx = i
      }
    }
    const adjustedTax = addMoney(
      preliminaryLines[maxIdx].taxAmount,
      roundingAdjustment
    )
    preliminaryLines[maxIdx].taxAmount = adjustedTax
  }

  const finalLines: ChargeLine[] = preliminaryLines.map((l) => ({
    id: l.id,
    classificationCode: l.classificationCode,
    label: l.label,
    taxableAmount: l.taxableAmount,
    taxRate: l.taxRate,
    taxAmount: l.taxAmount,
    totalAmount: addMoney(l.taxableAmount, l.taxAmount),
  }))

  const totalTax = finalLines.reduce((acc, l) => addMoney(acc, l.taxAmount), zeroMoney())
  const totalInvoiceValue = addMoney(sumTaxable, totalTax)

  // 5. Intrastate vs Interstate Tax Components
  let igst = zeroMoney()
  let cgst = zeroMoney()
  let sgst = zeroMoney()

  if (isInterstate) {
    igst = totalTax
  } else {
    // 50% CGST and 50% SGST with exact remainder
    const halfPaise = Math.floor(totalTax.paise / 2)
    const remainder = totalTax.paise - halfPaise * 2
    cgst = money(halfPaise + remainder)
    sgst = money(halfPaise)
  }

  // 6. Build Audit & Decision Record
  const decision: TaxDecision = {
    supplyType,
    placeOfSupplyStateCode: placeOfSupply,
    taxPolicyId: policy.policyId,
    igst,
    cgst,
    sgst,
    effectiveGstRate: defaultRate,
    reason: isInterstate
      ? `Supplier state (${supplierState}) differs from Place of Supply (${placeOfSupply}); Interstate IGST ${defaultRate}% applicable under IGST Act Section 12.`
      : `Supplier state (${supplierState}) matches Place of Supply (${placeOfSupply}); Intrastate CGST ${defaultRate / 2}% + SGST ${defaultRate / 2}% applicable.`,
  }

  const audit: TaxAudit = {
    supplierStateCode: supplierState,
    recipientStateCode: input.recipientStateCode,
    placeOfSupplyStateCode: placeOfSupply,
    serviceClassificationCode: effectiveLines[0].classificationCode,
    taxPolicyId: policy.policyId,
    taxableAmount: sumTaxable,
    calculatedIgst: igst,
    calculatedCgst: cgst,
    calculatedSgst: sgst,
    roundingAdjustment,
    calculatedAt: new Date().toISOString(),
  }

  return {
    decision,
    audit,
    lines: finalLines,
    subtotalTaxable: sumTaxable,
    totalTax,
    igst,
    cgst,
    sgst,
    totalInvoiceValue,
  }
}
