"use client"
import { ShippingLabel, type LabelShipment } from "@/components/documents/shipping-label"
export function ShippingLabelPreview({ shipment }: { shipment: LabelShipment }) {
  return <ShippingLabel shipment={shipment} />
}
