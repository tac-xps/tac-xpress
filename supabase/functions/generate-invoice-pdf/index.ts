// deno-lint-ignore-file no-import-prefix
import "@supabase/functions-js/edge-runtime.d.ts"
import { withSupabase } from "@supabase/server"
import { jsPDF } from "npm:jspdf@2.5.1"

import * as Sentry from "npm:@sentry/deno@10.58.0"
import { meeteiFontBase64 } from "./base64-font.ts"

function validateLineItems(
  items: unknown
): Array<{ desc: string; amount: number }> {
  if (!Array.isArray(items)) return []
  return items.filter(
    (item): item is { desc: string; amount: number } =>
      typeof item === "object" &&
      item !== null &&
      typeof item.desc === "string" &&
      typeof item.amount === "number"
  )
}

interface Invoice {
  id: string
  created_at: string
  amount: number
  freight_charge?: number
  pickup_charge?: number
  packing_charge?: number
  docket_charge?: number
  insurance_charge?: number
  other_charges?: number
  cgst?: number
  sgst?: number
  igst?: number
  shipments?: {
    awb_number?: string
    origin?: string
    destination?: string
    pieces?: number
    weight_kg?: number
    consignor_name?: string
    consignor_address?: string
    consignor_pin_code?: string
    consignor_email?: string
    service_type?: string
    content_description?: string
    nature_of_goods?: string
    item_condition?: string
  }
}

