import "server-only"
import * as Sentry from "@sentry/nextjs"
import { db } from "@/lib/db"
import { whatsappSubscribers } from "@/lib/db/schema"
import { parsePhoneNumberFromString } from "libphonenumber-js"

import { withRetry } from "@/lib/queue"
import { getErrorMessage } from "@/lib/server/public-errors"
import { supabaseAdmin } from "@/lib/supabase/clients"
import {
  getWhatsAppConfig,
  getWhatsAppTemplate,
  type WhatsAppTemplateDefinition,
  type WhatsAppTemplateKey,
} from "@/lib/whatsapp/config"

const OUTBOUND_PROVIDER = "wpbox"
const GENERIC_PROVIDER_ERROR =
  "Delivery was not confirmed. Check the provider history before retrying; the message may already have been accepted."
const DISABLED_ERROR = "WhatsApp delivery is currently disabled."
const MISCONFIGURED_ERROR = "WhatsApp delivery is not configured."

type WhatsAppMessageStatus =
  | "pending"
  | "sent"
  | "delivered"
  | "read"
  | "failed"
type WhatsAppMessageType = "text" | "template"

type WhatsAppSendContext = {
  relatedTicketId?: string | null
  relatedAwb?: string | null
  relatedInvoiceId?: string | null
  context?: string
}

type SendTextMessageInput = WhatsAppSendContext & {
  to: string
  text: string
}

type TemplateComponent = {
  type: string
  parameters?: unknown[]
}

type SendTemplateMessageInput = WhatsAppSendContext & {
  to: string
  template: WhatsAppTemplateKey | WhatsAppTemplateDefinition
  components?: TemplateComponent[]
  bodyPreview?: string
}

type ProviderResult = {
  parsedBody: Record<string, any> | null
  rawBody: string
  httpStatus: number
}

type MessageIdentifiers = {
  providerMessageId: string | null
  metaMessageId: string | null
}

function pickFirstString(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value
    }
  }

  return null
}

function parseProviderBody(rawBody: string) {
  if (!rawBody) {
    return null
  }

  try {
    const parsed = JSON.parse(rawBody)
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, any>)
      : null
  } catch {
    return null
  }
}

function extractMessageIdentifiers(
  parsedBody: Record<string, any> | null
): MessageIdentifiers {
  return {
    providerMessageId: pickFirstString(
      parsedBody?.id,
      parsedBody?.message_id,
      parsedBody?.messageId,
      parsedBody?.data?.id
    ),
    metaMessageId: pickFirstString(
      parsedBody?.message_wamid,
      parsedBody?.messageWamid,
      parsedBody?.wamid,
      parsedBody?.messages?.[0]?.id,
      parsedBody?.data?.message_wamid,
      parsedBody?.data?.wamid
    ),
  }
}

function extractProviderError(
  parsedBody: Record<string, any> | null,
  rawBody: string
) {
  return (
    pickFirstString(
      parsedBody?.error,
      parsedBody?.message,
      parsedBody?.errors?.[0]?.message,
      parsedBody?.detail
    ) ||
    rawBody ||
    "Unknown provider error"
  )
}

function hasSemanticFailure(
  parsedBody: Record<string, any> | null,
  rawBody: string
) {
  if (!parsedBody) {
    return true
  }
  const ids = extractMessageIdentifiers(parsedBody)
  if (!ids.providerMessageId && !ids.metaMessageId) return true

  const normalizedStatus =
    typeof parsedBody.status === "string"
      ? parsedBody.status.toLowerCase()
      : null

  if (
    normalizedStatus &&
    normalizedStatus !== "success" &&
    normalizedStatus !== "sent"
  ) {
    return true
  }

  if (parsedBody.success === false || parsedBody.error || parsedBody.errors) {
    return true
  }

  if (
    Object.prototype.hasOwnProperty.call(parsedBody, "message_wamid") &&
    parsedBody.message_wamid == null
  ) {
    return true
  }

  if (
    rawBody &&
    !parsedBody.status &&
    /whoops|error|failed/i.test(rawBody) &&
    !/success/i.test(rawBody)
  ) {
    return true
  }

  return false
}

function serializeProviderPayload(
  parsedBody: Record<string, any> | null,
  rawBody: string
) {
  if (parsedBody) {
    return parsedBody
  }

  if (!rawBody) {
    return null
  }

  return { raw: rawBody.slice(0, 4000) }
}

function createTemplatePreview(template: WhatsAppTemplateDefinition) {
  return `[template:${template.name}]`
}

export function normalizeWhatsAppPhone(phone: string) {
  const parsed = parsePhoneNumberFromString(phone, "IN")
  if (parsed?.isValid()) {
    return parsed.number.replace(/^\+/, "")
  }

  const digits = phone.replace(/\D/g, "")
  if (/^0\d{10}$/.test(digits)) {
    return `91${digits.slice(1)}`
  }

  if (/^\d{10}$/.test(digits)) {
    return `91${digits}`
  }

  if (/^\d{11,15}$/.test(digits)) {
    return digits
  }

  throw new Error("Invalid WhatsApp phone number")
}

