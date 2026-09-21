import type { Meta, StoryObj } from "@storybook/nextjs"
import { ShipmentDesk } from "./shipment-desk"

const meta = {
  title: "TAC-XPRESS/Landing/Shipment Desk",
  component: ShipmentDesk,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof ShipmentDesk>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
