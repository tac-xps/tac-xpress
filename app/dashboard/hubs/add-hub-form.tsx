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
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"
import type { CreateHubValues } from "./validations"

/** Corridor logistics hub presets for New Delhi and Imphal */
const CORRIDOR_HUB_PRESETS = [
  { label: "Delhi IGI Gateway", name: "IGI Cargo Terminal Gate 4", location: "New Delhi (IGI T4)", type: "transit_center" as const },
  { label: "Delhi Central Hub", name: "Central Delhi Sorting Center", location: "New Delhi (Central)", type: "warehouse" as const },
  { label: "Delhi South Hub", name: "Okhla Freight Terminal", location: "New Delhi (South)", type: "branch" as const },
  { label: "Imphal Tulihal Apron", name: "Tulihal Cargo Apron", location: "Imphal (Tulihal)", type: "transit_center" as const },
  { label: "Imphal West Hub", name: "Imphal West Logistics Center", location: "Imphal (West)", type: "warehouse" as const },
  { label: "Imphal Central Hub", name: "Thangal Bazar Sorting Hub", location: "Imphal (Central)", type: "branch" as const },
] as const

interface AddHubFormProps {
  form: UseFormReturn<CreateHubValues>
  onSubmit: (values: CreateHubValues) => void
  isSubmitting: boolean
}

export function AddHubForm({ form, onSubmit, isSubmitting }: AddHubFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Bilateral corridor quick-preset chips */}
        <div className="grid gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">Corridor presets: DEL ⇄ IMF</p>
          <div className="flex flex-wrap gap-1.5">
            {CORRIDOR_HUB_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  form.setValue("name", preset.name, { shouldValidate: true })
                  form.setValue("location", preset.location, { shouldValidate: true })
                  form.setValue("type", preset.type, { shouldValidate: true })
                }}
                className="rounded-none border border-border/60 bg-muted/40 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hub Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. IGI Cargo Gateway Gate 4" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="New Delhi or Imphal" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value ?? ""}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="branch">Branch</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="transit_center">Transit Center</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info</FormLabel>
              <FormControl>
                <Input placeholder="Phone or Email (Optional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Hub
          </Button>
        </div>
      </form>
    </Form>
  )
}
