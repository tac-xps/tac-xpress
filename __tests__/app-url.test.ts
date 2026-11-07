import { afterEach, describe, expect, it, vi } from "vitest"
import { getAppUrl } from "../lib/config/app-url"

afterEach(() => vi.unstubAllEnvs())

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
    vi.stubEnv("NEXT_PUBLIC_APP_URL", undefined)
    vi.stubEnv("VERCEL_ENV", "production")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "tac-xpress-five.vercel.app")
    expect(getAppUrl(undefined, "production")).toBe(
      "https://tac-xpress-five.vercel.app"
    )
  })

  it("keeps preview document and callback URLs on the preview deployment", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://tac-xpress-five.vercel.app")
    vi.stubEnv("VERCEL_PROJECT_PRODUCTION_URL", "tac-xpress-five.vercel.app")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("VERCEL_URL", "dashboard-acceptance.vercel.app")
    expect(getAppUrl(undefined, "production")).toBe(
      "https://dashboard-acceptance.vercel.app"
    )
  })

  it("rejects an unidentified preview instead of using production", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://tac-xpress-five.vercel.app")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("VERCEL_URL", undefined)
    expect(() => getAppUrl(undefined, "production")).toThrow()
  })

  it("keeps explicit browser origins independent of the deployment fallback", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://tac-xpress-five.vercel.app")
    vi.stubEnv("VERCEL_ENV", "preview")
    vi.stubEnv("VERCEL_URL", "dashboard-acceptance.vercel.app")
    expect(getAppUrl("http://localhost:3000", "development")).toBe(
      "http://localhost:3000"
    )
  })
})
