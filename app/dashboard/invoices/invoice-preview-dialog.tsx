"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { InvoiceDocument } from "@/components/invoice-document"
import { ShippingLabel } from "@/components/documents/shipping-label"
import { getInvoiceDetails } from "./actions"
import { useAction } from "next-safe-action/hooks"
import {
  FileText,
  Tag,
  Printer,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { formatInvoiceCurrency } from "./invoice-types"

interface InvoicePreviewDialogProps {
  invoiceId: string
  shipmentId?: string | null
  initialTab?: "invoice" | "label"
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: any
}

export function InvoicePreviewDialog({
  invoiceId,
  shipmentId,
  initialTab = "invoice",
  open,
  onOpenChange,
  initialData,
}: InvoicePreviewDialogProps) {
  const [activeTab, setActiveTab] = useState<"invoice" | "label">(initialTab)
  const [data, setData] = useState<any>(initialData ?? null)

  const { execute, isExecuting } = useAction(getInvoiceDetails, {
    onSuccess: ({ data: result }) => {
      if (result) {
        setData(result)
      }
    },
  })

  // Synchronize initialTab whenever dialog opens or initialTab changes
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab)
    }
  }, [open, initialTab])

  // Fetch full details if data is missing or different invoice
  useEffect(() => {
    if (open && invoiceId) {
      if (!data || data.id !== invoiceId) {
        execute({
          invoiceId,
          shipmentId: shipmentId || undefined,
        })
      }
    }
  }, [open, invoiceId, shipmentId, data, execute])

  const handlePrint = () => {
    const targetUrl =
      activeTab === "label"
        ? `/invoice/${invoiceId}/label`
        : `/invoice/${invoiceId}`
    window.open(targetUrl, "_blank")
  }

  const invoiceAmount = data?.amount
    ? formatInvoiceCurrency(data.amount)
    : null

  const awb = data?.shipment?.awbNumber || "PENDING"
  const shortId = invoiceId ? invoiceId.slice(0, 8).toUpperCase() : ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[92vh] w-[95vw] sm:max-w-4xl md:max-w-5xl flex-col p-0 overflow-hidden bg-background">
        {/* Header */}
        <DialogHeader className="flex flex-shrink-0 flex-row items-center justify-between border-b px-6 py-3.5 bg-background">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900">
              {activeTab === "invoice" ? (
                <FileText className="size-4.5 text-neutral-700 dark:text-neutral-200" />
              ) : (
                <Tag className="size-4.5 text-neutral-700 dark:text-neutral-200" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold tracking-tight">
                  {activeTab === "invoice"
                    ? `Tax Invoice #${shortId}`
                    : `Shipping Label • ${awb}`}
                </DialogTitle>
                {data?.status && (
                  <Badge
                    variant={
                      data.status === "paid"
                        ? "success"
                        : data.status === "unpaid"
                          ? "warning"
                          : "outline"
                    }
                    className="capitalize text-[11px] px-2 py-0.5"
                  >
                    {data.status}
                  </Badge>
                )}
              </div>
              <DialogDescription className="mt-0.5 text-xs text-muted-foreground">
                AWB: <span className="font-mono font-medium text-foreground">{awb}</span>
                {invoiceAmount && ` • Total: ${invoiceAmount}`}
              </DialogDescription>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="mr-8 flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <Printer className="size-3.5" />
              <span>Print {activeTab === "label" ? "Label" : "PDF"}</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 gap-1.5 text-xs font-medium"
            >
              <a href={`/api/documents/download?id=${invoiceId}`} download>
                <Download className="size-3.5" />
                <span>Download</span>
              </a>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              asChild
              className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
              title="Open standalone page in new tab"
            >
              <a
                href={
                  activeTab === "label"
                    ? `/invoice/${invoiceId}/label`
                    : `/invoice/${invoiceId}`
                }
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink className="size-3.5" />
              </a>
            </Button>
          </div>
        </DialogHeader>

        {/* Tabs Bar */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "invoice" | "label")}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex items-center justify-between border-b px-6 py-2 bg-muted/30">
            <TabsList className="h-8 bg-muted/60 p-0.5">
              <TabsTrigger
                value="invoice"
                className="gap-1.5 text-xs px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <FileText className="size-3.5" />
                <span>Tax Invoice (A4)</span>
              </TabsTrigger>
              <TabsTrigger
                value="label"
                className="gap-1.5 text-xs px-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                <Tag className="size-3.5" />
                <span>Shipping Label (4:3)</span>
              </TabsTrigger>
            </TabsList>

            <span className="text-[11px] font-mono text-muted-foreground">
              {activeTab === "invoice"
                ? "GST Triplicate • 210mm × 297mm"
                : "Thermal Roll • 4\" × 3\" (4:3 Aspect)"}
            </span>
          </div>

          {/* Loading State */}
          {isExecuting && !data ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-muted-foreground">
              <Loader2 className="size-7 animate-spin text-primary" />
              <p className="text-xs font-mono">Loading document details...</p>
            </div>
          ) : !data ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-muted-foreground">
              <AlertCircle className="size-8 text-destructive/80" />
              <p className="text-sm font-medium text-foreground">
                Document not found or loading failed
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  execute({ invoiceId, shipmentId: shipmentId || undefined })
                }
              >
                Retry Loading
              </Button>
            </div>
          ) : (
            <>
              {/* TAB 1: TAX INVOICE PREVIEW */}
              <TabsContent
                value="invoice"
                className="mt-0 flex-1 overflow-auto bg-neutral-100/90 p-4 dark:bg-neutral-950/60 flex justify-center items-start"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="invoice-doc"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="relative my-2 origin-top shadow-2xl rounded-sm overflow-hidden bg-white max-w-full"
                  >
                    <div className="w-[210mm] max-w-full origin-top scale-[0.78] sm:scale-[0.88] md:scale-100">
                      <InvoiceDocument
                        invoice={data}
                        shipment={data.shipment}
                      />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>

              {/* TAB 2: 4:3 THERMAL SHIPPING LABEL PREVIEW */}
              <TabsContent
                value="label"
                className="mt-0 flex-1 overflow-auto bg-neutral-100/90 p-6 dark:bg-neutral-950/60 flex flex-col justify-center items-center"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key="label-doc"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center gap-4 my-auto"
                  >
                    {/* Thermal Label Card with 4:3 Aspect Ratio */}
                    <div className="rounded-none shadow-2xl transition-transform sm:scale-110 md:scale-125 origin-center my-6">
                      <ShippingLabel
                        shipment={{
                          ...data.shipment,
                          paymentMode: data.paymentMode,
                          totalAmount: data.amount,
                        }}
                      />
                    </div>

                    <div className="text-center font-mono text-[11px] text-muted-foreground">
                      Standard 4&quot; × 3&quot; (101.6mm × 76.2mm) Landscape Thermal Roll • High Contrast Barcodes
                    </div>
                  </motion.div>
                </AnimatePresence>
              </TabsContent>
            </>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
