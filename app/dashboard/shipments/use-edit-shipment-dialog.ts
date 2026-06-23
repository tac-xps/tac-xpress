import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { updateShipmentAction } from "./actions"
import { updateShipmentSchema } from "./schemas"
import { z } from "zod"
import { useAction } from "next-safe-action/hooks"

type UpdateShipmentValues = z.infer<typeof updateShipmentSchema>

export function useEditShipmentDialog(
  shipment: any,
  onOpenChange: (open: boolean) => void
) {
  const form = useForm<UpdateShipmentValues>({
    resolver: zodResolver(updateShipmentSchema as any),
    defaultValues: {
      id: shipment.id,
      origin: shipment.origin || "",
      destination: shipment.destination || "",
      serviceType: shipment.serviceType as any,
      weightKg: shipment.weightKg || 0,
      consignorName: shipment.consignorName || "",
      consignorPhone: shipment.consignorPhone || "",
      consignorAddress: shipment.consignorAddress || "",
      consigneeName: shipment.consigneeName || "",
      consigneePhone: shipment.consigneePhone || "",
      consigneeAddress: shipment.consigneeAddress || "",
      natureOfGoods: (shipment.natureOfGoods as any) || undefined,
      itemCondition: (shipment.itemCondition as any) || undefined,
      packagingType: (shipment.packagingType as any) || undefined,
      pieces: shipment.pieces || undefined,
      dimensionsL: shipment.dimensionsL || undefined,
      dimensionsW: shipment.dimensionsW || undefined,
      dimensionsH: shipment.dimensionsH || undefined,
      chargedWeightKg: shipment.chargedWeightKg || undefined,
      isFragile: shipment.isFragile || false,
      insuranceOptIn: shipment.insuranceOptIn || false,
    },
  })

  const { executeAsync, isExecuting: isSubmitting } = useAction(
    updateShipmentAction,
    {
      onSuccess: ({ data }) => {
        if (data?.success) {
          toast.success("Shipment updated successfully")
          onOpenChange(false)
        } else {
          toast.error("Failed to update shipment")
        }
      },
      onError: ({ error }) => {
        toast.error(error.serverError || "An unexpected error occurred")
      },
    }
  )

  async function onSubmit(data: UpdateShipmentValues) {
    await executeAsync(data)
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}
