import type { Meta, StoryObj } from "@storybook/react"
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const meta = {
  title: "UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Shipment Details</CardTitle>
        <CardDescription>View tracking and operational details.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Your cargo is currently at the New Delhi processing facility and is awaiting departure.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Track Package</Button>
      </CardFooter>
    </Card>
  ),
}

export const Simple: Story = {
  render: () => (
    <Card className="w-[300px] p-6">
      <div className="flex flex-col space-y-2">
        <h3 className="font-semibold leading-none tracking-tight">Compact Card</h3>
        <p className="text-sm text-muted-foreground">This is a simpler card layout without explicit header/footer components.</p>
      </div>
    </Card>
  ),
}
