import { NextResponse, type NextRequest } from "next/server"

// Retired customer magic links must not create sessions, even if the token is
// still valid at the identity provider. Never forward token/query parameters.
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/signin?reason=staff-only", request.nextUrl.origin))
  response.headers.set("Cache-Control", "no-store")
  response.headers.set("Referrer-Policy", "no-referrer")
  for (const name of ["sb-access-token", "sb-refresh-token", "portal_session"]) {
    response.cookies.set(name, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 0, path: "/" })
  }
  return response
}
