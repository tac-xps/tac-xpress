"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import {
  Download,
  ReceiptText,
  MoreHorizontal,
  EditIcon,
  Trash2Icon,
  Eye,
  Send,
  CheckCircle2,
  RefreshCw,
} from "lucide-react"
import Link from "next/link"

import {
  TableBody,
  TableCell,
  TableColumnHeader,
  TableHead,
  TableHeader,
  TableHeaderGroup,
  TableProvider,
  TableRow,
} from "@/components/kibo-ui/table"
import type { ColumnDef } from "@/components/kibo-ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { cn } from "@/lib/utils"
import { useAction } from "next-safe-action/hooks"
import {
  deleteInvoiceAction,
  sendInvoiceViaWhatsApp,
  updateInvoiceAction,
} from "./actions"
import { toast } from "sonner"
import { EditInvoiceDialog } from "./edit-invoice-dialog"
import { DataTablePagination } from "@/components/ui/data-table-pagination"

type InvoiceData = {
  id: string
  customer: { name?: string | null; phone?: string | null } | null
  createdAt: Date
  status: "unpaid" | "paid" | "void" | string
  amount: number
  paymentMode?: string | null
  pdfUrl?: string | null
  shipmentId?: string | null
  shipment?: {
    id?: string | null
    awbNumber?: string | null
    consignorName?: string | null
    consignorPhone?: string | null
    consigneeName?: string | null
    consigneePhone?: string | null
  } | null
  freightCharge?: number | null
  pickupCharge?: number | null
  packingCharge?: number | null
  docketCharge?: number | null
  insuranceCharge?: number | null
  otherCharges?: number | null
  gstRate?: number | null
  advancePaid?: number | null
  balanceDue?: number | null
  remarks?: string | null
}

const paymentLabels: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  card: "Card",
  wallet: "Wallet",
  to_pay: "To Pay",
  credit: "Credit",
}

function formatCurrency(amountPaise: number) {
  return new Intl.NumberFormat("en-IN", {
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    style: "currency",
  }).format(amountPaise / 100)
}

function getStatusVariant(status: string) {
  if (status === "paid") return "success"
  if (status === "unpaid") return "warning"
  if (status === "void") return "error"
  return "neutral"
}

