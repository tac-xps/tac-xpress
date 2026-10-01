"use client"

import React from "react"
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
 * Standard 4" × 6" Thermal Barcode Shipping Label.
 *
 * Minimalist Freight & Courier Layout matching modern parcel thermal designs:
 * - Zone 1 (Top): Origin Station ('FROM:' + Origin routing barcode) and Service Specs (Ship Date, Weight, Service Tier, Day of Week, Deliver By, Payment).
 * - Zone 2 (Middle): Destination ('TO:' + Destination postal routing barcode, Consignee name, Destination City/State/PIN, Singjamei Hub [SJM], and Driver Scan QR code).
 *   STRICT PRIVACY: Customer street address and phone number are NEVER printed.
 * - Zone 3 (Bottom): Full-width Tracking Section with large, high-density Code 128 Barcode for conveyor and handheld laser scanners.
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
  const deliveryDayOfWeek = format(validEddDate, "EEE").toUpperCase()
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
      className="box-border flex h-[6in] w-[4in] shrink-0 flex-col border-2 border-black bg-white p-3 font-sans text-black select-none [print-color-adjust:exact]"
      aria-label={`Shipping label for AWB ${shipment.awbNumber}`}
    >
      {/* ── ZONE 1: ORIGIN ('FROM:') & SERVICE LEVEL / SHIP DATE (TOP) ── */}
      <section className="grid grid-cols-2 gap-3 border-b-2 border-black pb-2.5">
        {/* Top Left: FROM + Origin Routing Barcode + Hub Details */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-black tracking-wider text-black">
                FROM:
              </span>
              <span className="font-mono text-[9px] font-bold text-neutral-600">
                (DEL)
              </span>
            </div>

            {/* Origin Hub Barcode */}
            <div className="mt-1 flex items-center justify-start [&_svg]:h-[24px] [&_svg]:max-w-[1.6in]">
              <Barcode
                value="DEL-HUB"
                format="CODE128"
                width={1.3}
                height={24}
                displayValue={false}
                margin={0}
                background="#ffffff"
                lineColor="#000000"
              />
            </div>

            {/* Origin Station Text */}
            <div className="mt-1 text-[9px] leading-tight text-neutral-800">
              <p className="font-bold text-black uppercase">
                TAC-XPRESS CENTRAL HUB
              </p>
              <p>South Delhi, New Delhi - 110003</p>
              <p className="font-mono text-[8px] text-neutral-600 mt-0.5">
                GSTIN: {DELHI_HUB_ADDRESS.gstin}
              </p>
            </div>
          </div>
        </div>

        {/* Top Right: SHIP DATE, WEIGHT, SERVICE TIER, DAY, DELIVER BY, PAYMENT */}
        <div className="flex flex-col items-end text-right justify-between">
          <div className="text-[9px] font-mono leading-tight">
            <p>
              <span className="text-neutral-600 font-semibold">SHIP DATE: </span>
              <span className="font-bold text-black">{bookingDateFormatted}</span>
            </p>
            <p className="mt-0.5">
              <span className="text-neutral-600 font-semibold">WEIGHT: </span>
              <span className="font-bold text-black">
                {weightDisplay} • {piecesDisplay}
              </span>
            </p>
          </div>

          {/* Large Bold Service Typography & Estimated Day of Week */}
          <div className="my-1 flex flex-col items-end">
            <span className="text-sm font-black uppercase tracking-tight text-black leading-none">
              {serviceLabel}
            </span>
            <span className="text-2xl font-black uppercase tracking-tight text-black leading-none mt-1">
              {deliveryDayOfWeek}
            </span>
          </div>

          {/* Deliver By & Payment Mode Pill */}
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="text-[8.5px] font-bold text-neutral-800">
              <span>DELIVER BY: </span>
              <span className="font-mono font-black">{deliverByFormatted}</span>
            </div>
            {isCOD ? (
              <span className="border border-black bg-black px-1.5 py-0.5 font-mono text-[8.5px] font-black uppercase text-white tracking-wider">
                COD: ₹{codAmount}
              </span>
            ) : (
              <span className="border border-black bg-white px-1.5 py-0.5 font-mono text-[8.5px] font-black uppercase text-black tracking-wider">
                PREPAID
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ── ZONE 2: DESTINATION ('TO:') & PRIVACY-PROTECTED RECIPIENT (MIDDLE) ── */}
      <section className="flex-1 border-b-2 border-black py-2.5 flex flex-col justify-between">
        <div>
          {/* TO header + Destination Sorting Barcode */}
          <div className="flex items-center justify-between border-b border-neutral-300 pb-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black tracking-wider text-black">
                TO:
              </span>
              <div className="flex items-center [&_svg]:h-[26px] [&_svg]:max-w-[1.8in]">
                <Barcode
                  value={destinationPin}
                  format="CODE128"
                  width={1.5}
                  height={26}
                  displayValue={false}
                  margin={0}
                  background="#ffffff"
                  lineColor="#000000"
                />
              </div>
            </div>
            <span className="font-mono text-[10px] font-black tracking-widest text-black">
              PIN: {destinationPin}
            </span>
          </div>

          {/* Recipient Details & QR Layout */}
          <div className="mt-2 flex items-start justify-between gap-3">
            {/* Left: Consignee name, destination region, station, privacy notice */}
            <div className="flex-1 min-w-0">
              <p className="text-lg font-black uppercase text-black tracking-tight leading-tight truncate">
                {shipment.consigneeName || "CONSIGNEE RECIPIENT"}
              </p>
              <p className="text-sm font-bold uppercase text-neutral-900 mt-1">
                {destinationCity}, {destinationState} - {destinationPin}
              </p>

              {/* Station Hub Routing Indicator */}
              <div className="mt-2.5 flex items-center gap-2">
                <span className="border border-black bg-black px-1.5 py-0.5 font-mono text-[9px] font-black text-white uppercase tracking-wider">
                  SJM HUB
                </span>
                <span className="text-[10px] font-bold text-neutral-800 uppercase">
                  Singjamei Delivery Station [SJM]
                </span>
              </div>

              {shipment.contentDescription && (
                <p className="mt-2 font-mono text-[9px] text-neutral-700 truncate">
                  <span className="font-semibold text-neutral-500">CONTENT: </span>
                  <span className="font-bold uppercase text-black">{shipment.contentDescription}</span>
                </p>
              )}

              {/* Privacy Enforcement Notice */}
              <div className="mt-2.5 inline-flex items-center gap-1 border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[8px] font-mono font-semibold uppercase text-neutral-600">
                <span>🔒 Privacy Protected • Street Address & Phone Masked</span>
              </div>
            </div>

            {/* Right: Driver Verification QR Code */}
            <div className="flex flex-col items-center shrink-0 text-center">
              <QRCode
                data={`https://tacservice.in/track?awb=${encodeURIComponent(shipment.awbNumber)}`}
                className="size-20 shrink-0 border border-black p-1 bg-white"
              />
              <span className="font-mono text-[7.5px] font-bold text-neutral-700 tracking-wider mt-1 uppercase">
                DRIVER VERIFY
              </span>
            </div>
          </div>
        </div>

        {/* Handling and Route Sort Summary */}
        <div className="flex items-center justify-between text-[9px] font-mono text-neutral-600 pt-1.5 border-t border-neutral-200">
          <span>SORT CODE: DEL-SJM-DIR</span>
          <span className="font-bold text-black uppercase">
            KEEP DRY • HANDLE WITH CARE
          </span>
        </div>
      </section>

      {/* ── ZONE 3: PRIMARY CODE 128 TRACKING BARCODE (BOTTOM) ── */}
      <section className="flex flex-col items-center justify-center pt-2">
        <div className="w-full flex items-center justify-between font-mono text-sm font-black tracking-widest text-black mb-1">
          <span>TRACKING #:</span>
          <span>{shipment.awbNumber}</span>
        </div>

        {/* Large Primary Barcode for Instant Laser/Thermal Reading */}
        <div className="w-full flex justify-center [&_svg]:h-[80px] [&_svg]:w-full [&_svg]:max-w-[3.7in]">
          <Barcode
            value={shipment.awbNumber}
            format="CODE128"
            width={2.2}
            height={80}
            displayValue={false}
            margin={0}
            background="#ffffff"
            lineColor="#000000"
          />
        </div>

        <div className="mt-1 flex w-full items-center justify-between font-mono text-[8px] font-bold uppercase tracking-wider text-neutral-600">
          <span>TAC-XPRESS LOGISTICS NETWORK</span>
          <span>4&quot; × 6&quot; THERMAL FREIGHT</span>
        </div>
      </section>
    </article>
  )
}
