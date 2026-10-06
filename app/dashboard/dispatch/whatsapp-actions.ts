"use server"

import * as Sentry from "@sentry/nextjs"
import { eq } from "drizzle-orm"

import { requireDashboardSession } from "@/lib/auth/guards"
import { db } from "@/lib/db"
import { manifests, users, drivers } from "@/lib/db/schema"
import {
  sendWhatsAppTemplateMessage,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

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

    // Lookup driver from drivers table, with fallback to users
    const driver =
      (await db.query.drivers.findFirst({
        where: eq(drivers.id, driverId),
      })) ||
      (await db.query.users.findFirst({
        where: eq(users.id, driverId),
      }))

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

  try {
    const driver =
      (await db.query.drivers.findFirst({
        where: eq(drivers.id, driverId),
      })) ||
      (await db.query.users.findFirst({
        where: eq(users.id, driverId),
      }))

    if (!driver || !driver.phone) {
      return {
        success: false,
        error: "Driver not found or missing contact phone number",
      }
    }

    const result = await sendWhatsAppTextMessage({
      to: driver.phone,
      text: message,
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