export default {
  fetch: withSupabase({ auth: ["publishable", "secret"] }, async (req, ctx) => {
    try {
      const { invoice_id, test_items } = await req.json()

      if (!invoice_id) {
        return new Response("Missing invoice_id", { status: 400 })
      }

      // Fetch invoice and shipment data
      const { data, error: invoiceError } = await ctx.supabaseAdmin
        .from("invoices")
        .select(
          `
          *,
          shipments (*)
        `
        )
        .eq("id", invoice_id)
        .single()

      const invoice = data as unknown as Invoice

      if (invoiceError || !invoice) {
        return new Response(`Invoice not found: ${invoiceError?.message}`, {
          status: 404,
        })
      }

      // Create a new jsPDF Document
      const doc = new jsPDF({ format: "a4", unit: "pt" })
      const width = doc.internal.pageSize.getWidth()
      const height = doc.internal.pageSize.getHeight()

      doc.addFileToVFS("NotoMeetei.ttf", meeteiFontBase64)
      doc.addFont("NotoMeetei.ttf", "NotoMeetei", "normal")

      const margin = 50
      let cursorY = margin

      // Helper to draw text easily
      const setFont = (
        name: string,
        style: string,
        size: number,
        color: [number, number, number]
      ) => {
        doc.setFont(name, style)
        doc.setFontSize(size)
        doc.setTextColor(color[0], color[1], color[2])
      }

      // --- Draw Header ---
      setFont("helvetica", "bold", 28, [0, 135, 181]) // RGB ~ rgb(0, 0.53, 0.71)
      doc.text("Tac Service", margin, cursorY)

      setFont("NotoMeetei", "normal", 24, [0, 135, 181])
      doc.text("ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ", width - margin - 220, cursorY)
      cursorY += 15

      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(3)
      doc.line(margin, cursorY, width - margin, cursorY)
      cursorY += 30

      setFont("helvetica", "bold", 16, [0, 0, 0])
      doc.text("INVOICE", margin, cursorY)
      cursorY += 20

      setFont("helvetica", "normal", 10, [0, 0, 0])
      doc.text(`Invoice ID: ${invoice.id}`, margin, cursorY)
      cursorY += 15
      if (invoice.shipments) {
        doc.text(`AWB: ${invoice.shipments.awb_number}`, margin, cursorY)
        cursorY += 15
      }
      doc.text(
        `Date: ${new Date(invoice.created_at).toLocaleDateString()}`,
        margin,
        cursorY
      )
      cursorY += 30

      // --- Draw Addresses (Bill To & Service Provider) ---
      if (invoice.shipments) {
        const colWidth = (width - 2 * margin - 20) / 2
        const startY = cursorY

        // Left column: Bill To
        doc.setLineWidth(1)
        doc.setDrawColor(0, 0, 0)
        doc.rect(margin, startY, colWidth, 110)

        let leftY = startY + 15
        setFont("helvetica", "bold", 10, [0, 0, 0])
        doc.text("Bill To", margin + 10, leftY)
        leftY += 15

        setFont("helvetica", "normal", 9, [0, 0, 0])
        doc.text(
          `Attn: ${invoice.shipments.consignor_name || "Customer"}`,
          margin + 10,
          leftY
        )
        leftY += 12

        if (invoice.shipments.consignor_address) {
          const addressLines = doc.splitTextToSize(
            invoice.shipments.consignor_address,
            colWidth - 20
          )
          for (const line of addressLines.slice(0, 3)) {
            doc.text(line, margin + 10, leftY)
            leftY += 12
          }
        }
        if (invoice.shipments.consignor_pin_code) {
          doc.text(
            `PIN: ${invoice.shipments.consignor_pin_code}`,
            margin + 10,
            leftY
          )
          leftY += 12
        }
        if (invoice.shipments.consignor_email) {
          doc.text(
            `Email: ${invoice.shipments.consignor_email}`,
            margin + 10,
            leftY
          )
        }

        // Right column: Service Provider
        const rightX = margin + colWidth + 20
        doc.rect(rightX, startY, colWidth, 110)

        let rightY = startY + 15
        setFont("helvetica", "bold", 10, [0, 0, 0])
        doc.text("Service Provider", rightX + 10, rightY)
        rightY += 15

        setFont("helvetica", "bold", 9, [0, 0, 0])
        doc.text("TAPAN ASSOCIATE CARGO SERVICE", rightX + 10, rightY)
        rightY += 12

        setFont("helvetica", "normal", 9, [0, 0, 0])
        doc.text("Brand: Tac Service", rightX + 10, rightY)
        rightY += 12

        setFont("NotoMeetei", "normal", 9, [0, 0, 0])
        doc.text("ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ", rightX + 10, rightY)
        rightY += 12

        setFont("helvetica", "normal", 9, [0, 0, 0])
        doc.text(
          `${invoice.shipments.origin?.toUpperCase() || "ORIGIN"} Branch`,
          rightX + 10,
          rightY
        )
        rightY += 12
        const gstin = Deno.env.get("COMPANY_GSTIN") || "07AAMFT6165B1Z3"
        doc.text(`GSTIN: ${gstin}`, rightX + 10, rightY)
        rightY += 12
        doc.text("Ph: 1800-123-4567 | Web: tacservice.in", rightX + 10, rightY)
        rightY += 12
        doc.text("Email: support@tacservice.in", rightX + 10, rightY)

        cursorY = startY + 130
      }

      // --- Draw Shipment Details ---
      setFont("helvetica", "bold", 12, [0, 0, 0])
      doc.text("Shipment Details", margin, cursorY)
      cursorY += 20

      setFont("helvetica", "normal", 10, [0, 0, 0])
      if (invoice.shipments) {
        doc.text(`Origin: ${invoice.shipments.origin}`, margin, cursorY)
        doc.text(`Pcs: ${invoice.shipments.pieces || 1}`, margin + 180, cursorY)
        cursorY += 15

        doc.text(
          `Destination: ${invoice.shipments.destination}`,
          margin,
          cursorY
        )
        doc.text(
          `Weight: ${invoice.shipments.weight_kg || 1} kg`,
          margin + 180,
          cursorY
        )
        cursorY += 15

        doc.text(`Service: ${invoice.shipments.service_type}`, margin, cursorY)
        const itemText =
          invoice.shipments.content_description ||
          invoice.shipments.nature_of_goods ||
          "General"
        doc.text(`Item: ${itemText}`, margin + 180, cursorY)
        cursorY += 30
      }

      // --- Draw Items (Charges Table with Pagination) ---
      const lineItems: Array<{ desc: string; amount: number }> = test_items
        ? validateLineItems(test_items)
        : []

      if (lineItems.length === 0) {
        if (invoice.freight_charge)
          lineItems.push({
            desc: "Freight Charge",
            amount: invoice.freight_charge,
          })
        if (invoice.pickup_charge)
          lineItems.push({
            desc: "Pickup Charge",
            amount: invoice.pickup_charge,
          })
        if (invoice.packing_charge)
          lineItems.push({
            desc: "Packing Charge",
            amount: invoice.packing_charge,
          })
        if (invoice.docket_charge)
          lineItems.push({
            desc: "Docket Charge",
            amount: invoice.docket_charge,
          })
        if (invoice.insurance_charge)
          lineItems.push({
            desc: "Insurance Charge",
            amount: invoice.insurance_charge,
          })
        if (invoice.other_charges)
          lineItems.push({
            desc: "Other Charges",
            amount: invoice.other_charges,
          })
        if (invoice.cgst) lineItems.push({ desc: "CGST", amount: invoice.cgst })
        if (invoice.sgst) lineItems.push({ desc: "SGST", amount: invoice.sgst })
        if (invoice.igst) lineItems.push({ desc: "IGST", amount: invoice.igst })
      }

      setFont("helvetica", "bold", 12, [0, 0, 0])
      doc.text("Charges Breakdown", margin, cursorY)
      cursorY += 20

      // Table Headers
      const drawHeaders = (y: number) => {
        setFont("helvetica", "bold", 10, [0, 0, 0])
        doc.text("Description", margin, y)
        doc.text("Amount (INR)", width - margin - 80, y)
      }

      drawHeaders(cursorY)
      cursorY += 10
      doc.line(margin, cursorY, width - margin, cursorY)
      cursorY += 20

      let runningTotal = 0

      setFont("helvetica", "normal", 10, [0, 0, 0])

      for (let i = 0; i < lineItems.length; i++) {
        const item = lineItems[i]

        // Pagination logic (jsPDF y goes down)
        if (cursorY > height - margin - 40) {
          // Draw Carry Forward
          doc.line(margin, cursorY, width - margin, cursorY)
          cursorY += 15
          setFont("helvetica", "bold", 10, [0, 0, 0])
          doc.text("Carry Forward", margin, cursorY)
          doc.text(
            `${(runningTotal / 100).toFixed(2)}`,
            width - margin - 80,
            cursorY
          )

          // New Page
          doc.addPage()
          cursorY = margin + 20

          // Draw Brought Forward
          doc.text("Brought Forward", margin, cursorY)
          doc.text(
            `${(runningTotal / 100).toFixed(2)}`,
            width - margin - 80,
            cursorY
          )
          cursorY += 10
          doc.line(margin, cursorY, width - margin, cursorY)
          cursorY += 20

          drawHeaders(cursorY)
          cursorY += 10
          doc.line(margin, cursorY, width - margin, cursorY)
          cursorY += 20

          setFont("helvetica", "normal", 10, [0, 0, 0])
        }

        doc.text(item.desc, margin, cursorY)
        doc.text(
          `${(item.amount / 100).toFixed(2)}`,
          width - margin - 80,
          cursorY
        )

        runningTotal += item.amount
        cursorY += 20
      }

      // Draw Subtotal & Total
      cursorY += 5
      doc.line(margin, cursorY, width - margin, cursorY)
      cursorY += 20

      const finalAmount = test_items ? runningTotal : invoice.amount

      setFont("helvetica", "bold", 14, [0, 0, 0])
      doc.text("Total Amount:", margin, cursorY)
      doc.text(
        `${(finalAmount / 100).toFixed(2)}`,
        width - margin - 80,
        cursorY
      )

      // --- PAGE 2: PACKING SLIP ANNEXURE ---
      if (invoice.shipments && (invoice.shipments.pieces || 1) > 1) {
        doc.addPage()
        let annY = margin

        // Draw Premium Header Again
        setFont("helvetica", "bold", 28, [0, 135, 181])
        doc.text("Tac Service", margin, annY)
        setFont("NotoMeetei", "normal", 24, [0, 135, 181])
        doc.text("ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ", width - margin - 220, annY)
        annY += 15

        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(3)
        doc.line(margin, annY, width - margin, annY)
        annY += 30

        // Annexure Title
        setFont("helvetica", "bold", 16, [0, 0, 0])
        doc.text("PACKING SLIP ANNEXURE", margin, annY)
        annY += 15

        setFont("helvetica", "normal", 10, [100, 100, 100])
        doc.text(
          `Detailed Manifest for AWB: ${invoice.shipments.awb_number || "N/A"}`,
          margin,
          annY
        )
        annY += 30

        // Table Headers
        setFont("helvetica", "bold", 10, [0, 0, 0])
        doc.text("Piece #", margin, annY)
        doc.text("Description", margin + 60, annY)
        doc.text("Est. Weight", width - margin - 150, annY)
        doc.text("Condition", width - margin - 60, annY)
        annY += 10
        doc.setLineWidth(1)
        doc.line(margin, annY, width - margin, annY)
        annY += 20

        const totalPieces = invoice.shipments.pieces || 1
        const totalWeight = invoice.shipments.weight_kg || 1
        const description =
          invoice.shipments.content_description ||
          invoice.shipments.nature_of_goods ||
          "General Cargo"
        const condition = invoice.shipments.item_condition || "NEW"

        setFont("helvetica", "normal", 10, [0, 0, 0])
        for (let i = 1; i <= totalPieces; i++) {
          if (annY > height - margin - 40) {
            doc.addPage()
            annY = margin + 20
            // Redraw table headers
            setFont("helvetica", "bold", 10, [0, 0, 0])
            doc.text("Piece #", margin, annY)
            doc.text("Description", margin + 60, annY)
            doc.text("Est. Weight", width - margin - 150, annY)
            doc.text("Condition", width - margin - 60, annY)
            annY += 10
            doc.line(margin, annY, width - margin, annY)
            annY += 20
            setFont("helvetica", "normal", 10, [0, 0, 0])
          }
          doc.text(`${i}`, margin, annY)
          doc.text(`${description}`, margin + 60, annY)
          doc.text(
            `${(totalWeight / totalPieces).toFixed(2)} kg`,
            width - margin - 150,
            annY
          )
          doc.text(`${condition}`.toUpperCase(), width - margin - 60, annY)
          annY += 20
        }

        annY += 10
        setFont("helvetica", "italic", 9, [100, 100, 100])
        doc.text(
          "This annexure is an integral part of the primary invoice document and serves as a detailed piece-level packing slip.",
          margin,
          annY
        )
      }

      // Serialize to bytes
      const pdfBytes = doc.output("arraybuffer")

      const fileName = `invoice-${invoice_id}.pdf`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } =
        await ctx.supabaseAdmin.storage
          .from("cargo-documents")
          .upload(fileName, pdfBytes, {
            contentType: "application/pdf",
            upsert: true,
          })

      if (uploadError) {
        return new Response(`Failed to upload PDF: ${uploadError.message}`, {
          status: 500,
        })
      }

      const pdfUrl = `${uploadData.path}`

      // Update the invoice record
      const { error: updateError } = await ctx.supabaseAdmin
        .from("invoices")
        // @ts-ignore: Supabase client lacks Database generic here
        .update({ pdf_url: pdfUrl })
        .eq("id", invoice_id)

      if (updateError) {
        return new Response(
          `Failed to update invoice: ${updateError.message}`,
          { status: 500 }
        )
      }

      return Response.json({
        message: "PDF generated and uploaded successfully",
        pdfUrl: pdfUrl,
      })
    } catch (err) {
      console.error(err)
      Sentry.captureException(err)
      return new Response(`Internal Server Error: ${(err as Error).message}`, {
        status: 500,
      })
    }
  }),
}
