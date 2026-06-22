"use server"

import { supabaseAdmin } from "@/lib/supabase/clients"
import {
  isWithinWhatsAppConversationWindow,
  normalizeWhatsAppPhone,
  sendWhatsAppTemplateMessage,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

/**
 * Proactively notify a customer via WhatsApp when their shipment status changes.
 *
 * Respects:
 *  1. Customer opt-in status
 *  2. 24-hour conversation window based on the customer's most recent inbound message
 */
export async function notifyShipmentUpdate(
  awb: string,
  newStatus: string
): Promise<void> {
  const { data } = await supabaseAdmin
    .from("shipments")
    .select("consignee_phone, customer_phone")
    .eq("awb_number", awb)
    .single()
  const shipment = data as {
    consignee_phone?: string | null
    customer_phone?: string | null
  } | null

  const rawPhone = shipment?.customer_phone || shipment?.consignee_phone

  if (!rawPhone) {
    console.warn(`[WhatsApp Proactive] No phone for AWB ${awb}`)
    return
  }

  const phone = normalizeWhatsAppPhone(rawPhone)

  const { data: subscriber } = await supabaseAdmin
    .from("whatsapp_subscribers")
    .select("opted_in, last_inbound_at")
    .eq("phone", phone)
    .single()

  if (subscriber?.opted_in === false) {
    console.log(`[WhatsApp Proactive] ${phone} is opted out; skipping`)
    return
  }

  const trackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/portal/track`

  if (isWithinWhatsAppConversationWindow(subscriber?.last_inbound_at)) {
    await sendWhatsAppTextMessage({
      to: phone,
      text: `Update for ${awb}: your shipment is now ${newStatus}.\nTrack live: ${trackUrl}`,
      relatedAwb: awb,
      context: "shipment_status_update_text",
    })
    return
  }

  await sendWhatsAppTemplateMessage({
    to: phone,
    template: "shipmentStatusUpdate",
    relatedAwb: awb,
    context: "shipment_status_update_template",
    components: [
      {
        type: "body",
        parameters: [
          { type: "text", text: awb },
          { type: "text", text: newStatus },
        ],
      },
    ],
  })
}
