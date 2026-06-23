import { useState, useEffect } from "react"
import { useAction } from "next-safe-action/hooks"
import { getInvoiceDetails } from "./actions"

export function useInvoiceSheet(shipmentId: string, open: boolean) {
  const [data, setData] = useState<any>(null)

  const { execute, isExecuting, status } = useAction(getInvoiceDetails, {
    onSuccess: ({ data }) => {
      setData(data ?? null)
    },
  })

  useEffect(() => {
    if (open && !data && status === "idle") {
      execute({ shipmentId })
    }
  }, [open, shipmentId, data, status, execute])

  return {
    data,
    loading: isExecuting,
  }
}
