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
          <FormItem className="sm:col-span-2">
            <FormLabel>
              Service Type <span className="text-destructive">*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="h-9 bg-background">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="express_air">Express Air</SelectItem>
                <SelectItem value="standard_ocean">Standard Ocean</SelectItem>
                <SelectItem value="road_freight">Road Freight</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

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
