"use client"

import { useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Simple canvas drawing
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext("2d")
    if (ctx) {
      ctx.beginPath()
      // Note: Coordinates need offset adjustment in a real app
      // For this demo we'll use a simplified approach
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
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext("2d")
      ctx?.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleComplete = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    // To check if empty: simple heuristic, but we'll assume they signed if they click complete
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
      toast.error("Failed to complete delivery")
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
          <div className="relative overflow-hidden rounded-md border bg-background">
            <canvas
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
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={clearSignature}
                type="button"
              >
                Clear
              </Button>
            </div>
          </div>

          <Button
            className="h-12 w-full text-lg"
            onClick={handleComplete}
            disabled={isSubmitting || shipment.status === "delivered"}
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
