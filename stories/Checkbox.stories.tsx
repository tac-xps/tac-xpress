import type { Meta, StoryObj } from "@storybook/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Checkbox>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
}

export const Checked: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="checked" defaultChecked />
      <Label htmlFor="checked">Insurance required</Label>
    </div>
  ),
}

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-off" disabled />
        <Label htmlFor="disabled-off" className="opacity-50">
          Disabled unchecked
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on" className="opacity-50">
          Disabled checked
        </Label>
      </div>
    </div>
  ),
}
