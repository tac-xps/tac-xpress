"use client"

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import type { UseFormReturn } from "react-hook-form"

interface Step3Props {
  form: UseFormReturn<any>
  onQuickAdd: () => void
}

export function Step3Consignee({ form, onQuickAdd }: Step3Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control as any}
        name="consigneeName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Consignee <span className="text-destructive">*</span>
            </FormLabel>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <FormControl>
                  <CustomerCombobox
                    value={field.value}
                    onSelect={(customer) => {
                      field.onChange(
                        customer.name || customer.email || customer.id
                      )
                      if (customer.phone)
                        form.setValue("consigneePhone", customer.phone)
                      if (customer.email)
                        form.setValue("consigneeEmail", customer.email)
                      if (customer.address)
                        form.setValue("consigneeAddress", customer.address)
                      if (customer.pinCode)
                        form.setValue("consigneePinCode", customer.pinCode)
                      form.trigger([
                        "consigneePhone",
                        "consigneeEmail",
                        "consigneeAddress",
                        "consigneePinCode",
                      ])
                    }}
                  />
                </FormControl>
              </div>
              <Button
                type="button"
                variant="outline"
                className="h-9 shrink-0 border-dashed border-primary/40 text-xs font-semibold text-primary hover:bg-primary/5"
                onClick={onQuickAdd}
              >
                + Quick Add
              </Button>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="consigneePhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Phone <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                {...field}
                placeholder="10-digit number"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="consigneeAltPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alt Phone</FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                {...field}
                placeholder="Optional"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="consigneeAddress"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>
              Address <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                className="h-24 resize-none bg-background"
                {...field}
                placeholder="Full Address"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="consigneePinCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              PIN Code <span className="text-destructive">*</span>
            </FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                {...field}
                placeholder="6 digits"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control as any}
        name="consigneeEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                className="bg-background"
                {...field}
                type="email"
                placeholder="Optional"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
