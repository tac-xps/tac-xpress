import type { Meta, StoryObj } from "@storybook/react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

const meta = {
  title: "UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "destructive",
        "outline",
        "secondary",
        "ghost",
        "link",
      ],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon", "xs", "icon-xs", "icon-sm", "icon-lg"],
    },
    disabled: {
      control: "boolean",
    },
    asChild: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: "Button",
    variant: "default",
  },
}

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
}

export const Destructive: Story = {
  args: {
    children: "Destructive Action",
    variant: "destructive",
  },
}

export const Outline: Story = {
  args: {
    children: "Outline Button",
    variant: "outline",
  },
}

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
  },
}

export const Link: Story = {
  args: {
    children: "Link Button",
    variant: "link",
  },
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Search />
        Search
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    variant: "outline",
    size: "icon",
    children: <Search />,
    "aria-label": "Search",
  },
}
