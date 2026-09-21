"use client"
import { useState, useTransition } from "react"
import Link from "next/link"
import {
  MoreHorizontal,
  Download,
  Eye,
  Pencil,
  Send,
  CheckCircle,
  Trash2,
} from "lucide-react"
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
import {
  deleteInvoiceAction,
  sendInvoiceViaWhatsApp,
  updateInvoiceAction,
} from "./actions"
import { EditInvoiceDialog } from "./edit-invoice-dialog"
import { toast } from "sonner"
import type { InvoiceData } from "./invoice-types"
export function InvoiceTableActions({
  invoice,
  canVoid = false,
}: {
  invoice: InvoiceData
  canVoid?: boolean
}) {
  const [edit, setEdit] = useState(false)
  const [confirmation, setConfirmation] = useState<
    "delete" | "paid" | "send" | null
  >(null)
  const [pending, startTransition] = useTransition()
  const phone =
    invoice.shipment?.consignorPhone ||
    invoice.customer?.phone ||
    invoice.shipment?.consigneePhone
  function confirm() {
    startTransition(async () => {
      try {
        const result =
          confirmation === "delete"
            ? await deleteInvoiceAction({ id: invoice.id })
            : confirmation === "paid"
              ? await updateInvoiceAction({
                  id: invoice.id,
                  status: "paid",
                  amount: invoice.amount,
                  advancePaid: invoice.amount,
                  balanceDue: 0,
                })
              : phone
                ? await sendInvoiceViaWhatsApp({ invoiceId: invoice.id, phone })
                : undefined
        if (!result?.data?.success)
          throw new Error(
            result?.serverError ||
              result?.data?.error ||
              "The action could not be completed."
          )
        toast.success(
          confirmation === "delete"
            ? "Invoice voided; record retained"
            : confirmation === "paid"
              ? "Invoice marked paid"
              : "Invoice accepted by WhatsApp provider"
        )
        setConfirmation(null)
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Unable to complete the action."
        )
      }
    })
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Actions for invoice ${invoice.id.slice(0, 8)}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/invoice/${invoice.id}`}>
              <Eye />
              View invoice
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={`/invoice/${invoice.id}/label`}>
              <Eye />
              View shipping label
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a href={`/api/documents/download?id=${invoice.id}`} download>
              <Download />
              Download PDF
            </a>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!phone || pending}
            onSelect={() => {
              if (invoice.status === "void") {
                toast.error(
                  "Cannot dispatch WhatsApp invoice: this invoice has been voided. Re-issue an active invoice first."
                )
                return
              }
              setConfirmation("send")
            }}
          >
            <Send />
            Send via WhatsApp
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setEdit(true)}
            disabled={invoice.status === "void"}
          >
            <Pencil />
            Edit invoice
          </DropdownMenuItem>
          {invoice.status === "unpaid" && (
            <DropdownMenuItem onSelect={() => setConfirmation("paid")}>
              <CheckCircle />
              Mark paid
            </DropdownMenuItem>
          )}
          {canVoid && invoice.status === "unpaid" && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => setConfirmation("delete")}
                className="text-destructive"
              >
                <Trash2 />
                Void invoice
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog
        open={confirmation !== null}
        onOpenChange={(open) => {
          if (!open && !pending) setConfirmation(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmation === "delete"
                ? "Void this invoice?"
                : confirmation === "paid"
                  ? "Confirm payment received?"
                  : "Send invoice via WhatsApp?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmation === "delete"
                ? "The billing record and audit history will be retained. Invoices with recorded payments must be reconciled before they can be voided."
                : confirmation === "paid"
                  ? "Only continue after verifying that the full payment was received. The outstanding balance will be set to zero."
                  : `The current invoice will be sent to the recorded customer number: ${phone ?? "not recorded"}.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={pending}
              onClick={(event) => {
                event.preventDefault()
                confirm()
              }}
            >
              {pending ? "Working…" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {edit && (
        <EditInvoiceDialog
          invoice={invoice}
          open={edit}
          onOpenChange={setEdit}
        />
      )}
    </>
  )
}
