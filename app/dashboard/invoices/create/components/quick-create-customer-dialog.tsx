"use client"

import React, { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { createCustomerAction } from "@/app/dashboard/customers/actions"
import { lookupPincodeAction } from "../../actions"
import type { UseFormReturn } from "react-hook-form"

interface QuickCreateCustomerDialogProps {
  role: "consignor" | "consignee" | null
  onClose: () => void
  form: UseFormReturn<any>
}

export function QuickCreateCustomerDialog({
  role,
  onClose,
  form,
}: QuickCreateCustomerDialogProps) {
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newAddress, setNewAddress] = useState("")
  const [newPinCode, setNewPinCode] = useState("")
  const [newCity, setNewCity] = useState("")
  const [newState, setNewState] = useState("")
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false
    const lookup = async () => {
      if (newPinCode.length === 6 && /^\d{6}$/.test(newPinCode)) {
        try {
          const res = await lookupPincodeAction({ pincode: newPinCode })
          if (!cancelled && res?.data?.success && res.data.city) {
            setNewCity(res.data.city)
            setNewState(res.data.state || "")
            toast.success(`Resolved: ${res.data.city}, ${res.data.state}`)
          }
        } catch {
          // ignore
        }
      }
    }
    lookup()
    return () => {
      cancelled = true
    }
  }, [newPinCode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newName.trim() || !newPhone.trim()) {
      setError("Name and Phone number are required.")
      return
    }
    setIsCreating(true)
    setError("")
    try {
      const res = await createCustomerAction({
        name: newName,
        phone: newPhone,
        email: newEmail || undefined,
        address: newAddress || undefined,
        city: newCity || undefined,
        state: newState || undefined,
        pinCode: newPinCode || undefined,
      })
      const customer = res?.data?.customer
      const success = res?.data?.success
      if (success && customer) {
        const c = customer
        toast.success(`Customer "${newName}" created!`)
        if (role === "consignor") {
          form.setValue("consignorName", c.name ?? "")
          form.setValue("consignorPhone", c.phone ?? "")
          if (c.email) form.setValue("consignorEmail", c.email)
          if (c.address) form.setValue("consignorAddress", c.address)
          if (c.pinCode) form.setValue("consignorPinCode", c.pinCode)
          if (c.city) form.setValue("origin", c.city)
          form.trigger([
            "consignorPhone",
            "consignorEmail",
            "consignorAddress",
            "consignorPinCode",
          ])
        } else {
          form.setValue("consigneeName", c.name ?? "")
          form.setValue("consigneePhone", c.phone ?? "")
          if (c.email) form.setValue("consigneeEmail", c.email)
          if (c.address) form.setValue("consigneeAddress", c.address)
          if (c.pinCode) form.setValue("consigneePinCode", c.pinCode)
          if (c.city) form.setValue("destination", c.city)
          form.trigger([
            "consigneePhone",
            "consigneeEmail",
            "consigneeAddress",
            "consigneePinCode",
          ])
        }
        onClose()
      } else {
        const msg =
          (res?.data?.error ?? res?.serverError) ||
          "Failed to create customer."
        setError(typeof msg === "string" ? msg : "Failed to create customer.")
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <Dialog
      open={role !== null}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent className="max-w-md rounded-none border border-border/85 bg-popover p-6 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            Quick Add {role === "consignor" ? "Consignor" : "Consignee"}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Add a new customer to the database and auto-populate wizard details.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {error && (
            <div className="rounded-none bg-destructive/10 p-3 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          <div className="grid gap-3">
            <div className="space-y-1">
              <Label
                htmlFor="quick-name"
                className="text-xs font-semibold text-foreground"
              >
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quick-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. John Doe"
                className="h-10 bg-background text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="quick-phone"
                className="text-xs font-semibold text-foreground"
              >
                Phone Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="quick-phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="10-digit mobile number"
                className="h-10 bg-background text-xs"
                required
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="quick-email"
                className="text-xs font-semibold text-foreground"
              >
                Email (Optional)
              </Label>
              <Input
                id="quick-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10 bg-background text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="quick-address"
                className="text-xs font-semibold text-foreground"
              >
                Address (Optional)
              </Label>
              <Textarea
                id="quick-address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Complete Address"
                className="h-16 resize-none bg-background text-xs"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor="quick-pin"
                  className="text-xs font-semibold text-foreground"
                >
                  PIN Code
                </Label>
                <Input
                  id="quick-pin"
                  value={newPinCode}
                  onChange={(e) => setNewPinCode(e.target.value)}
                  placeholder="6 digits"
                  className="h-10 bg-background text-xs"
                  maxLength={6}
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="quick-city"
                  className="text-xs font-semibold text-foreground"
                >
                  City
                </Label>
                <Input
                  id="quick-city"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="City"
                  className="h-10 bg-background text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label
                  htmlFor="quick-state"
                  className="text-xs font-semibold text-foreground"
                >
                  State
                </Label>
                <Input
                  id="quick-state"
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  placeholder="State"
                  className="h-10 bg-background text-xs"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="flex gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
                className="text-xs"
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
                className="bg-primary text-xs font-semibold text-primary-foreground"
              disabled={isCreating}
            >
              {isCreating ? "Saving..." : "Save Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
