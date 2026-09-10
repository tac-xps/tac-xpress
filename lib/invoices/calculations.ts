const MAX_DATABASE_AMOUNT = 2_147_483_647

export function assertPaise(value: number, label = "Amount") {
  if (
    !Number.isSafeInteger(value) ||
    value < 0 ||
    value > MAX_DATABASE_AMOUNT
  ) {
    throw new Error(
      `${label} must be a non-negative amount within the supported limit.`
    )
  }
  return value
}

export function toPaise(value: number) {
  if (!Number.isFinite(value) || value < 0) throw new Error("Invalid amount.")
  return assertPaise(Math.round(value * 100))
}

export const chargeKeys = [
  "freightCharge",
  "pickupCharge",
  "packingCharge",
  "docketCharge",
  "insuranceCharge",
  "otherCharges",
] as const
export type InvoiceCharges = Record<(typeof chargeKeys)[number], number>

/** All persisted and returned amounts are integer paise. Tax classification is explicit. */
export function calculateInvoice(
  input: InvoiceCharges & {
    gstRate: number
    interstate: boolean
    advancePaid: number
    paid?: boolean
  }
) {
  const subtotal = assertPaise(
    chargeKeys.reduce((sum, key) => sum + assertPaise(input[key], key), 0),
    "Subtotal"
  )
  if (
    !Number.isInteger(input.gstRate) ||
    input.gstRate < 0 ||
    input.gstRate > 28
  )
    throw new Error("Invalid GST rate.")
  const tax = assertPaise(Math.round((subtotal * input.gstRate) / 100))
  const cgst = input.interstate ? 0 : Math.floor(tax / 2)
  const sgst = input.interstate ? 0 : tax - cgst
  const igst = input.interstate ? tax : 0
  const amount = assertPaise(subtotal + tax)
  const advancePaid = input.paid
    ? amount
    : assertPaise(input.advancePaid, "Payment")
  if (advancePaid > amount)
    throw new Error("Payment cannot exceed the invoice total.")
  const balanceDue = amount - advancePaid
  return {
    subtotal,
    cgst,
    sgst,
    igst,
    amount,
    advancePaid,
    balanceDue,
    status: balanceDue === 0 ? ("paid" as const) : ("unpaid" as const),
  }
}
