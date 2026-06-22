"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEditDriverDialog } from "./use-edit-driver-dialog"
import { AddDriverForm } from "./add-driver-form"

interface EditDriverDialogProps {
  driver: any
  open: boolean
  setOpen: (open: boolean) => void
}

export function EditDriverDialog({
  driver,
  open,
  setOpen,
}: EditDriverDialogProps) {
  const { form, isExecuting, onSubmit } = useEditDriverDialog(
    driver,
    open,
    setOpen
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Driver</DialogTitle>
          <DialogDescription>
            Update the driver's details below.
          </DialogDescription>
        </DialogHeader>
        <AddDriverForm
          form={form}
          onSubmit={onSubmit}
          isExecuting={isExecuting}
        />
      </DialogContent>
    </Dialog>
  )
}
