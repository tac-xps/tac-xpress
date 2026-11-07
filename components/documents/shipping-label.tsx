"use client"

import React from "react"
import { LogoMark } from "@/components/logo"
import Barcode from "@/components/barcode"
import { QRCode } from "@/components/documents/document-qr"
import { format } from "date-fns"
import {
  DELHI_HUB_ADDRESS,
  SINGJAMEI_HUB_ADDRESS,
} from "@/lib/documents/address-constants"

export interface LabelShipment {
  awbNumber: string
  serviceType: string
  pieces: number | null
  consigneeName: string | null
  consigneeAddress?: string | null
  consigneePinCode: string | null
  consigneePhone?: string | null
  consignorName: string | null
  consignorAddress?: string | null
  consignorPinCode?: string | null
  consignorPhone?: string | null
  weightKg: number
  chargedWeightKg?: number | null
  bookingDate: Date | string
  paymentMode?: string | null
  totalAmount?: number | null
  contentDescription?: string | null
  origin?: string | null
  destination?: string | null
  destinationCity?: string | null
  destinationState?: string | null
  originCity?: string | null
  edd?: Date | string | null
}

interface ShippingLabelProps {
  shipment: LabelShipment
}

/**
 * Standard 4" × 3" Thermal Barcode Shipping Label (Aspect Ratio 4:3).
 *
 * Minimalist Industrial Logistics Layout:
 * - Zone 1 (Top): Origin Station, Service Classification, Ship Date, Weight, and Payment Mode.
 * - Zone 2 (Middle): Destination Station routing, Consignee Name, Delivery City/State/PIN, and Driver Scan QR code.
 *   STRICT PRIVACY: Street address and contact phone are never printed.
 * - Zone 3 (Bottom): Primary full-width Code 128 Barcode with generous quiet zones for conveyor sortation.
 */
