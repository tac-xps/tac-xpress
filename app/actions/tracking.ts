"use server"

import { supabaseAdmin, supabasePublic } from "@/lib/supabase/clients"
import { z } from "zod"

const trackAwbSchema = z.object({
  awb_number: z.string().min(8, "Invalid AWB number"),
})

export async function trackAwb(formData: FormData) {
  const awb = formData.get("awb_number") as string

  const parsed = trackAwbSchema.safeParse({ awb_number: awb })
  if (!parsed.success) {
    return { error: "Invalid AWB number format" }
  }

  // Get shipment details
  const { data: shipment, error: shipmentError } = await supabasePublic
    .from("shipments")
    .select("*")
    .eq("awb_number", awb)
    .eq("is_publicly_trackable", true)
    .single()

  if (shipmentError || !shipment) {
    return { error: "AWB not found or not trackable" }
  }

  // Get tracking events
  const { data: events, error: eventsError } = await supabasePublic
    .from("tracking_events")
    .select("*")
    .eq("awb_number", awb)
    .eq("is_public", true)
    .order("event_time", { ascending: false })

  if (eventsError) {
    return { error: "Failed to load tracking events" }
  }

  return {
    success: true,
    data: {
      awb_number: shipment.awb_number,
      origin: shipment.origin,
      destination: shipment.destination,
      status: shipment.status,
      service: shipment.service_type || shipment.service,
      weight: shipment.weight_kg ? `${shipment.weight_kg}kg` : shipment.weight,
      created_at: shipment.created_at,
      customer_name: shipment.customer_name,
      events: events || [],
      current_location: events?.[0]?.location,
      estimated_delivery: shipment.estimated_delivery,
    },
  }
}
