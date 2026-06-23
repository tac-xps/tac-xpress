"use client"

import React, { useState } from "react"
import { Navigation } from "lucide-react"
import { messageDriverAction } from "@/app/dashboard/dispatch/whatsapp-actions"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface MessageDriverButtonProps {
  manifestId?: string
  driverId: string
}

export function MessageDriverButton({
  manifestId,
  driverId,
}: MessageDriverButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleMessage = async () => {
    if (!manifestId) {
      toast.error(
        "No active manifest found for this driver to send route details."
      )
      return
    }

    setIsLoading(true)
    try {
      const result = await messageDriverAction(manifestId, driverId)
      if (result.success) {
        toast.success("WhatsApp message sent successfully!")
      } else {
        toast.error(result.error || "Failed to send message.")
      }
    } catch (error: any) {
      toast.error("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      onClick={handleMessage}
      disabled={isLoading || !manifestId}
      className="flex h-auto w-full items-center justify-center gap-2 rounded-lg bg-primary/10 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
    >
      <Navigation className="size-4" />
      {isLoading ? "Sending..." : "Message Driver"}
    </Button>
  )
}
