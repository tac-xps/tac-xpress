/**
 * Converts Indian Rupee amounts into standardized words for GST Tax Invoices.
 * Handles Crores, Lakhs, Thousands, Hundreds, and Paise.
 */

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
]

const TENS = [
  "",
  "",
  "Twenty",
  "Thirty",
  "Forty",
  "Fifty",
  "Sixty",
  "Seventy",
  "Eighty",
  "Ninety",
]

function convertLessThanThousand(num: number): string {
  let str = ""
  if (num >= 100) {
    str += `${ONES[Math.floor(num / 100)]} Hundred `
    num %= 100
  }
  if (num >= 20) {
    str += `${TENS[Math.floor(num / 10)]} `
    num %= 10
  }
  if (num > 0) {
    str += `${ONES[num]} `
  }
  return str.trim()
}

export function amountInWords(totalRupees: number): string {
  if (totalRupees === 0) return "INR Zero Only"

  const rupees = Math.floor(Math.abs(totalRupees))
  const paise = Math.round((Math.abs(totalRupees) - rupees) * 100)

  let remaining = rupees
  let words = ""

  // Crores
  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000)
    words += `${convertLessThanThousand(crores)} Crore `
    remaining %= 10000000
  }

  // Lakhs
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000)
    words += `${convertLessThanThousand(lakhs)} Lakh `
    remaining %= 100000
  }

  // Thousands
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000)
    words += `${convertLessThanThousand(thousands)} Thousand `
    remaining %= 1000
  }

  // Hundreds & Remaining
  if (remaining > 0) {
    words += `${convertLessThanThousand(remaining)} `
  }

  words = words.trim()

  let result = `INR ${words}`
  if (paise > 0) {
    result += ` and ${convertLessThanThousand(paise)} Paise`
  }
  result += " Only"

  return result
}
