"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useEditHubDialog } from "./use-edit-hub-dialog"
import { EditHubForm } from "./edit-hub-form"

interface EditHubDialogProps {
  hub: any
  open: boolean
  setOpen: (open: boolean) => void
}

export function EditHubDialog({ hub, open, setOpen }: EditHubDialogProps) {
  const { form, isSubmitting, onSubmit } = useEditHubDialog(hub, open, setOpen)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transit Hub</DialogTitle>
          <DialogDescription>
            Update the details for this transit hub.
          </DialogDescription>
        </DialogHeader>
        <EditHubForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
