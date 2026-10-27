import type { Metadata } from "next"
import { Geist, Newsreader } from "next/font/google"
import "@/components/v2/marlow.css"

const marlowSans = Geist({
  subsets: ["latin"],
  variable: "--marlow-font-sans",
  display: "swap",
})
const marlowSerif = Newsreader({
  subsets: ["latin"],
  variable: "--marlow-font-serif",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Marlow · Ines Calder, product designer and design engineer",
  description:
    "Interfaces for the tools people use every day. Product design, design engineering, and design systems for web and mobile.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function MarlowV2Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${marlowSans.variable} ${marlowSerif.variable} marlow-root-container min-h-screen w-full bg-[#F4F1E9] text-[#141413]`}
    >
      {children}
    </div>
  )
}
