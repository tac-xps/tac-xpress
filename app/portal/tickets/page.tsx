import { redirect } from "next/navigation"
import { requireStaffPage } from "@/lib/auth/page-access"

export default async function LegacyPortalPage() {
  await requireStaffPage()
  redirect("/dashboard/messages")
}

