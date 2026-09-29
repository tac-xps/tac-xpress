import { describe, it, expect, vi } from "vitest"

vi.mock("server-only", () => ({}))

import { deriveWhatsAppIntentFromRules } from "@/lib/jev/whatsapp-questions"

describe("whatsapp-questions", () => {
  describe("deriveWhatsAppIntentFromRules", () => {
    it("identifies opt-out keywords deterministically", () => {
      for (const word of ["stop", "STOP", " unsubscribe ", "cancel", "opt out"]) {
        const result = deriveWhatsAppIntentFromRules(word)
        expect(result).not.toBeNull()
        expect(result?.intent).toBe("opt_out")
        expect(result?.isOptOut).toBe(true)
        expect(result?.confidence).toBe(1.0)
      }
    })

    it("identifies opt-in keywords deterministically", () => {
      for (const word of ["start", "subscribe", "opt in"]) {
        const result = deriveWhatsAppIntentFromRules(word)
        expect(result).not.toBeNull()
        expect(result?.intent).toBe("opt_in")
        expect(result?.isOptOut).toBe(false)
        expect(result?.confidence).toBe(1.0)
      }
    })

    it("identifies tracking queries with AWB format or keywords", () => {
      const res1 = deriveWhatsAppIntentFromRules("Where is my shipment TAC99823?")
      expect(res1?.intent).toBe("tracking_request")
      expect(res1?.confidence).toBeGreaterThanOrEqual(0.9)

      const res2 = deriveWhatsAppIntentFromRules("Track status of my package")
      expect(res2?.intent).toBe("tracking_request")

      const res3 = deriveWhatsAppIntentFromRules("WB10042")
      expect(res3?.intent).toBe("tracking_request")
    })

    it("identifies billing inquiries", () => {
      const result = deriveWhatsAppIntentFromRules("Please send the GST invoice for last week's booking")
      expect(result?.intent).toBe("billing_inquiry")
      expect(result?.confidence).toBe(0.85)
    })

    it("identifies severe complaints and damage reports", () => {
      const result = deriveWhatsAppIntentFromRules("The carton arrived completely damaged and items are broken")
      expect(result?.intent).toBe("complaint")
      expect(result?.isComplaint).toBe(true)
      expect(result?.confidence).toBe(0.9)
    })

    it("returns null for conversational or ambiguous messages to defer to AI evaluation", () => {
      const result = deriveWhatsAppIntentFromRules("Good morning, hope you are doing well today")
      expect(result).toBeNull()
    })
  })
})
