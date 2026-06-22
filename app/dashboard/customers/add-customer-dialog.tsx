"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { UserPlusIcon } from "lucide-react"
import { AddCustomerForm } from "./add-customer-form"

/**
 * Dialog wrapper for the AddCustomerForm.
 * Controls the open/close state of the modal and renders the trigger button.
 */
export function AddCustomerDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Customer</DialogTitle>
          <DialogDescription>
            Create a new customer profile. They will receive an email to set
            their password.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <AddCustomerForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
