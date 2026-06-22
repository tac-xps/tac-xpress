"use server"

import crypto from "crypto"
import { revalidatePath } from "next/cache"
import * as Sentry from "@sentry/nextjs"
import { z } from "zod"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { eq, or, and, sql } from "drizzle-orm"

import { auth } from "@/auth"
import { cookies } from "next/headers"
import { db } from "@/lib/db"
import { invoices, shipments, users } from "@/lib/db/schema"
import { actionClient } from "@/lib/safe-action"
import { invoiceWizardSchema } from "@/lib/schemas/invoice-wizard"
import { sendWhatsAppTemplateMessage } from "@/lib/whatsapp/service"

const GENERIC_INVOICE_ERROR =
  "We could not complete the invoice request. Please try again."
const GENERIC_WIZARD_ERROR =
  "A critical error occurred while creating your shipment."

async function verifyAuth() {
  const session = await auth()
  if (
    session?.user?.id &&
    (session.user.role === "admin" || session.user.role === "staff")
  ) {
    return {
      userId: session.user.id,
      email: session.user.email ?? null,
    }
  }

  return null
}

function unauthorizedResult() {
  return {
    success: false,
    error: "You must be signed in to perform this action.",
  }
}

function toPaise(amount: number) {
  return Math.round(amount * 100)
}

async function invokeInvoicePdfGeneration(
  invoiceId: string,
  sig: string
): Promise<boolean> {
  // If NEXT_PUBLIC_APP_URL is accidentally left as localhost:3000 in Vercel env vars,
  // we must ignore it and use VERCEL_URL instead to prevent fetch failures.
  let appUrl =
    process.env.NEXT_PUBLIC_APP_URL || "https://tac-xpress.vercel.app"
  if (appUrl.includes("localhost") && process.env.NODE_ENV === "production") {
    appUrl = "https://tac-xpress.vercel.app"
  }

  const localUrl = `${appUrl}/api/public/invoice-pdf?id=${invoiceId}&sig=${sig}`

  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ")

  const pdfRes = await fetch(localUrl, {
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; TacXpress-InternalPDFWorker/1.0)",
      "x-internal-call": "1",
      Cookie: cookieHeader,
      "x-vercel-protection-bypass":
        process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
    },
  })

  if (!pdfRes.ok) {
    const errorText = await pdfRes.text().catch(() => "")
    throw new Error(
      `PDF endpoint failed: ${pdfRes.status} ${pdfRes.statusText} - ${errorText}`
    )
  }
  return true
}

