import crypto from "node:crypto"
import { NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"
import { webhookSchema } from "@/lib/whatsapp/webhook-schema"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"
import { recordWhatsAppStatusUpdate } from "@/lib/whatsapp/service"
import { processInboundMessage } from "@/app/actions/whatsapp-inbound"

export const maxDuration = 60
async function signedBody(request: Request) {
  if (!request.body || Number(request.headers.get("content-length")) > 128_000)
    return null
  const reader = request.body.getReader()
  const chunks: Uint8Array[] = []
  let length = 0
  try {
    while (true) {
      const { value, done } = await reader.read()
      if (done) break
      length += value.length
      if (length > 128_000) {
        await reader.cancel()
        return null
      }
      chunks.push(value)
    }
    return Buffer.concat(chunks)
  } finally {
    reader.releaseLock()
  }
}

export async function POST(request: Request) {
  const config = getWhatsAppConfig()
  const signature = request.headers.get("x-hub-signature-256")
  if (!config.appSecret)
    return NextResponse.json({ error: "Webhook unavailable" }, { status: 503 })
  if (!signature || !/^sha256=[a-f0-9]{64}$/i.test(signature))
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  try {
    const body = await signedBody(request)
    if (!body)
      return NextResponse.json(
        { error: "Payload too large or missing" },
        { status: 413 }
      )
    const expected = crypto
      .createHmac("sha256", config.appSecret)
      .update(body)
      .digest()
    if (
      !crypto.timingSafeEqual(expected, Buffer.from(signature.slice(7), "hex"))
    )
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    let value: unknown
    try {
      value = JSON.parse(body.toString("utf8"))
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    }
    const parsed = webhookSchema.safeParse(value)
    if (!parsed.success)
      return NextResponse.json(
        { error: "Invalid webhook payload" },
        { status: 400 }
      )
    for (const entry of parsed.data.entry)
      for (const { value } of entry.changes) {
        for (const message of value.messages ?? [])
          await processInboundMessage(
            message,
            value.contacts?.find((contact) => contact.wa_id === message.from)
          )
        for (const receipt of value.statuses ?? [])
          await recordWhatsAppStatusUpdate(receipt)
      }
    return NextResponse.json({ success: true })
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "whatsapp_webhook" } })
    return NextResponse.json(
      { error: "Processing unavailable; retry delivery" },
      { status: 503 }
    )
  }
}

export async function GET(request: Request) {
  const { verifyToken } = getWhatsAppConfig()
  const params = new URL(request.url).searchParams
  const token = params.get("hub.verify_token")
  const challenge = params.get("hub.challenge")
  if (
    verifyToken &&
    token &&
    challenge &&
    params.get("hub.mode") === "subscribe" &&
    Buffer.byteLength(token) === Buffer.byteLength(verifyToken) &&
    crypto.timingSafeEqual(Buffer.from(token), Buffer.from(verifyToken))
  )
    return new NextResponse(challenge)
  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}
