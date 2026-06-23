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
import { useAddDriverDialog } from "./use-add-driver-dialog"
import { AddDriverForm } from "./add-driver-form"

export function AddDriverDialog() {
  const { open, setOpen, form, isExecuting, onSubmit } = useAddDriverDialog()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Driver
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Driver</DialogTitle>
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
