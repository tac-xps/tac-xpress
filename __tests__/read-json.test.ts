import { describe, expect, it } from "vitest"
import { readBoundedJson } from "@/lib/server/read-json"
describe("bounded public JSON", () => {
  it("parses valid input", async () =>
    expect(
      await readBoundedJson(
        new Request("https://example.com", {
          method: "POST",
          body: '{"message":"hello"}',
        })
      )
    ).toEqual({ message: "hello" }))
  it("rejects oversized input without a content-length header", async () =>
    expect(
      await readBoundedJson(
        new Request("https://example.com", {
          method: "POST",
          body: JSON.stringify({ message: "a".repeat(100) }),
        }),
        20
      )
    ).toBeNull())
  it("rejects invalid JSON", async () =>
    expect(
      await readBoundedJson(
        new Request("https://example.com", { method: "POST", body: "invalid" })
      )
    ).toBeNull())
})
