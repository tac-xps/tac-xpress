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
import { EditVehicleDialog } from "./edit-vehicle-dialog"
import { deleteVehicleAction } from "./actions"
import { toast } from "sonner"

interface VehicleActionsProps {
  vehicle: any
  drivers: { id: string; name: string }[]
}

export function VehicleActions({ vehicle, drivers }: VehicleActionsProps) {
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return

    setIsDeleting(true)
    const result = await deleteVehicleAction({ id: vehicle.id })
    if (result?.success) {
      toast.success("Vehicle deleted successfully")
      router.refresh()
    } else {
      toast.error(result?.error || "Failed to delete vehicle")
    }
    setIsDeleting(false)
  }

  return (
    <>
      <EditVehicleDialog
        vehicle={vehicle}
        open={editOpen}
        setOpen={setEditOpen}
        drivers={drivers}
      />
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
            Edit vehicle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" />
            Delete vehicle
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
