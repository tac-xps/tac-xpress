"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/reui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Check, Webhook } from "lucide-react"
import { toast } from "sonner"

interface WebhookEndpointItem {
  name: string
  url: string
  secretName: string
  isConfigured: boolean
}

export function WebhookEndpointsCard({
  endpoints,
}: {
  endpoints: WebhookEndpointItem[]
}) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  async function copyUrl(endpoint: WebhookEndpointItem) {
    try {
      await navigator.clipboard.writeText(endpoint.url)
      setCopiedUrl(endpoint.url)
      toast.success(`${endpoint.name} URL copied`)
    } catch {
      toast.error("Could not copy the URL. Select and copy it from the field.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Webhook className="size-5 text-primary" aria-hidden="true" />
          <CardTitle>Webhook endpoints</CardTitle>
        </div>
        <CardDescription>
          Copy callback URLs. Manage verification secrets in the deployment
          settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        {endpoints.map((endpoint) => (
          <div key={endpoint.name} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold">{endpoint.name}</span>
              <Badge
                variant={endpoint.isConfigured ? "success-light" : "secondary"}
              >
                {endpoint.isConfigured
                  ? "Configuration present"
                  : "Not configured"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={endpoint.url}>Callback URL</Label>
              <div className="flex items-center gap-2">
                <Input
                  id={endpoint.url}
                  readOnly
                  value={endpoint.url}
                  className="font-mono select-all"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyUrl(endpoint)}
                  aria-label={`Copy ${endpoint.name} URL`}
                >
                  {copiedUrl === endpoint.url ? (
                    <Check aria-hidden="true" />
                  ) : (
                    <Copy aria-hidden="true" />
                  )}
                </Button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              {endpoint.secretName}:{" "}
              {endpoint.isConfigured ? "Server-managed" : "Not configured"}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
