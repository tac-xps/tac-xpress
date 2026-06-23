"use client"

import { useState } from "react"
import { Info, AlertTriangle, X } from "lucide-react"
import {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerAction,
  BannerClose,
} from "@/components/kibo-ui/banner"

type SystemAlert = {
  id: string
  type: "info" | "warning" | "error"
  message: string
  action?: { label: string; href: string }
}

// In production this would come from a server-side check or Sentry/real-time source.
// For now it reads from env so ops can set alerts without a deploy.
const SYSTEM_ALERTS: SystemAlert[] = [
  // Populated from NEXT_PUBLIC_SYSTEM_BANNER env at build time, or empty.
  ...(process.env.NEXT_PUBLIC_SYSTEM_BANNER
    ? [
        {
          id: "env-banner",
          type: "info" as const,
          message: process.env.NEXT_PUBLIC_SYSTEM_BANNER,
        },
      ]
    : []),
]

export function SystemBanner() {
  const [dismissed, setDismissed] = useState<string[]>([])

  const active = SYSTEM_ALERTS.filter((a) => !dismissed.includes(a.id))

  if (active.length === 0) return null

  return (
    <div className="flex flex-col gap-0">
      {active.map((alert) => (
        <Banner
          key={alert.id}
          className={
            alert.type === "warning"
              ? "bg-status-pending text-background"
              : alert.type === "error"
                ? "bg-destructive text-destructive-foreground"
                : "bg-primary text-primary-foreground"
          }
          onClose={() => setDismissed((prev) => [...prev, alert.id])}
        >
          <BannerIcon icon={alert.type === "warning" ? AlertTriangle : Info} />
          <BannerTitle className="text-sm font-medium">
            {alert.message}
          </BannerTitle>
          {alert.action && (
            <BannerAction asChild className="text-xs">
              <a
                href={alert.action.href}
                className="underline underline-offset-2"
              >
                {alert.action.label}
              </a>
            </BannerAction>
          )}
          <BannerClose
            onClick={() => setDismissed((prev) => [...prev, alert.id])}
          >
            <X size={16} />
          </BannerClose>
        </Banner>
      ))}
    </div>
  )
}
