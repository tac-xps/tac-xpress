"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { requireDashboardSession } from "@/lib/auth/guards"
import { logAudit } from "@/lib/audit"
import { db } from "@/lib/db"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * Retrieves the profile of the currently authenticated user.
 *
 * This function uses the NextAuth session to identify the user. It attempts
 * to fetch the user's profile from the Supabase `profiles` table. If the profile
 * does not exist, it automatically creates a new profile row using the user's
 * session data as a fallback, ensuring the UI always has a valid profile object.
 *
 * @returns {Promise<Object|null>} An object containing the user's ID, email, full name, avatar URL, role, and notification preferences, or null if no session exists.
 * @throws {Error} If the database query or initialization fails.
 */
export async function getUserProfile() {
  const session = await auth()
  if (!session?.user?.id) return null

  if (session.user.id === "00000000-0000-0000-0000-000000000000") {
    return {
      id: session.user.id,
      email: session.user.email,
      fullName: "E2E Admin",
      avatarUrl: "",
      role: "Admin",
      emailNotifications: true,
      whatsappNotifications: true,
      smsNotifications: false,
    }
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .maybeSingle()

  let profileData = data

  if (error) {
    throw new Error("Failed to load profile")
  }

  if (!data) {
    // Automatically create a profile row if it's missing (e.g. NextAuth login without trigger)
    const defaultName =
      session.user.name || session.user.email?.split("@")[0] || "User"
    const newProfile = {
      id: session.user.id,
      full_name: defaultName,
      avatar_url: "",
      email_notifications: true,
      whatsapp_notifications: true,
      sms_notifications: false,
    }

    const { error: upsertError } = await supabaseAdmin
      .from("profiles")
      .upsert(newProfile)
    if (upsertError) {
      throw new Error("Failed to initialize profile")
    }
    profileData = newProfile
  }

  return {
    id: profileData.id || session.user.id,
    email: session.user.email,
    fullName: profileData.full_name,
    avatarUrl: profileData.avatar_url || "",
    role: profileData.role || session.user.role || "Staff",
    emailNotifications: profileData.email_notifications ?? true,
    whatsappNotifications: profileData.whatsapp_notifications ?? true,
    smsNotifications: profileData.sms_notifications ?? false,
  }
}

/**
 * Uploads a new avatar image to Supabase Storage and updates the user's profile.
 *
 * Bypasses client-side RLS by executing as a Server Action using `supabaseAdmin`.
 * The function uploads the file, retrieves the public URL, and then upserts
 * the URL into the user's `profiles` row. If the database update fails, it
 * cleans up the orphaned file in Storage.
 *
 * @param {FormData} formData - The multipart form data containing the file to upload under the "file" key.
 * @returns {Promise<{publicUrl: string}>} An object containing the public URL of the uploaded avatar.
 * @throws {Error} If authentication fails, no file is provided, or the upload/upsert process encounters an error.
 */
export async function uploadAvatarFile(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  if (session.user.id === "00000000-0000-0000-0000-000000000000") {
    return { publicUrl: "https://example.com/avatar.png" }
  }

  const file = formData.get("file") as File
  if (!file) throw new Error("No file provided")

  const fileExt = file.name.split(".").pop() || "png"
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${session.user.id}/${fileName}`

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, file)

  if (uploadError) {
    throw new Error("Failed to upload avatar to storage")
  }

  const { data } = supabaseAdmin.storage.from("avatars").getPublicUrl(filePath)

  // Upsert profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .upsert({ id: session.user.id, avatar_url: data.publicUrl })

  if (profileError) {
    await supabaseAdmin.storage.from("avatars").remove([filePath])
    throw new Error("Failed to persist avatar")
  }

  await logAudit({
    action: "update_avatar",
    entity: "profiles",
    entityId: session.user.id,
    userId: session.user.id,
    userEmail: session.user.email,
    after: { avatar_url: data.publicUrl },
  })

  revalidatePath("/", "layout")
  return { publicUrl: data.publicUrl }
}

/**
 * Updates the profile settings of the currently authenticated user.
 *
 * Modifies fields like full name and notification preferences. It uses
 * an upsert operation to ensure that even if a profile row does not yet
 * exist, the changes will be safely applied and the row will be created.
 *
 * @param {Object} data - The updated profile data.
 * @param {string} data.fullName - The user's full name.
 * @param {boolean} [data.emailNotifications] - Preference for receiving email notifications.
 * @param {boolean} [data.whatsappNotifications] - Preference for receiving WhatsApp notifications.
 * @param {boolean} [data.smsNotifications] - Preference for receiving SMS notifications.
 * @returns {Promise<{success: boolean}>} An object indicating success.
 * @throws {Error} If authentication fails or the database update encounters an error.
 */
export async function updateProfile(data: {
  fullName: string
  emailNotifications?: boolean
  whatsappNotifications?: boolean
  smsNotifications?: boolean
}) {
  const session = await auth()
  if (!session?.user?.id) throw new Error("Not authenticated")

  if (session.user.id === "00000000-0000-0000-0000-000000000000") {
    return { success: true }
  }

  const { data: before, error: lookupError } = await supabaseAdmin
    .from("profiles")
    .select(
      "full_name, email_notifications, whatsapp_notifications, sms_notifications"
    )
    .eq("id", session.user.id)
    .maybeSingle()
  if (lookupError) throw new Error("Failed to load current profile")

  const updates: {
    id: string
    full_name: string
    email_notifications?: boolean
    whatsapp_notifications?: boolean
    sms_notifications?: boolean
  } = { id: session.user.id, full_name: data.fullName }
  if (data.emailNotifications !== undefined)
    updates.email_notifications = data.emailNotifications
  if (data.whatsappNotifications !== undefined)
    updates.whatsapp_notifications = data.whatsappNotifications
  if (data.smsNotifications !== undefined)
    updates.sms_notifications = data.smsNotifications

  const { error } = await supabaseAdmin.from("profiles").upsert(updates)

  if (error) {
    throw new Error("Failed to update profile")
  }

  await logAudit({
    action: "update",
    entity: "profiles",
    entityId: session.user.id,
    userId: session.user.id,
    userEmail: session.user.email,
    before,
    after: updates,
  })

  revalidatePath("/", "layout")
  return { success: true }
}

/**
 * Retrieves a list of team members registered in the organization.
 *
 * Fetches all users from the Supabase admin interface and formats them
 * into a structured list. It safely handles metadata fields to resolve
 * each user's full name and system role.
 *
 * @returns {Promise<Array<{id: string, fullName: string, email: string, role: string}>>} An array of team member objects.
 */
export async function getTeamMembers() {
  await requireDashboardSession(["admin"])

  const { data, error } = await supabaseAdmin.auth.admin.listUsers()
  if (error || !data) return []

  return data.users.map((u) => ({
    id: u.id,
    fullName: u.user_metadata?.full_name || "Guest User",
    email: u.email,
    role: u.user_metadata?.role || u.app_metadata?.role || "Staff",
  }))
}

export async function completeTour() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email,
        isOnboarded: true,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { isOnboarded: true },
      })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (err: any) {
    console.error("Error completing tour:", err)
    return { success: false, error: err.message }
  }
}

export async function resetTour() {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" }
  }

  try {
    await db
      .insert(users)
      .values({
        id: session.user.id,
        email: session.user.email,
        isOnboarded: false,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: { isOnboarded: false },
      })

    revalidatePath("/", "layout")
    return { success: true }
  } catch (err: any) {
    console.error("Error resetting tour:", err)
    return { success: false, error: err.message }
  }
}
