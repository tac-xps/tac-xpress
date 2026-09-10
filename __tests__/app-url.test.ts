import { describe, expect, it } from "vitest"
import { getAppUrl } from "../lib/config/app-url"

describe("trusted application URL", () => {
  it("normalizes the website origin", () =>
    expect(getAppUrl("https://cargo.example/", "production")).toBe(
      "https://cargo.example"
    ))
  it("allows local development", () =>
    expect(getAppUrl("http://localhost:3000", "development")).toBe(
      "http://localhost:3000"
    ))
  it.each([
    "",
    "http://localhost:3000",
    "https://127.0.0.1",
    "http://cargo.example",
    "https://cargo.example/path",
    "https://user:pass@cargo.example",
    "https://cargo.example?next=evil",
    "https://ujyellrhwhqjmfponhuz.supabase.co",
    "https://mcp.supabase.com/mcp",
  ])("rejects unsafe production origin %s", (url) =>
    expect(() => getAppUrl(url, "production")).toThrow()
  )
})
