import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react"

const meta = {
  title: "UI/Alert",
  component: Alert,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-96">
      <Alert>
        <Info />
        <AlertTitle>Dispatch Notice</AlertTitle>
        <AlertDescription>
          Air cargo flight 6E-204 departed Delhi hub on schedule at 14:30 IST.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const Destructive: Story = {
  render: () => (
    <div className="w-96">
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Transit Exception</AlertTitle>
        <AlertDescription>
          Shipment TAC-BOM-8821 custom clearance held due to missing HSN code.
        </AlertDescription>
      </Alert>
    </div>
  ),
}

export const WithoutIcon: Story = {
  render: () => (
    <div className="w-96">
      <Alert>
        <AlertTitle>System Advisory</AlertTitle>
        <AlertDescription>
          Scheduled server maintenance planned for Sunday 02:00 IST.
        </AlertDescription>
      </Alert>
    </div>
  ),
}
