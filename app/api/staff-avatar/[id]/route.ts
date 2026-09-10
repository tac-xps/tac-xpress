import { NextResponse } from "next/server"
import { z } from "zod"
import { requireDashboardApi } from "@/lib/auth/guards"
import { supabaseAdmin } from "@/lib/supabase/clients"
import * as Sentry from "@sentry/nextjs"
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const access = await requireDashboardApi()
  if (!access.ok) return access.response
  const { id } = await params
  if (id !== access.session.user.id)
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  const file = new URL(request.url).searchParams.get("file") ?? ""
  if (
    !z.string().uuid().safeParse(id).success ||
    !/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(file)
  )
    return NextResponse.json(
      { error: "Invalid photo reference" },
      { status: 400 }
    )
  try {
    const { data, error } = await supabaseAdmin.storage
      .from("cargo-documents")
      .download(`staff-avatars/${id}/${file}`)
    if (error || !data)
      return NextResponse.json({ error: "Photo unavailable" }, { status: 404 })
    return new NextResponse(data, {
      headers: {
        "Content-Type": file.endsWith(".jpg")
          ? "image/jpeg"
          : file.endsWith(".png")
            ? "image/png"
            : "image/webp",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "staff_avatar" } })
    return NextResponse.json({ error: "Photo unavailable" }, { status: 500 })
  }
}
