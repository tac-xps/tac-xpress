import { describe, expect, it, vi } from "vitest"
import { NextRequest } from "next/server"
const verify = vi.hoisted(() => vi.fn())
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth: { verifyOtp: verify } }) }))
const { GET } = await import("@/app/auth/callback/route")
describe("retired customer email callback", () => {
  for (const query of ["", "?token_hash=expired", "?token_hash=valid&next=https://attacker.example"]) {
    it(`always stays on the staff sign-in origin: ${query || "no token"}`, async () => {
      const response = await GET(new NextRequest(`https://cargo.example/auth/callback${query}`))
      expect(response.headers.get("location")).toBe("https://cargo.example/signin?reason=staff-only")
      expect(response.cookies.get("sb-access-token")?.value).toBe("")
      expect(response.cookies.get("sb-access-token")?.maxAge).toBe(0)
      expect(response.headers.get("cache-control")).toBe("no-store")
      expect(response.headers.get("referrer-policy")).toBe("no-referrer")
      expect(verify).not.toHaveBeenCalled()
    })
  }
})

