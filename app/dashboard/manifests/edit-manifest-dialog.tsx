"use client"

import { useEffect } from "react"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { updateManifestAction } from "./actions"
import { FileText, Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { updateManifestSchema } from "./schemas"
import { z } from "zod"
import { ManifestDetail } from "./manifest-detail-dialog"

export function EditManifestDialog({
  manifest,
  open,
  onOpenChange,
}: {
  manifest: ManifestDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const form = useForm<z.infer<typeof updateManifestSchema>>({
    resolver: zodResolver(updateManifestSchema),
    defaultValues: {
      id: manifest.id,
      referenceId: manifest.referenceId,
      status: manifest.status,
      originHubId: manifest.originHubId || "",
      destinationHubId: manifest.destinationHubId || "",
      vehicleId: manifest.vehicleId || "",
      driverId: manifest.driverId || "",
    },
  })

  // Reset form when manifest changes
  useEffect(() => {
    form.reset({
      id: manifest.id,
      referenceId: manifest.referenceId,
      status: manifest.status,
      originHubId: manifest.originHubId || "",
      destinationHubId: manifest.destinationHubId || "",
      vehicleId: manifest.vehicleId || "",
      driverId: manifest.driverId || "",
    })
  }, [manifest.id, form, manifest])

  const { executeAsync, isExecuting } = useAction(updateManifestAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Manifest updated successfully")
        onOpenChange(false)
      } else {
        toast.error(data?.error || "Failed to update manifest")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  const onSubmit = async (values: z.infer<typeof updateManifestSchema>) => {
    await executeAsync({
      id: values.id,
      referenceId: values.referenceId,
      status: values.status,
      originHubId: values.originHubId || null,
      destinationHubId: values.destinationHubId || null,
      vehicleId: values.vehicleId || null,
      driverId: values.driverId || null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/20 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <FileText className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Edit Manifest
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                {manifest.id.slice(0, 8).toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column - General Info */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      General Info
                    </h3>

                    <FormField
                      control={form.control}
                      name="referenceId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Reference ID
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="MAN-12345" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Status
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="finalized">
                                Finalized
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Right Column - Logistics & Routing */}
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Logistics & Routing
                    </h3>

                    <FormField
                      control={form.control}
                      name="originHubId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Origin Hub ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="destinationHubId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Destination Hub ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vehicleId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Vehicle ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="driverId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-semibold text-muted-foreground">
                            Driver ID
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="UUID"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-border/50 bg-muted/10 p-6">
              <Button
                variant="outline"
                type="button"
                className="w-32"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isExecuting}
                className="w-40 font-semibold"
              >
                {isExecuting ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
