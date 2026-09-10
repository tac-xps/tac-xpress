"use client"
import { QRCodeSVG } from "qrcode.react"
import type { HTMLAttributes } from "react"
// shadcn has no QR encoding primitive. qrcode.react provides the document barcode;
// it is not a UI kit. Printed codes deliberately use black on white with a quiet zone.
export function QRCode({
  data,
  className,
  foreground,
  background,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  data: string
  foreground?: string
  background?: string
}) {
  return (
    <div className={className} {...props}>
      <QRCodeSVG
        value={data}
        size={160}
        level="M"
        marginSize={4}
        title="Shipment tracking QR code"
        className="h-full w-full"
      />
    </div>
  )
}
