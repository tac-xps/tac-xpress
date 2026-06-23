"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InvoiceDocument } from "@/components/invoice-document"
import { ShippingLabelPreview } from "./shipping-label-preview"
import { motion, AnimatePresence } from "framer-motion"
import { fadeSlideVariant } from "@/lib/animations"
import {
  Check,
  Printer,
  QrCode,
  Send,
  ArrowLeft,
  Loader2,
  FileText,
  Tag,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useInvoiceSuccessDialog } from "./use-invoice-success-dialog"
import { Skeleton } from "@/components/ui/skeleton"

interface InvoiceSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipmentId: string
  invoiceId: string
  consignorPhone?: string
}

export function InvoiceSuccessDialog({
  open,
  onOpenChange,
  shipmentId,
  invoiceId,
  consignorPhone,
}: InvoiceSuccessDialogProps) {
  const {
    data,
    loading,
    isSending,
    whatsappSent,
    handleClose,
    handleSendWhatsApp,
  } = useInvoiceSuccessDialog({
    shipmentId,
    invoiceId,
    consignorPhone,
    open,
    onOpenChange,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] max-w-[95vw] min-w-0 flex-col gap-0 overflow-hidden bg-background p-0 shadow-2xl sm:max-w-5xl">
        <DialogHeader className="shrink-0 p-4 pb-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <AnimatePresence>
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: 0.1,
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground"
                >
                  <Check className="h-5 w-5" strokeWidth={3} />
                </motion.div>
              </AnimatePresence>
              <div>
                <DialogTitle className="text-lg">
                  Invoice Created Successfully
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {data?.shipment?.awbNumber || "Loading..."}
                  </Badge>
                </DialogDescription>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={`/invoice/${shipmentId}`} target="_blank">
                  <Printer className="mr-2 h-4 w-4" />
                  Print Invoice
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/invoice/${shipmentId}/label`} target="_blank">
                  <QrCode className="mr-2 h-4 w-4" />
                  Print Label
                </Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="group relative overflow-hidden"
                disabled={isSending || whatsappSent}
                onClick={handleSendWhatsApp}
              >
                {isSending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : whatsappSent ? (
                  <CheckCircle2 className="text-trend-positive mr-2 h-4 w-4" />
                ) : (
                  <Send className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                )}
                {isSending
                  ? "Sending..."
                  : whatsappSent
                    ? "Sent"
                    : "Send WhatsApp"}
              </Button>
              <Button variant="default" size="sm" onClick={handleClose}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Invoices
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-hidden p-4 pt-4">
          {loading ? (
            <div className="flex h-full w-full flex-col items-center justify-center text-muted-foreground">
              <Skeleton className="h-[297mm] w-[210mm] origin-top scale-[0.72]" />
            </div>
          ) : !data ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground">
              <AlertCircle className="mb-2 h-10 w-10 opacity-20" />
              <p>Invoice not found or loading failed.</p>
            </div>
          ) : (
            <Tabs defaultValue="invoice" className="flex h-full flex-col">
              <TabsList className="mb-4 shrink-0">
                <TabsTrigger
                  value="invoice"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Invoice Preview
                </TabsTrigger>
                <TabsTrigger value="label" className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  Shipping Label
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="invoice"
                className="mt-0 flex flex-1 items-start justify-center overflow-auto"
              >
                <div className="relative h-[calc(297mm*0.72)] w-[210mm] overflow-hidden">
                  <motion.div
                    variants={fadeSlideVariant}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute top-0 left-0 h-[297mm] w-[210mm] shrink-0 origin-top scale-[0.72] overflow-hidden bg-background shadow-lg"
                  >
                    <InvoiceDocument invoice={data} shipment={data.shipment} />
                  </motion.div>
                </div>
              </TabsContent>

              <TabsContent
                value="label"
                className="mt-0 flex flex-1 items-start justify-center overflow-auto"
              >
                <motion.div
                  variants={fadeSlideVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="origin-top scale-[0.85]"
                >
                  <ShippingLabelPreview shipment={data.shipment} />
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
