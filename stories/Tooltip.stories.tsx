import type { Meta, StoryObj } from "@storybook/react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { Info, HelpCircle } from "lucide-react"

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="outline" size="icon">
          <Info />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Shipment details</p>
      </TooltipContent>
    </Tooltip>
  ),
}

export const WithText: Story = {
  render: () => (
    <Tooltip defaultOpen>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="sm">
          <HelpCircle />
          Help
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>View documentation and support resources</p>
      </TooltipContent>
    </Tooltip>
  ),
}
