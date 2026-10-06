"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Check, Webhook } from "lucide-react"
import { toast } from "sonner"

interface WebhookEndpointItem {
  name: string
  url: string
  secretName: string
  secretValue: string | null
  isConfigured: boolean
}

interface WebhookEndpointsCardProps {
  endpoints: WebhookEndpointItem[]
}

export function WebhookEndpointsCard({ endpoints }: WebhookEndpointsCardProps) {
  const [visibleSecrets, setVisibleSecrets] = useState<Record<string, boolean>>({})
  const [copiedKeys, setCopiedKeys] = useState<Record<string, boolean>>({})

  const toggleVisibility = (name: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const copyToClipboard = (key: string, text: string, label: string) => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopiedKeys((prev) => ({ ...prev, [key]: true }))
    toast.success(`${label} copied to clipboard`)
    setTimeout(() => {
      setCopiedKeys((prev) => ({ ...prev, [key]: false }))
    }, 2000)
  }

  return (
    <Card className="shadow-none">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="size-5 text-primary" />
          <CardTitle>Webhook Endpoints & Secrets</CardTitle>
        </div>
        <CardDescription>
          Inbound HTTP callbacks and cryptographic verification tokens for external event relays.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {endpoints.map((ep) => {
          const isVisible = Boolean(visibleSecrets[ep.name])
          const isCopiedUrl = Boolean(copiedKeys[`${ep.name}-url`])
          const isCopiedSecret = Boolean(copiedKeys[`${ep.name}-secret`])

          return (
            <div
              key={ep.name}
              className="space-y-3 rounded-none border border-border/60 bg-muted/10 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">{ep.name}</span>
                <Badge variant={ep.isConfigured ? "default" : "outline"} className="text-xs">
                  {ep.isConfigured ? "Configured" : "Not Set"}
                </Badge>
              </div>

              {/* Callback URL */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Callback URL</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    value={ep.url}
                    className="font-mono text-xs bg-background text-foreground select-all"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="size-9 shrink-0"
                    onClick={() => copyToClipboard(`${ep.name}-url`, ep.url, `${ep.name} URL`)}
                    aria-label={`Copy ${ep.name} URL`}
                  >
                    {isCopiedUrl ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                  </Button>
                </div>
              </div>

              {/* Signing Token / Secret */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">{ep.secretName}</Label>
                <div className="flex items-center gap-2">
                  <Input
                    readOnly
                    type={isVisible ? "text" : "password"}
                    value={ep.secretValue || (ep.isConfigured ? "••••••••••••••••••••••••" : "Not configured")}
                    className="font-mono text-xs bg-background select-all"
                  />
                  {!ep.secretValue && ep.isConfigured && (
                    <span className="text-[11px] text-muted-foreground italic shrink-0 px-2 font-mono">
                      Server-managed
                    </span>
                  )}
                  {ep.secretValue && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0"
                      onClick={() => toggleVisibility(ep.name)}
                      aria-label={isVisible ? "Hide secret" : "Show secret"}
                    >
                      {isVisible ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </Button>
                  )}
                  {ep.secretValue && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="size-9 shrink-0"
                      onClick={() => copyToClipboard(`${ep.name}-secret`, ep.secretValue!, ep.secretName)}
                      aria-label={`Copy ${ep.secretName}`}
                    >
                      {isCopiedSecret ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
