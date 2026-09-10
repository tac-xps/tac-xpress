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
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CustomerCombobox } from "@/components/forms/customer-combobox"
import type { UseFormReturn } from "react-hook-form"

interface Step2Props {
  form: UseFormReturn<any>
  onQuickAdd: () => void
}

export function Step2Consignor({ form, onQuickAdd }: Step2Props) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      <FormField
        control={form.control as any}
        name="consignorName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Consignor <span className="text-destructive">*</span>
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
                        form.setValue("consignorPhone", customer.phone)
                      if (customer.email)
                        form.setValue("consignorEmail", customer.email)
                      if (customer.address)
                        form.setValue("consignorAddress", customer.address)
                      if (customer.pinCode)
                        form.setValue("consignorPinCode", customer.pinCode)
                      form.trigger([
                        "consignorPhone",
                        "consignorEmail",
                        "consignorAddress",
                        "consignorPinCode",
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
        name="consignorCompany"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Company Name</FormLabel>
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
        name="consignorPhone"
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
        name="consignorAltPhone"
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
        name="consignorEmail"
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

      <FormField
        control={form.control as any}
        name="consignorAddress"
        render={({ field }) => (
          <FormItem className="sm:col-span-2">
            <FormLabel>Address (Optional)</FormLabel>
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
        name="consignorPinCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>PIN Code (Optional)</FormLabel>
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
        name="consignorIdType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>ID Proof Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="bg-background">
                  <SelectValue placeholder="Select ID type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="aadhaar">Aadhaar</SelectItem>
                <SelectItem value="pan">PAN</SelectItem>
                <SelectItem value="passport">Passport</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {form.watch("consignorIdType") !== "none" && (
        <FormField
          control={form.control as any}
          name="consignorIdNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Number</FormLabel>
              <FormControl>
                <Input
                  className="bg-background uppercase"
                  {...field}
                  placeholder="Enter ID number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  )
}
