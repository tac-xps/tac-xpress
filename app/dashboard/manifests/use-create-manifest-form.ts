import { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useAction } from "next-safe-action/hooks"
import { createManifestAction } from "./actions"
import { createManifestSchema, type CreateManifestValues } from "./validations"
import { useScannerContext } from "@/components/scanner/scanner-provider"
import type { ManifestShipmentItem } from "./manifest-telemetry-card"

export function useCreateManifestForm(
  shipments: ManifestShipmentItem[],
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
      sendWhatsAppNotification: true,
    },
  })

  const { executeAsync, isExecuting } = useAction(createManifestAction, {
    onSuccess: ({ data }) => {
      if (data?.whatsAppDispatched) {
        toast.success("Manifest created & WhatsApp dispatched to driver")
      } else {
        toast.success("Manifest created successfully")
      }
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
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter shipments based on search query
  const filteredShipments = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return shipments
    return shipments.filter(
      (s) =>
        s.awbNumber.toLowerCase().includes(q) ||
        s.destination.toLowerCase().includes(q) ||
        s.origin.toLowerCase().includes(q)
    )
  }, [shipments, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / itemsPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedShipments = useMemo(() => {
    const start = (safeCurrentPage - 1) * itemsPerPage
    return filteredShipments.slice(start, start + itemsPerPage)
  }, [filteredShipments, safeCurrentPage, itemsPerPage])

  const processScannedAwb = useCallback(
    async (targetAwb: string) => {
      const shipment = shipments.find(
        (s) => s.awbNumber.toUpperCase() === targetAwb
      )

      if (shipment) {
        const currentIds = form.getValues("shipmentIds") || []
        if (!currentIds.includes(shipment.id)) {
          form.setValue("shipmentIds", [...currentIds, shipment.id], {
            shouldDirty: true,
          })
          toast.success(`Scanned and added AWB: ${shipment.awbNumber}`)

          const shipmentIndex = filteredShipments.findIndex(
            (s) => s.id === shipment.id
          )
          if (shipmentIndex !== -1) {
            setCurrentPage(Math.floor(shipmentIndex / itemsPerPage) + 1)
          }
          return true
        } else {
          toast.info(`AWB ${shipment.awbNumber} is already selected.`)
          return false
        }
      } else {
        toast.error(`Pending shipment not found for AWB: ${targetAwb}`)
        return false
      }
    },
    [shipments, filteredShipments, form, itemsPerPage]
  )

  const processScannedAwbRef = useRef(processScannedAwb)
  useEffect(() => {
    processScannedAwbRef.current = processScannedAwb
  })

  const { setOverrideHandler } = useScannerContext()

  // Register the scanner context override handler stably on mount
  useEffect(() => {
    const handler = (code: string) => processScannedAwbRef.current(code)
    setOverrideHandler(handler)
    return () => setOverrideHandler(null)
  }, [setOverrideHandler])

  const handleScanKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (!scanInput.trim()) return

      const targetAwb = scanInput.trim().toUpperCase()
      processScannedAwb(targetAwb)
      setScanInput("")
    }
  }

  const watchedShipmentIds = useWatch({ control: form.control, name: "shipmentIds" })
  const selectedShipmentIds = watchedShipmentIds || []
  const selectedCount = selectedShipmentIds.length

  // Bulk toggle for all currently filtered shipments
  const areAllFilteredSelected =
    filteredShipments.length > 0 &&
    filteredShipments.every((s) => selectedShipmentIds.includes(s.id))

  const toggleSelectAllFiltered = () => {
    const currentIds = form.getValues("shipmentIds") || []
    if (areAllFilteredSelected) {
      // Deselect filtered
      const filteredIdSet = new Set(filteredShipments.map((s) => s.id))
      form.setValue(
        "shipmentIds",
        currentIds.filter((id) => !filteredIdSet.has(id)),
        { shouldDirty: true }
      )
    } else {
      // Select all filtered
      const newIds = Array.from(
        new Set([...currentIds, ...filteredShipments.map((s) => s.id)])
      )
      form.setValue("shipmentIds", newIds, { shouldDirty: true })
    }
  }

  return {
    form,
    status: isExecuting ? "executing" : "idle",
    onSubmit,
    scanInput,
    setScanInput,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    handleScanKeyDown,
    selectedShipmentIds,
    selectedCount,
    totalPages,
    filteredShipments,
    paginatedShipments,
    areAllFilteredSelected,
    toggleSelectAllFiltered,
  }
}