export function isWithinWhatsAppConversationWindow(
  lastInboundAt: string | Date | null | undefined,
  now = new Date()
) {
  if (!lastInboundAt) {
    return false
  }

  const lastInbound = new Date(lastInboundAt)
  if (Number.isNaN(lastInbound.getTime())) {
    return false
  }

  return now.getTime() - lastInbound.getTime() < 24 * 60 * 60 * 1000
}

async function insertOutboundLog(
  input: {
    phone: string
    body: string
    messageType: WhatsAppMessageType
    status: WhatsAppMessageStatus
    templateName?: string | null
    templateLanguage?: string | null
    relatedTicketId?: string | null
    relatedAwb?: string | null
    relatedInvoiceId?: string | null
    providerMessageId?: string | null
    metaMessageId?: string | null
    providerPayload?: Record<string, any> | null
    failureReason?: string | null
  },
  existingId?: string
) {
  const payload = {
    phone: input.phone,
    body: input.body,
    whatsapp_message_id: input.metaMessageId || input.providerMessageId || null,
    provider_name: OUTBOUND_PROVIDER,
    provider_message_id: input.providerMessageId || null,
    meta_message_id: input.metaMessageId || null,
    status: input.status,
    template_name: input.templateName || null,
    template_language: input.templateLanguage || null,
    message_type: input.messageType,
    related_ticket_id: input.relatedTicketId || null,
    related_awb: input.relatedAwb || null,
    related_invoice_id: input.relatedInvoiceId || null,
    failure_reason: input.failureReason || null,
    provider_payload: input.providerPayload || null,
    last_status_at: new Date().toISOString(),
    ...(existingId ? {} : { created_at: new Date().toISOString() }),
  }
  const query = existingId
    ? supabaseAdmin
        .from("message_outbound")
        .update(payload)
        .eq("id", existingId)
    : supabaseAdmin.from("message_outbound").insert(payload)
  const { data, error } = await query.select("id").single()

  if (error) {
    Sentry.captureException(error, {
      tags: { area: "whatsapp_outbound_log" },
      extra: {
        messageType: input.messageType,
        status: input.status,
        relatedTicketId: input.relatedTicketId,
        relatedAwb: input.relatedAwb,
      },
    })
    return null
  }

  return data?.id ?? null
}

async function sendViaRelay(input: {
  endpoint: "sendmessage" | "sendtemplatemessage"
  phone: string
  messageType: WhatsAppMessageType
  bodyPreview: string
  payload: Record<string, unknown>
  templateName?: string | null
  templateLanguage?: string | null
  actionName: string
  relatedTicketId?: string | null
  relatedAwb?: string | null
  relatedInvoiceId?: string | null
  sentryContext?: string
}) {
  const config = getWhatsAppConfig()
  const normalizedPhone = normalizeWhatsAppPhone(input.phone)

  if (!config.enabled) {
    await insertOutboundLog({
      phone: normalizedPhone,
      body: input.bodyPreview,
      messageType: input.messageType,
      status: "failed",
      templateName: input.templateName,
      templateLanguage: input.templateLanguage,
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
      relatedInvoiceId: input.relatedInvoiceId,
      failureReason: DISABLED_ERROR,
    })

    return { success: false, error: DISABLED_ERROR }
  }

  if (!config.relayToken) {
    Sentry.captureMessage("WPBox token missing for outbound send", {
      level: "error",
      tags: { area: "whatsapp_config" },
      extra: { context: input.sentryContext || input.actionName },
    })

    await insertOutboundLog({
      phone: normalizedPhone,
      body: input.bodyPreview,
      messageType: input.messageType,
      status: "failed",
      templateName: input.templateName,
      templateLanguage: input.templateLanguage,
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
      relatedInvoiceId: input.relatedInvoiceId,
      failureReason: MISCONFIGURED_ERROR,
    })

    return { success: false, error: MISCONFIGURED_ERROR }
  }

  const logId = await insertOutboundLog({
    phone: normalizedPhone,
    body: input.bodyPreview,
    messageType: input.messageType,
    status: "pending",
    templateName: input.templateName,
    templateLanguage: input.templateLanguage,
    relatedTicketId: input.relatedTicketId,
    relatedAwb: input.relatedAwb,
    relatedInvoiceId: input.relatedInvoiceId,
    failureReason:
      "Awaiting provider response. Review provider history before any retry.",
  })
  if (!logId)
    return {
      success: false,
      error:
        "Message was not sent because its delivery attempt could not be saved.",
    }

  const relayResult = await withRetry<ProviderResult>(
    async () => {
      const response = await fetch(
        `${config.relayBaseUrl}/api/wpbox/${input.endpoint}`,
        {
          method: "POST",
          signal: AbortSignal.timeout(15000),
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: config.relayToken,
            ...(config.userId ? { uid: config.userId } : {}),
            phone: normalizedPhone,
            ...input.payload,
          }),
        }
      )

      const rawBody = await response.text()
      const parsedBody = parseProviderBody(rawBody)

      if (!response.ok || hasSemanticFailure(parsedBody, rawBody)) {
        throw new Error(extractProviderError(parsedBody, rawBody))
      }

      return {
        parsedBody,
        rawBody,
        httpStatus: response.status,
      }
    },
    input.actionName,
    {
      phoneLast4: normalizedPhone.slice(-4),
      messageType: input.messageType,
      templateName: input.templateName,
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
    },
    1 // A provider without idempotency support must not be retried after an ambiguous send.
  )

  if (!relayResult) {
    await insertOutboundLog(
      {
        phone: normalizedPhone,
        body: input.bodyPreview,
        messageType: input.messageType,
        status: "failed",
        templateName: input.templateName,
        templateLanguage: input.templateLanguage,
        relatedTicketId: input.relatedTicketId,
        relatedAwb: input.relatedAwb,
        relatedInvoiceId: input.relatedInvoiceId,
        failureReason: GENERIC_PROVIDER_ERROR,
      },
      logId
    )

    return {
      success: false,
      error: GENERIC_PROVIDER_ERROR,
    }
  }

  const identifiers = extractMessageIdentifiers(relayResult.parsedBody)
  const updatedLogId = await insertOutboundLog(
    {
      phone: normalizedPhone,
      body: input.bodyPreview,
      messageType: input.messageType,
      status: "sent",
      templateName: input.templateName,
      templateLanguage: input.templateLanguage,
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
      relatedInvoiceId: input.relatedInvoiceId,
      providerMessageId: identifiers.providerMessageId,
      metaMessageId: identifiers.metaMessageId,
      providerPayload: serializeProviderPayload(
        relayResult.parsedBody,
        relayResult.rawBody
      ),
    },
    logId
  )
  if (!updatedLogId)
    Sentry.captureMessage(
      "Provider accepted a message but its receipt identifiers could not be saved",
      { level: "error", extra: { logId, ...identifiers } }
    )

  return {
    success: true,
    data: relayResult.parsedBody ?? relayResult.rawBody,
    providerMessageId: identifiers.providerMessageId,
    metaMessageId: identifiers.metaMessageId,
    logId,
  }
}

