import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShippingSteps } from "./shipping-steps"

const meta = {
  title: "TAC-XPRESS/Landing/Shipping Steps",
  component: ShippingSteps,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
    chromatic: { delay: 400 },
  },
} satisfies Meta<typeof ShippingSteps>

export default meta
type Story = StoryObj<typeof meta>

/** Default — no step activated yet (above fold) */
export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
