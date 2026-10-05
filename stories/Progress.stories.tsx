import type { Meta, StoryObj } from "@storybook/react"
import { Progress } from "@/components/ui/progress"

const meta = {
  title: "UI/Progress",
  component: Progress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Progress value={45} />
    </div>
  ),
}

export const Zero: Story = {
  render: () => (
    <div className="w-80">
      <Progress value={0} />
    </div>
  ),
}

export const Half: Story = {
  render: () => (
    <div className="w-80">
      <Progress value={50} />
    </div>
  ),
}

export const Complete: Story = {
  render: () => (
    <div className="w-80">
      <Progress value={100} />
    </div>
  ),
}

export const AllStates: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Not started (0%)</p>
        <Progress value={0} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">In transit (33%)</p>
        <Progress value={33} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Out for delivery (75%)</p>
        <Progress value={75} />
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Delivered (100%)</p>
        <Progress value={100} />
      </div>
    </div>
  ),
}
