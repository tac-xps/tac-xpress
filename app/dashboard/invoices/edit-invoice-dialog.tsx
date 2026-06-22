"use client"

import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useAction } from "next-safe-action/hooks"
import { toast } from "sonner"
import { Loader2, ReceiptText } from "lucide-react"
import { updateFullInvoiceAction } from "./actions"
import { cn } from "@/lib/utils"

// ─── Schema ──────────────────────────────────────────────────────────────────

const editInvoiceSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["unpaid", "paid"]),
  paymentMode: z.enum(["cash", "upi", "card", "wallet", "credit", "to_pay"]),
  freightCharge: z.number().min(0),
  pickupCharge: z.number().min(0),
  packingCharge: z.number().min(0),
  docketCharge: z.number().min(0),
  insuranceCharge: z.number().min(0),
  otherCharges: z.number().min(0),
  gstRate: z.number().min(0).max(28),
  advancePaid: z.number().min(0),
  remarks: z.string().optional(),
  shipmentId: z.string().uuid().optional(),
  consignorName: z.string().optional(),
  consignorPhone: z.string().optional(),
  consigneeName: z.string().optional(),
  consigneePhone: z.string().optional(),
})

type EditInvoiceValues = z.infer<typeof editInvoiceSchema>

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fromPaise(v: number | null | undefined) {
  return (v ?? 0) / 100
}
function toPaise(v: number) {
  return Math.round(v * 100)
}

// ─── Component ───────────────────────────────────────────────────────────────

export type InvoiceForEdit = {
  id: string
  status: string
  paymentMode?: string | null
  freightCharge?: number | null
  pickupCharge?: number | null
  packingCharge?: number | null
  docketCharge?: number | null
  insuranceCharge?: number | null
  otherCharges?: number | null
  gstRate?: number | null
  advancePaid?: number | null
  remarks?: string | null
  amount?: number | null
  shipmentId?: string | null
  shipment?: {
    id?: string | null
    consignorName?: string | null
    consignorPhone?: string | null
    consigneeName?: string | null
    consigneePhone?: string | null
  } | null
}

