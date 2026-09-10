import type { Meta, StoryObj } from "@storybook/nextjs"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { WorkspaceFrame } from "@/components/operations/workspace-frame"
import { WorkspaceHeader } from "@/components/operations/workspace-header"
import { WorkspaceSearch } from "@/components/operations/workspace-search"
import { OverviewMetrics } from "@/components/operations/overview-metrics"
import { WorkQueue } from "@/components/operations/work-queue"
import { VolumeChart } from "@/components/operations/volume-chart"
import { PageHeader } from "@/components/operations/page-header"
import { ThemeSwitcher } from "@/components/theme-switcher"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/components/logistics/status-badge"
import { ControlCenterActions, ControlCenterPanels } from "@/components/operations/control-center"
const data = Array.from({ length: 90 }, (_, index) => ({
  date: new Date(Date.UTC(2026, 5, 10 + index)).toISOString().slice(0, 10),
  airCargo: ((index * 13) % 27) + 8,
  surfaceCargo: ((index * 7) % 19) + 4,
}))
function OperationsPreview() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <WorkspaceFrame
        userRole="admin"
        header={
          <WorkspaceHeader>
            <WorkspaceSearch />
            <ThemeSwitcher />
          </WorkspaceHeader>
        }
      >
        <Alert>
          <AlertDescription>
            Design preview · All records below are simulated. No operational
            actions are connected.
          </AlertDescription>
        </Alert>
        <PageHeader
          title="Operations overview"
          description="A clear view of bookings, current work and movement across the network."
        />
        <ControlCenterActions />
        <ControlCenterPanels snapshot={{ outstanding: 18524000, unpublished: 6, failedMessages: 2,
          recentInvoices: [{ id: "11111111-1111-4111-8111-111111111111", amount: 420000, status: "unpaid", whatsappStatus: "sent", createdAt: new Date("2026-09-07"), shipment: { awbNumber: "TAC-DEMO-001", consignorName: "Sample cargo account" } }],
          recentContacts: [{ id: "22222222-2222-4222-8222-222222222222", subject: "Packing a fragile consignment", customerName: "Sample enquiry", status: "open", createdAt: new Date("2026-09-07") }],
          recentMessages: [{ id: "33333333-3333-4333-8333-333333333333", status: "delivered", relatedInvoiceId: null, relatedAwb: "TAC-DEMO-001", createdAt: new Date("2026-09-07") }]
        }} />
        <OverviewMetrics
          stats={{
            totalDispatches: 1248,
            airCargo: 732,
            surfaceCargo: 516,
            pickDrop: 286,
            trends: { dispatches: null, air: null, surface: null, pick: null },
          }}
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
          <VolumeChart data={data} />
          <WorkQueue
            counts={{ pending: 18, drafts: 4, overdue: 7, support: 9 }}
          />
        </div>
        <Card className="shadow-none">
          <CardHeader>
            <CardTitle>Shipment register · sample records</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">AWB</TableHead>
                  <TableHead>Route</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  {
                    awb: "TAC-DEMO-001",
                    from: "New Delhi",
                    to: "Imphal",
                    service: "Air cargo",
                    status: "in-transit",
                  },
                  {
                    awb: "TAC-DEMO-002",
                    from: "Imphal",
                    to: "New Delhi",
                    service: "Surface cargo",
                    status: "pending",
                  },
                  {
                    awb: "TAC-DEMO-003",
                    from: "New Delhi",
                    to: "Imphal",
                    service: "Air cargo",
                    status: "delivered",
                  },
                ].map((row) => (
                  <TableRow key={row.awb}>
                    <TableCell className="py-4 pl-6 font-mono">
                      {row.awb}
                    </TableCell>
                    <TableCell>
                      {row.from} → {row.to}
                    </TableCell>
                    <TableCell>{row.service}</TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </WorkspaceFrame>
    </ThemeProvider>
  )
}
const meta = {
  title: "TAC-XPRESS/Operations workspace",
  component: OperationsPreview,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/dashboard" } },
  },
} satisfies Meta<typeof OperationsPreview>
export default meta
type Story = StoryObj<typeof meta>
export const Overview: Story = {}
