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
import { AddStaffForm } from "./add-staff-form"

/**
 * Dialog wrapper for the AddStaffForm.
 */
export function AddStaffDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlusIcon className="mr-2 h-4 w-4" />
          Add Staff
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Staff</DialogTitle>
          <DialogDescription>
            Create a new staff member profile. They can sign in using their email via magic link.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <AddStaffForm onSuccess={() => setOpen(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
