"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2, UserPlus, Edit3, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createDriverAction,
  updateDriverAction,
} from "@/app/dashboard/fleet/actions"
import {
  addDriverSchema,
  type AddDriverValues,
} from "@/app/dashboard/fleet/validations"
import type { ManifestDriverOption } from "./manifest-fleet-card"

interface DriverFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mode: "create" | "edit"
  driver?: ManifestDriverOption | null
  onSuccess: (driver: ManifestDriverOption) => void
}

export function DriverFormDialog({
  open,
  onOpenChange,
  mode,
  driver,
  onSuccess,
}: DriverFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddDriverValues>({
    resolver: zodResolver(addDriverSchema),
    defaultValues: {
      name: "",
      phone: "+91 ",
      licenseNumber: "",
      status: "active",
    },
  })

  useEffect(() => {
    if (open) {
      if (mode === "edit" && driver) {
        form.reset({
          name: driver.label || "",
          phone: driver.phone || "+91 ",
          licenseNumber: driver.licenseNumber || "",
          status: "active",
        })
      } else {
        form.reset({
          name: "",
          phone: "+91 ",
          licenseNumber: "",
          status: "active",
        })
      }
    }
  }, [open, mode, driver, form])

  const onSubmit = async (values: AddDriverValues) => {
    setIsSubmitting(true)
    try {
      if (mode === "create") {
        const res = await createDriverAction(values)
        if (res?.data?.success && res.data.driver) {
          const newDriver: ManifestDriverOption = {
            id: res.data.driver.id,
            label: res.data.driver.name,
            phone: res.data.driver.phone,
            licenseNumber: res.data.driver.licenseNumber,
          }
          toast.success(`Driver ${newDriver.label} registered successfully`)
          onSuccess(newDriver)
          onOpenChange(false)
        } else {
          toast.error(res?.data?.error || "Failed to create driver")
        }
      } else if (mode === "edit" && driver?.id) {
        const res = await updateDriverAction({
          id: driver.id,
          ...values,
        })
        if (res?.data?.success && res.data.driver) {
          const updatedDriver: ManifestDriverOption = {
            id: res.data.driver.id,
            label: res.data.driver.name,
            phone: res.data.driver.phone,
            licenseNumber: res.data.driver.licenseNumber,
          }
          toast.success(`Driver ${updatedDriver.label} updated successfully`)
          onSuccess(updatedDriver)
          onOpenChange(false)
        } else {
          toast.error(res?.data?.error || "Failed to update driver")
        }
      }
    } catch {
      toast.error("An unexpected error occurred while saving driver details")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-none border-border bg-background p-6 shadow-2xl">
        <DialogHeader className="space-y-1">
          <DialogTitle className="flex items-center gap-2 text-base font-bold">
            {mode === "create" ? (
              <>
                <UserPlus className="size-4 text-primary" />
                Register Commercial Driver
              </>
            ) : (
              <>
                <Edit3 className="size-4 text-primary" />
                Update Driver Details
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {mode === "create"
              ? "Add a new driver to the fleet for immediate route assignment."
              : `Modify contact phone number or license details for ${driver?.label || "driver"}.`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold">Driver Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Vikram Thapa"
                      className="rounded-none h-9 text-xs"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-xs font-semibold">
                    Contact Phone (WhatsApp Dispatch)
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="+91 98765 43210"
                      className="rounded-none h-9 text-xs font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold">License Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="DL-0420210098765"
                        className="rounded-none h-9 text-xs font-mono uppercase"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-xs font-semibold">Duty Status</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full bg-background rounded-none h-9 text-xs">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-none">
                        <SelectItem value="active" className="text-xs font-mono">
                          Active (On Duty)
                        </SelectItem>
                        <SelectItem value="on_leave" className="text-xs font-mono">
                          On Leave
                        </SelectItem>
                        <SelectItem value="inactive" className="text-xs font-mono">
                          Inactive
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="border border-border/70 bg-muted/20 p-2.5 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4 text-status-delivered shrink-0" />
              <span>
                Verified commercial driver profiles can receive digital manifests &amp; route updates via WhatsApp.
              </span>
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-none h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-none h-9 text-xs font-semibold"
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                ) : mode === "create" ? (
                  <UserPlus className="mr-2 size-3.5" />
                ) : (
                  <Edit3 className="mr-2 size-3.5" />
                )}
                {mode === "create" ? "Register & Assign" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
