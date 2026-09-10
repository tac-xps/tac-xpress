"use client"
import { useState } from "react"
import { Info, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
// Public environment values are captured at build time; updating this notice requires a rebuild.
export function SystemBanner() {
  const [dismissed, setDismissed] = useState(false)
  const message = process.env.NEXT_PUBLIC_SYSTEM_BANNER
  if (!message || dismissed) return null
  return <Alert className="rounded-none border-x-0 border-t-0"><Info /><AlertTitle>Operations notice</AlertTitle><AlertDescription className="pr-8">{message}</AlertDescription><Button variant="ghost" size="icon" className="absolute top-2 right-2" aria-label="Dismiss operations notice" onClick={() => setDismissed(true)}><X /></Button></Alert>
}

