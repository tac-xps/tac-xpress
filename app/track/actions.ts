"use server"

import { db } from "@/lib/db"
import { shipments, trackingEvents } from "@/lib/db/schema"
import { eq, desc } from "drizzle-orm"
import { headers } from "next/headers"

const publicTrackingRateLimits = new Map<
  string,
  { count: number; resetAt: number }
>()
const PUBLIC_TRACKING_RATE_LIMIT_MAX = 20
const PUBLIC_TRACKING_RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000

async function checkPublicTrackingRateLimit(awbNumber: string) {
  const headerStore = await headers()
  const clientIp =
    headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headerStore.get("x-real-ip") ||
    "unknown"
  const key = `${clientIp}:${awbNumber.toUpperCase()}`
  const now = Date.now()
  const entry = publicTrackingRateLimits.get(key)

  if (!entry || now > entry.resetAt) {
    publicTrackingRateLimits.set(key, {
      count: 1,
      resetAt: now + PUBLIC_TRACKING_RATE_LIMIT_WINDOW_MS,
    })
    return true
  }

  if (entry.count >= PUBLIC_TRACKING_RATE_LIMIT_MAX) return false
  entry.count++
  return true
}

export async function fetchPublicTrackingInfo(awbNumber: string) {
  const normalizedAwb = awbNumber.trim().toUpperCase()

  if (!normalizedAwb) {
    return { success: false, error: "AWB Number is required" }
  }

  if (!(await checkPublicTrackingRateLimit(normalizedAwb))) {
    return {
      success: false,
      error: "Too many tracking requests. Please try again later.",
    }
  }

  // Query only what is safe for public view
  const shipment = await db.query.shipments.findFirst({
    where: eq(shipments.awbNumber, normalizedAwb),
    columns: {
      id: true,
      awbNumber: true,
      origin: true,
      destination: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      serviceType: true,
      weightKg: true,
      pieces: true,
      bookingDate: true,
    },
  })

  if (!shipment) {
    return { success: false, error: "AWB Number not found" }
  }

  const events = await db.query.trackingEvents.findMany({
    where: eq(trackingEvents.shipmentId, shipment.id),
    orderBy: [desc(trackingEvents.createdAt)],
    columns: {
      id: true,
      status: true,
      location: true,
      description: true,
      createdAt: true,
    },
  })

  return {
    success: true,
    shipment,
    events,
  }
}