async function capturePostHogEvent(
  event: string,
  distinctId: string,
  properties: Record<string, unknown>
) {
  const apiKey = process.env.POSTHOG_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!apiKey) {
    return
  }

  const host =
    process.env.POSTHOG_HOST ||
    process.env.NEXT_PUBLIC_POSTHOG_HOST ||
    "https://us.i.posthog.com"

  try {
    const response = await fetch(`${host.replace(/\/$/, "")}/capture/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        event,
        distinct_id: distinctId,
        properties,
      }),
    })

    if (!response.ok) {
      Sentry.captureMessage("PostHog capture failed", {
        level: "warning",
        extra: { event, status: response.status },
      })
    }
  } catch (error) {
    Sentry.captureException(error, {
      tags: { area: "posthog_capture", event },
    })
  }
}

const sendInvoiceViaWhatsAppSchema = z.object({
  invoiceId: z.string().uuid("Invalid invoice ID"),
  phone: z.string().min(10, "Phone number is required"),
})

export const sendInvoiceViaWhatsApp = actionClient
  .schema(sendInvoiceViaWhatsAppSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return unauthorizedResult()
    }

    const { invoiceId, phone } = parsedInput

    try {
      if (process.env.WHATSAPP_ENABLED !== "true") {
        return {
          success: false,
          error: "WhatsApp delivery is currently disabled.",
        }
      }

      const invoice = await db.query.invoices.findFirst({
        where: eq(invoices.id, invoiceId),
        with: { shipment: true },
      })

      if (!invoice?.shipment) {
        return {
          success: false,
          error: "Invoice does not have an associated shipment.",
        }
      }

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL ||
        !process.env.SUPABASE_SERVICE_ROLE_KEY
      ) {
        Sentry.captureMessage(
          "Missing required Supabase environment variables",
          {
            level: "error",
          }
        )
        return {
          success: false,
          error: "Invoice delivery is not configured.",
        }
      }

      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      )

      let finalPdfUrl = ""
      const fileName = `whatsapp-invoice-${invoice.id}.pdf`

      try {
        if (!process.env.INVOICE_PDF_SIGNING_SECRET) {
          throw new Error("Missing INVOICE_PDF_SIGNING_SECRET")
        }

        if (
          !process.env.NEXT_PUBLIC_SUPABASE_URL ||
          !process.env.SUPABASE_SERVICE_ROLE_KEY
        ) {
          throw new Error("Missing Supabase env vars")
        }

        // Check if the file actually exists via list() — createSignedUrl always
        // returns a URL even for non-existent files, so it cannot be used as an
        // existence check.
        const { data: listData } = await supabase.storage
          .from("cargo-documents")
          .list("", { search: fileName })

        let fileExists = !!listData?.some((f) => f.name === fileName)

        if (!fileExists) {
          // File missing — trigger generation (which uploads it to Supabase)
          const sig = crypto
            .createHmac("sha256", process.env.INVOICE_PDF_SIGNING_SECRET)
            .update(invoice.id)
            .digest("hex")
          const success = await invokeInvoicePdfGeneration(invoice.id, sig)

          if (!success) {
            throw new Error("Failed to generate PDF")
          }
        }

        // Always generate a fresh signed URL for WPBox
        const { data: signedUrlData, error: signError } = await supabase.storage
          .from("cargo-documents")
          .createSignedUrl(fileName, 60 * 60 * 24 * 7)

        if (signError || !signedUrlData) {
          throw signError || new Error("Failed to create signed URL")
        } else {
          finalPdfUrl = signedUrlData.signedUrl
        }
      } catch (err) {
        Sentry.captureMessage("Failed to retrieve WhatsApp PDF from Supabase", {
          level: "error",
          extra: { error: String(err) },
        })
        return {
          success: false,
          error: "Failed to process invoice PDF.",
        }
      }
      const sendResult = await sendWhatsAppTemplateMessage({
        to: phone,
        template: "invoice",
        relatedAwb: invoice.shipment.awbNumber,
        context: "invoice_send",
        bodyPreview: `[template:invoice:${invoice.id}]`,
        components: [
          {
            type: "HEADER",
            parameters: [
              {
                type: "document",
                document: {
                  link: finalPdfUrl,
                  filename: `Invoice-${invoice.id.split("-")[0].toUpperCase()}.pdf`,
                },
              },
            ],
          },
          {
            type: "BODY",
            parameters: [
              {
                type: "text",
                text: invoice.shipment.consignorName || "Customer",
              },
              {
                type: "text",
                text: `INV-${invoice.id.split("-")[0].toUpperCase()}`,
              },
              {
                type: "text",
                text: `INR ${(invoice.amount / 100).toFixed(2)}`,
              },
            ],
          },
        ],
      })

      if (!sendResult.success) {
        await db
          .update(invoices)
          .set({ whatsappStatus: "failed", updatedAt: new Date() })
          .where(eq(invoices.id, invoiceId))

        revalidatePath("/dashboard/invoices")
        return {
          success: false,
          error:
            sendResult.error ||
            "WhatsApp provider rejected the invoice message.",
        }
      }

      await db
        .update(invoices)
        .set({ whatsappStatus: "sent", updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId))

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "send_invoice_whatsapp" },
        extra: { invoiceId, actorId: actor.userId },
      })

      await db
        .update(invoices)
        .set({ whatsappStatus: "failed", updatedAt: new Date() })
        .where(eq(invoices.id, invoiceId))

      revalidatePath("/dashboard/invoices")
      return {
        success: false,
        error: "Failed to send WhatsApp message.",
      }
    }
  })

const createInvoiceSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
})

export const createInvoiceAction = actionClient
  .schema(createInvoiceSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return unauthorizedResult()
    }

    try {
      const targetShipment = await db.query.shipments.findFirst({
        where: eq(shipments.id, parsedInput.shipmentId),
      })

      if (!targetShipment) {
        return {
          success: false,
          error: "Shipment not found.",
        }
      }

      const invoiceAmountInCents = toPaise(parsedInput.amount)

      const [newInvoice] = await db
        .insert(invoices)
        .values({
          shipmentId: parsedInput.shipmentId,
          customerId: targetShipment.customerId,
          amount: invoiceAmountInCents,
          status: "unpaid",
          whatsappStatus: "pending",
          pdfUrl: `/invoice/${parsedInput.shipmentId}`,
        })
        .returning()

      if (!process.env.INVOICE_PDF_SIGNING_SECRET) {
        throw new Error("Missing INVOICE_PDF_SIGNING_SECRET")
      }

      // Wait for background PDF generation
      const sig = crypto
        .createHmac("sha256", process.env.INVOICE_PDF_SIGNING_SECRET)
        .update(newInvoice.id)
        .digest("hex")
      const success = await invokeInvoicePdfGeneration(newInvoice.id, sig)

      if (!success) {
        throw new Error("Failed to generate PDF")
      }

      revalidatePath("/dashboard/invoices")
      return { success: true, invoiceId: newInvoice.id }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "create_invoice" },
        extra: { actorId: actor.userId, shipmentId: parsedInput.shipmentId },
      })
      return {
        success: false,
        error: GENERIC_INVOICE_ERROR,
      }
    }
  })

const updateInvoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unpaid", "paid"]),
  amount: z.number().nonnegative(),
  advancePaid: z.number().nonnegative().optional(),
  balanceDue: z.number().optional(),
})

export const updateInvoiceAction = actionClient
  .schema(updateInvoiceSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return unauthorizedResult()
    }

    const { id, status, amount, advancePaid, balanceDue } = parsedInput

    try {
      await db
        .update(invoices)
        .set({ status, amount, advancePaid, balanceDue, updatedAt: new Date() })
        .where(eq(invoices.id, id))

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "update_invoice" },
        extra: { actorId: actor.userId, invoiceId: id },
      })
      return { success: false, error: "Failed to update invoice." }
    }
  })

// ─── Full Invoice Update ───────────────────────────────────────────────────────
// Updates ALL charge breakdown fields plus recalculates totals.

const updateFullInvoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unpaid", "paid"]),
  paymentMode: z
    .enum(["cash", "upi", "card", "wallet", "credit", "to_pay"])
    .optional(),
  freightCharge: z.number().nonnegative().optional(),
  pickupCharge: z.number().nonnegative().optional(),
  packingCharge: z.number().nonnegative().optional(),
  docketCharge: z.number().nonnegative().optional(),
  insuranceCharge: z.number().nonnegative().optional(),
  otherCharges: z.number().nonnegative().optional(),
  subtotal: z.number().nonnegative().optional(),
  gstRate: z.number().min(0).max(28).optional(),
  cgst: z.number().nonnegative().optional(),
  sgst: z.number().nonnegative().optional(),
  amount: z.number().nonnegative().optional(),
  advancePaid: z.number().nonnegative().optional(),
  balanceDue: z.number().optional(),
  remarks: z.string().optional(),
  shipmentId: z.string().uuid().optional(),
  consignorName: z.string().optional(),
  consignorPhone: z.string().optional(),
  consigneeName: z.string().optional(),
  consigneePhone: z.string().optional(),
})

export const updateFullInvoiceAction = actionClient
  .schema(updateFullInvoiceSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) return unauthorizedResult()

    const {
      id,
      shipmentId,
      consignorName,
      consignorPhone,
      consigneeName,
      consigneePhone,
      ...fields
    } = parsedInput

    try {
      await db.transaction(async (tx) => {
        const invoiceRow = await tx.query.invoices.findFirst({
          where: eq(invoices.id, id),
        })
        const canonicalShipmentId = invoiceRow?.shipmentId

        if (shipmentId && canonicalShipmentId !== shipmentId) {
          throw new Error("Shipment ID mismatch")
        }

        await tx
          .update(invoices)
          .set({ ...fields, updatedAt: new Date() })
          .where(eq(invoices.id, id))

        if (canonicalShipmentId) {
          const updateData: Partial<typeof shipments.$inferInsert> = {
            updatedAt: new Date(),
          }
          if (consignorName !== undefined)
            updateData.consignorName = consignorName
          if (consignorPhone !== undefined)
            updateData.consignorPhone = consignorPhone
          if (consigneeName !== undefined)
            updateData.consigneeName = consigneeName
          if (consigneePhone !== undefined)
            updateData.consigneePhone = consigneePhone

          await tx
            .update(shipments)
            .set(updateData)
            .where(eq(shipments.id, canonicalShipmentId))
        }
      })

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "update_full_invoice" },
        extra: { actorId: actor.userId, invoiceId: id },
      })
      return { success: false, error: "Failed to update invoice." }
    }
  })

const deleteInvoiceSchema = z.object({
  id: z.string().uuid(),
})

export const deleteInvoiceAction = actionClient
  .schema(deleteInvoiceSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return unauthorizedResult()
    }

    try {
      await db.delete(invoices).where(eq(invoices.id, parsedInput.id))

      revalidatePath("/dashboard/invoices")
      return { success: true }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "delete_invoice" },
        extra: { actorId: actor.userId, invoiceId: parsedInput.id },
      })
      return { success: false, error: "Failed to delete invoice." }
    }
  })

async function upsertCustomerHelper(
  tx: Parameters<Parameters<typeof db.transaction>[0]>[0],
  name: string,
  phone: string,
  email?: string | null,
  address?: string | null,
  pinCode?: string | null,
  city?: string | null,
  state?: string | null
) {
  if (!phone) return null

  // Normalize phone (strip non-digits)
  const normalizedPhone = phone.replace(/\D/g, "")
  const searchPhone10 =
    normalizedPhone.length > 10 ? normalizedPhone.slice(-10) : normalizedPhone
  const searchPhone91 = `91${searchPhone10}`

  const existing = await tx.query.users.findFirst({
    where: (usersTable: any, { eq, and, or }: any) =>
      and(
        eq(usersTable.role, "customer"),
        or(
          eq(usersTable.phone, phone),
          eq(usersTable.phone, normalizedPhone),
          eq(usersTable.phone, searchPhone10),
          eq(usersTable.phone, searchPhone91),
          eq(usersTable.phone, `+${searchPhone91}`)
        )
      ),
  })

  // Prevent unique constraint violation by checking if the requested email belongs to another user
  // Normalize to lowercase so comparison is consistent with the DB unique constraint
  let safeEmail =
    email && email.trim() !== "" ? email.trim().toLowerCase() : null
  if (safeEmail) {
    const emailOwner = await tx.query.users.findFirst({
      where: (t: any, { sql: sqlHelper }: any) =>
        sqlHelper`LOWER(${t.email}) = ${safeEmail}`,
    })
    if (emailOwner && (!existing || emailOwner.id !== existing.id)) {
      // The email belongs to a different account. We ignore the email update to prevent a crash.
      safeEmail = existing ? existing.email : null
    }
  }

  const isUniqueViolation = (err: unknown) =>
    typeof err === "object" &&
    err !== null &&
    "code" in err &&
    (err as { code?: string }).code === "23505"

  if (existing) {
    let updated
    try {
      await tx.transaction(async (tx2) => {
        ;[updated] = await tx2
          .update(users)
          .set({
            name: name || existing.name,
            email: safeEmail || existing.email,
            phone: phone || existing.phone,
            address: address || existing.address,
            pinCode: pinCode || existing.pinCode,
            city: city || existing.city,
            state: state || existing.state,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existing.id))
          .returning()
      })
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
      ;[updated] = await tx
        .update(users)
        .set({
          name: name || existing.name,
          email: existing.email,
          phone: phone || existing.phone,
          address: address || existing.address,
          pinCode: pinCode || existing.pinCode,
          city: city || existing.city,
          state: state || existing.state,
          updatedAt: new Date(),
        })
        .where(eq(users.id, existing.id))
        .returning()
    }
    return updated
  } else {
    let inserted
    try {
      await tx.transaction(async (tx2) => {
        ;[inserted] = await tx2
          .insert(users)
          .values({
            id: crypto.randomUUID(),
            name,
            email: safeEmail,
            phone,
            address: address || null,
            pinCode: pinCode || null,
            city: city || null,
            state: state || null,
            role: "customer",
          })
          .returning()
      })
    } catch (err) {
      if (!isUniqueViolation(err)) throw err
      ;[inserted] = await tx
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          name,
          email: null,
          phone,
          address: address || null,
          pinCode: pinCode || null,
          city: city || null,
          state: state || null,
          role: "customer",
        })
        .returning()
    }
    return inserted
  }
}

export const createWizardInvoiceAction = actionClient
  .schema(invoiceWizardSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return unauthorizedResult()
    }

    try {
      const awbNumber = `AWB-${crypto.randomUUID().replace(/-/g, "").slice(0, 12).toUpperCase()}`

      const { newInvoice, newShipment, totalAmount } = await Sentry.startSpan(
        {
          name: "create wizard invoice transaction",
          op: "db.transaction",
          attributes: {
            "invoice.service_type": parsedInput.serviceType,
          },
        },
        async () =>
          db.transaction(async (tx) => {
            // Upsert consignor
            const consignorUser = await upsertCustomerHelper(
              tx,
              parsedInput.consignorName,
              parsedInput.consignorPhone,
              parsedInput.consignorEmail,
              parsedInput.consignorAddress,
              parsedInput.consignorPinCode,
              parsedInput.origin,
              null
            )

            // Upsert consignee
            const consigneeUser = await upsertCustomerHelper(
              tx,
              parsedInput.consigneeName,
              parsedInput.consigneePhone,
              parsedInput.consigneeEmail,
              parsedInput.consigneeAddress,
              parsedInput.consigneePinCode,
              parsedInput.destination,
              null
            )

            const [newShipment] = await tx
              .insert(shipments)
              .values({
                awbNumber,
                status: "pending",
                customerId: consignorUser?.id || null,
                origin: parsedInput.origin,
                destination: parsedInput.destination,
                serviceType: parsedInput.serviceType,
                weightKg: parsedInput.weightKg,
                consignorName: parsedInput.consignorName,
                consignorCompany: parsedInput.consignorCompany,
                consignorPhone: parsedInput.consignorPhone,
                consignorAltPhone: parsedInput.consignorAltPhone,
                consignorEmail: parsedInput.consignorEmail,
                consignorAddress: parsedInput.consignorAddress,
                consignorPinCode: parsedInput.consignorPinCode,
                consignorIdType: parsedInput.consignorIdType,
                consignorIdNumber: parsedInput.consignorIdNumber,
                consigneeName: parsedInput.consigneeName,
                consigneePhone: parsedInput.consigneePhone,
                consigneeAltPhone: parsedInput.consigneeAltPhone,
                consigneeEmail: parsedInput.consigneeEmail,
                consigneeAddress: parsedInput.consigneeAddress,
                consigneePinCode: parsedInput.consigneePinCode,
                contentDescription: parsedInput.contentDescription,
                natureOfGoods: parsedInput.natureOfGoods,
                itemCondition: parsedInput.itemCondition,
                declaredValue: toPaise(parsedInput.declaredValue),
                pieces: parsedInput.pieces,
                dimensionsL: parsedInput.dimensionsL,
                dimensionsW: parsedInput.dimensionsW,
                dimensionsH: parsedInput.dimensionsH,
                chargedWeightKg: Math.max(
                  parsedInput.weightKg,
                  Math.round(
                    (parsedInput.dimensionsL *
                      parsedInput.dimensionsW *
                      parsedInput.dimensionsH) /
                      5000
                  )
                ),
                packagingType: parsedInput.packagingType,
                isFragile: parsedInput.isFragile,
                insuranceOptIn: parsedInput.insuranceOptIn,
              })
              .returning()

            const freightChargePaise = toPaise(parsedInput.freightCharge)
            const pickupChargePaise = toPaise(parsedInput.pickupCharge)
            const packingChargePaise = toPaise(parsedInput.packingCharge)
            const docketChargePaise = toPaise(parsedInput.docketCharge)
            const insuranceChargePaise = toPaise(parsedInput.insuranceCharge)
            const otherChargesPaise = toPaise(parsedInput.otherCharges)

            const subtotalPaise =
              freightChargePaise +
              pickupChargePaise +
              packingChargePaise +
              docketChargePaise +
              insuranceChargePaise +
              otherChargesPaise

            let cgstPaise = 0
            let sgstPaise = 0
            let igstPaise = 0

            if (parsedInput.gstRate > 0) {
              const totalGstPaise = Math.round(
                (subtotalPaise * parsedInput.gstRate) / 100
              )

              const oState = (parsedInput.originState || "")
                .toLowerCase()
                .trim()
              const dState = (parsedInput.destinationState || "")
                .toLowerCase()
                .trim()

              if (oState && dState && oState !== dState) {
                igstPaise = totalGstPaise
              } else {
                cgstPaise = Math.round(totalGstPaise / 2)
                sgstPaise = totalGstPaise - cgstPaise
              }
            }

            const totalAmountPaise =
              subtotalPaise + cgstPaise + sgstPaise + igstPaise
            const advancePaidPaise = toPaise(parsedInput.advancePaid)
            const balanceDuePaise = totalAmountPaise - advancePaidPaise

            const [newInvoice] = await tx
              .insert(invoices)
              .values({
                shipmentId: newShipment.id,
                customerId: consignorUser?.id || null,
                amount: totalAmountPaise,
                status: balanceDuePaise <= 0 ? "paid" : "unpaid",
                freightCharge: freightChargePaise,
                pickupCharge: pickupChargePaise,
                packingCharge: packingChargePaise,
                docketCharge: docketChargePaise,
                insuranceCharge: insuranceChargePaise,
                otherCharges: otherChargesPaise,
                subtotal: subtotalPaise,
                gstRate: parsedInput.gstRate,
                cgst: cgstPaise,
                sgst: sgstPaise,
                igst: igstPaise,
                paymentMode: parsedInput.paymentMode,
                advancePaid: advancePaidPaise,
                balanceDue: balanceDuePaise,
                remarks: parsedInput.remarks,
                termsAccepted: parsedInput.termsAccepted,
                prohibitedAccepted: parsedInput.prohibitedAccepted,
                pdfUrl: `/invoice/${newShipment.id}`,
              })
              .returning()

            const totalAmount = totalAmountPaise / 100
            return { newInvoice, newShipment, totalAmount }
          })
      )

      if (!process.env.INVOICE_PDF_SIGNING_SECRET) {
        throw new Error("Missing INVOICE_PDF_SIGNING_SECRET")
      }

      // Wait for background PDF generation
      const sig = crypto
        .createHmac("sha256", process.env.INVOICE_PDF_SIGNING_SECRET)
        .update(newInvoice.id)
        .digest("hex")
      const pdfSuccess = await invokeInvoicePdfGeneration(newInvoice.id, sig)

      if (!pdfSuccess) {
        throw new Error("Failed to generate PDF")
      }

      await capturePostHogEvent("invoice_created", actor.userId, {
        invoiceId: newInvoice.id,
        shipmentId: newShipment.id,
        amountPaise: toPaise(totalAmount),
        source: "invoice_wizard",
      })

      revalidatePath("/dashboard/invoices")
      revalidatePath("/dashboard/shipments")

      return {
        success: true,
        invoiceId: newInvoice.id,
        shipmentId: newShipment.id,
      }
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "create_wizard_invoice" },
        extra: { actorId: actor.userId },
      })
      return {
        success: false,
        error: GENERIC_WIZARD_ERROR,
      }
    }
  })

const getInvoiceDetailsSchema = z.object({
  shipmentId: z.string().uuid("Invalid shipment ID"),
})

export const getInvoiceDetails = actionClient
  .schema(getInvoiceDetailsSchema)
  .action(async ({ parsedInput }) => {
    const actor = await verifyAuth()
    if (!actor) {
      return null
    }

    try {
      const targetInvoice = await db.query.invoices.findFirst({
        where: eq(invoices.shipmentId, parsedInput.shipmentId),
        with: {
          shipment: true,
        },
      })

      if (!targetInvoice?.shipment) {
        return null
      }

      return targetInvoice
    } catch (error) {
      Sentry.captureException(error, {
        tags: { area: "get_invoice_details" },
        extra: { actorId: actor.userId, shipmentId: parsedInput.shipmentId },
      })
      return null
    }
  })

const lookupPincodeSchema = z.object({
  pincode: z.string().regex(/^\d{6}$/, "Must be a 6-digit Indian PIN code"),
})

export const lookupPincodeAction = actionClient
  .schema(lookupPincodeSchema)
  .action(async ({ parsedInput }) => {
    const { pincode } = parsedInput
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const res = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`,
        {
          signal: controller.signal,
        }
      )
      clearTimeout(timeoutId)
      if (!res.ok) {
        throw new Error(`Postal API returned status ${res.status}`)
      }
      const data = await res.json()
      if (
        data &&
        data[0] &&
        data[0].Status === "Success" &&
        data[0].PostOffice &&
        data[0].PostOffice.length > 0
      ) {
        const postOffices = data[0].PostOffice
        const office = postOffices[0]
        return {
          success: true,
          city: office.District || office.Name || "",
          state: office.State || "",
          officeName: office.Name || "",
        }
      }
      return {
        success: false,
        error: "No details found for this PIN code.",
      }
    } catch (error) {
      Sentry.captureException(error)
      return {
        success: false,
        error: "Failed to fetch PIN code details. Please enter manually.",
      }
    }
  })
