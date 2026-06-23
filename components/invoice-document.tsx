"use client"

import { format } from "date-fns"
import { PlaneTakeoff } from "lucide-react"
import { QRCode } from "@/components/kibo-ui/qr-code"
import { type Invoice, type Shipment } from "@/lib/db/schema"
import { Logo } from "@/components/logo"

interface InvoiceDocumentProps {
  invoice: Invoice
  shipment: Shipment
}

export function InvoiceDocument({ invoice, shipment }: InvoiceDocumentProps) {
  // Formatting helpers
  const formatCurrency = (cents: number | null) =>
    `Rs ${((cents || 0) / 100).toFixed(2)}`
  const formatDate = (date: Date | null) =>
    date ? format(date, "dd/MM/yyyy") : "-"

  return (
    <div className="flex flex-col gap-8 bg-gray-100 pb-8 print:block print:gap-0 print:bg-white print:pb-0">
      {/* PAGE 1: PRIMARY INVOICE */}
      <div className="relative mx-auto flex min-h-[297mm] w-[210mm] shrink-0 flex-col overflow-hidden bg-white p-[10mm] font-sans text-[11px] text-black shadow-xl [-webkit-print-color-adjust:exact] [print-color-adjust:exact] print:shadow-none">
        <style
          dangerouslySetInnerHTML={{
            __html: `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Meetei+Mayek&display=swap');
        .meetei-mayek { font-family: 'Noto Sans Meetei Mayek', sans-serif; }
      `,
          }}
        />

        {/* HEADER: Premium Logo and Branding */}
        <div className="mb-6 flex items-center justify-between border-b-[3px] border-black pb-4">
          <div className="flex items-center gap-2">
            <Logo className="h-10 print:h-10" />
            <span className="sr-only">Tac Service</span>
          </div>
          <div className="meetei-mayek text-[22px] font-bold tracking-wide text-[#0087b5]">
            ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ
          </div>
        </div>

        {/* META GRID */}
        <table className="mb-4 w-full border-collapse border border-black text-center text-[10px]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="border border-black p-2">AWB Number</th>
              <th className="border border-black p-2">Invoice No</th>
              <th className="border border-black p-2">Statement Date</th>
              <th className="border border-black p-2">Payment Mode</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2 font-mono tracking-wider uppercase">
                {shipment.awbNumber}
              </td>
              <td className="border border-black p-2 uppercase">
                {invoice.id.split("-")[0]}
              </td>
              <td className="border border-black p-2">
                {formatDate(invoice.createdAt)}
              </td>
              <td className="border border-black p-2 uppercase">
                {invoice.paymentMode || "Cash"}
              </td>
            </tr>
          </tbody>
        </table>

        {/* ADDRESSES */}
        <div className="mb-4 flex gap-4">
          <div className="w-1/2 border border-black p-3">
            <h3 className="mb-1 font-bold">Bill To</h3>
            <div className="leading-relaxed">
              Attn: {shipment.consignorName || "Customer"}
              <br />
              {shipment.consignorAddress ? (
                <>
                  {shipment.consignorAddress}
                  <br />
                </>
              ) : null}
              {shipment.consignorPinCode ? (
                <>
                  PIN: {shipment.consignorPinCode}
                  <br />
                </>
              ) : null}
              {shipment.consignorEmail
                ? `Email: ${shipment.consignorEmail}`
                : null}
            </div>
          </div>
          <div className="w-1/2 border border-black p-3">
            <h3 className="mb-1 font-bold">Service Provider</h3>
            <div className="leading-relaxed">
              <span className="font-bold">TAPAN ASSOCIATE CARGO SERVICE</span>
              <br />
              Tac Service (ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ)
              <br />
              {shipment.origin?.toUpperCase()} Branch
              <br />
              GSTIN: 07AAMFT6165B1Z3
              <br />
              Ph: 1800-123-4567
              <br />
              Email: support@tacservice.in
              <br />
              Web: tacservice.in
            </div>
          </div>
        </div>

        {/* SHIPMENT SUMMARY */}
        <div className="mb-2 border border-black bg-gray-100 px-2 py-1 text-[10px] leading-tight font-bold uppercase">
          Billing Period: {formatDate(invoice.createdAt)} &nbsp;|&nbsp; Route:{" "}
          {shipment.origin?.toUpperCase()} TO{" "}
          {shipment.destination?.toUpperCase()} &nbsp;|&nbsp; Pcs:{" "}
          {shipment.pieces} &nbsp;|&nbsp; Wt: {shipment.weightKg}kg
          &nbsp;|&nbsp; Item:{" "}
          {shipment.contentDescription || shipment.natureOfGoods || "GENERAL"}
        </div>

        {/* CHARGES TABLE */}
        <table className="mb-4 w-full border-collapse border border-black text-left text-[11px]">
          <thead>
            <tr className="bg-gray-100 font-bold">
              <th className="w-3/4 border border-black p-2">Service Name</th>
              <th className="border border-black p-2 text-right">Amount Due</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black p-2">Freight Charge</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(invoice.freightCharge)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">Pickup Charge</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(invoice.pickupCharge)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">Packing Charge</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(invoice.packingCharge)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">
                Docket Charge
                <span className="ml-1 text-[9px] text-gray-500 italic">
                  (fixed — not included in total)
                </span>
              </td>
              <td className="border border-black p-2 text-right text-gray-600">
                {formatCurrency(invoice.docketCharge)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">Insurance Charge</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(invoice.insuranceCharge)}
              </td>
            </tr>
            <tr>
              <td className="border border-black p-2">Taxes (CGST + SGST)*</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency((invoice.cgst || 0) + (invoice.sgst || 0))}
              </td>
            </tr>
            <tr className="bg-gray-100 font-bold">
              <td className="border border-black p-2">Total due in INR</td>
              <td className="border border-black p-2 text-right">
                {formatCurrency(invoice.amount)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* LEGAL / FOOTER */}
        <div className="mt-auto text-[9px] leading-relaxed text-gray-700">
          <div className="mb-4 text-[8px] italic">
            *This is not a VAT invoice. This is a GST compliant tax invoice.
          </div>

          <p className="mb-2">
            All logistics services are sold by Tac Service.
            <br />
            The above charges include fees incurred for cargo handling and
            transit as requested during booking.
            <br />
            For customers requiring proof of delivery, please track your
            shipment via our online portal.
          </p>

          <div className="mb-3 flex flex-col gap-1 rounded-lg border border-gray-200 bg-gray-50 p-2">
            <h4 className="flex items-center gap-1.5 font-bold text-black">
              <span className="rounded bg-black px-1.5 py-0.5 text-[8px] tracking-wider text-white uppercase">
                Legal
              </span>
              Terms and Conditions
            </h4>
            <p className="text-[9px] leading-relaxed text-gray-700">
              By accepting this invoice, you agree to our comprehensive Terms
              and Conditions. This includes policies on accurate declaration,
              prohibited goods, and liability limits.
              <strong>
                {" "}
                Scan the QR code below or visit{" "}
                <a
                  href="https://tacservice.in/term"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline"
                >
                  tacservice.in/term
                </a>{" "}
                to read the full policy.
              </strong>
            </p>
          </div>

          <div className="flex items-end justify-between border-t border-black pt-2">
            <div>
              Thank you for using Tac Service.
              <br />
              Sincerely,
              <br />
              Tac Service Team
              <br />
              <br />
              This message was produced and distributed by Tac Service, New
              Delhi.
            </div>
            <div className="flex flex-col items-center">
              <QRCode
                data={`https://tacservice.in/track?awb=${encodeURIComponent(shipment.awbNumber ?? "")}`}
                robustness="M"
                className="mb-1 h-16 w-16"
              />
              <span className="text-[7px]">Scan to Track</span>
            </div>
          </div>
        </div>
      </div>

      {/* PAGE 2: PACKING SLIP ANNEXURE (if applicable) */}
      {(shipment.pieces ?? 1) > 1 && (
        <div className="relative mx-auto flex min-h-[297mm] w-[210mm] shrink-0 flex-col overflow-hidden bg-white p-[10mm] font-sans text-[11px] text-black shadow-xl [-webkit-print-color-adjust:exact] [print-color-adjust:exact] print:break-before-page print:shadow-none">
          {/* HEADER: Premium Logo and Branding */}
          <div className="mb-6 flex items-center justify-between border-b-[3px] border-black pb-4">
            <div className="flex items-center gap-2">
              <Logo className="h-10 print:h-10" />
              <span className="sr-only">Tac Service</span>
            </div>
            <div className="meetei-mayek text-[22px] font-bold tracking-wide text-[#0087b5]">
              ꯇꯤ.ꯑꯦ.ꯁꯤ. ꯁꯔꯚꯤꯁ
            </div>
          </div>

          <div className="mb-4 text-center">
            <h2 className="text-[16px] font-bold tracking-widest uppercase">
              Packing Slip Annexure
            </h2>
            <p className="text-[10px] text-gray-600">
              Detailed Manifest for AWB:{" "}
              <span className="font-bold text-black">{shipment.awbNumber}</span>
            </p>
          </div>

          <table className="w-full border-collapse border border-black text-left text-[11px]">
            <thead>
              <tr className="bg-gray-100 font-bold">
                <th className="w-16 border border-black p-2 text-center">
                  Piece #
                </th>
                <th className="border border-black p-2">Description</th>
                <th className="w-24 border border-black p-2 text-center">
                  Est. Weight
                </th>
                <th className="w-24 border border-black p-2 text-center">
                  Condition
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: shipment.pieces ?? 1 }).map((_, i) => (
                <tr key={i}>
                  <td className="border border-black p-2 text-center font-bold">
                    {i + 1}
                  </td>
                  <td className="border border-black p-2">
                    {shipment.contentDescription ||
                      shipment.natureOfGoods ||
                      "General Cargo"}
                    <span className="ml-2 rounded bg-gray-200 px-1 py-0.5 text-[8px] text-gray-700">
                      Piece {i + 1} of {shipment.pieces}
                    </span>
                  </td>
                  <td className="border border-black p-2 text-center">
                    {(
                      (shipment.weightKg ?? 1) / (shipment.pieces ?? 1)
                    ).toFixed(2)}{" "}
                    kg
                  </td>
                  <td className="border border-black p-2 text-center uppercase">
                    {shipment.itemCondition || "NEW"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-auto pt-4 text-center text-[9px] text-gray-500 italic">
            This annexure is an integral part of the primary invoice document
            and serves as a detailed piece-level packing slip.
          </div>
        </div>
      )}
    </div>
  )
}
