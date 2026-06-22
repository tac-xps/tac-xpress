"use client"

import { useAction } from "next-safe-action/hooks"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { MoreHorizontal, FileText, Edit, Trash, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
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
import { AddTrackingEventDialog } from "./add-tracking-event-dialog"
import { EditShipmentDialog } from "./edit-shipment-dialog"
import { deleteShipmentAction } from "./actions"
import { toast } from "sonner"

import { type Shipment } from "@/lib/db/schema"
import { SecureBoundary } from "@/components/security/secure-boundary"

export interface ShipmentWithRelations extends Shipment {
  invoice?: { pdfUrl: string | null } | null
}

interface ShipmentActionsProps {
  shipment: ShipmentWithRelations
}

export function ShipmentActions({ shipment }: ShipmentActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const pdfUrl = shipment.invoice?.pdfUrl

  const { executeAsync, isExecuting: isDeleting } = useAction(
    deleteShipmentAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Shipment deleted successfully")
          router.refresh()
        } else {
          toast.error("Failed to delete shipment")
        }
        setDeleteOpen(false)
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An error occurred")
        setDeleteOpen(false)
      },
    }
  )

  async function handleDelete() {
    await executeAsync({ id: shipment.id })
  }

  return (
    <>
      <EditShipmentDialog
        shipment={shipment}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete
              shipment {shipment.awbNumber}
              and all its associated data (tracking events, invoices).
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

      <div className="flex items-center justify-end gap-2">
        {pdfUrl ? (
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="size-4 text-primary" />
            </a>
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-not-allowed opacity-50"
            disabled
          >
            <FileText className="size-4" />
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 group-hover:bg-background"
              disabled={isDeleting}
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="border-border/50 bg-background"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/shipments/${shipment.id}`}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Link>
            </DropdownMenuItem>

            <SecureBoundary
              table="shipments"
              operation="update"
              resourceId={shipment.id}
              fallback="boundary"
            >
              <DropdownMenuItem onClick={() => setEditOpen(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Shipment
              </DropdownMenuItem>
              <AddTrackingEventDialog
                shipmentId={shipment.id}
                awbNumber={shipment.awbNumber}
              />
            </SecureBoundary>

            <DropdownMenuSeparator />

            <SecureBoundary
              table="shipments"
              operation="delete"
              resourceId={shipment.id}
              fallback="boundary"
            >
              <DropdownMenuItem
                variant="destructive"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete Shipment
              </DropdownMenuItem>
            </SecureBoundary>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
