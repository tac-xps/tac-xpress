"use client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTrackingEventForm } from "./use-tracking-event-form"
export function AddTrackingEventForm({ shipmentId, onSuccess }: { shipmentId: string; onSuccess: () => void }) {
  const { form, status, onSubmit } = useTrackingEventForm(shipmentId, onSuccess)
  return <Form {...form}><form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5">
    <FormField control={form.control} name="status" render={({ field }) => <FormItem><FormLabel>Shipment status</FormLabel><Select value={field.value ?? ""} onValueChange={field.onChange}><FormControl><SelectTrigger className="w-full"><SelectValue placeholder="Choose a status" /></SelectTrigger></FormControl><SelectContent><SelectItem value="pending">Pending</SelectItem><SelectItem value="in-transit">In transit</SelectItem><SelectItem value="delivered">Delivered</SelectItem></SelectContent></Select><FormMessage /></FormItem>} />
    <FormField control={form.control} name="location" render={({ field }) => <FormItem><FormLabel>Recorded location</FormLabel><FormControl><Input {...field} placeholder="Hub, facility or handover location" /></FormControl><FormMessage /></FormItem>} />
    <FormField control={form.control} name="description" render={({ field }) => <FormItem><FormLabel>Event description</FormLabel><FormControl><Textarea {...field} value={field.value ?? ""} rows={4} placeholder="Describe what happened to the shipment" /></FormControl><p className="text-xs text-muted-foreground">Use clear shipment information. Do not include private contact or payment details.</p><FormMessage /></FormItem>} />
    <FormField control={form.control} name="isPublic" render={({ field }) => <FormItem className="flex items-center gap-3"><FormControl><Checkbox checked={field.value ?? false} onCheckedChange={(value) => field.onChange(value === true)} /></FormControl><FormLabel>Publish this event on public shipment tracking</FormLabel><FormMessage /></FormItem>} />
    <Button type="submit" disabled={status === "executing"}>{status === "executing" ? "Saving event…" : "Save tracking event"}</Button>
  </form></Form>
}

