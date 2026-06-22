"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEditVehicleDialog } from "./use-edit-vehicle-dialog"
import { AddVehicleForm } from "./add-vehicle-form"

interface EditVehicleDialogProps {
  vehicle: any
  open: boolean
  setOpen: (open: boolean) => void
  drivers: { id: string; name: string }[]
}

export function EditVehicleDialog({
  vehicle,
  open,
  setOpen,
  drivers,
}: EditVehicleDialogProps) {
  const { form, isExecuting, onSubmit } = useEditVehicleDialog(
    vehicle,
    open,
    setOpen
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Vehicle</DialogTitle>
          <DialogDescription>
            Update the vehicle's details below.
          </DialogDescription>
        </DialogHeader>
        <AddVehicleForm
          form={form}
          onSubmit={onSubmit}
          isExecuting={isExecuting}
          drivers={drivers}
        />
      </DialogContent>
    </Dialog>
  )
}
