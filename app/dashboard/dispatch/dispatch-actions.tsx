"use client"

import { useState } from "react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, EditIcon, Trash2Icon } from "lucide-react"
import { deleteDispatchRunAction } from "./actions"
import { EditDispatchDialog } from "./edit-dispatch-dialog"

export function DispatchActions({
  dispatchRun,
}: {
  dispatchRun: {
    id: string
    referenceId: string
    status: "draft" | "finalized"
    driverId?: string | null
    vehicleId?: string | null
  }
}) {
  const [showEditDialog, setShowEditDialog] = useState(false)

  const { executeAsync: executeDelete, isExecuting: isDeleting } = useAction(
    deleteDispatchRunAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Dispatch run deleted successfully")
        } else {
          toast.error(data?.error || "Failed to delete dispatch run")
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An error occurred")
      },
    }
  )

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this dispatch run?")) {
      await executeDelete({ id: dispatchRun.id })
    }
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
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            <EditIcon className="mr-2 h-4 w-4" />
            Edit Dispatch Run
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-destructive focus:text-destructive"
          >
            <Trash2Icon className="mr-2 h-4 w-4" />
            {isDeleting ? "Deleting..." : "Delete Dispatch Run"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDispatchDialog
        dispatchRun={dispatchRun}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </>
  )
}
