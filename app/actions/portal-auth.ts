"use server"
import { logoutUser } from "@/app/actions/auth"

export type PortalSessionPayload = { email: string; awb_number: string }

// Customer access is retired. Staff use NextAuth and the current-role guards
// on /dashboard; a legacy Supabase or portal cookie never authorizes operations.
export async function verifyPortalSession(): Promise<PortalSessionPayload | null> { return null }
export async function deletePortalSession() { await logoutUser() }
export async function logoutPortal() { await logoutUser() }
export async function authenticatePortalAccess(_formData: FormData) {
  return { error: "The workspace is for admins and staff. Use staff sign-in; shipment tracking does not require an account." }
}
