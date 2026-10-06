"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, Calendar, ArrowRight } from "lucide-react"
import { format } from "date-fns"

interface ModalRoutingPartiesProps {
  shipment: {
    origin: string
    destination: string
    bookingDate?: Date | string | null
    createdAt: Date | string
    edd?: Date | string | null
    consignorName?: string | null
    consignorCompany?: string | null
    consignorPhone?: string | null
    consignorEmail?: string | null
    consignorAddress?: string | null
    consigneeName?: string | null
    consigneePhone?: string | null
    consigneeEmail?: string | null
    consigneeAddress?: string | null
  }
}

export function ModalRoutingParties({ shipment }: ModalRoutingPartiesProps) {
  const bookedDate = shipment.bookingDate || shipment.createdAt
  const formattedBookedDate = bookedDate
    ? format(new Date(bookedDate), "dd MMM yyyy")
    : "N/A"
  const formattedEdd = shipment.edd
    ? format(new Date(shipment.edd), "dd MMM yyyy")
    : "Pending"

  return (
    <Card className="rounded-none border-border shadow-xs">
      <CardHeader className="border-b bg-muted/40 py-3.5 px-4 sm:px-5">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold tracking-tight uppercase">
          <MapPin className="size-4 text-primary shrink-0" />
          Routing & Stakeholders
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Route Corridor Banner */}
        <div className="flex items-center justify-between rounded-none border border-border bg-card p-3">
          <div className="space-y-0.5">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Origin
            </span>
            <p className="font-bold text-sm text-foreground">{shipment.origin}</p>
          </div>
          <ArrowRight className="size-4 text-muted-foreground shrink-0 mx-2" />
          <div className="space-y-0.5 text-right">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Destination
            </span>
            <p className="font-bold text-sm text-foreground">{shipment.destination}</p>
          </div>
        </div>

        {/* Timelines */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 font-semibold text-muted-foreground uppercase text-[10px]">
              <Calendar className="size-3 shrink-0" /> Booked On
            </span>
            <p className="font-medium text-foreground">{formattedBookedDate}</p>
          </div>
          <div className="space-y-0.5">
            <span className="flex items-center gap-1 font-semibold text-muted-foreground uppercase text-[10px]">
              <Calendar className="size-3 shrink-0 text-status-pending" /> Expected Delivery
            </span>
            <p className="font-medium text-foreground">{formattedEdd}</p>
          </div>
        </div>

        <Separator />

        {/* Stakeholder Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {/* Sender */}
          <div className="space-y-1.5 border-l-2 border-primary/40 pl-3">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Sender (Consignor)
            </span>
            <p className="font-bold text-sm text-foreground">
              {shipment.consignorName || "N/A"}
            </p>
            {shipment.consignorCompany && (
              <p className="text-muted-foreground text-[11px] font-medium">
                {shipment.consignorCompany}
              </p>
            )}
            <p className="text-muted-foreground font-mono">
              {shipment.consignorPhone || "No phone"}
            </p>
            {shipment.consignorAddress && (
              <p className="text-muted-foreground text-[11px] line-clamp-2">
                {shipment.consignorAddress}
              </p>
            )}
          </div>

          {/* Receiver */}
          <div className="space-y-1.5 border-l-2 border-foreground/30 pl-3">
            <span className="font-mono text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              Receiver (Consignee)
            </span>
            <p className="font-bold text-sm text-foreground">
              {shipment.consigneeName || "N/A"}
            </p>
            <p className="text-muted-foreground font-mono">
              {shipment.consigneePhone || "No phone"}
            </p>
            {shipment.consigneeAddress && (
              <p className="text-muted-foreground text-[11px] line-clamp-2">
                {shipment.consigneeAddress}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
