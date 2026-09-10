"use client"

import { useState } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { UseFormReturn } from "react-hook-form"

interface Step5Props {
  form: UseFormReturn<any>
}

export function Step5Charges({ form }: Step5Props) {
  const [chargesOpen, setChargesOpen] = useState(false)

  return (
    <div className="grid gap-6">
      <Card className="border border-border/60 bg-muted/30 shadow-none">
        <CardHeader className="pt-6 pb-4">
          <CardTitle className="text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Charges Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <FormField
              control={form.control as any}
              name="freightRatePerKg"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>Freight Rate (per kg)</FormLabel>
                  <div className="relative flex flex-col gap-2">
                    <FormControl>
                      <Input
                        className="bg-background text-right tabular-nums"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <p className="text-micro text-muted-foreground">
                      Auto-calculates Freight Charge
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="freightCharge"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>Freight Charge</FormLabel>
                  <div className="relative flex flex-col gap-2">
                    <FormControl>
                      <Input
                        className="bg-background text-right tabular-nums"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <p className="invisible text-micro text-muted-foreground">
                      Spacer
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name="pickupCharge"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-1.5">
                  <FormLabel>Pickup Charge</FormLabel>
                  <div className="relative flex flex-col gap-2">
                    <FormControl>
                      <Input
                        className="bg-background text-right tabular-nums"
                        type="number"
                        {...field}
                      />
                    </FormControl>
                    <p className="invisible text-micro text-muted-foreground">
                      Spacer
                    </p>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Collapsible
            open={chargesOpen}
            onOpenChange={setChargesOpen}
            className="mt-4 overflow-hidden border border-border/60 bg-background"
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between p-4 font-semibold transition-colors hover:bg-muted/50">
              <span className="text-sm">Additional Charges</span>
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  chargesOpen && "rotate-180"
                )}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="grid gap-4 border-t border-border/40 bg-muted/10 p-4 pt-0 sm:grid-cols-2">
              <FormField
                control={form.control as any}
                name="packingCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packing Charge</FormLabel>
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
                name="docketCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Docket Charge</FormLabel>
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
                name="insuranceCharge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Charge</FormLabel>
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
                name="otherCharges"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Other Charges</FormLabel>
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
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        <FormField
          control={form.control as any}
          name="gstRate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GST Rate (%)</FormLabel>
              <Select
                onValueChange={(val) => field.onChange(Number(val))}
                value={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger className="bg-background tabular-nums">
                    <SelectValue placeholder="Select GST" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">0%</SelectItem>
                  <SelectItem value="5">5%</SelectItem>
                  <SelectItem value="12">12%</SelectItem>
                  <SelectItem value="18">18%</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="paymentMode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Mode</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="credit">Credit (B2B)</SelectItem>
                  <SelectItem value="to_pay">To Pay (COD)</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control as any}
          name="advancePaid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Advance Paid (₹)</FormLabel>
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
    </div>
  )
}
