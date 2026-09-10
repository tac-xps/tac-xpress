import type { Meta, StoryObj } from "@storybook/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    disabled: {
      control: "boolean",
    },
    type: {
      control: "select",
      options: ["text", "password", "email", "number", "file"],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: "text",
    placeholder: "Enter tracking number...",
  },
  render: (args: any) => <Input className="w-[300px]" {...args} />,
}

export const WithLabel: Story = {
  render: () => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
}

export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: "Disabled input",
  },
  render: (args: any) => <Input className="w-[300px]" {...args} />,
}

export const File: Story = {
  args: {
    type: "file",
  },
  render: (args: any) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="manifest">Manifest Document</Label>
      <Input id="manifest" type="file" {...args} />
    </div>
  ),
}
