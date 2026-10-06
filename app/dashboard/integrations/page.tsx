import { requireStaffPage } from "@/lib/auth/page-access"
import { PageHeader } from "@/components/operations/page-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getWhatsAppConfig } from "@/lib/whatsapp/config"
import { ScannerTest } from "./scanner-test"
import { WebhookEndpointsCard } from "./webhook-endpoints-card"

export default async function IntegrationsPage() {
  await requireStaffPage()
  const whatsapp = getWhatsAppConfig()
  const configured = Boolean(whatsapp.relayToken && whatsapp.appSecret && whatsapp.verifyToken)

  const integrations = [
    {
      title: "WhatsApp delivery",
      status: !whatsapp.enabled
        ? "Disabled"
        : configured
          ? "Configuration present"
          : "Configuration incomplete",
      description:
        "Invoice and shipment messaging through the configured relay. Configuration does not confirm successful delivery; review outbound message results in Support.",
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
      url: "/api/webhooks/whatsapp",
      secretName: "Verify Token",
      secretValue: whatsapp.verifyToken,
      isConfigured: Boolean(whatsapp.verifyToken),
    },
    {
      name: "Carrier Telemetry Relay",
      url: "/api/webhooks/carrier",
      secretName: "Signing Secret",
      secretValue: process.env.CARRIER_WEBHOOK_SECRET?.trim() || null,
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

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Barcode & QR scanner</CardTitle>
            <CardDescription>
              Test camera permission and a shipment code on this device.
            </CardDescription>
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
