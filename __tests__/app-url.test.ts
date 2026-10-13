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

  it("falls back to Vercel production hostname when NEXT_PUBLIC_APP_URL is unset", () => {
    const originalEnv = process.env.NEXT_PUBLIC_APP_URL
    const originalVercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
    try {
      delete process.env.NEXT_PUBLIC_APP_URL
      process.env.VERCEL_PROJECT_PRODUCTION_URL = "tac-xpress-five.vercel.app"
      expect(getAppUrl(undefined, "production")).toBe(
        "https://tac-xpress-five.vercel.app"
      )
    } finally {
      process.env.NEXT_PUBLIC_APP_URL = originalEnv
      process.env.VERCEL_PROJECT_PRODUCTION_URL = originalVercel
    }
  })
})
