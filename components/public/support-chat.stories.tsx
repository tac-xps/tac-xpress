import type { Meta, StoryObj } from "@storybook/nextjs"
import { SupportChat } from "./support-chat"

const meta = {
  title: "TAC-XPRESS/Landing/Support Chat",
  component: SupportChat,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof SupportChat>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
