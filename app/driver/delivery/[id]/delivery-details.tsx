"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useHydrated } from "@/hooks/use-hydrated"
import { completeDeliveryAction } from "./actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export function DeliveryDetails({
  shipment,
  invoice,
}: {
  shipment: any
  invoice: any
}) {
  const router = useRouter()
  const signatureReady = useHydrated()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple canvas drawing
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const point = "touches" in e ? e.touches[0] : e
      ctx.moveTo(
        ((point.clientX - rect.left) * canvas.width) / rect.width,
        ((point.clientY - rect.top) * canvas.height) / rect.height
      )
    }
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext("2d")
    const canvas = canvasRef.current
    if (ctx && canvas) {
      const rect = canvas.getBoundingClientRect()
      let x, y
      if ("touches" in e) {
        x = e.touches[0].clientX - rect.left
        y = e.touches[0].clientY - rect.top
      } else {
        x = e.clientX - rect.left
        y = e.clientY - rect.top
      }
      ctx.lineWidth = 2
      ctx.lineCap = "round"
      ctx.strokeStyle = "black"
      ctx.lineTo(
        (x * canvas.width) / rect.width,
        (y * canvas.height) / rect.height
      )
      setHasDrawn(true)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    setHasDrawn(false)
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleComplete = async () => {
    const canvas = canvasRef.current
    if (!canvas || !hasDrawn) {
      toast.error("Draw the consignee signature before completing delivery")
      return
    }
    const signatureDataUrl = canvas.toDataURL("image/png")

    setIsSubmitting(true)
    const result = await completeDeliveryAction({
      shipmentId: shipment.id,
      signatureDataUrl,
    })

    if (result?.data?.success) {
      toast.success("Delivery status updated successfully")
      router.push("/driver")
    } else {
      toast.error(
        result?.data?.error ||
          result?.serverError ||
          "Failed to complete delivery"
      )
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold tracking-tight">
        {shipment.awbNumber}
      </h1>
      <Card>
        <CardHeader>
          <CardTitle>Delivery Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Consignee
            </div>
            <div className="font-medium">{shipment.consigneeName || "N/A"}</div>
            <div>{shipment.consigneePhone}</div>
            <div className="mt-1 text-sm text-muted-foreground">
              {shipment.consigneeAddress}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Payment Required
            </div>
            <div className="text-xl font-bold">
              {invoice?.status === "unpaid" ? (
                `₹${((invoice?.balanceDue || 0) / 100).toFixed(2)}`
              ) : (
                <Badge variant="default">PAID</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proof of Delivery (ePoD)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative overflow-hidden rounded-none border bg-background">
            {signatureReady ? (
              <canvas
                aria-label="Consignee signature"
                ref={canvasRef}
                width={400}
                height={200}
                className="h-48 w-full touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            ) : (
              <div role="status" className="relative">
                <Skeleton className="h-48 w-full" />
                <span className="absolute inset-0 grid place-items-center text-sm text-muted-foreground">
                  Loading signature pad
                </span>
              </div>
            )}
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clearSignature}
                type="button"
                disabled={!signatureReady}
              >
                Clear
              </Button>
            </div>
          </div>

          <Button
            className="h-9 w-full text-sm"
            onClick={handleComplete}
            disabled={
              isSubmitting || !hasDrawn || shipment.status === "delivered"
            }
          >
            {isSubmitting && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            {shipment.status === "delivered"
              ? "Already Delivered"
              : "Complete Delivery"}
          </Button>
        </CardContent>
      </Card>
    </>
  )
}
