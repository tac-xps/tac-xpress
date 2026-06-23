import crypto from "crypto"
import { NextResponse } from "next/server"

import { getWhatsAppConfig } from "@/lib/whatsapp/config"
import { recordWhatsAppStatusUpdate } from "@/lib/whatsapp/service"

function verifySignature(payload: string, signature: string, secret: string) {
  if (!/^[a-f0-9]{64}$/i.test(signature)) return false

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload, "utf8")
    .digest("hex")

  const sigBuf = Buffer.from(signature, "hex")
  const expBuf = Buffer.from(expected, "hex")

  if (sigBuf.length !== expBuf.length) return false
  return crypto.timingSafeEqual(sigBuf, expBuf)
}

export async function POST(request: Request) {
  const config = getWhatsAppConfig()
  const signature = request.headers
    .get("x-hub-signature-256")
    ?.replace("sha256=", "")
  const body = await request.text()

  if (!signature || !config.appSecret) {
    return NextResponse.json(
      { error: "Missing signature or secret" },
      { status: 401 }
    )
  }

  if (!verifySignature(body, signature, config.appSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
  }

  let data: any
  try {
    data = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  let processInboundMessage: any

  for (const entry of data.entry || []) {
    for (const change of entry.changes || []) {
      if (change.value?.messages) {
        if (!processInboundMessage) {
          const mod = await import("@/app/actions/whatsapp-inbound")
          processInboundMessage = mod.processInboundMessage
        }
        for (const message of change.value.messages) {
          await processInboundMessage(
            message,
            change.value.contacts?.[0]
          ).catch((error) =>
            console.error(
              "[WhatsApp Webhook] Failed to process inbound message:",
              error
            )
          )
        }
      }

      if (change.value?.statuses) {
        for (const status of change.value.statuses) {
          await recordWhatsAppStatusUpdate(status).catch((error) =>
            console.error(
              "[WhatsApp Webhook] Failed to process status update:",
              error
            )
          )
        }
      }
    }
  }

  return NextResponse.json({ success: true })
}

export async function GET(request: Request) {
  const config = getWhatsAppConfig()
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get("hub.mode")
  const token = searchParams.get("hub.verify_token")
  const challenge = searchParams.get("hub.challenge")

  if (mode === "subscribe" && token === config.verifyToken) {
    return new NextResponse(challenge, { status: 200 })
  }

  return NextResponse.json({ error: "Verification failed" }, { status: 403 })
}
