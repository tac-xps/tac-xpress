"use server"

import * as Sentry from "@sentry/nextjs"
import { eq } from "drizzle-orm"

import { requireDashboardAction } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { manifests, users } from "@/lib/db/schema"
import { sendWhatsAppTemplateMessage } from "@/lib/whatsapp/service"

export async function messageDriverAction(
  manifestId: string,
  driverId: string
) {
  const authResult = await requireDashboardAction()
  if (!authResult.ok) return authResult.response

  try {
    const manifest = await db.query.manifests.findFirst({
      where: eq(manifests.id, manifestId),
    })

    if (!manifest) {
      return { success: false, error: "Manifest not found" }
    }

    const driver = await db.query.users.findFirst({
      where: eq(users.id, driverId),
    })

    if (!driver || !driver.phone) {
      return {
        success: false,
        error: "Driver not found or missing phone number",
      }
    }

    const result = await sendWhatsAppTemplateMessage({
      to: driver.phone,
      template: "driverRoute",
      context: "driver_route_dispatch",
      bodyPreview: `[template:driver-route:${manifest.referenceId}]`,
      components: [
        {
          type: "BODY",
          parameters: [
            { type: "text", text: driver.name || "Driver" },
            { type: "text", text: manifest.referenceId },
          ],
        },
      ],
    })

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to send WhatsApp message",
      }
    }

    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "dispatch_driver_whatsapp" },
      extra: { manifestId, driverId },
    })
    return {
      success: false,
      error: "Failed to send WhatsApp message",
    }
  }
}
