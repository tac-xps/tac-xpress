"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Edit, Trash } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { EditDriverDialog } from "./edit-driver-dialog"
import { deleteDriverAction } from "./actions"
import { toast } from "sonner"

interface DriverActionsProps {
  driver: any
}

export function DriverActions({ driver }: DriverActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this driver?")) return

    setIsDeleting(true)
    const result = await deleteDriverAction({ id: driver.id })
    if (result?.success) {
      toast.success("Driver deleted successfully")
      router.refresh()
    } else {
      toast.error(result?.error || "Failed to delete driver")
    }
    setIsDeleting(false)
  }

  return (
    <>
      <EditDriverDialog driver={driver} open={editOpen} setOpen={setEditOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit driver
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete driver
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
