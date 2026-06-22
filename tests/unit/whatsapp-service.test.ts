import { describe, expect, it } from "vitest"

import {
  isWithinWhatsAppConversationWindow,
  normalizeWhatsAppPhone,
} from "@/lib/whatsapp/service"

describe("whatsapp service helpers", () => {
  it("normalizes Indian phone formats to E.164 digits", () => {
    expect(normalizeWhatsAppPhone("+918837364182")).toBe("918837364182")
    expect(normalizeWhatsAppPhone("08837364182")).toBe("918837364182")
    expect(normalizeWhatsAppPhone("8837364182")).toBe("918837364182")
  })

  it("rejects invalid phone numbers", () => {
    expect(() => normalizeWhatsAppPhone("123")).toThrow(/Invalid WhatsApp/i)
  })

  it("uses the last inbound customer activity for the 24 hour window", () => {
    const now = new Date("2026-06-18T12:00:00.000Z")

    expect(
      isWithinWhatsAppConversationWindow("2026-06-18T02:00:00.000Z", now)
    ).toBe(true)
    expect(
      isWithinWhatsAppConversationWindow("2026-06-17T10:59:59.000Z", now)
    ).toBe(false)
    expect(isWithinWhatsAppConversationWindow(null, now)).toBe(false)
  })
})
