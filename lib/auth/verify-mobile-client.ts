import { timingSafeEqual } from "node:crypto"

export function verifyMobileClient(request: Request): Response | null {
  const secret = process.env.MOBILE_API_SECRET?.trim()
  const header = request.headers.get("authorization")
  const supplied = header?.startsWith("Bearer ") ? header.slice(7) : ""
  if (
    !secret ||
    !supplied ||
    Buffer.byteLength(secret) !== Buffer.byteLength(supplied) ||
    !timingSafeEqual(Buffer.from(secret), Buffer.from(supplied))
  ) {
    return Response.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } }
    )
  }
  return null
}
