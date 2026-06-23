"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import { DialogFooter } from "@/components/ui/dialog"

import { useScannerContext } from "@/components/scanner/scanner-provider"
import { useEffect, useCallback } from "react"
import { toast } from "sonner"

export type ShipmentMin = {
  id: string
  awbNumber: string
  origin: string
  destination: string
  status: string
}

import { DriverCombobox } from "@/components/forms/driver-combobox"
import { VehicleCombobox } from "@/components/forms/vehicle-combobox"

interface CreateDispatchFormProps {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void
  isExecuting: boolean
  pendingShipments: ShipmentMin[]
}

export function CreateDispatchForm({
  form,
  onSubmit,
  isExecuting,
  pendingShipments,
}: CreateDispatchFormProps) {
  const { setOverrideHandler } = useScannerContext()

  const processScannedAwb = useCallback(
    async (targetAwb: string) => {
      const shipment = pendingShipments.find(
        (s) => s.awbNumber.toUpperCase() === targetAwb.toUpperCase()
      )

      if (shipment) {
        const currentIds = form.getValues("shipmentIds") || []
        if (!currentIds.includes(shipment.id)) {
          form.setValue("shipmentIds", [...currentIds, shipment.id], {
            shouldValidate: true,
          })
          toast.success(`Scanned and assigned AWB: ${shipment.awbNumber}`)
          return true
        } else {
          toast.info(`AWB ${shipment.awbNumber} is already selected.`)
          return false
        }
      } else {
        toast.error(`Pending shipment not found for AWB: ${targetAwb}`)
        return false
      }
    },
    [pendingShipments, form]
  )

  useEffect(() => {
    setOverrideHandler(processScannedAwb)
    return () => setOverrideHandler(null)
  }, [setOverrideHandler, processScannedAwb])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="runType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Run Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="driverId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Driver</FormLabel>
                <DriverCombobox
                  value={field.value}
                  onSelect={(id) => field.onChange(id)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicleId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assign Vehicle</FormLabel>
                <VehicleCombobox
                  value={field.value}
                  onSelect={(id) => field.onChange(id)}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="shipmentIds"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Select Shipments</FormLabel>
              </div>
              {pendingShipments.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No pending shipments available.
                </p>
              ) : (
                pendingShipments.map((shipment) => (
                  <FormField
                    key={shipment.id}
                    control={form.control}
                    name="shipmentIds"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={shipment.id}
                          className="flex flex-row items-start space-y-0 space-x-3 border p-3"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(shipment.id)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([
                                      ...field.value,
                                      shipment.id,
                                    ])
                                  : field.onChange(
                                      field.value?.filter(
                                        (v: string) => v !== shipment.id
                                      )
                                    )
                              }}
                            />
                          </FormControl>
                          <FormLabel className="flex flex-col font-normal">
                            <span className="font-semibold">
                              {shipment.awbNumber}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {shipment.origin} → {shipment.destination} (
                              {shipment.status})
                            </span>
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button type="submit" disabled={isExecuting}>
            {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Assign Run Sheet
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}
