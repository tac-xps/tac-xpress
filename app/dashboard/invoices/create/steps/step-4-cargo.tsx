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
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { UseFormReturn } from "react-hook-form"

interface Step4Props {
  form: UseFormReturn<any>
  calculations: any
}

export function Step4Cargo({ form, calculations }: Step4Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control as any}
        name="contentDescription"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>
              Content Description <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                {...field}
                placeholder="e.g. Used Mobile Phone"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="natureOfGoods"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nature of Goods</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select nature" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="garments">Garments</SelectItem>
                <SelectItem value="fragile">Fragile</SelectItem>
                <SelectItem value="medicines">Medicines</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="itemCondition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Item Condition</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="packagingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Packaging Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select packaging" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="corrugated_box">Corrugated Box</SelectItem>
                <SelectItem value="bubble_wrap">Bubble Wrap</SelectItem>
                <SelectItem value="wooden_crate">Wooden Crate</SelectItem>
                <SelectItem value="pallet">Pallet</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <p className="text-sm text-muted-foreground sm:col-span-2">
        Enter the overall packed dimensions of this consignment. Piece count
        does not multiply these dimensions. Ask operations to assess parcels
        with different measurements.
      </p>
      <div className="grid grid-cols-3 gap-4 sm:col-span-2">
        <FormField
          control={form.control as any}
          name="pieces"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pieces</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="weightKg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weight (Kg)</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  step="0.1"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="declaredValue"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Declared Value (₹)</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-3 gap-4 sm:col-span-2">
        <FormField
          control={form.control as any}
          name="dimensionsL"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Length (cm)</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="dimensionsW"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Width (cm)</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="dimensionsH"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Height (cm)</FormLabel>
              <FormControl>
                <Input
                  className="bg-background text-right tabular-nums"
                  type="number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center">
        <FormField
          control={form.control as any}
          name="isFragile"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-row items-center space-y-0 space-x-3 rounded-none border border-border/50 bg-background/50 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Fragile Items</FormLabel>
                <p className="text-micro text-muted-foreground">
                  Handle with extra care
                </p>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control as any}
          name="insuranceOptIn"
          render={({ field }) => (
            <FormItem className="flex flex-1 flex-row items-center space-y-0 space-x-3 rounded-none border border-border/50 bg-background/50 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Insurance Opt-in</FormLabel>
                <p className="text-micro text-muted-foreground">
                  Protect declared value
                </p>
              </div>
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:col-span-2">
        <Card className="border border-border/60 bg-gradient-to-br from-background to-muted/40 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold tracking-wider text-primary uppercase">
              Live Cargo Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
              <span className="text-muted-foreground">Actual Gross Weight</span>
              <span className="font-semibold">
                {form.watch("weightKg") || 0} Kg
              </span>
            </div>
            <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
              <span className="text-muted-foreground">Volumetric Weight</span>
              <span className="font-semibold">
                {calculations.volumetricWeight
                  ? calculations.volumetricWeight.toFixed(2)
                  : "0.00"}{" "}
                Kg
              </span>
            </div>
            <div className="flex justify-between border-b border-dashed border-border/40 py-1.5">
              <span className="text-muted-foreground">Total Volume</span>
              <span className="font-semibold">
                {calculations.volumeCbm
                  ? calculations.volumeCbm.toFixed(4)
                  : "0.0000"}{" "}
                CBM
              </span>
            </div>
            <div className="flex justify-between py-1.5 font-bold text-primary">
              <span>Chargeable Weight</span>
              <span className="flex items-center gap-2">
                {calculations.chargeableWeight >
                  (Number(form.watch("weightKg")) || 0) && (
                  <Badge
                    variant="outline"
                    className="h-5 border-primary/30 px-1.5 text-micro text-primary"
                  >
                    Volumetric
                  </Badge>
                )}
                {calculations.chargeableWeight
                  ? calculations.chargeableWeight.toFixed(2)
                  : "0.00"}{" "}
                Kg
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