export async function sendWhatsAppTextMessage(input: SendTextMessageInput) {
  try {
    return await sendViaRelay({
      endpoint: "sendmessage",
      phone: input.to,
      messageType: "text",
      bodyPreview: input.text,
      payload: {
        message: input.text,
      },
      actionName: "whatsapp_send_text",
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
      sentryContext: input.context,
    })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "whatsapp_send_text" },
      extra: {
        context: input.context,
        relatedTicketId: input.relatedTicketId,
        relatedAwb: input.relatedAwb,
      },
    })
    return {
      success: false,
      error: getErrorMessage(error),
    }
  }
}

function formatTemplateComponents(components: TemplateComponent[] | undefined) {
  return (
    components?.map((component) => {
      return {
        ...component,
        type: component.type.toUpperCase(),
      }
    }) || []
  )
}

export async function sendWhatsAppTemplateMessage(
  input: SendTemplateMessageInput
) {
  const template = getWhatsAppTemplate(input.template)

  try {
    return await sendViaRelay({
      endpoint: "sendtemplatemessage",
      phone: input.to,
      messageType: "template",
      bodyPreview: input.bodyPreview || createTemplatePreview(template),
      payload: {
        template_name: template.name,
        template_language: template.languageCode,
        components: formatTemplateComponents(input.components),
      },
      templateName: template.name,
      templateLanguage: template.languageCode,
      actionName: "whatsapp_send_template",
      relatedTicketId: input.relatedTicketId,
      relatedAwb: input.relatedAwb,
      relatedInvoiceId: input.relatedInvoiceId,
      sentryContext: input.context,
    })
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "whatsapp_send_template" },
      extra: {
        templateName: template.name,
        relatedTicketId: input.relatedTicketId,
        relatedAwb: input.relatedAwb,
      },
    })
    return {
      success: false,
      error: getErrorMessage(error),
    }
  }
}

export async function recordInboundWhatsAppActivity(input: {
  phone: string
  name?: string | null
  timestamp?: string
  optedIn?: boolean
}) {
  const normalizedPhone = normalizeWhatsAppPhone(input.phone)
  const occurredAt = input.timestamp || new Date().toISOString()

  const activity = {
    name: input.name || null,
    lastInboundAt: new Date(occurredAt),
    updatedAt: new Date(occurredAt),
  }
  await db
    .insert(whatsappSubscribers)
    .values({
      phone: normalizedPhone,
      ...activity,
      optedIn: input.optedIn ?? true,
    })
    .onConflictDoUpdate({
      target: whatsappSubscribers.phone,
      set: {
        ...activity,
        ...(input.optedIn !== undefined ? { optedIn: input.optedIn } : {}),
      },
    })

  return normalizedPhone
}

export { recordDeliveryReceipt as recordWhatsAppStatusUpdate } from "./delivery-status"
