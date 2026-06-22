"use server"

import {
  sendWhatsAppTemplateMessage,
  sendWhatsAppTextMessage,
} from "@/lib/whatsapp/service"

export async function sendWhatsAppMessage(to: string, text: string) {
  return sendWhatsAppTextMessage({
    to,
    text,
    context: "legacy_whatsapp_outbound_text",
  })
}

export async function sendTemplateMessage(
  to: string,
  templateName: string,
  languageCode: string = "en_US",
  components?: any[]
) {
  return sendWhatsAppTemplateMessage({
    to,
    template: {
      name: templateName,
      languageCode,
    },
    components,
    context: "legacy_whatsapp_outbound_template",
  })
}
