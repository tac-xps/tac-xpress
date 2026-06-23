"use client"

import React, { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"

export function Portal({
  children,
  className,
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return createPortal(
    <div id={id} className={cn("fixed inset-x-0 bottom-0 z-50", className)}>
      {children}
    </div>,
    document.body
  )
}

export function PortalBackdrop({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[-1] bg-background/80 backdrop-blur-sm",
        className
      )}
      {...props}
    />
  )
}
