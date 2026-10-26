"use client"

import * as React from "react"
import {
  SlidersHorizontal,
  Video,
  Users,
  MessageSquare,
  Check,
  Play,
  Pause,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react"

type TabType = "retouch" | "video" | "review" | "feedback"

interface Reviewer {
  id: string
  name: string
  role: string
  avatar: string
  status: "Approved" | "Pending"
  time: string
}

const REVIEWERS: Reviewer[] = [
  {
    id: "ana",
    name: "Ana Moreno",
    role: "Lead Creative",
    avatar: "AM",
    status: "Approved",
    time: "10m ago",
  },
  {
    id: "jules",
    name: "Jules Laurent",
    role: "Art Director",
    avatar: "JL",
    status: "Approved",
    time: "24m ago",
  },
  {
    id: "sam",
    name: "Sam Okafor",
    role: "Brand Director",
    avatar: "SO",
    status: "Approved",
    time: "1h ago",
  },
]

interface FeedbackComment {
  id: number
  author: string
  avatar: string
  text: string
  tag: string
  resolved: boolean
  coords: { x: number; y: number }
}

const FEEDBACK_COMMENTS: FeedbackComment[] = [
  {
    id: 1,
    author: "Ana Moreno",
    avatar: "AM",
    text: "Can we soften the shadow under the chin?",
    tag: "Fixed in v4",
    resolved: true,
    coords: { x: 48, y: 64 },
  },
  {
    id: 2,
    author: "Jules Laurent",
    avatar: "JL",
    text: "Hair edge looks cut out here on the rim light.",
    tag: "On it",
    resolved: false,
    coords: { x: 70, y: 26 },
  },
]

export function MarlowFeature() {
  const [activeTab, setActiveTab] = React.useState<TabType>("retouch")
  const [sliderPos, setSliderPos] = React.useState(60)
  const [isPlayingVideo, setIsPlayingVideo] = React.useState(true)
  const [currentFrame, setCurrentFrame] = React.useState(3)
  const [activePin, setActivePin] = React.useState<number | null>(1)

  React.useEffect(() => {
    if (activeTab !== "video" || !isPlayingVideo) return

    const interval = setInterval(() => {
      setCurrentFrame((prev) => (prev % 6) + 1)
    }, 600)

    return () => clearInterval(interval)
  }, [activeTab, isPlayingVideo])

  return (
    <section
      aria-label="Features made for you"
      className="relative isolate w-full bg-white text-neutral-950 dark:bg-neutral-950 dark:text-neutral-50 py-20 sm:py-28 px-6 sm:px-10 overflow-hidden"
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-neutral-950 dark:text-neutral-50 leading-[1.1]">
          Features made for you
        </h2>
        <p className="mt-4 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed text-pretty">
          Elevate your personal brand with AI-powered portraits that capture your true essence and more.
        </p>
      </div>

      <div className="mx-auto mt-12 sm:mt-16 max-w-5xl rounded-none border border-black/10 bg-neutral-50/70 dark:border-white/10 dark:bg-neutral-900/60 p-3 sm:p-5 shadow-xs backdrop-blur-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/5 dark:border-white/5 pb-3 px-1 sm:px-2">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("retouch")}
              className={`inline-flex h-9 items-center gap-2 rounded-none px-3.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "retouch"
                  ? "bg-white text-neutral-950 shadow-xs border border-black/10 dark:bg-neutral-800 dark:text-white dark:border-white/10"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Retouch</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("video")}
              className={`inline-flex h-9 items-center gap-2 rounded-none px-3.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "video"
                  ? "bg-white text-neutral-950 shadow-xs border border-black/10 dark:bg-neutral-800 dark:text-white dark:border-white/10"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Video className="size-3.5" />
              <span>Video</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("review")}
              className={`inline-flex h-9 items-center gap-2 rounded-none px-3.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "review"
                  ? "bg-white text-neutral-950 shadow-xs border border-black/10 dark:bg-neutral-800 dark:text-white dark:border-white/10"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <Users className="size-3.5" />
              <span>Review</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("feedback")}
              className={`inline-flex h-9 items-center gap-2 rounded-none px-3.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === "feedback"
                  ? "bg-white text-neutral-950 shadow-xs border border-black/10 dark:bg-neutral-800 dark:text-white dark:border-white/10"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-black/5 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-white/5"
              }`}
            >
              <MessageSquare className="size-3.5" />
              <span>Feedback</span>
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-neutral-500 dark:text-neutral-400">
            <span>maya-portrait.jpg</span>
          </div>
        </div>

        <div className="pt-6 pb-3 px-2 sm:px-4">
          {activeTab === "retouch" && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[340px] sm:max-w-[370px] overflow-hidden rounded-none border border-black/10 dark:border-white/10 bg-neutral-200 dark:bg-neutral-800 shadow-sm select-none">
                  <div className="absolute left-3.5 top-3.5 z-20 rounded-none bg-neutral-900/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    Before
                  </div>
                  <div className="absolute right-3.5 top-3.5 z-20 rounded-none bg-neutral-900/60 px-2 py-1 text-[11px] font-medium text-white backdrop-blur-md">
                    After
                  </div>

                  {/* Layer 1: BEFORE Portrait (Cool studio lighting, unretouched, raw film vibe) */}
                  <div className="absolute inset-0 size-full bg-linear-to-br from-[#8C93A8] via-[#5C647C] to-[#2B3042] flex items-center justify-center overflow-hidden">
                    <svg
                      viewBox="0 0 360 480"
                      className="absolute inset-0 size-full object-cover filter contrast-90 brightness-95"
                      aria-hidden="true"
                    >
                      <defs>
                        {/* Background ambience */}
                        <linearGradient id="bgBefore" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#9FA7BD" />
                          <stop offset="60%" stopColor="#6C738D" />
                          <stop offset="100%" stopColor="#303548" />
                        </linearGradient>
                        <radialGradient id="coolRim" cx="85%" cy="35%" r="65%">
                          <stop offset="0%" stopColor="#7E8FF5" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#7E8FF5" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="360" height="480" fill="url(#bgBefore)" />
                      <rect width="360" height="480" fill="url(#coolRim)" />

                      {/* Hair Silhouette */}
                      <path
                        d="M100 230 C90 140 120 70 180 70 C240 70 270 140 260 230 C275 300 270 380 270 480 L90 480 C90 380 85 300 100 230 Z"
                        fill="#1F2026"
                      />

                      {/* Face / Jawline */}
                      <path
                        d="M130 160 C125 240 145 285 180 285 C215 285 235 240 230 160 C230 120 205 105 180 105 C155 105 130 120 130 160 Z"
                        fill="#D9B79E"
                      />

                      {/* Cool Neck & Chest */}
                      <path d="M155 270 L155 350 L205 350 L205 270 Z" fill="#CFA88E" />

                      {/* Dark Minimal Crewneck Sweater */}
                      <path
                        d="M90 480 C100 370 140 330 155 330 C165 345 195 345 205 330 C220 330 260 370 270 480 Z"
                        fill="#15161A"
                      />

                      {/* Facial Features (Maya) */}
                      {/* Eyebrows */}
                      <path d="M145 168 Q160 163 172 168" stroke="#2B1E1A" strokeWidth="2.5" fill="none" />
                      <path d="M188 168 Q200 163 215 168" stroke="#2B1E1A" strokeWidth="2.5" fill="none" />

                      {/* Eyes */}
                      <ellipse cx="158" cy="180" rx="9" ry="5.5" fill="#241B18" />
                      <ellipse cx="202" cy="180" rx="9" ry="5.5" fill="#241B18" />
                      <circle cx="159" cy="179" r="2" fill="#FFFFFF" opacity="0.8" />
                      <circle cx="203" cy="179" r="2" fill="#FFFFFF" opacity="0.8" />

                      {/* Nose bridge & tip */}
                      <path d="M180 178 Q182 205 178 215 Q183 220 186 215" stroke="#9E7660" strokeWidth="2" fill="none" />

                      {/* Lips */}
                      <path d="M166 238 Q180 235 194 238 Q180 252 166 238 Z" fill="#9E5D57" />
                    </svg>

                    {/* Unretouched Skin Grain / Cool Tone */}
                    <div className="absolute inset-0 bg-[#34405E]/20 mix-blend-color" />
                  </div>

                  {/* Layer 2: AFTER Portrait (Warm Keylight +12, Softened Skin, Warm Grade) */}
                  <div
                    className="absolute inset-0 size-full bg-linear-to-br from-[#D4A373] via-[#B5838D] to-[#3B2C35] flex items-center justify-center overflow-hidden"
                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                  >
                    <svg
                      viewBox="0 0 360 480"
                      className="absolute inset-0 size-full object-cover filter brightness-105 contrast-105"
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id="bgAfter" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#C9B4A6" />
                          <stop offset="50%" stopColor="#8C8899" />
                          <stop offset="100%" stopColor="#252433" />
                        </linearGradient>
                        <radialGradient id="warmKey" cx="30%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#FFE0B2" stopOpacity="0.55" />
                          <stop offset="60%" stopColor="#FFA07A" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="#FFA07A" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="violetRim" cx="85%" cy="40%" r="65%">
                          <stop offset="0%" stopColor="#8E9AFF" stopOpacity="0.55" />
                          <stop offset="100%" stopColor="#8E9AFF" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="360" height="480" fill="url(#bgAfter)" />
                      <rect width="360" height="480" fill="url(#warmKey)" />
                      <rect width="360" height="480" fill="url(#violetRim)" />

                      {/* Hair Silhouette with soft shine */}
                      <path
                        d="M100 230 C90 140 120 70 180 70 C240 70 270 140 260 230 C275 300 270 380 270 480 L90 480 C90 380 85 300 100 230 Z"
                        fill="#1C1822"
                      />

                      {/* Retouched Softened Face & Jaw */}
                      <path
                        d="M130 160 C125 240 145 285 180 285 C215 285 235 240 230 160 C230 120 205 105 180 105 C155 105 130 120 130 160 Z"
                        fill="#F3D1BC"
                      />

                      {/* Warm Studio Keylight on Cheek */}
                      <ellipse cx="152" cy="195" rx="28" ry="32" fill="#FFE8D6" opacity="0.45" />

                      {/* Soft Retouched Neck */}
                      <path d="M155 270 L155 350 L205 350 L205 270 Z" fill="#E8C3AC" />

                      {/* Minimal Dark Sweater */}
                      <path
                        d="M90 480 C100 370 140 330 155 330 C165 345 195 345 205 330 C220 330 260 370 270 480 Z"
                        fill="#141318"
                      />

                      {/* Refined Features */}
                      <path d="M145 168 Q160 162 172 168" stroke="#251612" strokeWidth="2.8" strokeLinecap="round" fill="none" />
                      <path d="M188 168 Q200 162 215 168" stroke="#251612" strokeWidth="2.8" strokeLinecap="round" fill="none" />

                      {/* Eyes with warm catchlight */}
                      <ellipse cx="158" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <ellipse cx="202" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <circle cx="160" cy="178" r="2.5" fill="#FFFFFF" />
                      <circle cx="204" cy="178" r="2.5" fill="#FFFFFF" />

                      <path d="M180 178 Q182 205 178 214 Q183 219 186 214" stroke="#B08369" strokeWidth="2" strokeLinecap="round" fill="none" />

                      {/* Soft Satin Lips */}
                      <path d="M166 238 Q180 234 194 238 Q180 254 166 238 Z" fill="#C26D68" />
                    </svg>

                    {/* Warm Color Grade Overlay */}
                    <div className="absolute inset-0 bg-[#F59E0B]/10 mix-blend-overlay" />
                  </div>

                  <div
                    className="absolute inset-y-0 z-30 w-px bg-white/90 shadow-sm transition-none pointer-events-none"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-7.5 rounded-none bg-white text-neutral-800 shadow-md border border-black/10 flex items-center justify-center">
                      <div className="flex items-center gap-0.75">
                        <div className="h-3 w-0.5 rounded-none bg-neutral-400" />
                        <div className="h-3 w-0.5 rounded-none bg-neutral-400" />
                      </div>
                    </div>
                  </div>

                  {/* Invisible Range Input Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    aria-label="Compare before and after"
                    className="peer absolute inset-0 z-40 size-full cursor-ew-resize opacity-0"
                  />
                </div>

                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center font-normal">
                  Drag the line to compare before and after
                </p>
              </div>

              <div className="flex flex-col justify-center py-2 lg:pl-4">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950 dark:text-white">
                  Edit, retouch, and enhance
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed text-pretty">
                  All assets in one place. Everything you need to create your portrait.
                </p>

                <div className="mt-8 space-y-3.5 divide-y divide-black/5 dark:divide-white/5">
                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-5 rounded-none bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                        <Check className="size-3 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Skin
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      Softened
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-5 rounded-none bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                        <Check className="size-3 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Key light
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      +12
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-5 rounded-none bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 flex items-center justify-center">
                        <Check className="size-3 stroke-[2.5]" />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        Color grade
                      </span>
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                      Warm
                    </span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSliderPos(sliderPos > 50 ? 20 : 80)}
                    className="inline-flex h-9 items-center gap-1.5 rounded-none border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 px-4 text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-2xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    <span>Toggle split preview</span>
                    <ChevronRight className="size-3 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "video" && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[340px] sm:max-w-[370px] overflow-hidden rounded-none border border-black/10 dark:border-white/10 bg-neutral-900 shadow-sm select-none">
                  <div className="absolute inset-0 size-full flex items-center justify-center">
                    <svg viewBox="0 0 360 480" className="size-full object-cover" aria-hidden="true">
                      <defs>
                        <linearGradient id="bgVideo" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#2D283E" />
                          <stop offset="100%" stopColor="#121019" />
                        </linearGradient>
                        <radialGradient id="videoLight" cx="40%" cy="30%" r="70%">
                          <stop offset="0%" stopColor="#907AD6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#4F518C" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                      <rect width="360" height="480" fill="url(#bgVideo)" />
                      <rect width="360" height="480" fill="url(#videoLight)" />

                      {/* Head rotation based on currentFrame */}
                      <g
                        transform={`translate(${180 + (currentFrame - 3.5) * 4}, 200) rotate(${(currentFrame - 3.5) * 1.5}) translate(-180, -200)`}
                      >
                        <path
                          d="M100 230 C90 140 120 70 180 70 C240 70 270 140 260 230 C275 300 270 380 270 480 L90 480 C90 380 85 300 100 230 Z"
                          fill="#1C1822"
                        />
                        <path
                          d="M130 160 C125 240 145 285 180 285 C215 285 235 240 230 160 C230 120 205 105 180 105 C155 105 130 120 130 160 Z"
                          fill="#E7C0AA"
                        />
                        <ellipse cx="158" cy="180" rx="9" ry="6" fill="#1C1310" />
                        <ellipse cx="202" cy="180" rx="9" ry="6" fill="#1C1310" />
                        <circle cx="160" cy="178" r="2.5" fill="#FFFFFF" />
                        <circle cx="204" cy="178" r="2.5" fill="#FFFFFF" />
                        <path d="M166 238 Q180 234 194 238 Q180 254 166 238 Z" fill="#C26D68" />
                      </g>
                    </svg>
                  </div>

                  <div className="absolute left-3.5 top-3.5 z-20 rounded-none bg-neutral-900/70 px-2.5 py-1 text-[11px] font-mono text-white backdrop-blur-md">
                    Frame {currentFrame} of 6
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                    aria-label={isPlayingVideo ? "Pause video loop" : "Play video loop"}
                    className="absolute right-3.5 bottom-3.5 z-20 size-8 rounded-none bg-white/90 text-neutral-950 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
                  >
                    {isPlayingVideo ? <Pause className="size-3.5" /> : <Play className="size-3.5 ml-0.5" />}
                  </button>
                </div>

                <div className="mt-4 flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((frameNum) => (
                    <button
                      key={frameNum}
                      type="button"
                      onClick={() => {
                        setCurrentFrame(frameNum)
                        setIsPlayingVideo(false)
                      }}
                      className={`h-7 w-8 rounded-none text-[11px] font-mono transition-all cursor-pointer ${
                        currentFrame === frameNum
                          ? "border-2 border-neutral-950 bg-neutral-950 text-white dark:border-white dark:bg-white dark:text-neutral-950 font-medium scale-105"
                          : "border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {frameNum}
                    </button>
                  ))}
                </div>

                <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400 text-center font-normal">
                  Playing 6 frames on a loop
                </p>
              </div>

              <div className="flex flex-col justify-center py-2 lg:pl-4">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950 dark:text-white">
                  Create video
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed text-pretty">
                  Create video with consecutive frames of images. Generate consistent motion, lighting, and expressions across multi-frame sequences.
                </p>

                <div className="mt-8 space-y-3">
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5 text-xs">
                    <span className="text-neutral-500">Output Format</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium">MP4 / ProRes 422</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5 text-xs">
                    <span className="text-neutral-500">Frame Rate</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium">24 fps Cinematic</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-2.5 text-xs">
                    <span className="text-neutral-500">Interpolation</span>
                    <span className="font-mono text-neutral-900 dark:text-neutral-100 font-medium">Motion-Flow v2</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "review" && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[340px] sm:max-w-[370px] overflow-hidden rounded-none border border-black/10 dark:border-white/10 bg-neutral-900 shadow-sm select-none">
                  <div className="absolute inset-0 size-full flex items-center justify-center">
                    <svg viewBox="0 0 360 480" className="size-full object-cover" aria-hidden="true">
                      <rect width="360" height="480" fill="#24212D" />
                      <ellipse cx="180" cy="200" rx="90" ry="120" fill="#E8C3AC" />
                      <ellipse cx="158" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <ellipse cx="202" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <path d="M166 238 Q180 234 194 238 Q180 254 166 238 Z" fill="#C26D68" />
                    </svg>
                  </div>

                  <div className="absolute right-3.5 top-3.5 z-20 inline-flex items-center gap-1.5 rounded-none bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 backdrop-blur-md">
                    <CheckCircle2 className="size-3.5" />
                    <span>Approved</span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center font-normal">
                  Approved by all 3 reviewers, ready to export
                </p>
              </div>

              <div className="flex flex-col justify-center py-2 lg:pl-4">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950 dark:text-white">
                  Work in a team environment
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed text-pretty">
                  Edit, validate, and enhance your portraits with your team. Maintain strict brand compliance with automated stakeholder sign-offs.
                </p>

                <div className="mt-8 space-y-2.5">
                  {REVIEWERS.map((rev) => (
                    <div
                      key={rev.id}
                      className="flex items-center justify-between rounded-none border border-black/5 dark:border-white/5 bg-white dark:bg-neutral-800/80 p-3 shadow-2xs"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-none bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs flex items-center justify-center font-mono">
                          {rev.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                            {rev.name}
                          </p>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {rev.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium font-mono">
                        <Check className="size-3.5 stroke-[2.5]" />
                        <span>{rev.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "feedback" && (
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center gap-8 lg:gap-12">
              <div className="flex flex-col items-center">
                <div className="relative aspect-[3/4] w-full max-w-[340px] sm:max-w-[370px] overflow-hidden rounded-none border border-black/10 dark:border-white/10 bg-neutral-900 shadow-sm select-none">
                  <div className="absolute inset-0 size-full flex items-center justify-center">
                    <svg viewBox="0 0 360 480" className="size-full object-cover" aria-hidden="true">
                      <rect width="360" height="480" fill="#24212D" />
                      <ellipse cx="180" cy="200" rx="90" ry="120" fill="#E8C3AC" />
                      <ellipse cx="158" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <ellipse cx="202" cy="180" rx="9" ry="6" fill="#1C1310" />
                      <path d="M166 238 Q180 234 194 238 Q180 254 166 238 Z" fill="#C26D68" />
                    </svg>
                  </div>

                  {FEEDBACK_COMMENTS.map((comm) => (
                    <button
                      key={comm.id}
                      type="button"
                      onClick={() => setActivePin(comm.id)}
                      aria-label={`View feedback pin ${comm.id} by ${comm.author}`}
                      style={{ left: `${comm.coords.x}%`, top: `${comm.coords.y}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 size-7 rounded-none text-xs font-bold shadow-lg transition-transform hover:scale-110 flex items-center justify-center cursor-pointer ${
                        activePin === comm.id
                          ? "bg-neutral-950 text-white ring-4 ring-white/50 scale-110 dark:bg-white dark:text-neutral-950"
                          : "bg-white text-neutral-900 border border-black/20"
                      }`}
                    >
                      {comm.id}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400 text-center font-normal">
                  2 comments on this portrait, click pin to inspect
                </p>
              </div>

              <div className="flex flex-col justify-center py-2 lg:pl-4">
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-neutral-950 dark:text-white">
                  Project discussion and feedback
                </h3>
                <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed text-pretty">
                  Discuss your portraits with your team. Pin annotations directly onto high-resolution canvases with immediate issue tracking.
                </p>

                <div className="mt-8 space-y-3">
                  {FEEDBACK_COMMENTS.map((comm) => (
                    <div
                      key={comm.id}
                      onClick={() => setActivePin(comm.id)}
                      className={`rounded-none border p-3.5 transition-all cursor-pointer ${
                        activePin === comm.id
                          ? "border-neutral-950 bg-white dark:border-white dark:bg-neutral-800 shadow-sm"
                          : "border-black/5 bg-white/70 dark:border-white/5 dark:bg-neutral-800/40 hover:border-black/15"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="size-5 rounded-none bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-[10px] font-bold flex items-center justify-center">
                            {comm.id}
                          </span>
                          <span className="text-xs font-medium text-neutral-900 dark:text-neutral-100">
                            {comm.author}
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-none ${
                            comm.resolved
                              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                              : "bg-amber-500/10 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {comm.tag}
                        </span>
                      </div>
                      <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        {comm.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
