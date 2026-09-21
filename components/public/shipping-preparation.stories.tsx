import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShippingPreparation } from "./shipping-preparation"

const meta = {
  title: "TAC-XPRESS/Landing/Shipping Preparation",
  component: ShippingPreparation,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof ShippingPreparation>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
