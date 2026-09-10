"use server"

import { signOut } from "@/auth"
import { cookies } from "next/headers"
import type { User } from "@supabase/supabase-js"

const staffOnlyMessage = "TAC-XPRESS workspace access is for provisioned admins and staff. Customers can track a shipment or contact our team without an account."

// Compatibility endpoints fail closed. Public enrollment and customer sign-in
// are retired; keeping these exports prevents stale clients from granting access.
export async function registerWithEmail(_email: string, _fullName: string) {
  return { success: false, error: staffOnlyMessage }
}
export async function sendMagicLink(_email: string) {
  return { success: false, error: staffOnlyMessage }
}
export async function getCurrentUser(): Promise<User | null> { return null }
export async function getUserProfile(_userId: string) { return null }
export async function logoutUser() {
  const cookieStore = await cookies()
  for (const name of ["sb-access-token", "sb-refresh-token", "portal_session"]) {
    cookieStore.set(name, "", { maxAge: 0, path: "/" })
  }
  await signOut({ redirectTo: "/signin" })
}
