import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import { createManifestAction } from "./actions"
import { createManifestSchema, type CreateManifestValues } from "./validations"
import { useScannerContext } from "@/components/scanner/scanner-provider"

export function useCreateManifestForm(
  shipments: { id: string; awbNumber: string; destination: string }[],
  onSuccess: () => void
) {
  const form = useForm<CreateManifestValues>({
    resolver: zodResolver(createManifestSchema as any),
    defaultValues: {
      originHubId: "",
      destinationHubId: "",
      vehicleId: "",
      driverId: "",
      shipmentIds: [],
    },
  })

  const { executeAsync, isExecuting } = useAction(createManifestAction, {
    onSuccess: () => {
      toast.success("Manifest created successfully")
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError || "An unexpected error occurred")
    },
  })

  async function onSubmit(values: CreateManifestValues) {
    await executeAsync(values)
  }

  const [scanInput, setScanInput] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 4

  const processScannedAwb = useCallback(
    async (targetAwb: string) => {
      const shipment = shipments.find(
        (s) => s.awbNumber.toUpperCase() === targetAwb
      )

      if (shipment) {
        const currentIds = form.getValues("shipmentIds") || []
        if (!currentIds.includes(shipment.id)) {
          form.setValue("shipmentIds", [...currentIds, shipment.id], {
            shouldValidate: true,
          })
          toast.success(`Scanned and added AWB: ${shipment.awbNumber}`)

          const shipmentIndex = shipments.findIndex((s) => s.id === shipment.id)
          if (shipmentIndex !== -1) {
            setCurrentPage(Math.floor(shipmentIndex / itemsPerPage) + 1)
          }
          return true // Success
        } else {
          toast.info(`AWB ${shipment.awbNumber} is already selected.`)
          return false // Duplicate = error buzz
        }
      } else {
        toast.error(`Pending shipment not found for AWB: ${targetAwb}`)
        return false // Not found = error buzz
      }
    },
    [shipments, form, itemsPerPage]
  )

  const { setOverrideHandler } = useScannerContext()

  // Register the scanner context override handler on mount
  useEffect(() => {
    setOverrideHandler(processScannedAwb)
    // Cleanup on unmount
    return () => setOverrideHandler(null)
  }, [setOverrideHandler, processScannedAwb])

  const handleScanKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!scanInput.trim()) return

      const targetAwb = scanInput.trim().toUpperCase()
      processScannedAwb(targetAwb)
      setScanInput("")
    }
  }

  const selectedCount = form.watch("shipmentIds")?.length || 0
  const totalPages = Math.max(1, Math.ceil(shipments.length / itemsPerPage))
  const paginatedShipments = shipments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return {
    form,
    status: isExecuting ? "executing" : "idle",
    onSubmit,
    scanInput,
    setScanInput,
    currentPage,
    setCurrentPage,
    handleScanKeyDown,
    selectedCount,
    totalPages,
    paginatedShipments,
  }
}
