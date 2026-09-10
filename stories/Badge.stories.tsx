import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "@/components/ui/badge"

const meta = {
  title: "UI/Badge",
  component: Badge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "destructive",
        "outline",
        "ghost",
        "link",
        "success",
        "warning",
        "error",
        "neutral",
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary",
    variant: "secondary",
  },
}

export const Destructive: Story = {
  args: {
    children: "Destructive",
    variant: "destructive",
  },
}

export const Outline: Story = {
  args: {
    children: "Outline",
    variant: "outline",
  },
}

export const SuccessLogistics: Story = {
  args: {
    children: "Delivered",
    variant: "success",
  },
}

export const WarningLogistics: Story = {
  args: {
    children: "In Transit",
    variant: "warning",
  },
}

export const ErrorLogistics: Story = {
  args: {
    children: "Failed Delivery",
    variant: "error",
  },
}

export const NeutralLogistics: Story = {
  args: {
    children: "Pending",
    variant: "neutral",
  },
}
