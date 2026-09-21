import type { Meta, StoryObj } from "@storybook/nextjs"
import { SiteNavigation } from "./site-navigation"

const meta = {
  title: "TAC-XPRESS/Landing/Navigation",
  component: SiteNavigation,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
    chromatic: { delay: 300 },
  },
} satisfies Meta<typeof SiteNavigation>

export default meta
type Story = StoryObj<typeof meta>

/** Default — top of page, transparent nav */
export const Default: Story = {}

/** Mobile — narrow viewport to show hamburger trigger */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
