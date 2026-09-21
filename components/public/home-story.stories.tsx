import type { Meta, StoryObj } from "@storybook/nextjs"
import { HomeStory } from "./home-story"

const meta = {
  title: "TAC-XPRESS/Landing/Our Story",
  component: HomeStory,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof HomeStory>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
