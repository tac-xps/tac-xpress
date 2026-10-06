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

/** Northeast India logistics hub presets */
const NE_HUB_PRESETS = [
  { label: "Guwahati", name: "Guwahati Hub", location: "Guwahati, Assam" },
  { label: "Imphal", name: "Imphal Hub", location: "Imphal, Manipur" },
  { label: "Dimapur", name: "Dimapur Hub", location: "Dimapur, Nagaland" },
  { label: "Agartala", name: "Agartala Hub", location: "Agartala, Tripura" },
  { label: "Shillong", name: "Shillong Hub", location: "Shillong, Meghalaya" },
  { label: "Aizawl", name: "Aizawl Hub", location: "Aizawl, Mizoram" },
  { label: "Itanagar", name: "Itanagar Hub", location: "Itanagar, Arunachal Pradesh" },
] as const

interface AddHubFormProps {
  form: UseFormReturn<any>
  onSubmit: (values: any) => void
  isSubmitting: boolean
}

export function AddHubForm({ form, onSubmit, isSubmitting }: AddHubFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Northeast India quick-preset chips */}
        <div className="grid gap-1.5">
          <p className="text-xs font-medium text-muted-foreground">Quick presets — Northeast India</p>
          <div className="flex flex-wrap gap-1.5">
            {NE_HUB_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  form.setValue("name", preset.name, { shouldValidate: true })
                  form.setValue("location", preset.location, { shouldValidate: true })
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
                <Input placeholder="e.g. North Gateway" {...field} />
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
                <Input placeholder="City or Region" {...field} />
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
