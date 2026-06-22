import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { requireDashboardApi } from "@/lib/auth/guards"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const path = searchParams.get("path")

  if (!path) {
    return new NextResponse("Missing path parameter", { status: 400 })
  }

  const authResult = await requireDashboardApi()
  if (!authResult.ok) {
    return authResult.response
  }

  const supabase = await createClient()

  // Download the file from the private bucket
  const { data, error } = await supabase.storage
    .from("cargo-documents")
    .download(path)

  if (error || !data) {
    return new NextResponse("File not found or access denied", { status: 404 })
  }

  // Create response headers
  const fileName =
    path
      .split("/")
      .pop()
      ?.replace(/[^a-zA-Z0-9._-]/g, "_") || "document.pdf"
  const headers = new Headers()
  headers.set("Content-Type", data.type || "application/pdf")
  headers.set("Content-Disposition", `inline; filename="${fileName}"`)

  return new NextResponse(data as any, {
    status: 200,
    headers,
  })
}
