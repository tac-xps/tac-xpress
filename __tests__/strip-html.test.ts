import { describe, expect, it } from "vitest"
import { stripHtmlToPlainText } from "@/lib/sanitize"

describe("stripHtmlToPlainText", () => {
  it("converts rich-text paragraphs and line breaks to plain text newlines", () => {
    const html = "<p>First remark line</p><p>Second remark line</p>"
    expect(stripHtmlToPlainText(html)).toBe("First remark line\nSecond remark line")
  })

  it("handles br tags correctly", () => {
    const html = "<p>Line 1<br />Line 2</p>"
    expect(stripHtmlToPlainText(html)).toBe("Line 1\nLine 2")
  })

  it("strips formatting tags while preserving text content", () => {
    const html = "<p><strong>Urgent:</strong> Deliver to <em>Building B</em></p>"
    expect(stripHtmlToPlainText(html)).toBe("Urgent: Deliver to Building B")
  })

  it("preserves plain text containing mathematical inequality operators", () => {
    const plainText = "Charge < 500; insured value > 1000"
    expect(stripHtmlToPlainText(plainText)).toBe("Charge < 500; insured value > 1000")
  })

  it("preserves plain text containing non-HTML angle bracket tokens", () => {
    const plainText = "Ref <AWB-987452> pending customer signature"
    expect(stripHtmlToPlainText(plainText)).toBe("Ref <AWB-987452> pending customer signature")
  })

  it("returns empty string for null, undefined, or empty input", () => {
    expect(stripHtmlToPlainText(null)).toBe("")
    expect(stripHtmlToPlainText(undefined)).toBe("")
    expect(stripHtmlToPlainText("")).toBe("")
  })
})
