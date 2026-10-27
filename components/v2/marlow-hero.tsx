"use client"

import * as React from "react"
import { ArrowRight, Dices } from "lucide-react"

interface PromptOption {
  id: string
  shortLabel: string
  fullPrompt: string
  palette: {
    sunColor: string
    sunY: number
    sunRadius: number
    mountains: string[]
    waterColor: string
    reflectionColor: string
    skyTop: string
    skyBottom: string
  }
}

const PROMPT_OPTIONS: PromptOption[] = [
  {
    id: "low-sun",
    shortLabel: "A low sun over still water",
    fullPrompt: "A low sun over still water, three folded ridges, ink on paper",
    palette: {
      sunColor: "#F04D23",
      sunY: 0.28,
      sunRadius: 0.13,
      mountains: ["#C5C6C3", "#787B7A", "#262827"],
      waterColor: "#DAD8D0",
      reflectionColor: "#F04D23",
      skyTop: "#F4F2EC",
      skyBottom: "#DFDCD4",
    },
  },
  {
    id: "crescent-moon",
    shortLabel: "Crescent moon above a quiet bay",
    fullPrompt: "Crescent moon above a quiet bay, night, long reflections",
    palette: {
      sunColor: "#E8E4D5",
      sunY: 0.24,
      sunRadius: 0.09,
      mountains: ["#50545E", "#2C303B", "#14171E"],
      waterColor: "#1E222A",
      reflectionColor: "#E8E4D5",
      skyTop: "#1A1D24",
      skyBottom: "#353A47",
    },
  },
  {
    id: "pale-sun",
    shortLabel: "Pale sun through morning mist",
    fullPrompt: "Pale sun through morning mist, five hills fading back",
    palette: {
      sunColor: "#F3BE7A",
      sunY: 0.32,
      sunRadius: 0.11,
      mountains: ["#D8D7D2", "#A6A7A2", "#4A4D49"],
      waterColor: "#EAE7DF",
      reflectionColor: "#F3BE7A",
      skyTop: "#F8F6F0",
      skyBottom: "#ECE8DD",
    },
  },
]

