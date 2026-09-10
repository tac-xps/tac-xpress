"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { ReceiptText } from "lucide-react"
import { Stack } from "@/components/layout/stack"
import type { UseFormReturn } from "react-hook-form"

interface Step6Props {
  form: UseFormReturn<any>
}

export function Step6Review({ form }: Step6Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-8 space-y-4 text-center">
        <div className="mb-2 inline-flex h-20 w-20 items-center justify-center rounded-none bg-primary/10 text-primary shadow-sm">
          <ReceiptText className="h-10 w-10" />
        </div>
        <h3 className="text-3xl font-bold">Ready to Generate</h3>
        <p className="mx-auto max-w-sm text-muted-foreground">
          Review the summary on the right to ensure all details are correct
          before finalizing.
        </p>
      </div>

      <div className="w-full max-w-md border border-border/60 bg-muted/40 p-6">
        <Stack space="md">
          <FormField
            control={form.control as any}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-start space-x-4 p-4 transition-colors hover:bg-background/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer font-semibold">
                      Accept Terms &amp; Conditions
                    </FormLabel>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      I agree to the standard shipping terms and conditions of
                      service.
                    </p>
                  </div>
                </div>
                <FormMessage className="mt-2 ml-4" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control as any}
            name="prohibitedAccepted"
            render={({ field }) => (
              <FormItem className="w-full">
                <div className="flex flex-row items-start space-x-4 p-4 transition-colors hover:bg-background/50">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="mt-1"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="cursor-pointer font-semibold">
                      Prohibited Items Declaration
                    </FormLabel>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      I declare that this shipment contains no prohibited or
                      hazardous items.
                    </p>
                  </div>
                </div>
                <FormMessage className="mt-2 ml-4" />
              </FormItem>
            )}
          />
        </Stack>
      </div>
    </div>
  )
}
