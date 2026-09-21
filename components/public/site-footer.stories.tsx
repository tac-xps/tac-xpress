import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteFooter } from "./site-footer"

const meta = {
  title: "TAC-XPRESS/Landing/Footer",
  component: SiteFooter,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
