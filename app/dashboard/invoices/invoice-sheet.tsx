"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { InvoiceDocument } from "@/components/invoice-document"
import { Loader2, Printer, QrCode, Edit } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { standardFade } from "@/lib/animations"
import { useInvoiceSheet } from "./use-invoice-sheet"
import { Skeleton } from "@/components/ui/skeleton"

export function InvoiceSheet({
  shipmentId,
  awbNumber,
  open,
  onOpenChange,
}: {
  shipmentId: string
  awbNumber: string
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { data, loading } = useInvoiceSheet(shipmentId, open)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="flex h-full w-full flex-col bg-background p-0 sm:max-w-4xl"
        side="right"
      >
        <SheetHeader className="flex flex-shrink-0 flex-row items-center justify-between space-y-0 border-b bg-background p-4">
          <SheetTitle>Invoice for {awbNumber}</SheetTitle>
          <div className="mr-8 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex"
              disabled
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/invoice/${shipmentId}/label`} target="_blank">
                <QrCode className="mr-2 h-4 w-4" />
                Print Label
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/invoice/${shipmentId}`} target="_blank">
                <Printer className="mr-2 h-4 w-4" />
                Print PDF
              </Link>
            </Button>
          </div>
        </SheetHeader>

        <div className="flex flex-1 items-start justify-center overflow-auto p-4">
          {loading ? (
            <div className="relative mt-4 h-[calc(297mm*0.85)] w-[210mm] overflow-hidden">
              <Skeleton className="absolute top-0 left-0 h-[297mm] w-[210mm] origin-top scale-[0.85]" />
            </div>
          ) : !data ? (
            <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
              <p>Invoice not found or loading failed.</p>
            </div>
          ) : (
            <div className="relative mt-4 h-[calc(297mm*0.85)] w-[210mm] overflow-hidden">
              <motion.div
                variants={standardFade}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-0 left-0 h-[297mm] w-[210mm] shrink-0 origin-top scale-[0.85] overflow-hidden bg-background shadow-lg"
              >
                <InvoiceDocument invoice={data} shipment={data.shipment} />
              </motion.div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
