"use server"

import * as Sentry from "@sentry/nextjs"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { requireDashboardSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { manifests, drivers } from "@/lib/db/schema"
import {
  sendWhatsAppTemplateMessage,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

const directMessageSchema = z.object({
  driverId: z.string().uuid("Invalid driver identifier"),
  message: z
    .string()
    .trim()
    .min(1, "Message content is required")
    .max(1000, "Message cannot exceed 1000 characters"),
})

export async function messageDriverAction(
  manifestId: string,
  driverId: string
) {
  await requireDashboardSession()

  try {
    const manifest = await db.query.manifests.findFirst({
      where: eq(manifests.id, manifestId),
      with: {
        originHub: true,
        destinationHub: true,
        vehicle: true,
      },
    })

    if (!manifest) {
      return { success: false, error: "Manifest record not found" }
    }

    if (!manifest.driverId || manifest.driverId !== driverId) {
      return {
        success: false,
        error: "Driver is not assigned to this manifest",
      }
    }

    // Lookup driver strictly from drivers table
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.id, driverId),
    })

    if (!driver || !driver.phone) {
      return {
        success: false,
        error: "Driver not found or missing contact phone number",
      }
    }

    const routeText = `Hello ${driver.name || "Driver"}, you have been assigned to Manifest ${manifest.referenceId}. Route: ${manifest.originHub?.name ?? "Origin"} -> ${manifest.destinationHub?.name ?? "Destination"}. Vehicle: ${manifest.vehicle?.registrationNumber ?? "Assigned Fleet"}. Please inspect cargo and verify dispatch in your driver portal.`

    // Attempt template message first, fallback to text message
    let result = await sendWhatsAppTemplateMessage({
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
      result = await sendWhatsAppTextMessage({
        to: driver.phone,
        text: routeText,
        context: "driver_route_dispatch",
      })
    }

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to dispatch WhatsApp message to driver",
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

export async function directDriverWhatsAppAction(
  driverId: string,
  message: string
) {
  await requireDashboardSession()

  const parsed = directMessageSchema.safeParse({ driverId, message })
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message || "Invalid driver or message input",
    }
  }

  try {
    const driver = await db.query.drivers.findFirst({
      where: eq(drivers.id, parsed.data.driverId),
    })

    if (!driver || !driver.phone) {
      return {
        success: false,
        error: "Driver not found or missing contact phone number",
      }
    }

    const result = await sendWhatsAppTextMessage({
      to: driver.phone,
      text: parsed.data.message,
      context: "driver_direct_notice",
    })

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to dispatch WhatsApp message to driver",
      }
    }

    return { success: true, error: undefined }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "direct_driver_whatsapp" },
      extra: { driverId },
    })
    return {
      success: false,
      error: "Failed to send WhatsApp message",
    }
  }
}