export function ShippingLabel({ shipment }: ShippingLabelProps) {
  const isCOD =
    shipment.paymentMode === "cod" || shipment.paymentMode === "to_pay"
  const codAmount = shipment.totalAmount
    ? (shipment.totalAmount / 100).toFixed(0)
    : "0"

  const serviceLabel =
    shipment.serviceType === "express_air"
      ? "EXPRESS AIR"
      : shipment.serviceType === "standard_ocean"
        ? "OCEAN CARGO"
        : "STANDARD FREIGHT"

  const bookingDate = shipment.bookingDate
    ? new Date(shipment.bookingDate)
    : new Date()
  const validBookingDate = isNaN(bookingDate.getTime()) ? new Date() : bookingDate
  const bookingDateFormatted = format(validBookingDate, "dd MMM yyyy").toUpperCase()

  const eddDate = shipment.edd
    ? new Date(shipment.edd)
    : new Date(validBookingDate.getTime() + 3 * 24 * 60 * 60 * 1000)
  const validEddDate = isNaN(eddDate.getTime())
    ? new Date(validBookingDate.getTime() + 3 * 24 * 60 * 60 * 1000)
    : eddDate
  const deliverByFormatted = format(validEddDate, "dd MMM yyyy").toUpperCase()

  const destinationPin =
    shipment.consigneePinCode || SINGJAMEI_HUB_ADDRESS.pinCode
  const destinationCity =
    shipment.destinationCity ||
    shipment.destination ||
    SINGJAMEI_HUB_ADDRESS.city
  const destinationState =
    shipment.destinationState || SINGJAMEI_HUB_ADDRESS.state

  const weightDisplay = shipment.weightKg
    ? `${shipment.weightKg} KG`
    : "1.0 KG"
  const piecesDisplay = `${shipment.pieces ?? 1} PCS`

  return (
    <article
      data-shipping-label
      className="box-border flex h-[3in] w-[4in] aspect-[4/3] shrink-0 flex-col justify-between border-2 border-black bg-white p-3 font-sans text-black select-none [print-color-adjust:exact]"
      aria-label={`4:3 Shipping label for AWB ${shipment.awbNumber}`}
    >
      {/* ── ZONE 1: ORIGIN & SERVICE SPECS (TOP) ── */}
      <section className="flex items-start justify-between border-b-2 border-black pb-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <LogoMark animated={false} className="size-4 shrink-0 text-black" />
            <span className="font-heading text-xs font-black tracking-tight text-black">
              TAC-XPRESS
            </span>
            <span className="bg-black text-white px-1 py-0.2 font-mono text-[8px] font-black uppercase">
              DEL ORIGIN
            </span>
          </div>
          <p className="mt-0.5 text-[8px] text-neutral-700 leading-tight">
            Central Hub, New Delhi 110003
          </p>
          <p className="font-mono text-[7px] text-neutral-500">
            GSTIN: {DELHI_HUB_ADDRESS.gstin}
          </p>
        </div>

        <div className="flex flex-col items-end text-right">
          <div className="flex items-center gap-1.5">
            <span className="font-heading text-xs font-black tracking-tight text-black uppercase">
              {serviceLabel}
            </span>
            {isCOD ? (
              <span className="border border-black bg-black px-1.5 py-0.2 font-mono text-[8px] font-black text-white uppercase">
                COD ₹{codAmount}
              </span>
            ) : (
              <span className="border border-black bg-white px-1.5 py-0.2 font-mono text-[8px] font-black text-black uppercase">
                PREPAID
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-2 font-mono text-[8px] text-neutral-800">
            <span>{weightDisplay} / {piecesDisplay}</span>
            <span>Est: {deliverByFormatted}</span>
          </div>
        </div>
      </section>

      {/* ── ZONE 2: DESTINATION ROUTING & RECIPIENT (MIDDLE) ── */}
      <section className="flex-1 py-2 flex flex-col justify-between min-h-0 border-b-2 border-black">
        {/* Destination Station Corridor Banner */}
        <div className="flex items-center justify-between pb-1.5 border-b border-neutral-300">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] font-bold text-neutral-600">
              SHIP TO:
            </span>
            <span className="bg-black text-white px-1.5 py-0.2 font-mono text-[10px] font-black tracking-wider">
              SJM HUB
            </span>
            <span className="font-heading text-[10px] font-bold uppercase tracking-tight text-black">
              Singjamei Station, Imphal
            </span>
          </div>
          <span className="font-mono text-xs font-black text-black">
            PIN {destinationPin}
          </span>
        </div>

        {/* Consignee & QR Verification */}
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black uppercase text-black tracking-tight truncate leading-tight">
              {shipment.consigneeName || "CONSIGNEE RECIPIENT"}
            </p>
            <p className="text-[10px] font-medium uppercase text-neutral-800 mt-0.5 leading-tight">
              {destinationCity}, {destinationState}
            </p>

            {shipment.contentDescription && (
              <p className="mt-1 font-mono text-[8px] text-neutral-600 truncate">
                Content: {shipment.contentDescription}
              </p>
            )}

            <p className="mt-1 text-[7px] font-mono uppercase text-neutral-500">
              Confidential Delivery (Address &amp; Phone Protected)
            </p>
          </div>

          <div className="flex flex-col items-center shrink-0">
            <QRCode
              data={`https://tacservice.in/track?awb=${encodeURIComponent(shipment.awbNumber)}`}
              className="size-13 shrink-0 border border-black p-0.5 bg-white"
            />
            <span className="font-mono text-[6.5px] font-bold text-neutral-600 tracking-wider mt-0.5 uppercase">
              SCAN TO DELIVER
            </span>
          </div>
        </div>
      </section>

      {/* ── ZONE 3: PRIMARY CODE 128 TRACKING BARCODE (BOTTOM) ── */}
      <section className="pt-1.5 flex flex-col items-center justify-center">
        <div className="w-full flex items-center justify-between font-mono text-xs font-black tracking-widest text-black mb-1 leading-none">
          <span>AWB TRACKING:</span>
          <span>{shipment.awbNumber}</span>
        </div>

        {/* High-density barcode with ample quiet zone */}
        <div className="w-full flex justify-center py-0.5 [&_svg]:h-[44px] [&_svg]:w-full [&_svg]:max-w-[3.6in]">
          <Barcode
            value={shipment.awbNumber}
            format="CODE128"
            width={2.0}
            height={44}
            displayValue={false}
            margin={0}
            background="#ffffff"
            lineColor="#000000"
          />
        </div>

        <div className="mt-1 flex w-full items-center justify-between font-mono text-[7px] font-semibold uppercase tracking-wider text-neutral-500 leading-none">
          <span>TAC-XPRESS BILATERAL CORRIDOR (DEL / IMF)</span>
          <span>4&quot; × 3&quot; THERMAL FREIGHT</span>
        </div>
      </section>
    </article>
  )
}
