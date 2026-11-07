"use client"

import {
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
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CityCombobox } from "@/components/forms/city-combobox"
import { Label } from "@/components/ui/label"
import type { UseFormReturn } from "react-hook-form"

interface Step1Props {
  form: UseFormReturn<any>
  originPinQuery: string
  setOriginPinQuery: (v: string) => void
  destinationPinQuery: string
  setDestinationPinQuery: (v: string) => void
  isOriginPinLoading: boolean
  isDestinationPinLoading: boolean
  handleOriginPinLookup: () => void
  handleDestinationPinLookup: () => void
}

export function Step1ShipmentType({
  form,
  originPinQuery,
  setOriginPinQuery,
  destinationPinQuery,
  setDestinationPinQuery,
  isOriginPinLoading,
  isDestinationPinLoading,
  handleOriginPinLookup,
  handleDestinationPinLookup,
}: Step1Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control as any}
        name="serviceType"
        render={({ field }) => (
          <FormItem className="sm:col-span-1">
            <FormLabel>
              Service Type <span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 w-full max-w-sm bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="express_air">Express Air (24-48h)</SelectItem>
                <SelectItem value="road_freight">Road Freight (4-7d)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Corridor Service Telemetry & Quick Corridor Route Toggles */}
      <div className="sm:col-span-1 flex flex-col justify-end">
        <div className="flex flex-col gap-1.5 border border-border/70 bg-muted/30 p-2.5 text-xs rounded-none">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-foreground uppercase tracking-wider text-[10px] font-mono">
              Bilateral Freight Corridor
            </span>
            <span className="font-mono text-[10px] text-primary font-bold">
              DEL ⇄ IMF
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <button
              type="button"
              onClick={() => {
                form.setValue("origin", "New Delhi", { shouldValidate: true })
                form.setValue("originState", "Delhi")
                form.setValue("consignorPinCode", "110001")
                setOriginPinQuery("110001")
                form.setValue("destination", "Imphal", { shouldValidate: true })
                form.setValue("destinationState", "Manipur")
                form.setValue("consigneePinCode", "795001")
                setDestinationPinQuery("795001")
              }}
              className="flex-1 py-1 px-2 border border-border/80 bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors text-center cursor-pointer select-none"
            >
              DEL → IMF (Outbound)
            </button>
            <button
              type="button"
              onClick={() => {
                form.setValue("origin", "Imphal", { shouldValidate: true })
                form.setValue("originState", "Manipur")
                form.setValue("consignorPinCode", "795001")
                setOriginPinQuery("795001")
                form.setValue("destination", "New Delhi", { shouldValidate: true })
                form.setValue("destinationState", "Delhi")
                form.setValue("consigneePinCode", "110001")
                setDestinationPinQuery("110001")
              }}
              className="flex-1 py-1 px-2 border border-border/80 bg-background hover:bg-muted text-[11px] font-medium text-foreground transition-colors text-center cursor-pointer select-none"
            >
              IMF → DEL (Inbound)
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <FormItem>
          <Label>Origin PIN Code Search</Label>
          <div className="flex gap-2">
            <Input
              placeholder="PIN Code (e.g. 110003)"
              value={originPinQuery}
              onChange={(e) => setOriginPinQuery(e.target.value)}
              className="h-9 flex-1 bg-background"
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleOriginPinLookup}
              disabled={isOriginPinLoading || originPinQuery.length !== 6}
              variant="secondary"
              className="h-9 shrink-0 border border-border/50"
            >
              {isOriginPinLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </FormItem>
        <FormField
          control={form.control as any}
          name="origin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Origin City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <CityCombobox
                  freightOnly
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={field.value}
                  onSelect={(data) => {
                    field.onChange(data.city)
                    form.setValue("originState", data.state || "")
                    form.setValue("consignorPinCode", data.pinCode || "")
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-4">
        <FormItem>
          <Label>Destination PIN Code Search</Label>
          <div className="flex gap-2">
            <Input
              placeholder="PIN Code (e.g. 795001)"
              value={destinationPinQuery}
              onChange={(e) => setDestinationPinQuery(e.target.value)}
              className="h-9 flex-1 bg-background"
              maxLength={6}
            />
            <Button
              type="button"
              onClick={handleDestinationPinLookup}
              disabled={
                isDestinationPinLoading || destinationPinQuery.length !== 6
              }
              variant="secondary"
              className="h-9 shrink-0 border border-border/50"
            >
              {isDestinationPinLoading ? "Searching..." : "Search"}
            </Button>
          </div>
        </FormItem>
        <FormField
          control={form.control as any}
          name="destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Destination City <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <CityCombobox
                  freightOnly
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  value={field.value}
                  onSelect={(data) => {
                    field.onChange(data.city)
                    form.setValue("destinationState", data.state || "")
                    form.setValue("consigneePinCode", data.pinCode || "")
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
