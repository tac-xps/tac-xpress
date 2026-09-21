import type { Meta, StoryObj } from "@storybook/nextjs"
import { HomeServices } from "./home-services"

const meta = {
  title: "TAC-XPRESS/Landing/Services",
  component: HomeServices,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof HomeServices>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
