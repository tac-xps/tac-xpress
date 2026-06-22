"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAddHubDialog } from "./use-add-hub-dialog"
import { AddHubForm } from "./add-hub-form"

export function AddHubDialog() {
  const { open, setOpen, form, isSubmitting, onSubmit } = useAddHubDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Hub</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transit Hub</DialogTitle>
          <DialogDescription>
            Create a new branch, warehouse, or transit center in your network.
          </DialogDescription>
        </DialogHeader>
        <AddHubForm
          form={form}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  )
}
