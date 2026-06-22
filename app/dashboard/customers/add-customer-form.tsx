"use client"

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
import { Loader2, UserPlus } from "lucide-react"
import { useAddCustomerForm } from "./use-add-customer-form"
import { CityCombobox } from "@/components/forms/city-combobox"
import { Card, CardContent } from "@/components/ui/card"

export function AddCustomerForm({ onSuccess }: { onSuccess?: () => void }) {
  const { form, isExecuting, onSubmit } = useAddCustomerForm(onSuccess)

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
