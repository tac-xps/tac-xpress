"use client"

import { useState } from "react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, UserPlus, CheckCircle2, XCircle } from "lucide-react"
import { useAddCustomerForm } from "./use-add-customer-form"
import { CityCombobox } from "@/components/forms/city-combobox"
import { Card, CardContent } from "@/components/ui/card"

// GSTIN format: 2-digit state code + 10-char PAN + 1-digit entity + Z + checksum
const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/

export function AddCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const { form, isExecuting, onSubmit } = useAddCustomerForm(onSuccess)
  const [gstin, setGstin] = useState("")
  const gstinValid = gstin.length === 0 ? null : GSTIN_REGEX.test(gstin)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6">
        <Card className="border-border bg-muted/20 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase">
                Contact Information
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control as any}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+91 99999 99999"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control as any}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="customer@example.com"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card className="border-border bg-muted/20 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase">
                Address Details
              </h3>
            </div>

            <FormField
              control={form.control as any}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123 Logistics Park"
                      className="bg-background"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control as any}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City (Optional)</FormLabel>
                    <FormControl>
                      <CityCombobox
                        value={field.value}
                        onSelect={(data) => {
                          field.onChange(data.city)
                          form.setValue("state", data.state)
                          form.setValue("pinCode", data.pinCode)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="State"
                        {...field}
                        readOnly
                        className="bg-muted/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control as any}
                name="pinCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="000000"
                        className="bg-background"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* GSTIN with live format validation */}
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                GSTIN{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (Optional — for GST invoice compliance)
                </span>
              </label>
              <div className="relative">
                <Input
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase().replace(/\s/g, ""))}
                  maxLength={15}
                  placeholder="22AAAAA0000A1Z5"
                  className="bg-background font-mono pr-8"
                  aria-label="GSTIN number"
                  aria-describedby="gstin-hint"
                />
                {gstinValid !== null && (
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                    {gstinValid ? (
                      <CheckCircle2 className="size-4 text-status-delivered" aria-label="Valid GSTIN format" />
                    ) : (
                      <XCircle className="size-4 text-destructive" aria-label="Invalid GSTIN format" />
                    )}
                  </span>
                )}
              </div>
              <p id="gstin-hint" className="text-xs text-muted-foreground">
                Format: 2-digit state code + 10-char PAN + 1 entity + Z + checksum
              </p>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full font-semibold shadow-md"
          size="lg"
          disabled={isExecuting}
        >
          {isExecuting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {isExecuting ? "Adding..." : "Add Customer"}
        </Button>
      </form>
    </Form>
  )
}
