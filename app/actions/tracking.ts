"use server"

import { publicTrackingQuery } from "@/lib/tracking/public-query"
import arcjet, { slidingWindow, request } from "@arcjet/next"
import { z } from "zod"
import * as Sentry from "@sentry/nextjs"
import { capturePostHogEvent } from "@/lib/posthog-server"
const aj = arcjet({
  key: process.env.ARCJET_KEY || "ajkey_placeholder",
  rules: [
    slidingWindow({
      mode: process.env.NODE_ENV === "development" ? "DRY_RUN" : "LIVE",
      interval: "1m",
      max: 20,
    }),
  ],
})

const trackAwbSchema = z.object({
  awb_number: z.string().trim().toUpperCase().regex(/^[A-Z0-9-]{5,40}$/, "Invalid AWB number"),
})

export async function trackAwb(formData: FormData) {
  const rawAwb = formData.get("awb_number")

  const parsed = trackAwbSchema.safeParse({ awb_number: rawAwb })
  if (!parsed.success) {
    return { error: "Invalid AWB number format" }
  }
  const awb = parsed.data.awb_number

  try {
    const req = await request()
    const decision = await aj.protect(req)
    if (decision.isDenied() || decision.isErrored()) {
      await capturePostHogEvent("public_tracking_lookup", "public_tracker", { awb_number: awb, success: false, error_reason: "rate_limited" })
      return { error: "Tracking is temporarily unavailable. Please try again shortly." }
    }
    const rows = await publicTrackingQuery(awb)
    const shipment = rows[0]
    if (!shipment) {
      await capturePostHogEvent("public_tracking_lookup", "public_tracker", { awb_number: awb, success: false, error_reason: "not_found" })
      return { error: "AWB not found or no public updates are available yet." }
    }
    const validEvents = rows.filter(r => r.event && r.event.id)
    const displayStatus = validEvents.length > 0 ? validEvents[0].event!.status : "pending"

    await capturePostHogEvent("public_tracking_lookup", "public_tracker", { awb_number: awb, success: true, status: displayStatus })
    return { success: true, data: {
      awb_number: shipment.awb_number, origin: shipment.origin, destination: shipment.destination,
      status: displayStatus || "pending", service: shipment.service, created_at: shipment.created_at.toISOString(),
      estimated_delivery: shipment.estimated_delivery?.toISOString(), current_location: validEvents.length > 0 ? validEvents[0].event!.location : shipment.origin,
      events: validEvents.map(row => ({ ...row.event!, event_time: row.event!.event_time?.toISOString() || row.event!.created_at?.toISOString() || new Date().toISOString(), created_at: row.event!.created_at?.toISOString() || new Date().toISOString() })),
    } }
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "public_tracking" } })
    await capturePostHogEvent("public_tracking_lookup", "public_tracker", { awb_number: awb, success: false, error_reason: "server_error" })
    return { error: "Tracking is temporarily unavailable. Please try again later." }
  }
}
