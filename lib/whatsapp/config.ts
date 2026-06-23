const DEFAULT_WPBOX_BASE_URL = "https://chat.leminai.com"

export type WhatsAppTemplateKey =
  | "invoice"
  | "driverRoute"
  | "shipmentStatusUpdate"

export type WhatsAppTemplateDefinition = {
  name: string
  languageCode: string
}

export const WHATSAPP_TEMPLATES: Record<
  WhatsAppTemplateKey,
  WhatsAppTemplateDefinition
> = {
  invoice: {
    name: "tac_express_corridor_invoice",
    languageCode: "en_US",
  },
  driverRoute: {
    name:
      process.env.WHATSAPP_DRIVER_TEMPLATE_NAME?.trim() ||
      "tac_express_driver_route",
    languageCode:
      process.env.WHATSAPP_DRIVER_TEMPLATE_LANGUAGE?.trim() || "en_US",
  },
  shipmentStatusUpdate: {
    name:
      process.env.WHATSAPP_STATUS_TEMPLATE_NAME?.trim() ||
      "shipment_status_update",
    languageCode:
      process.env.WHATSAPP_STATUS_TEMPLATE_LANGUAGE?.trim() || "en_US",
  },
}

export function getWhatsAppConfig() {
  return {
    enabled: process.env.WHATSAPP_ENABLED === "true",
    relayToken: process.env.WPBOX_API_TOKEN?.trim() || null,
    relayBaseUrl: process.env.WPBOX_BASE_URL?.trim() || DEFAULT_WPBOX_BASE_URL,
    appSecret: process.env.WHATSAPP_APP_SECRET?.trim() || null,
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN?.trim() || null,
  }
}

export function getWhatsAppTemplate(
  template: WhatsAppTemplateKey | WhatsAppTemplateDefinition
) {
  return typeof template === "string" ? WHATSAPP_TEMPLATES[template] : template
}
