"use server"
import { randomUUID } from "node:crypto"
import { z } from "zod"
import { supabaseAdmin } from "@/lib/supabase/clients"
import { revalidatePath } from "next/cache"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAuditInTransaction } from "@/lib/audit"
import { db } from "@/lib/db"
import { profiles, users } from "@/lib/db/schema"
import { and, eq, inArray, isNull } from "drizzle-orm"
import * as Sentry from "@sentry/nextjs"

export async function getUserProfile() {
  const session = await requireDashboardSession()
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1)
  return {
    id: session.user.id,
    email: session.user.email,
    fullName: profile?.fullName || session.user.name || "Staff",
    avatarUrl: profile?.avatarUrl || "",
    role: session.user.role,
    emailNotifications: profile?.emailNotifications ?? true,
    whatsappNotifications: profile?.whatsappNotifications ?? true,
    smsNotifications: profile?.smsNotifications ?? false,
  }
}

export async function uploadAvatarFile(formData: FormData) {
  const session = await requireDashboardSession()
  const file = formData.get("file")
  if (!(file instanceof File) || file.size === 0 || file.size > 2 * 1024 * 1024)
    throw new Error("Choose an image under 2 MB.")
  const bytes = new Uint8Array(await file.arrayBuffer())
  const extensions: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  }
  const extension = extensions[file.type]
  const isImage =
    extension === "jpg"
      ? bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255
      : extension === "png"
        ? [137, 80, 78, 71, 13, 10, 26, 10].every(
            (byte, index) => bytes[index] === byte
          )
        : extension === "webp"
          ? new TextDecoder().decode(bytes.slice(0, 4)) === "RIFF" &&
            new TextDecoder().decode(bytes.slice(8, 12)) === "WEBP"
          : false
  if (!isImage) throw new Error("Choose a JPEG, PNG or WebP image.")
  const filename = `${randomUUID()}.${extension}`
  const filePath = `staff-avatars/${session.user.id}/${filename}`
  const { error } = await supabaseAdmin.storage
    .from("cargo-documents")
    .upload(filePath, bytes, { contentType: file.type, upsert: false })
  if (error) {
    Sentry.captureException(error, { tags: { area: "avatar_upload" } })
    throw new Error("Unable to upload your photo.")
  }
  const avatarUrl = `/api/staff-avatar/${session.user.id}?file=${filename}`
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(profiles)
        .values({ id: session.user.id, avatarUrl })
        .onConflictDoUpdate({ target: profiles.id, set: { avatarUrl } })
      await tx
        .update(users)
        .set({ avatarUrl })
        .where(eq(users.id, session.user.id))
      await logAuditInTransaction(tx, {
        action: "update_avatar",
        entity: "profiles",
        entityId: session.user.id,
        userId: session.user.id,
        userEmail: session.user.email,
        after: { avatar_url: avatarUrl },
      })
    })
  } catch (error) {
    await supabaseAdmin.storage.from("cargo-documents").remove([filePath])
    Sentry.captureException(error, { tags: { area: "avatar_profile" } })
    throw new Error("Unable to save your photo.")
  }
  revalidatePath("/dashboard", "layout")
  return { publicUrl: avatarUrl }
}

const profileSchema = z
  .object({
    fullName: z.string().trim().min(1).max(100),
    emailNotifications: z.boolean().optional(),
    whatsappNotifications: z.boolean().optional(),
    smsNotifications: z.boolean().optional(),
  })
  .strict()
export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const session = await requireDashboardSession()
  const parsed = profileSchema.parse(data)
  const [before] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, session.user.id))
    .limit(1)
  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(profiles)
        .values({ id: session.user.id, ...parsed })
        .onConflictDoUpdate({ target: profiles.id, set: parsed })
      await tx
        .update(users)
        .set({ name: parsed.fullName })
        .where(eq(users.id, session.user.id))
      await logAuditInTransaction(tx, {
        action: "update",
        entity: "profiles",
        entityId: session.user.id,
        userId: session.user.id,
        userEmail: session.user.email,
        before,
        after: parsed,
      })
    })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "staff_profile" } })
    throw new Error("Unable to save your profile.")
  }
  revalidatePath("/dashboard", "layout")
  return { success: true }
}
export async function getTeamMembers() {
  await requireDashboardSession(["admin"])
  return db
    .select({
      id: users.id,
      fullName: users.name,
      email: users.email,
      role: users.role,
    })
    .from(users)
    .where(
      and(inArray(users.role, ["admin", "staff"]), isNull(users.deletedAt))
    )
    .orderBy(users.name)
    .limit(100)
}
async function setTourComplete(value: boolean) {
  const session = await requireDashboardSession()
  try {
    await db
      .update(users)
      .set({ isOnboarded: value })
      .where(eq(users.id, session.user.id))
    revalidatePath("/dashboard", "layout")
    return { success: true }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "staff_onboarding" } })
    return { success: false, error: "Unable to update your tour preference." }
  }
}
export async function completeTour() {
  return setTourComplete(true)
}
export async function resetTour() {
  return setTourComplete(false)
}
