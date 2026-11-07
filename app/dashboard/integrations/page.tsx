import type { Metadata } from "next"
import { requireStaffPage } from "@/lib/auth/page-access"
import { PageHeader } from "@/components/operations/page-header"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"

export const metadata: Metadata = {
  title: "Integrations & Webhooks | TAC-XPRESS",
  description:
    "LeminAI messaging, service configuration, and inbound webhook endpoints.",
}
import { getAppUrl } from "@/lib/config/app-url"
import { ScannerTest } from "./scanner-test"
import { WebhookEndpointsCard } from "./webhook-endpoints-card"

export default async function IntegrationsPage() {
  await requireStaffPage()
  const whatsapp = getWhatsAppConfig()
  const baseUrl = getAppUrl()

  const integrations = [
    {
      title: "WhatsApp delivery via LeminAI",
      status: !whatsapp.enabled
        ? "Disabled"
        : whatsapp.outboundConfigured
          ? "Configuration present"
          : "Configuration incomplete",
      description:
        "Invoice and shipment messaging through LeminAI's WPBox relay. Configuration does not confirm delivery; review outbound message results in Support.",
    },
    {
      title: "Support email",
      status: process.env.RESEND_API_KEY?.trim()
        ? "Configuration present"
        : "Configuration missing",
      description:
        "Support notifications and replies use Resend. A successful provider response is needed before a message can be considered sent.",
    },
    {
      title: "Carrier rates",
      status: "Manual coordination",
      description:
        "Carrier quoting is not connected. Confirm rates, cargo acceptance and schedules with the operations team before promising a movement.",
    },
  ]

  const webhookEndpoints = [
    {
      name: "WhatsApp Meta Webhook",
      url: `${baseUrl}/api/webhooks/whatsapp`,
      secretName: "Meta app secret and verification token",
      isConfigured: whatsapp.metaWebhookConfigured,
    },
    {
      name: "Carrier Telemetry Relay",
      url: `${baseUrl}/api/webhooks/carrier`,
      secretName: "Signing Secret",
      isConfigured: Boolean(process.env.CARRIER_WEBHOOK_SECRET?.trim()),
    },
  ]

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <PageHeader
        title="Integrations & Webhooks"
        description="Review service configuration, manage inbound webhook secrets, and test supported scanning hardware."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {integrations.map((item) => (
          <Card key={item.title} className="shadow-none">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>
                <Badge variant="outline" className="mt-2">
                  {item.status}
                </Badge>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-none lg:col-span-2">
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-base font-bold">
                  Barcode & QR Hardware Scanner
                </CardTitle>
                <CardDescription className="mt-1 text-xs">
                  Test camera permissions, evaluate mobile iOS & Android
                  scanning, and verify consignment AWB barcodes.
                </CardDescription>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                WebRTC & Native Capture
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ScannerTest />
          </CardContent>
        </Card>
      </div>

      <div className="mt-2">
        <WebhookEndpointsCard endpoints={webhookEndpoints} />
      </div>
    </div>
  )
}
