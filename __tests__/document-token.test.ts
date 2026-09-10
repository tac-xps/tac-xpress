import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  signDocumentToken,
  verifyDocumentToken,
} from "@/lib/auth/document-token"
describe("document authorization tokens", () => {
  const now = 1_800_000_000_000
  beforeEach(() =>
    vi.stubEnv(
      "INVOICE_PDF_SIGNING_SECRET",
      "synthetic-secret-for-unit-test-only-123456"
    )
  )
  afterEach(() => vi.unstubAllEnvs())
  it("binds the token to one invoice and one purpose", () => {
    const token = signDocumentToken("invoice-a", "render", now)
    expect(verifyDocumentToken(token, "invoice-a", "render", now)).toBe(true)
    expect(verifyDocumentToken(token, "invoice-b", "render", now)).toBe(false)
    expect(verifyDocumentToken(token, "invoice-a", "pdf", now)).toBe(false)
  })
  it("expires after five minutes", () =>
    expect(
      verifyDocumentToken(
        signDocumentToken("a", "pdf", now),
        "a",
        "pdf",
        now + 300_000
      )
    ).toBe(false))
  it.each([null, "invalid", "0.deadbeef", "abc".repeat(300)])(
    "rejects malformed tokens",
    (token) =>
      expect(verifyDocumentToken(token, "a", "render", now)).toBe(false)
  )
  it("fails closed when the secret is missing", () => {
    vi.stubEnv("INVOICE_PDF_SIGNING_SECRET", "")
    expect(verifyDocumentToken("invalid", "a", "pdf", now)).toBe(false)
  })
})
