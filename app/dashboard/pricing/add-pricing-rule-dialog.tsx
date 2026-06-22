"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusIcon } from "lucide-react"
import { AddPricingRuleForm } from "./add-pricing-rule-form"

export function AddPricingRuleDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Pricing Rule
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Pricing Rule</DialogTitle>
          <DialogDescription>
            Create a new dynamic rate card for a specific route.
          </DialogDescription>
        </DialogHeader>
        <AddPricingRuleForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
