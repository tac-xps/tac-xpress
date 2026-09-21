import type { Meta, StoryObj } from "@storybook/nextjs"
import { HomeHero } from "./home-hero"

const meta = {
  title: "TAC-XPRESS/Landing/Hero",
  component: HomeHero,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
    chromatic: { delay: 500 },
  },
} satisfies Meta<typeof HomeHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
