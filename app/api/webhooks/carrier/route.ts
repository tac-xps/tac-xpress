import crypto from "node:crypto"
import * as Sentry from "@sentry/nextjs"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { and, eq, isNull } from "drizzle-orm"
import { db } from "@/lib/db"
import { shipments } from "@/lib/db/schema"

const carrierUpdateSchema = z.object({
  awbNumber: z
    .string()
    .trim()
    .min(1)
    .max(64)
    .regex(/^[A-Za-z0-9-]+$/),
  status: z.enum(["pending", "in-transit", "delivered"]),
  payload: z
    .object({
      location: z.string().trim().min(1).max(200).optional(),
      description: z.string().trim().min(1).max(500).optional(),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  const signature = request.headers.get("x-carrier-signature")
  const secret = process.env.CARRIER_WEBHOOK_SECRET
  if (!secret || !signature || !/^[a-f0-9]{64}$/i.test(signature)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  if (!request.body || Number(request.headers.get("content-length")) > 64_000) {
    return NextResponse.json(
      { error: "Payload too large or missing" },
      { status: 413 }
    )
  }
  try {
    const reader = request.body.getReader()
    const chunks: Uint8Array[] = []
    let length = 0
    try {
      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        length += value.byteLength
        if (length > 64_000) {
          await reader.cancel()
          return NextResponse.json(
            { error: "Payload too large" },
            { status: 413 }
          )
        }
        chunks.push(value)
      }
    } finally {
      reader.releaseLock()
    }
    const rawBody = Buffer.concat(chunks)
    const expected = crypto
      .createHmac("sha256", secret)
      .update(rawBody)
      .digest()
    if (!crypto.timingSafeEqual(expected, Buffer.from(signature, "hex"))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    let body: unknown
    try {
      body = JSON.parse(rawBody.toString("utf8"))
    } catch {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }
    const parsed = carrierUpdateSchema.safeParse(body)
    if (!parsed.success)
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    const [shipment] = await db
      .select({ id: shipments.id, status: shipments.status })
      .from(shipments)
      .where(
        and(
          eq(shipments.awbNumber, parsed.data.awbNumber.toUpperCase()),
          isNull(shipments.deletedAt)
        )
      )
      .limit(1)
    if (!shipment)
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    if (shipment.status === parsed.data.status) {
      return NextResponse.json({ success: true, duplicate: true })
    }
    // Carrier payloads lack the actor, finalized leg, and custody evidence required for a handoff.
    return NextResponse.json(
      {
        error:
          "Record shipment movements through verified Operations handoffs. Carrier status changes are not supported.",
      },
      { status: 409 }
    )
  } catch (error) {
    Sentry.captureException(error, { tags: { area: "carrier_webhook" } })
    return NextResponse.json(
      { error: "Carrier processing unavailable" },
      { status: 503 }
    )
  }
}
