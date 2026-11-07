// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { HeroSection } from "@/components/public/landing/hero-section"

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true })
let container: HTMLDivElement
let root: Root | undefined
let reducedMotion = false

beforeEach(() => {
  container = document.createElement("div")
  document.body.append(container)
  vi.stubGlobal(
    "matchMedia",
    vi.fn((media: string) => ({
      matches: reducedMotion,
      media,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  )
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {})
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue()
  reducedMotion = false
})

afterEach(async () => {
  if (root) await act(async () => root?.unmount())
  root = undefined
  container.remove()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("HeroSection video", () => {
  it("renders the looping video with new_hero_video.mp4 source and accessible controls", async () => {
    reducedMotion = false
    root = createRoot(container)
    await act(async () => root?.render(<HeroSection />))

    const video = container.querySelector("video")
    expect(video).not.toBeNull()
    expect(video?.hasAttribute("loop")).toBe(true)
    expect(video?.hasAttribute("autoplay")).toBe(true)
    expect(video?.muted).toBe(true)

    const source = video?.querySelector("source")
    expect(source?.getAttribute("src")).toBe("/video/new_hero_video.mp4")

    const toggleBtn = container.querySelector('button[aria-label="Pause linehaul video"]')
    expect(toggleBtn).not.toBeNull()
  })

  it("pauses video playback when reduced motion is preferred", async () => {
    reducedMotion = true
    root = createRoot(container)
    await act(async () => root?.render(<HeroSection />))

    expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled()
  })
})
