import "server-only"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { requireDashboardSession } from "@/lib/auth/guards"
import { verifyDocumentToken } from "./document-token"

export async function requireStaffPage() {
  return requireDashboardSession().catch(() => redirect("/signin"))
}
export async function requireAdminPage() {
  return requireDashboardSession(["admin"]).catch(() => redirect("/signin"))
}
export async function requireDocumentPage(id: string) {
  const requestHeaders = await headers()
  if (
    verifyDocumentToken(
      requestHeaders.get("x-internal-document-token"),
      id,
      "render"
    )
  )
    return
  await requireStaffPage()
}