export function MarlowHero() {
  const [activePromptIndex, setActivePromptIndex] = React.useState(0)
  const [seed, setSeed] = React.useState(48213)
  const [step, setStep] = React.useState(30)
  const [isResolving, setIsResolving] = React.useState(false)
  const [displayedPrompt, setDisplayedPrompt] = React.useState(PROMPT_OPTIONS[0].fullPrompt)

  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const activePrompt = PROMPT_OPTIONS[activePromptIndex]

  React.useEffect(() => {
    const targetText = activePrompt.fullPrompt
    let charIdx = 0
    const interval = setInterval(() => {
      charIdx++
      setDisplayedPrompt(targetText.slice(0, charIdx))
      if (charIdx >= targetText.length) {
        clearInterval(interval)
      }
    }, 24)

    return () => clearInterval(interval)
  }, [activePrompt.fullPrompt])

  const startResolve = React.useCallback(() => {
    setIsResolving(true)
    setStep(0)
  }, [])

  React.useEffect(() => {
    if (!isResolving) return

    let currentStep = 0
    const stepInterval = setInterval(() => {
      currentStep += 1
      setStep(currentStep)
      if (currentStep >= 30) {
        clearInterval(stepInterval)
        setIsResolving(false)
      }
    }, 55)

    return () => clearInterval(stepInterval)
  }, [isResolving])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = 800
    const height = 600
    canvas.width = width
    canvas.height = height

    // Offscreen buffer for crisp procedural rendering
    const offscreen = document.createElement("canvas")
    offscreen.width = width
    offscreen.height = height
    const offCtx = offscreen.getContext("2d")
    if (!offCtx) return

    const { palette } = activePrompt

    const skyGrad = offCtx.createLinearGradient(0, 0, 0, height * 0.55)
    skyGrad.addColorStop(0, palette.skyTop)
    skyGrad.addColorStop(1, palette.skyBottom)
    offCtx.fillStyle = skyGrad
    offCtx.fillRect(0, 0, width, height * 0.55)

    const sunX = width * 0.35 + ((seed % 100) - 50) * 0.6
    const sunY = height * palette.sunY
    const sunR = width * palette.sunRadius

    offCtx.save()
    offCtx.fillStyle = palette.sunColor
    offCtx.beginPath()
    offCtx.arc(sunX, sunY, sunR, 0, Math.PI * 2)
    offCtx.fill()
    offCtx.restore()

    offCtx.fillStyle = palette.mountains[0]
    offCtx.beginPath()
    offCtx.moveTo(0, height * 0.55)
    offCtx.lineTo(0, height * 0.34)
    offCtx.bezierCurveTo(width * 0.25, height * 0.32, width * 0.45, height * 0.42, width * 0.7, height * 0.33)
    offCtx.bezierCurveTo(width * 0.85, height * 0.28, width * 0.95, height * 0.36, width, height * 0.35)
    offCtx.lineTo(width, height * 0.55)
    offCtx.closePath()
    offCtx.fill()

    offCtx.fillStyle = palette.mountains[1]
    offCtx.beginPath()
    offCtx.moveTo(0, height * 0.55)
    offCtx.lineTo(0, height * 0.42)
    offCtx.bezierCurveTo(width * 0.18, height * 0.44, width * 0.35, height * 0.38, width * 0.52, height * 0.45)
    offCtx.bezierCurveTo(width * 0.7, height * 0.42, width * 0.85, height * 0.37, width, height * 0.43)
    offCtx.lineTo(width, height * 0.55)
    offCtx.closePath()
    offCtx.fill()

    offCtx.fillStyle = palette.mountains[2]
    offCtx.beginPath()
    offCtx.moveTo(0, height * 0.55)
    offCtx.lineTo(0, height * 0.49)
    offCtx.bezierCurveTo(width * 0.28, height * 0.48, width * 0.48, height * 0.53, width * 0.68, height * 0.47)
    offCtx.bezierCurveTo(width * 0.82, height * 0.45, width * 0.92, height * 0.49, width, height * 0.48)
    offCtx.lineTo(width, height * 0.55)
    offCtx.closePath()
    offCtx.fill()

    const waterGrad = offCtx.createLinearGradient(0, height * 0.54, 0, height)
    waterGrad.addColorStop(0, palette.waterColor)
    waterGrad.addColorStop(1, palette.skyBottom)
    offCtx.fillStyle = waterGrad
    offCtx.fillRect(0, height * 0.54, width, height * 0.46)


    const reflectionStartY = height * 0.55
    const reflectionEndY = height * 0.88
    const numRipples = 64

    for (let i = 0; i < numRipples; i++) {
      const prog = i / numRipples
      const ry = reflectionStartY + prog * (reflectionEndY - reflectionStartY)
      const spread = (prog * 0.12 + 0.02) * width
      const dashWidth = (Math.sin(i * 1.7 + seed) * 0.4 + 0.6) * 6
      const count = Math.floor(spread / 12)

      for (let j = -count; j <= count; j++) {
        const jitter = Math.sin(j * 3.1 + i * 2.4 + seed) * 8
        const rx = sunX + j * 9 + jitter
        if (Math.abs(rx - sunX) < spread) {
          const alpha = (1 - prog * 0.7) * (Math.sin(i + j) * 0.3 + 0.7)
          offCtx.fillStyle = palette.reflectionColor
          offCtx.globalAlpha = alpha
          offCtx.fillRect(rx - dashWidth / 2, ry, dashWidth, 2.5)
        }
      }
    }
    offCtx.globalAlpha = 1.0

    // Dither reveal: downsample with ordered Bayer pixelation when step < 30.
    if (step < 30) {
      const blockSize = Math.max(1, Math.round(18 * Math.pow(1 - step / 30, 1.4)))

      const imgData = offCtx.getImageData(0, 0, width, height)
      const data = imgData.data

      ctx.clearRect(0, 0, width, height)

      // 4x4 Bayer Matrix for authentic dithering texture
      const bayer4x4 = [
        [0, 8, 2, 10],
        [12, 4, 14, 6],
        [3, 11, 1, 9],
        [15, 7, 13, 5],
      ]

      for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
          const pixelIndex = (y * width + x) * 4
          let r = data[pixelIndex]
          let g = data[pixelIndex + 1]
          let b = data[pixelIndex + 2]

          const bayerVal = (bayer4x4[(y / blockSize) % 4][(x / blockSize) % 4] / 16 - 0.5) * (30 - step) * 2.5
          r = Math.min(255, Math.max(0, r + bayerVal))
          g = Math.min(255, Math.max(0, g + bayerVal))
          b = Math.min(255, Math.max(0, b + bayerVal))

          ctx.fillStyle = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`
          ctx.fillRect(x, y, blockSize, blockSize)
        }
      }
    } else {
      ctx.drawImage(offscreen, 0, 0)

      // Soft stochastic grain overlay
      const grainData = ctx.getImageData(0, 0, width, height)
      const gPixels = grainData.data
      for (let i = 0; i < gPixels.length; i += 4) {
        const noise = (Math.random() - 0.5) * 8
        gPixels[i] = Math.min(255, Math.max(0, gPixels[i] + noise))
        gPixels[i + 1] = Math.min(255, Math.max(0, gPixels[i + 1] + noise))
        gPixels[i + 2] = Math.min(255, Math.max(0, gPixels[i + 2] + noise))
      }
      ctx.putImageData(grainData, 0, 0)
    }
  }, [step, activePrompt, seed])

  const handleSelectPrompt = (idx: number) => {
    if (idx === activePromptIndex) return
    setActivePromptIndex(idx)
    setDisplayedPrompt("")
    startResolve()
  }

  const handleNewSeed = () => {
    setSeed(Math.floor(10000 + Math.random() * 89999))
    startResolve()
  }

  return (
    <section
      aria-label="Grain"
      className="relative isolate w-full overflow-hidden bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50"
    >
      <div className="relative mx-auto grid w-full max-w-7xl lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] grid-cols-1 items-center lg:gap-14 gap-12 px-6 sm:px-10 lg:pt-24 pt-16 lg:pb-24 pb-16">
        <div className="relative flex flex-col">
          <p className="font-medium text-neutral-500 text-sm dark:text-neutral-400">Grain</p>

          <h1 className="mt-5 max-w-[10ch] text-balance font-medium text-5xl sm:text-7xl lg:text-[92px] leading-[0.92] tracking-[-0.045em]">
            Type it.
            <br />
            Watch it
            <br />
            develop.
          </h1>

          <p className="mt-8 max-w-md text-pretty text-base sm:text-lg text-neutral-600 leading-relaxed dark:text-neutral-400">
            Grain turns a sentence into a finished picture in seconds. You see every step as it resolves, and every seed is yours to keep, replay and remix.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={startResolve}
              className="group inline-flex h-12 items-center gap-2 bg-neutral-950 px-6 font-medium text-sm text-white transition-colors duration-150 hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 dark:bg-white dark:text-neutral-950 dark:focus-visible:ring-white dark:focus-visible:ring-offset-neutral-950 dark:hover:bg-neutral-200"
            >
              <span>Start generating</span>
              <ArrowRight className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5" />
            </button>

            <a
              href="#writing"
              className="inline-flex h-12 items-center px-5 font-medium text-neutral-700 text-sm transition-colors duration-150 hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:text-neutral-300 dark:focus-visible:ring-white dark:hover:bg-white/10 dark:hover:text-white"
            >
              Browse the gallery
            </a>
          </div>

          <dl className="mt-14 hidden lg:grid max-w-md grid-cols-3 border-black/10 border-t dark:border-white/10">
            <div className="flex flex-col gap-1 pt-5">
              <dt className="order-2 text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                to a finished image
              </dt>
              <dd className="order-1 font-medium text-lg tabular-nums tracking-tight">3.8 s</dd>
            </div>
            <div className="flex flex-col gap-1 pt-5 border-black/10 border-l pl-4 dark:border-white/10">
              <dt className="order-2 text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                native resolution
              </dt>
              <dd className="order-1 font-medium text-lg tabular-nums tracking-tight">2048 px</dd>
            </div>
            <div className="flex flex-col gap-1 pt-5 border-black/10 border-l pl-4 dark:border-white/10">
              <dt className="order-2 text-neutral-500 text-xs leading-snug dark:text-neutral-400">
                every seed and output
              </dt>
              <dd className="order-1 font-medium text-lg tabular-nums tracking-tight">Yours</dd>
            </div>
          </dl>
        </div>

        <div className="relative min-w-0">
          <div className="border border-black/10 bg-neutral-50 p-2.5 dark:border-white/10 dark:bg-neutral-900 shadow-sm">
            <div className="flex min-h-12 items-start gap-3 px-3 pt-2.5 pb-3">
              <span className="mt-[3px] shrink-0 text-neutral-500 text-sm dark:text-neutral-400 font-normal">
                Prompt
              </span>
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-neutral-900 dark:text-neutral-100 font-normal">
                <span>{displayedPrompt}</span>
                <span className="ml-0.5 inline-block h-[1.05em] w-[1.5px] translate-y-[0.18em] bg-neutral-950 dark:bg-white animate-pulse" />
              </p>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden border border-black/5 dark:border-white/5 bg-neutral-100 dark:bg-neutral-900">
              <canvas
                ref={canvasRef}
                aria-label={`Generated image for: ${activePrompt.fullPrompt}`}
                className="absolute inset-0 size-full object-cover"
                role="img"
              />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 pt-3 pb-1.5">
              <span className="font-mono text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400">
                {step === 30 ? "done" : "step"}{" "}
                <span className="text-neutral-950 dark:text-white font-medium">
                  {step < 10 ? `0${step}` : step}
                </span>
                /30
              </span>

              <span
                aria-hidden="true"
                className="relative h-px min-w-16 flex-1 overflow-hidden bg-black/10 dark:bg-white/10"
              >
                <span
                  className="absolute inset-0 origin-left bg-neutral-950 transition-transform duration-100 ease-out dark:bg-white"
                  style={{ transform: `scaleX(${step / 30})` }}
                />
              </span>

              <span className="hidden sm:inline font-mono text-[11px] text-neutral-500 tabular-nums dark:text-neutral-400">
                seed {seed}
              </span>

              <button
                type="button"
                onClick={handleNewSeed}
                aria-label={`New seed. Current seed ${seed}.`}
                className="relative inline-flex h-8 items-center gap-1.5 border border-black/10 bg-white px-3 font-medium text-neutral-800 text-xs transition-colors duration-150 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:border-white/10 dark:bg-neutral-950 dark:text-neutral-200 dark:focus-visible:ring-white dark:hover:bg-neutral-800 cursor-pointer"
              >
                <Dices className="size-3.5" />
                <span>New seed</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-neutral-500 text-xs dark:text-neutral-400">Try</span>
            {PROMPT_OPTIONS.map((opt, idx) => {
              const isSelected = idx === activePromptIndex
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectPrompt(idx)}
                  aria-pressed={isSelected}
                  title={opt.fullPrompt}
                  className={`relative inline-flex h-8 max-w-full items-center truncate border px-3 text-xs transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 dark:focus-visible:ring-white cursor-pointer ${
                    isSelected
                      ? "border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-medium"
                      : "border-black/10 text-neutral-600 hover:border-black/20 hover:text-neutral-950 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/25 dark:hover:text-white bg-transparent"
                  }`}
                >
                  <span className="truncate">{opt.shortLabel}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
