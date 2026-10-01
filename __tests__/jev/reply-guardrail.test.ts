import { describe, it, expect, vi } from "vitest"

vi.mock("server-only", () => ({}))

import {
  parseGuardrailVerdict,
  checkHeuristicGuardrails,
  GUARDRAIL_THRESHOLD,
} from "@/lib/jev/reply-guardrail"

describe("reply-guardrail", () => {
  describe("parseGuardrailVerdict", () => {
    it("passes when all risk probabilities are below threshold", () => {
      const result = parseGuardrailVerdict(0.05, 0.1)
      expect(result.passed).toBe(true)
      expect(result.reason).toBeUndefined()
    })

    it("blocks when false claim probability exceeds threshold", () => {
      const result = parseGuardrailVerdict(0.45, 0.05)
      expect(result.passed).toBe(false)
      expect(result.reason).toContain("Potential false claim")
    })

    it("blocks when unauthorized promise probability exceeds threshold", () => {
      const result = parseGuardrailVerdict(0.1, 0.55)
      expect(result.passed).toBe(false)
      expect(result.reason).toContain("Unauthorized compensation or liability promise")
    })

    it("honors custom threshold parameter", () => {
      const resultStrict = parseGuardrailVerdict(0.2, 0.1, 0.15)
      expect(resultStrict.passed).toBe(false)

      const resultLenient = parseGuardrailVerdict(0.35, 0.2, 0.5)
      expect(resultLenient.passed).toBe(true)
    })
  })

  describe("checkHeuristicGuardrails", () => {
    it("blocks unauthorized refund promises", () => {
      const blocked1 = checkHeuristicGuardrails("We apologize for the delay. We will refund your shipping fee.")
      expect(blocked1.passed).toBe(false)
      expect(blocked1.reason).toContain("will refund")

      const blocked2 = checkHeuristicGuardrails("You are entitled to a full refund.")
      expect(blocked2.passed).toBe(false)
      expect(blocked2.reason).toContain("full refund")
    })

    it("blocks liability admissions", () => {
      const blocked = checkHeuristicGuardrails("We accept full liability for the damaged carton.")
      expect(blocked.passed).toBe(false)
      expect(blocked.reason).toContain("we accept full liability")
    })

    it("blocks delivery guarantees without verification", () => {
      const blocked = checkHeuristicGuardrails("We guarantee delivery by tomorrow morning.")
      expect(blocked.passed).toBe(false)
      expect(blocked.reason).toContain("guarantee delivery by tomorrow")
    })

    it("passes compliant factual support responses", () => {
      const passed = checkHeuristicGuardrails(
        "Your shipment TAC90812 is currently in transit between New Delhi and Guwahati Hub. Estimated arrival is tomorrow afternoon."
      )
      expect(passed.passed).toBe(true)
      expect(passed.reason).toBeUndefined()
    })
  })
})
