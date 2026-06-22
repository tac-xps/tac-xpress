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
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, PlusCircle } from "lucide-react"
import { useAddPricingRuleForm } from "./use-add-pricing-rule-form"

interface AddPricingRuleFormProps {
  onSuccess: () => void
}

export function AddPricingRuleForm({ onSuccess }: AddPricingRuleFormProps) {
  const { form, isExecuting, onSubmit } = useAddPricingRuleForm(onSuccess)

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border bg-muted/20 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase">
                Route & Service
              </h3>
            </div>

            <FormField
              control={form.control as any}
              name="serviceType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Select a service type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="express_air">Express Air</SelectItem>
                      <SelectItem value="standard_ocean">
                        Standard Ocean
                      </SelectItem>
                      <SelectItem value="road_freight">Road Freight</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Imphal"
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
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Delhi"
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

        <Card className="border-border bg-muted/20 shadow-none">
          <CardContent className="space-y-6 p-6">
            <div className="mb-4 space-y-1 border-b border-border/50 pb-4">
              <h3 className="text-xs font-bold tracking-widest uppercase">
                Pricing Model
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control as any}
                name="basePrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Price (₹)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
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
                name="pricePerKg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Kg (₹)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0.00"
                        type="number"
                        step="0.01"
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
            <PlusCircle className="mr-2 h-4 w-4" />
          )}
          {isExecuting ? "Saving..." : "Add Pricing Rule"}
        </Button>
      </form>
    </Form>
  )
}
