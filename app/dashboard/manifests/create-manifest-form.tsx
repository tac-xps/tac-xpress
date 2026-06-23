"use client"

import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, PackagePlus, ScanBarcode, Package } from "lucide-react"
import { useCreateManifestForm } from "./use-create-manifest-form"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/kibo-ui/dropzone"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface CreateManifestFormProps {
  shipments: {
    id: string
    awbNumber: string
    destination: string
  }[]
  hubs: { id: string; label: string }[]
  vehicles: { id: string; label: string }[]
  drivers: { id: string; label: string }[]
  onSuccess: () => void
}

export function CreateManifestForm({
  shipments,
  hubs,
  vehicles,
  drivers,
  onSuccess,
}: CreateManifestFormProps) {
  const {
    form,
    status,
    onSubmit,
    scanInput,
    setScanInput,
    currentPage,
    setCurrentPage,
    handleScanKeyDown,
    selectedCount,
    totalPages,
    paginatedShipments,
  } = useCreateManifestForm(shipments, onSuccess)

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col space-y-6 p-6"
      >
        <div className="grid min-h-0 flex-1 gap-6 lg:grid-cols-2">
          {/* Left Column: Details & Assets */}
          <div className="flex flex-col space-y-6">
            <Card className="border-border bg-muted/10 shadow-none">
              <CardContent className="space-y-6 p-6">
                <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
                  <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                    Manifest Details
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Enter the primary reference identifier for this manifest.
                  </p>
                </div>

                <div className="border border-border bg-background p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Reference ID
                  </p>
                  <p className="mt-1 font-mono text-sm font-semibold">
                    Generated securely on creation
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ManifestSelect
                    form={form}
                    name="originHubId"
                    label="Origin hub"
                    placeholder="Select origin hub"
                    options={hubs}
                  />
                  <ManifestSelect
                    form={form}
                    name="destinationHubId"
                    label="Destination hub"
                    placeholder="Select destination hub"
                    options={hubs}
                  />
                  <ManifestSelect
                    form={form}
                    name="vehicleId"
                    label="Vehicle"
                    placeholder="Select active vehicle"
                    options={vehicles}
                  />
                  <ManifestSelect
                    form={form}
                    name="driverId"
                    label="Driver"
                    placeholder="Select active driver"
                    options={drivers}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="flex-1 border-border bg-muted/10 shadow-none">
              <CardContent className="p-6">
                <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
                  <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                    Attachments
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload consolidated documentation (Airway bills, load
                    sheets).
                  </p>
                </div>
                <Dropzone
                  accept={{
                    "application/pdf": [".pdf"],
                    "image/*": [".png", ".jpg", ".jpeg"],
                  }}
                  maxFiles={3}
                  onDrop={(files) => console.log(files)}
                >
                  <DropzoneEmptyState />
                  <DropzoneContent />
                </Dropzone>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Operations & Selection */}
          <div className="flex h-full min-h-0 flex-col">
            <Card className="flex h-full min-h-0 flex-col border-border bg-muted/10 shadow-none">
              <CardContent className="flex h-full min-h-0 flex-col p-6">
                <FormField
                  control={form.control}
                  name="shipmentIds"
                  render={() => (
                    <FormItem className="flex h-full min-h-0 flex-col">
                      <div className="mb-4 shrink-0 space-y-4 border-b border-border/50 pb-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold tracking-widest text-foreground uppercase">
                            Shipments Selection
                          </h3>
                          <Badge
                            variant={
                              selectedCount > 0 ? "default" : "secondary"
                            }
                            className="tabular-nums"
                          >
                            {selectedCount} / {shipments.length} Selected
                          </Badge>
                        </div>

                        <div className="relative">
                          <ScanBarcode className="absolute top-3 left-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Scan AWB Barcode or type and press Enter..."
                            className="h-10 border-primary/20 bg-background pl-9 font-mono text-sm focus-visible:border-primary"
                            value={scanInput}
                            onChange={(e) => setScanInput(e.target.value)}
                            onKeyDown={handleScanKeyDown}
                          />
                        </div>
                      </div>

                      <div className="flex min-h-0 flex-1 flex-col space-y-4">
                        <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                          {paginatedShipments.length === 0 ? (
                            <div className="flex h-full min-h-[120px] items-center justify-center border-2 border-dashed border-border text-sm text-muted-foreground">
                              No pending shipments available.
                            </div>
                          ) : (
                            paginatedShipments.map((shipment) => (
                              <FormField
                                key={shipment.id}
                                control={form.control}
                                name="shipmentIds"
                                render={({ field }) => {
                                  const isChecked = field.value?.includes(
                                    shipment.id
                                  )
                                  return (
                                    <FormItem
                                      key={shipment.id}
                                      className={`group flex cursor-pointer flex-row items-center space-y-0 space-x-3 border p-3 transition-all select-none ${
                                        isChecked
                                          ? "border-primary bg-primary/5 shadow-sm"
                                          : "border-border bg-background hover:border-primary/30 hover:bg-muted/50"
                                      }`}
                                    >
                                      <FormControl>
                                        <Checkbox
                                          className={
                                            isChecked
                                              ? "border-primary"
                                              : "border-muted-foreground/50"
                                          }
                                          checked={isChecked}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  shipment.id,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) =>
                                                      value !== shipment.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <div className="flex w-full flex-1 items-center justify-between">
                                        <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2">
                                            <Package
                                              className={`h-3.5 w-3.5 ${isChecked ? "text-primary" : "text-muted-foreground"}`}
                                            />
                                            <FormLabel
                                              className={`cursor-pointer font-mono text-sm font-bold tracking-tight ${isChecked ? "text-primary" : "text-foreground"}`}
                                            >
                                              {shipment.awbNumber}
                                            </FormLabel>
                                          </div>
                                          <span className="font-mono text-[10px] text-muted-foreground uppercase">
                                            ID: {shipment.id.substring(0, 8)}
                                          </span>
                                        </div>

                                        <Badge
                                          variant={
                                            isChecked ? "default" : "secondary"
                                          }
                                          className="bg-opacity-80 text-[10px] tracking-wider uppercase"
                                        >
                                          {shipment.destination}
                                        </Badge>
                                      </div>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))
                          )}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex shrink-0 items-center justify-between border-t border-border/50 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((p) => Math.max(1, p - 1))
                              }
                              disabled={currentPage === 1}
                              type="button"
                            >
                              Previous
                            </Button>
                            <span className="text-sm text-muted-foreground tabular-nums">
                              Page {currentPage} of {totalPages}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setCurrentPage((p) =>
                                  Math.min(totalPages, p + 1)
                                )
                              }
                              disabled={currentPage >= totalPages}
                              type="button"
                            >
                              Next
                            </Button>
                          </div>
                        )}
                      </div>
                      <FormMessage className="mt-2 shrink-0" />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t border-border/50 pt-4">
          <Button
            type="submit"
            size="lg"
            className="w-full px-8 font-semibold shadow-md sm:w-auto"
            disabled={status === "executing"}
          >
            {status === "executing" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PackagePlus className="mr-2 h-4 w-4" />
            )}
            {status === "executing"
              ? "Creating Manifest..."
              : "Create Manifest"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  )
}

function ManifestSelect({
  form,
  name,
  label,
  placeholder,
  options,
}: {
  form: ReturnType<typeof useCreateManifestForm>["form"]
  name: "originHubId" | "destinationHubId" | "vehicleId" | "driverId"
  label: string
  placeholder: string
  options: { id: string; label: string }[]
}) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select value={field.value} onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger className="w-full bg-background">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
