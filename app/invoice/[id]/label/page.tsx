import { db } from "@/lib/db"
import { invoices } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { format } from "date-fns"
import Barcode from "@/components/barcode"
import { QRCode } from "@/components/kibo-ui/qr-code"
import { Logo } from "@/components/logo"

export default async function ShippingLabelPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: paramId } = await params

  const targetInvoice = await db.query.invoices.findFirst({
    where: (invoices, { eq, or }) =>
      or(eq(invoices.shipmentId, paramId), eq(invoices.id, paramId)),
    with: {
      shipment: true,
    },
  })

  if (!targetInvoice || !targetInvoice.shipment) {
    return notFound()
  }

  const shipment = targetInvoice.shipment

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 p-8 print:block print:bg-white print:p-0">
      {/* Container simulating a 4x6 inch thermal label (approx 101.6mm x 152.4mm) */}
      <div
        className="box-border flex h-[450px] w-[600px] flex-col overflow-hidden border-4 border-black bg-white font-sans text-black antialiased shadow-xl print:h-[450px] print:w-[600px] print:origin-top-left print:scale-[0.64] print:shadow-none"
        style={{
          margin: "0 auto",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* ROW 1: Carrier & Destination PIN (Header) */}
        <div className="flex h-[75px] w-full shrink-0 border-b-4 border-black">
          {/* Top Left: Carrier Logo */}
          <div className="flex w-[60%] items-center justify-start border-r-4 border-black p-3">
            <div className="flex items-center">
              <Logo className="h-8 origin-left scale-110" />
              <div className="ml-6 flex h-8 flex-col justify-center border-l-2 border-black/20 pl-4">
                <span className="text-sm leading-none font-black tracking-widest uppercase">
                  {shipment.serviceType.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          </div>
          {/* Top Right: Massive PIN */}
          <div className="flex w-[40%] flex-col items-center justify-center bg-black p-1 text-white">
            <span className="mb-0.5 text-[10px] font-bold tracking-widest text-gray-300 uppercase">
              Destination
            </span>
            <div className="text-3xl leading-none font-black tracking-tight uppercase">
              {shipment.consigneePinCode || "RTE-00"}
            </div>
          </div>
        </div>

        {/* ROW 2: Address Zone */}
        <div className="flex h-[135px] min-h-0 w-full shrink-0 border-b-4 border-black">
          {/* Middle Left: SHIP TO */}
          <div className="flex w-[65%] flex-col justify-start border-r-4 border-black px-3 py-2">
            <div className="mb-1 inline-block w-fit border-b border-black pb-0.5 text-xs font-black tracking-widest uppercase">
              SHIP TO:
            </div>
            <div className="line-clamp-1 text-xl leading-none font-black uppercase">
              {shipment.consigneeName || "N/A"}
            </div>
            <div className="mt-1 line-clamp-2 text-xs leading-normal font-bold text-gray-800">
              {shipment.consigneeAddress || "N/A"}
            </div>
            <div className="mt-auto flex items-end justify-between">
              <div className="text-base leading-none font-black uppercase">
                PIN: {shipment.consigneePinCode || "N/A"}
              </div>
              <div className="text-xs leading-none font-bold text-gray-700">
                Ph: {shipment.consigneePhone || "N/A"}
              </div>
            </div>
          </div>

          {/* Middle Right: FROM */}
          <div className="flex w-[35%] flex-col justify-start bg-gray-100 px-2.5 py-2">
            <div className="mb-0.5 text-[9px] font-black text-gray-500 uppercase">
              From:
            </div>
            <div className="text-xs leading-none font-black uppercase">
              {shipment.consignorName || "N/A"}
            </div>
            <div className="mt-0.5 line-clamp-3 text-[10px] leading-tight font-semibold text-gray-700">
              {shipment.consignorAddress || "N/A"}
            </div>
            <div className="mt-auto text-[10px] leading-none font-bold text-black">
              PIN: {shipment.consignorPinCode || "N/A"}
              <div className="mt-0.5">
                Ph: {shipment.consignorPhone || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Data Grid & QR */}
        <div className="flex h-[112px] min-h-0 w-full shrink-0 border-b-4 border-black">
          {/* Data Zone */}
          <div className="flex w-[75%] border-r-4 border-black">
            <div className="flex w-full flex-col">
              <div className="flex justify-between border-b-2 border-black px-3 py-1.5">
                <div className="flex flex-col">
                  <span className="mb-0.5 text-[9px] font-black text-gray-500 uppercase">
                    Tracking Number
                  </span>
                  <span className="font-mono text-base leading-none font-black tracking-tight">
                    {shipment.awbNumber}
                  </span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="mb-0.5 text-[9px] font-black text-gray-500 uppercase">
                    Date
                  </span>
                  <span className="text-sm leading-none font-black">
                    {format(new Date(shipment.bookingDate), "dd/MM/yy")}
                  </span>
                </div>
              </div>
              <div className="flex items-end justify-start gap-12 px-3 py-1.5">
                <div className="flex flex-col">
                  <span className="mb-0.5 text-[9px] font-black text-gray-500 uppercase">
                    Weight
                  </span>
                  <span className="text-base leading-none font-black">
                    {shipment.weightKg} KG
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="mb-0.5 text-[9px] font-black text-gray-500 uppercase">
                    Pieces
                  </span>
                  <span className="text-base leading-none font-black">
                    {shipment.pieces || 1}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex w-[25%] shrink-0 items-center justify-center bg-white p-2">
            <QRCode
              data={`https://tacxpress.in/track?awb=${shipment.awbNumber}`}
              foreground="black"
              className="!h-[76px] !w-[76px]"
            />
          </div>
        </div>

        {/* ROW 4: Master Barcode */}
        <div className="flex h-[120px] shrink-0 flex-col items-center justify-center p-2">
          <div className="mt-1 flex w-full items-center justify-center">
            <Barcode
              value={shipment.awbNumber}
              width={2.8}
              height={58}
              displayValue={false}
              margin={0}
              background="transparent"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
