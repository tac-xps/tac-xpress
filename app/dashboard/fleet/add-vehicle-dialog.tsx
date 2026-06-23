"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAddVehicleDialog } from "./use-add-vehicle-dialog"
import { AddVehicleForm } from "./add-vehicle-form"

export function AddVehicleDialog({
  drivers,
}: {
  drivers: { id: string; name: string }[]
}) {
  const { open, setOpen, form, isExecuting, onSubmit } = useAddVehicleDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Vehicle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
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
