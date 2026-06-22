import { parsePhoneNumberFromString } from "libphonenumber-js"

export function isValidLogisticsPhone(value: string): boolean {
  const phone = value.trim()
  if (!phone) return true

  return Boolean(parsePhoneNumberFromString(phone, "IN")?.isValid())
}
