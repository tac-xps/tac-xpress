import type { Meta, StoryObj } from "@storybook/react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const meta = {
  title: "UI/Select",
  component: Select,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a shipping priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="standard">Standard (5-7 Days)</SelectItem>
        <SelectItem value="expedited">Expedited (2-3 Days)</SelectItem>
        <SelectItem value="overnight">Overnight (Next Day)</SelectItem>
      </SelectContent>
    </Select>
  ),
}

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="northeast">Northeast India</SelectItem>
        <SelectItem value="north">North India</SelectItem>
      </SelectContent>
    </Select>
  ),
}
