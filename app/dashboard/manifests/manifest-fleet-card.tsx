"use client"

import { useState, useMemo, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
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
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Truck,
  UserCheck,
  UserPlus,
  Edit2,
  Send,
  AlertCircle,
  Phone,
} from "lucide-react"
import { toast } from "sonner"
import { useWatch, type UseFormReturn } from "react-hook-form"
import type { CreateManifestValues } from "./validations"
import type { ManifestVehicleOption } from "./manifest-telemetry-card"
import { DriverFormDialog } from "./driver-form-dialog"
import { directDriverWhatsAppAction } from "@/app/dashboard/dispatch/whatsapp-actions"

export interface ManifestDriverOption {
  id: string
  label: string
  phone?: string | null
  licenseNumber?: string | null
}

interface ManifestFleetCardProps {
  form: UseFormReturn<CreateManifestValues>
  vehicles: ManifestVehicleOption[]
  drivers: ManifestDriverOption[]
}

export function ManifestFleetCard({
  form,
  vehicles,
  drivers,
}: ManifestFleetCardProps) {
  const [localDrivers, setLocalDrivers] = useState<ManifestDriverOption[]>([])
  const [isDriverDialogOpen, setIsDriverDialogOpen] = useState(false)
  const [driverDialogMode, setDriverDialogMode] = useState<"create" | "edit">("create")
  const [isPingingDriver, startPingTransition] = useTransition()

  const driverList = useMemo(() => {
    if (localDrivers.length === 0) return drivers
    const map = new Map(drivers.map((d) => [d.id, d]))
    for (const d of localDrivers) {
      map.set(d.id, d)
    }
    return Array.from(map.values())
  }, [drivers, localDrivers])

  const selectedVehicleId = useWatch({ control: form.control, name: "vehicleId" })
  const selectedDriverId = useWatch({ control: form.control, name: "driverId" })

  const selectedVehicle = vehicles.find((v) => v.id === selectedVehicleId)
  const selectedDriver = driverList.find((d) => d.id === selectedDriverId)

  const handleVehicleChange = (
    vehicleId: string,
    fieldChange: (val: string) => void
  ) => {
    fieldChange(vehicleId)

    const matchedVeh = vehicles.find((v) => v.id === vehicleId)
    if (matchedVeh?.driverId && !form.getValues("driverId")) {
      const designatedDriver = driverList.find((d) => d.id === matchedVeh.driverId)
      if (designatedDriver) {
        form.setValue("driverId", designatedDriver.id, {
          shouldValidate: true,
          shouldDirty: true,
        })
        toast.info(
          `Auto-assigned primary driver ${designatedDriver.label} for ${matchedVeh.label}`
        )
      }
    }
  }

  const handleCreateDriver = () => {
    setDriverDialogMode("create")
    setIsDriverDialogOpen(true)
  }

  const handleEditDriver = () => {
    if (!selectedDriver) return
    setDriverDialogMode("edit")
    setIsDriverDialogOpen(true)
  }

  const handleDriverSuccess = (newOrUpdated: ManifestDriverOption) => {
    setLocalDrivers((prev) => {
      const filtered = prev.filter((d) => d.id !== newOrUpdated.id)
      return [...filtered, newOrUpdated]
    })
    form.setValue("driverId", newOrUpdated.id, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  const handlePingDriver = () => {
    if (!selectedDriver?.id || !selectedDriver.phone) {
      toast.error("Driver does not have a contact phone number.")
      return
    }
    startPingTransition(async () => {
      const msg = `TAC-XPRESS Dispatch Notice: Hello ${selectedDriver.label}, you are assigned to an active route loading. Please verify your vehicle and stand by for the consolidated digital manifest.`
      const res = await directDriverWhatsAppAction(selectedDriver.id, msg)
      if (res.success) {
        toast.success(`WhatsApp route ping sent to ${selectedDriver.label}`)
      } else {
        toast.error(res.error || "Failed to dispatch WhatsApp message")
      }
    })
  }

  return (
    <>
      <Card className="shrink-0 border-border bg-card shadow-xs rounded-none">
        <CardHeader className="border-b bg-muted/40 py-2.5 px-3.5 sm:px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-foreground uppercase">
              <Truck className="size-4 text-primary shrink-0" />
              Fleet &amp; Crew Assignment
            </CardTitle>
            {selectedVehicle && (
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase">
                Cap: {selectedVehicle.capacityKg?.toLocaleString("en-IN") || 0} kg
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-3.5 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* Vehicle Selector */}
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex h-5 items-center justify-between">
                    <FormLabel className="text-xs font-semibold text-foreground whitespace-nowrap leading-none">
                      Transport Vehicle
                    </FormLabel>
                  </div>
                  <Select
                    value={field.value || undefined}
                    onValueChange={(val) => handleVehicleChange(val, field.onChange)}
                    disabled={vehicles.length === 0}
                  >
                    <SelectTrigger className="w-full bg-background rounded-none h-9 text-xs">
                      <SelectValue
                        placeholder={
                          vehicles.length === 0
                            ? "No vehicles available"
                            : "Select active vehicle"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {vehicles.length === 0 ? (
                        <SelectItem value="empty-vehicle" disabled className="text-xs text-muted-foreground">
                          No active vehicles found
                        </SelectItem>
                      ) : (
                        vehicles.map((veh) => (
                          <SelectItem
                            key={veh.id}
                            value={veh.id}
                            className="rounded-none text-xs font-mono"
                          >
                            {veh.label}
                            {veh.capacityKg
                              ? ` (${veh.capacityKg.toLocaleString("en-IN")} kg cap)`
                              : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />

            {/* Driver Selector with Add & Edit Actions */}
            <FormField
              control={form.control}
              name="driverId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <div className="flex h-5 items-center justify-between">
                    <FormLabel className="text-xs font-semibold text-foreground whitespace-nowrap leading-none">
                      Assigned Driver
                    </FormLabel>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCreateDriver}
                      className="h-5 px-1.5 text-[10px] text-primary hover:text-primary/80 font-medium shrink-0"
                    >
                      <UserPlus className="size-2.5 mr-1" />
                      + Add Driver
                    </Button>
                  </div>
                  <Select
                    value={field.value || undefined}
                    onValueChange={field.onChange}
                    disabled={driverList.length === 0}
                  >
                    <SelectTrigger className="w-full bg-background rounded-none h-9 text-xs">
                      <SelectValue
                        placeholder={
                          driverList.length === 0
                            ? "No drivers available"
                            : "Select active driver"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="rounded-none">
                      {driverList.length === 0 ? (
                        <SelectItem value="empty-driver" disabled className="text-xs text-muted-foreground">
                          No active drivers found
                        </SelectItem>
                      ) : (
                        driverList.map((drv) => (
                          <SelectItem
                            key={drv.id}
                            value={drv.id}
                            className="rounded-none text-xs font-mono"
                          >
                            {drv.label}
                            {drv.phone ? ` (${drv.phone})` : ""}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-[10px]" />
                </FormItem>
              )}
            />
          </div>

          {/* Driver Contact & WhatsApp Readiness Bar */}
          {selectedDriver && (
            <>
              {selectedDriver.phone ? (
                <div className="border border-border/80 bg-muted/20 p-2 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <UserCheck className="size-3.5 text-primary shrink-0" />
                      <span className="font-mono text-[11px] font-bold text-foreground truncate">
                        {selectedDriver.label}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate">
                        • {selectedDriver.phone}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleEditDriver}
                        className="h-5 px-1.5 text-[10px] font-mono text-muted-foreground hover:text-foreground shrink-0"
                        title="Edit driver phone or details"
                      >
                        <Edit2 className="size-2.5 mr-1" />
                        Edit
                      </Button>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isPingingDriver}
                      onClick={handlePingDriver}
                      className="h-6 px-2 text-[10px] font-mono font-semibold text-status-delivered hover:text-status-delivered/80 border-status-delivered/30 hover:border-status-delivered rounded-none shrink-0"
                    >
                      <Send className="size-2.5 mr-1" />
                      {isPingingDriver ? "Pinging..." : "WhatsApp Ping"}
                    </Button>
                  </div>

                  <FormField
                    control={form.control}
                    name="sendWhatsAppNotification"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0 pt-1.5 border-t border-border/40">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="rounded-none size-3.5"
                        />
                        <FormLabel className="text-[11px] text-muted-foreground cursor-pointer font-normal">
                          Auto-dispatch WhatsApp route notice upon manifest creation
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="border border-status-pending/30 bg-status-pending-wash p-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-status-pending">
                    <AlertCircle className="size-3.5 shrink-0" />
                    <span className="text-[11px]">
                      No phone on file for {selectedDriver.label}. WhatsApp dispatch disabled.
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleEditDriver}
                    className="h-6 px-2 text-[10px] border-status-pending/40 text-status-pending hover:bg-status-pending-wash rounded-none"
                  >
                    <Phone className="size-2.5 mr-1" />
                    Add Phone
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <DriverFormDialog
        open={isDriverDialogOpen}
        onOpenChange={setIsDriverDialogOpen}
        mode={driverDialogMode}
        driver={selectedDriver}
        onSuccess={handleDriverSuccess}
      />
    </>
  )
}
