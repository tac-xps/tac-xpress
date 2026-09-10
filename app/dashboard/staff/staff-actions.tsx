"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MoreHorizontal, Edit, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { deleteStaffAction } from "./actions"
import { toast } from "sonner"
import { EditStaffDialog } from "./edit-staff-dialog"
import { StaffForEdit } from "./use-edit-staff-dialog"

export function StaffActions({ staff }: { staff: StaffForEdit }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    const result = await deleteStaffAction({ id: staff.id })
    if ((result?.data?.success)) {
      toast.success("Staff access revoked")
      router.refresh()
    } else {
      toast.error((result?.data?.error ?? result?.serverError) || "Failed to revoke access")
    }
    setIsDeleting(false)
    setShowDelete(false)
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="sr-only">Open menu</span>
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowEdit(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setShowDelete(true)}
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Revoke Access
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will immediately revoke access to the dashboard for {staff.name}. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? "Revoking..." : "Revoke Access"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showEdit && (
        <EditStaffDialog
          staff={staff}
          open={showEdit}
          onOpenChange={setShowEdit}
        />
      )}
    </>
  )
}
