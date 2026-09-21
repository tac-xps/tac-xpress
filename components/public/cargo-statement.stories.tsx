import type { Meta, StoryObj } from "@storybook/nextjs"
import { CargoStatement } from "./cargo-statement"

const meta = {
  title: "TAC-XPRESS/Landing/Cargo Statement",
  component: CargoStatement,
  parameters: {
    layout: "fullscreen",
    nextjs: { appDirectory: true, navigation: { pathname: "/" } },
  },
} satisfies Meta<typeof CargoStatement>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
    chromatic: { viewports: [375] },
  },
}