interface EditInvoiceDialogProps {
  invoice: InvoiceForEdit
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditInvoiceDialog({
  invoice,
  open,
  onOpenChange,
}: EditInvoiceDialogProps) {
  const form = useForm<EditInvoiceValues>({
    resolver: zodResolver(editInvoiceSchema),
    defaultValues: {
      id: invoice.id,
      status: (invoice.status as "unpaid" | "paid") || "unpaid",
      paymentMode: (invoice.paymentMode as any) || "cash",
      freightCharge: fromPaise(invoice.freightCharge),
      pickupCharge: fromPaise(invoice.pickupCharge),
      packingCharge: fromPaise(invoice.packingCharge),
      docketCharge: fromPaise(invoice.docketCharge),
      insuranceCharge: fromPaise(invoice.insuranceCharge),
      otherCharges: fromPaise(invoice.otherCharges),
      gstRate: invoice.gstRate ?? 0,
      advancePaid: fromPaise(invoice.advancePaid),
      remarks: invoice.remarks ?? "",
      shipmentId: invoice.shipment?.id ?? invoice.shipmentId ?? undefined,
      consignorName: invoice.shipment?.consignorName ?? "",
      consignorPhone: invoice.shipment?.consignorPhone ?? "",
      consigneeName: invoice.shipment?.consigneeName ?? "",
      consigneePhone: invoice.shipment?.consigneePhone ?? "",
    },
  })

  // Reset form when invoice changes
  useEffect(() => {
    form.reset({
      id: invoice.id,
      status: (invoice.status as "unpaid" | "paid") || "unpaid",
      paymentMode: (invoice.paymentMode as any) || "cash",
      freightCharge: fromPaise(invoice.freightCharge),
      pickupCharge: fromPaise(invoice.pickupCharge),
      packingCharge: fromPaise(invoice.packingCharge),
      docketCharge: fromPaise(invoice.docketCharge),
      insuranceCharge: fromPaise(invoice.insuranceCharge),
      otherCharges: fromPaise(invoice.otherCharges),
      gstRate: invoice.gstRate ?? 0,
      advancePaid: fromPaise(invoice.advancePaid),
      remarks: invoice.remarks ?? "",
      shipmentId: invoice.shipment?.id ?? invoice.shipmentId ?? undefined,
      consignorName: invoice.shipment?.consignorName ?? "",
      consignorPhone: invoice.shipment?.consignorPhone ?? "",
      consigneeName: invoice.shipment?.consigneeName ?? "",
      consigneePhone: invoice.shipment?.consigneePhone ?? "",
    })
  }, [
    invoice.id,
    invoice.status,
    invoice.paymentMode,
    invoice.freightCharge,
    invoice.pickupCharge,
    invoice.packingCharge,
    invoice.docketCharge,
    invoice.insuranceCharge,
    invoice.otherCharges,
    invoice.gstRate,
    invoice.advancePaid,
    invoice.remarks,
    invoice.shipmentId,
    invoice.shipment?.id,
    invoice.shipment?.consignorName,
    invoice.shipment?.consignorPhone,
    invoice.shipment?.consigneeName,
    invoice.shipment?.consigneePhone,
  ])

  // Live calculations
  const watched = form.watch()
  const subtotal =
    (watched.freightCharge || 0) +
    (watched.pickupCharge || 0) +
    (watched.packingCharge || 0) +
    (watched.insuranceCharge || 0) +
    (watched.otherCharges || 0)
  const gstAmount = (subtotal * (watched.gstRate || 0)) / 100
  const totalAmount = subtotal + gstAmount
  const balanceDue = totalAmount - (watched.advancePaid || 0)

  const { executeAsync, isExecuting } = useAction(updateFullInvoiceAction, {
    onSuccess: ({ data }) => {
      if (data?.success) {
        toast.success("Invoice updated successfully")
        onOpenChange(false)
      } else {
        toast.error((data as any)?.error || "Failed to update invoice")
      }
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  const onSubmit = async (values: EditInvoiceValues) => {
    const subtotalPaise = toPaise(subtotal)
    const gstPaise = toPaise(gstAmount)
    const totalPaise = toPaise(totalAmount)
    const balancePaise = toPaise(balanceDue)
    const finalStatus = balancePaise <= 0 ? "paid" : values.status

    await executeAsync({
      id: values.id,
      status: finalStatus as "unpaid" | "paid",
      paymentMode: values.paymentMode,
      freightCharge: toPaise(values.freightCharge),
      pickupCharge: toPaise(values.pickupCharge),
      packingCharge: toPaise(values.packingCharge),
      docketCharge: toPaise(values.docketCharge),
      insuranceCharge: toPaise(values.insuranceCharge),
      otherCharges: toPaise(values.otherCharges),
      subtotal: subtotalPaise,
      gstRate: values.gstRate,
      cgst: Math.round(gstPaise / 2),
      sgst: Math.round(gstPaise / 2),
      amount: totalPaise,
      advancePaid: toPaise(values.advancePaid),
      balanceDue: balancePaise,
      remarks: values.remarks,
      shipmentId: values.shipmentId,
      consignorName: values.consignorName,
      consignorPhone: values.consignorPhone,
      consigneeName: values.consigneeName,
      consigneePhone: values.consigneePhone,
    })
  }

  const ChargeField = ({
    name,
    label,
    readOnly = false,
  }: {
    name: keyof EditInvoiceValues
    label: string
    readOnly?: boolean
  }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-xs font-semibold text-muted-foreground">
            {label}
          </FormLabel>
          <FormControl>
            <div className="relative">
              <span className="absolute top-2.5 left-3 text-sm text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                min="0"
                step="0.01"
                className={cn(
                  "pl-7 text-right tabular-nums",
                  readOnly &&
                    "cursor-not-allowed bg-muted text-muted-foreground"
                )}
                readOnly={readOnly}
                {...field}
                onChange={(e) =>
                  field.onChange(parseFloat(e.target.value) || 0)
                }
                value={field.value as number}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[90vw] max-w-4xl flex-col gap-0 overflow-hidden p-0 sm:rounded-xl">
        <DialogHeader className="shrink-0 border-b border-border/50 bg-muted/20 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <ReceiptText className="size-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Edit Invoice
              </DialogTitle>
              <DialogDescription className="font-mono text-xs text-muted-foreground">
                {invoice.id.slice(0, 8).toUpperCase()}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                  {watched.shipmentId ? (
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                        Parties Info
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="consignorName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-muted-foreground">
                                Shipper Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consignorPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-muted-foreground">
                                Shipper Phone
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consigneeName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-muted-foreground">
                                Receiver Name
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="consigneePhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-semibold text-muted-foreground">
                                Receiver Phone
                              </FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md bg-status-pending/10 p-4 text-sm text-status-pending">
                      No shipment associated with this invoice. Parties info
                      cannot be updated.
                    </div>
                  )}

                  <Separator />

                  {/* Payment Info */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Payment Info
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-muted-foreground">
                              Status
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="unpaid">Unpaid</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="paymentMode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-muted-foreground">
                              Payment Mode
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="upi">UPI</SelectItem>
                                <SelectItem value="card">Card</SelectItem>
                                <SelectItem value="wallet">Wallet</SelectItem>
                                <SelectItem value="credit">
                                  Credit (B2B)
                                </SelectItem>
                                <SelectItem value="to_pay">
                                  To Pay (COD)
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Tax & Settlement */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Tax & Settlement
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gstRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-semibold text-muted-foreground">
                              GST Rate (%)
                            </FormLabel>
                            <Select
                              onValueChange={(v) => field.onChange(Number(v))}
                              value={String(field.value)}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
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
                      <ChargeField name="advancePaid" label="Advance Paid" />
                    </div>
                  </div>

                  {/* Remarks */}
                  <FormField
                    control={form.control}
                    name="remarks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-semibold text-muted-foreground">
                          Remarks (Optional)
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="h-24 resize-none bg-background"
                            placeholder="Add any notes..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Charges Breakdown */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Charges Breakdown
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <ChargeField
                        name="freightCharge"
                        label="Freight Charge"
                      />
                      <ChargeField name="pickupCharge" label="Pickup Charge" />
                      <ChargeField
                        name="packingCharge"
                        label="Packing Charge"
                      />
                      <ChargeField
                        name="docketCharge"
                        label="Docket Charge"
                        readOnly
                      />
                      <ChargeField
                        name="insuranceCharge"
                        label="Insurance Charge"
                      />
                      <ChargeField name="otherCharges" label="Other Charges" />
                    </div>
                  </div>

                  {/* Live Summary */}
                  <div className="mt-6 space-y-3 rounded-lg border border-border/50 bg-muted/30 p-5">
                    <h3 className="mb-3 text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Live Summary
                    </h3>
                    {[
                      ["Subtotal", subtotal],
                      [`GST (${watched.gstRate || 0}%)`, gstAmount],
                      ["Total Amount", totalAmount],
                      ["Advance Paid", watched.advancePaid || 0],
                    ].map(([label, val]) => (
                      <div
                        key={label as string}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-muted-foreground">{label}</span>
                        <span className="font-mono font-medium tabular-nums">
                          ₹{(val as number).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <Separator className="my-3" />
                    <div className="flex justify-between text-lg font-bold">
                      <span>Balance Due</span>
                      <span
                        className={`font-mono tabular-nums ${balanceDue <= 0 ? "text-trend-positive" : "text-foreground"}`}
                      >
                        ₹{balanceDue.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex shrink-0 justify-end gap-3 border-t border-border/50 bg-muted/10 p-6">
              <Button
                type="button"
                variant="outline"
                className="w-32"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isExecuting}
                className="w-40 font-semibold"
              >
                {isExecuting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
