"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  AlertCircleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  DownloadIcon,
  EyeIcon,
  RefreshCwIcon,
  SendIcon,
  TrashIcon,
} from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

import { useInvoiceDetailDialog } from "./use-invoice-detail-dialog"

interface InvoiceDetailDialogProps {
  invoice: {
    id: string
    amount: number
    status: "unpaid" | "paid"
    pdfUrl: string | null
    whatsappStatus: "pending" | "sent" | "failed"
    createdAt: Date
    awbNumber: string | null
    customerPhone: string | null
    consignorName: string | null
    advancePaid: number | null
    balanceDue: number | null
    shipmentId: string | null
  }
}

function formatCurrency(amountPaise: number | null) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format((amountPaise ?? 0) / 100)
}

function DetailRow({
  label,
  value,
  numeric = false,
}: {
  label: string
  value: string
  numeric?: boolean
}) {
  return (
    <div className="grid grid-cols-2 gap-4 border-b border-border py-2 last:border-b-0">
      <dt className="text-sm font-medium text-muted-foreground">{label}</dt>
      <dd
        className={cn(
          "truncate text-sm font-medium text-foreground",
          numeric && "text-right font-mono tabular-nums"
        )}
      >
        {value}
      </dd>
    </div>
  )
}

export function InvoiceDetailDialog({ invoice }: InvoiceDetailDialogProps) {
  const {
    open,
    setOpen,
    showDeleteDialog,
    setShowDeleteDialog,
    isDeleting,
    isSending,
    isUpdating,
    form,
    handleDelete,
    handleSend,
    onSubmit,
  } = useInvoiceDetailDialog(invoice)
  const [editOpen, setEditOpen] = useState(false)

  const documentHref = useMemo(() => {
    if (!invoice.pdfUrl) return null
    if (invoice.pdfUrl.startsWith("/")) return invoice.pdfUrl
    return `/api/documents?path=${encodeURIComponent(invoice.pdfUrl)}`
  }, [invoice.pdfUrl])

  const downloadHref = invoice.shipmentId
    ? `/api/documents/download?id=${invoice.shipmentId}`
    : null

  const whatsappIcon = isSending ? (
    <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
  ) : invoice.whatsappStatus === "sent" ? (
    <CheckCircle2Icon className="mr-2 h-4 w-4 text-success" />
  ) : invoice.whatsappStatus === "failed" ? (
    <AlertCircleIcon className="mr-2 h-4 w-4 text-destructive" />
  ) : (
    <SendIcon className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Open
        </Button>
      </DialogTrigger>
      <DialogContent className="h-svh max-h-svh w-full max-w-5xl overflow-hidden p-0">
        <div className="grid h-full bg-background lg:grid-cols-3">
          <aside className="flex min-h-0 flex-col border-b border-border bg-card lg:border-r lg:border-b-0">
            <DialogHeader className="border-b border-border p-6 text-left">
              <DialogTitle className="text-base font-semibold text-foreground">
                Invoice details
              </DialogTitle>
              <DialogDescription className="font-mono text-sm text-muted-foreground tabular-nums">
                AWB {invoice.awbNumber || "Not assigned"}
              </DialogDescription>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-8 overflow-y-auto p-6">
              <section className="space-y-4" aria-labelledby="invoice-actions">
                <h3
                  className="text-sm font-medium text-foreground"
                  id="invoice-actions"
                >
                  Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    asChild={Boolean(documentHref)}
                    disabled={!documentHref}
                    variant="outline"
                  >
                    {documentHref ? (
                      <Link
                        href={documentHref}
                        rel="noreferrer"
                        target="_blank"
                      >
                        <EyeIcon className="h-4 w-4" />
                        View PDF
                      </Link>
                    ) : (
                      <span>
                        <EyeIcon className="h-4 w-4" />
                        View PDF
                      </span>
                    )}
                  </Button>
                  <Button
                    asChild={Boolean(downloadHref)}
                    disabled={!downloadHref}
                    variant="outline"
                  >
                    {downloadHref ? (
                      <a href={downloadHref} download>
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </a>
                    ) : (
                      <span>
                        <DownloadIcon className="h-4 w-4" />
                        Download
                      </span>
                    )}
                  </Button>
                  <Button
                    className="group relative col-span-2 justify-start overflow-hidden"
                    disabled={isSending}
                    onClick={handleSend}
                    variant="outline"
                  >
                    {whatsappIcon}
                    {isSending
                      ? "Sending invoice..."
                      : invoice.whatsappStatus === "sent"
                        ? "Resend WhatsApp"
                        : "Send WhatsApp"}
                  </Button>
                  <Button
                    className="col-span-2 justify-start"
                    disabled={isDeleting}
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                  >
                    {isDeleting ? (
                      <RefreshCwIcon className="h-4 w-4 animate-spin" />
                    ) : (
                      <TrashIcon className="h-4 w-4" />
                    )}
                    Delete invoice
                  </Button>
                </div>
              </section>

              <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
              >
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      this invoice and all associated records.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <section className="space-y-4" aria-labelledby="invoice-summary">
                <h3
                  className="text-sm font-medium text-foreground"
                  id="invoice-summary"
                >
                  Summary
                </h3>
                <dl className="border border-border bg-background px-4">
                  <DetailRow
                    label="Date"
                    numeric
                    value={format(new Date(invoice.createdAt), "dd MMM yyyy")}
                  />
                  <DetailRow
                    label="Customer"
                    value={invoice.consignorName || "Not recorded"}
                  />
                  <DetailRow
                    label="Phone"
                    numeric
                    value={invoice.customerPhone || "Not recorded"}
                  />
                  <DetailRow
                    label="Amount"
                    numeric
                    value={formatCurrency(invoice.amount)}
                  />
                  <DetailRow
                    label="Advance"
                    numeric
                    value={formatCurrency(invoice.advancePaid)}
                  />
                  <DetailRow
                    label="Balance"
                    numeric
                    value={formatCurrency(invoice.balanceDue)}
                  />
                </dl>
              </section>

              <Collapsible open={editOpen} onOpenChange={setEditOpen}>
                <CollapsibleTrigger asChild>
                  <Button
                    className="w-full justify-between"
                    type="button"
                    variant="outline"
                  >
                    Edit invoice
                    <ChevronDownIcon
                      className={cn(
                        "h-4 w-4 transition-transform",
                        editOpen && "rotate-180"
                      )}
                    />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                  <Form {...form}>
                    <form
                      className="space-y-4"
                      onSubmit={form.handleSubmit(onSubmit)}
                    >
                      <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount (INR)</FormLabel>
                            <FormControl>
                              <Input
                                className="text-right font-mono tabular-nums"
                                inputMode="decimal"
                                step="0.01"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="advancePaid"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Advance paid (INR)</FormLabel>
                            <FormControl>
                              <Input
                                className="text-right font-mono tabular-nums"
                                inputMode="decimal"
                                step="0.01"
                                type="number"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment status</FormLabel>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        className="w-full"
                        disabled={isUpdating}
                        type="submit"
                      >
                        {isUpdating ? (
                          <RefreshCwIcon className="h-4 w-4 animate-spin" />
                        ) : null}
                        Save changes
                      </Button>
                    </form>
                  </Form>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </aside>

          <section className="min-h-0 bg-muted p-8 lg:col-span-2">
            {documentHref ? (
              <iframe
                className="h-full min-h-96 w-full border border-border bg-background"
                src={
                  invoice.pdfUrl?.startsWith("/")
                    ? `${invoice.pdfUrl}?preview=true`
                    : documentHref
                }
                title="Invoice PDF preview"
              />
            ) : (
              <div
                className="flex h-full min-h-96 flex-col items-center justify-center gap-4 border border-dashed border-border bg-background p-8 text-center"
                role="status"
              >
                <AlertCircleIcon className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">
                    No PDF available
                  </p>
                  <p className="max-w-sm text-sm text-muted-foreground">
                    Generate or upload an invoice PDF before previewing this
                    document.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
