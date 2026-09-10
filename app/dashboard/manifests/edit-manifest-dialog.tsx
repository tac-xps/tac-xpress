"use client"
import { useAction } from "next-safe-action/hooks"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HubCombobox } from "@/components/forms/hub-combobox"
import { DriverCombobox } from "@/components/forms/driver-combobox"
import { VehicleCombobox } from "@/components/forms/vehicle-combobox"
import { updateManifestAction } from "./actions"
import { updateManifestSchema } from "./schemas"
import type { ManifestDetail } from "./manifest-detail-dialog"
export function EditManifestDialog({ manifest, open, onOpenChange }: { manifest: ManifestDetail; open: boolean; onOpenChange: (open: boolean) => void }) {
  const form = useForm<z.infer<typeof updateManifestSchema>>({ resolver: zodResolver(updateManifestSchema), defaultValues: { id: manifest.id, referenceId: manifest.referenceId, status: manifest.status, originHubId: manifest.originHubId, destinationHubId: manifest.destinationHubId, vehicleId: manifest.vehicleId, driverId: manifest.driverId } })
  const { executeAsync, isExecuting } = useAction(updateManifestAction, { onSuccess: ({ data }) => { if (data?.success) { toast.success("Manifest saved"); onOpenChange(false) } else toast.error(data?.error || "Unable to save manifest") }, onError: ({ error }) => toast.error(error.serverError || "Unable to save manifest") })
  const locked = manifest.status === "finalized"
  useEffect(() => { if (open) form.reset({ id: manifest.id, referenceId: manifest.referenceId, status: manifest.status, originHubId: manifest.originHubId, destinationHubId: manifest.destinationHubId, vehicleId: manifest.vehicleId, driverId: manifest.driverId }) }, [open, manifest, form])
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="max-h-[90svh] overflow-y-auto sm:max-w-2xl"><DialogHeader><DialogTitle>{locked ? "Finalized manifest" : "Edit manifest"}</DialogTitle><DialogDescription>{locked ? "This load has been finalized. Its route and assignments are preserved." : "Choose named hubs, a driver and a vehicle. Finalizing a manifest also records departure for its shipments."}</DialogDescription></DialogHeader><Form {...form}><form className="grid gap-5" onSubmit={form.handleSubmit(async (values) => { await executeAsync(values) })}>
    <FormField control={form.control} name="referenceId" render={({ field }) => <FormItem><FormLabel>Reference</FormLabel><FormControl><Input {...field} readOnly /></FormControl><FormMessage /></FormItem>} />
    <div className="grid gap-5 sm:grid-cols-2">
      <FormField control={form.control} name="originHubId" render={({ field }) => <FormItem><FormLabel>Origin hub</FormLabel><HubCombobox value={field.value ?? undefined} onSelect={field.onChange} disabled={locked} /><FormMessage /></FormItem>} />
      <FormField control={form.control} name="destinationHubId" render={({ field }) => <FormItem><FormLabel>Destination hub</FormLabel><HubCombobox value={field.value ?? undefined} onSelect={field.onChange} disabled={locked} /><FormMessage /></FormItem>} />
      <FormField control={form.control} name="vehicleId" render={({ field }) => <FormItem><FormLabel>Vehicle</FormLabel><VehicleCombobox value={field.value ?? undefined} onSelect={field.onChange} disabled={locked} /><FormMessage /></FormItem>} />
      <FormField control={form.control} name="driverId" render={({ field }) => <FormItem><FormLabel>Driver</FormLabel><DriverCombobox value={field.value ?? undefined} onSelect={field.onChange} disabled={locked} /><FormMessage /></FormItem>} />
    </div>
    <FormField control={form.control} name="status" render={({ field }) => <FormItem><FormLabel>Status</FormLabel><Select value={field.value} onValueChange={field.onChange} disabled={locked}><FormControl><SelectTrigger className="w-full"><SelectValue /></SelectTrigger></FormControl><SelectContent><SelectItem value="draft">Draft</SelectItem><SelectItem value="finalized">Finalize and dispatch</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
    <div className="flex justify-end gap-3"><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Close</Button>{!locked && <Button type="submit" disabled={isExecuting}>{isExecuting ? "Saving…" : form.watch("status") === "finalized" ? "Finalize and dispatch" : "Save changes"}</Button>}</div>
  </form></Form></DialogContent></Dialog>
}