function InvoiceTableActions({ invoice }: { invoice: InvoiceData }) {
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { executeAsync: executeDelete, isExecuting: isDeleting } = useAction(
    deleteInvoiceAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) toast.success("Invoice deleted successfully")
        else toast.error((data as any)?.error || "Failed to delete invoice")
        setShowDeleteDialog(false)
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An error occurred")
        setShowDeleteDialog(false)
      },
    }
  )

  const { executeAsync: executeSend, isExecuting: isSending } = useAction(
    sendInvoiceViaWhatsApp
  )

  const { executeAsync: executeMarkPaid, isExecuting: isMarking } = useAction(
    updateInvoiceAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) toast.success("Invoice marked as paid")
        else toast.error((data as any)?.error || "Failed to update")
      },
      onError: ({ error }) =>
        toast.error(error.serverError || "An error occurred"),
    }
  )

  const handleDelete = async () => {
    await executeDelete({ id: invoice.id })
  }

  const handleSendWhatsApp = async () => {
    const phone = invoice.customer?.phone || invoice.shipment?.consignorPhone
    if (!phone) {
      toast.error("No phone number on file for this customer.")
      return
    }
    const promise = executeSend({
      invoiceId: invoice.id,
      phone,
    }).then((res) => {
      if (res?.data && !res.data.success) {
        throw new Error(
          (res.data as any).error || "Failed to send WhatsApp message"
        )
      }
      if (res?.serverError) {
        throw new Error(res.serverError || "An unexpected error occurred")
      }
      return res
    })

    toast.promise(promise, {
      loading: "Sending invoice via WhatsApp...",
      success: "WhatsApp message sent successfully!",
      error: (err) => err.message,
    })
  }

  const handleMarkPaid = async () => {
    await executeMarkPaid({
      id: invoice.id,
      status: "paid",
      amount: invoice.amount,
      advancePaid: invoice.advancePaid ?? undefined,
      balanceDue: 0,
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {invoice.pdfUrl && (
            <DropdownMenuItem asChild>
              <Link
                href={invoice.pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center"
              >
                <Eye className="mr-2 h-4 w-4" />
                View PDF
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem asChild>
            <Link
              href={`/invoice/${invoice.id}/label`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center"
            >
              <Eye className="mr-2 h-4 w-4 text-primary" />
              View Label
            </Link>
          </DropdownMenuItem>
          {invoice.pdfUrl && (
            <DropdownMenuItem asChild>
              <a
                href={`/api/documents/download?id=${invoice.shipment ? invoice.id : ""}`}
                download
                className="flex items-center"
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </a>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={handleSendWhatsApp}
            disabled={isSending}
            className="group"
          >
            {isSending ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
            )}
            {isSending ? "Sending invoice..." : "Send via WhatsApp"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditSheet(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Invoice
          </DropdownMenuItem>
          {invoice.status !== "paid" && (
            <DropdownMenuItem onClick={handleMarkPaid} disabled={isMarking}>
              <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
              Mark as Paid
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete Invoice
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              invoice and all associated records.
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

      <EditInvoiceDialog
        invoice={invoice}
        open={showEditSheet}
        onOpenChange={setShowEditSheet}
      />
    </>
  )
}

function getHeadClassName(columnId: string) {
  return cn(
    "sticky top-0 z-20 bg-background",
    columnId === "id" && "left-0 z-30 min-w-36 border-r bg-background",
    columnId === "amount" && "min-w-48 text-right",
    columnId === "createdAt" && "min-w-40 text-right",
    columnId === "customer" && "min-w-48",
    columnId === "paymentMode" && "min-w-32",
    columnId === "status" && "min-w-32",
    columnId === "actions" && "w-[80px]"
  )
}

function getCellClassName(columnId: string) {
  return cn(
    columnId === "id" && "sticky left-0 z-10 min-w-36 border-r bg-background",
    columnId === "amount" && "min-w-48 text-right",
    columnId === "createdAt" && "min-w-40 text-right",
    columnId === "customer" && "min-w-48",
    columnId === "paymentMode" && "min-w-32",
    columnId === "status" && "min-w-32",
    columnId === "actions" && "w-[80px]"
  )
}

export function InvoiceDataTable({ data }: { data: InvoiceData[] }) {
  const columns = useMemo<ColumnDef<InvoiceData>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Invoice ID" />
        ),
        cell: ({ row }) => (
          <span className="font-mono font-medium text-foreground tabular-nums">
            {String(row.getValue("id")).slice(0, 8).toUpperCase()}
          </span>
        ),
      },
      {
        accessorKey: "customer",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Client" />
        ),
        cell: ({ row }) => {
          const customer = row.getValue("customer") as InvoiceData["customer"]
          const shipment = row.original.shipment

          return (
            <span className="block truncate font-medium text-foreground">
              {customer?.name || shipment?.consignorName || "Unknown client"}
            </span>
          )
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <TableColumnHeader
            className="justify-end"
            column={column}
            title="Date issued"
          />
        ),
        cell: ({ row }) => {
          const date = new Date(row.getValue("createdAt"))

          return (
            <time
              className="block font-mono text-muted-foreground tabular-nums"
              dateTime={date.toISOString()}
              title={date.toLocaleString()}
            >
              {format(date, "dd MMM yyyy")}
            </time>
          )
        },
      },
      {
        id: "paymentMode",
        accessorFn: (row) => row.paymentMode,
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Payment" />
        ),
        cell: ({ row }) => {
          const mode = row.original.paymentMode

          if (!mode || mode === "credit") {
            return <span className="text-muted-foreground">Not recorded</span>
          }

          return (
            <Badge className="capitalize" variant="outline">
              {paymentLabels[mode] ?? mode.replaceAll("_", " ")}
            </Badge>
          )
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <TableColumnHeader column={column} title="Status" />
        ),
        cell: ({ row }) => {
          const status = row.getValue("status") as string

          return (
            <Badge
              className="capitalize"
              variant={getStatusVariant(status) as "neutral"}
            >
              {status.replaceAll("_", " ")}
            </Badge>
          )
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => (
          <TableColumnHeader
            className="justify-end"
            column={column}
            title="Amount"
          />
        ),
        cell: ({ row }) => {
          const amount = row.getValue("amount") as number
          const pdfUrl = row.original.pdfUrl

          return (
            <div className="flex items-center justify-end gap-4">
              <span className="font-mono font-semibold text-foreground tabular-nums">
                {formatCurrency(amount)}
              </span>
              <Button
                aria-label={
                  pdfUrl ? "Download invoice PDF" : "Invoice PDF unavailable"
                }
                asChild={Boolean(pdfUrl)}
                disabled={!pdfUrl}
                size="icon"
                variant="ghost"
              >
                {pdfUrl ? (
                  <a href={pdfUrl} rel="noreferrer" target="_blank">
                    <Download className="size-4" />
                  </a>
                ) : (
                  <span>
                    <Download className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          )
        },
      },
      {
        id: "actions",
        header: () => null,
        cell: ({ row }) => <InvoiceTableActions invoice={row.original} />,
      },
    ],
    []
  )

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totalPages = Math.ceil(data.length / pageSize)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return data.slice(start, start + pageSize)
  }, [data, currentPage, pageSize])

  if (data.length === 0) {
    return (
      <div
        className="flex min-h-48 flex-col items-center justify-center gap-4 border border-dashed border-border bg-background p-8 text-center"
        role="status"
      >
        <ReceiptText className="size-8 text-muted-foreground" />
        <div className="space-y-2">
          <p className="text-sm font-medium text-foreground">No invoices yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Created invoices will appear here with payment status, issue date,
            and ledger totals.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col">
      <div className="w-full scrollbar-thin overflow-x-auto pb-4">
        <div className="min-w-[800px]">
          <TableProvider
            className="min-w-full"
            columns={columns}
            data={paginatedData}
          >
            <TableHeader>
              {({ headerGroup }) => (
                <TableHeaderGroup
                  key={headerGroup.id}
                  headerGroup={headerGroup}
                >
                  {({ header }) => (
                    <TableHead
                      className={getHeadClassName(header.column.id)}
                      header={header}
                      key={header.id}
                    />
                  )}
                </TableHeaderGroup>
              )}
            </TableHeader>
            <TableBody>
              {({ row }) => (
                <TableRow
                  className="group focus-within:bg-muted/50 hover:bg-muted/50"
                  key={row.id}
                  row={row}
                >
                  {({ cell }) => (
                    <TableCell
                      cell={cell}
                      className={getCellClassName(cell.column.id)}
                      key={cell.id}
                    />
                  )}
                </TableRow>
              )}
            </TableBody>
          </TableProvider>
        </div>
      </div>
      <DataTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
