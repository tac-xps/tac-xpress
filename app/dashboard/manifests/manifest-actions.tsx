"use client"

import React, { useState } from "react"
import {
  MoreHorizontal,
  Eye,
  Printer,
  Share2,
  MessageSquare,
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

import { messageDriverAction } from "@/app/dashboard/dispatch/whatsapp-actions"
import { toast } from "sonner"
import { useTransition } from "react"
import { useAction } from "next-safe-action/hooks"
import { deleteManifestAction } from "./actions"
import { EditManifestDialog } from "./edit-manifest-dialog"
import {
  ManifestDetailDialog,
  type ManifestDetail,
} from "./manifest-detail-dialog"
import { Trash2Icon, EditIcon } from "lucide-react"

export function ManifestActions({ manifest }: { manifest: ManifestDetail }) {
  const [isPending, startTransition] = useTransition()
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDetailDialog, setShowDetailDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const { executeAsync: executeDelete, isExecuting: isDeleting } = useAction(
    deleteManifestAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Manifest deleted successfully")
        } else {
          toast.error(data?.error || "Failed to delete manifest")
        }
        setShowDeleteDialog(false)
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An error occurred")
        setShowDeleteDialog(false)
      },
    }
  )

  const handleWhatsApp = () => {
    const driverId = manifest.driverId
    if (!driverId) {
      toast.error("No driver assigned to this manifest.")
      return
    }
    startTransition(async () => {
      const res = await messageDriverAction(manifest.id, driverId)
      if (res.success) {
        toast.success("WhatsApp message sent to driver successfully!")
      } else {
        toast.error(res.error || "Failed to send WhatsApp message.")
      }
    })
  }

  const handlePrint = () => {
    window.open(`/api/manifests/${manifest.id}/print`, "_blank")
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/api/manifests/${manifest.id}/print`
    try {
      await navigator.clipboard.writeText(url)
      toast.success("Manifest link copied to clipboard!")
    } catch {
      toast.error("Could not copy link. Please try again.")
    }
  }

  const handleDelete = async () => {
    await executeDelete({ id: manifest.id })
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
          <DropdownMenuItem onClick={() => setShowDetailDialog(true)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Manifest
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Copy Share Link
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Manifest
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleWhatsApp}
            disabled={isPending || !manifest.driverId}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            {isPending ? "Sending..." : "Send via WhatsApp"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setShowDeleteDialog(true)}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            Delete Manifest
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              manifest.
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

      <ManifestDetailDialog
        manifest={manifest}
        open={showDetailDialog}
        onOpenChange={setShowDetailDialog}
      />

      <EditManifestDialog
        manifest={manifest}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  )
}
