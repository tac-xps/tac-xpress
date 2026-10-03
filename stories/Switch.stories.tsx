import type { Meta, StoryObj } from "@storybook/react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

const meta = {
  title: "UI/Switch",
  component: Switch,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "default"],
    },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="notifications" />
      <Label htmlFor="notifications">Enable notifications</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="auto-dispatch" defaultChecked />
      <Label htmlFor="auto-dispatch">Auto-dispatch enabled</Label>
    </div>
  ),
}

export const Small: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Switch id="compact" size="sm" />
      <Label htmlFor="compact" className="text-xs">
        Compact mode
      </Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">
          Disabled off
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="opacity-50">
          Disabled on
        </Label>
      </div>
    </div>
  ),
}
