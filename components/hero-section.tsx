"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { DecorIcon } from "@/components/decor-icon"
import { FullWidthDivider } from "@/components/full-width-divider"
import {
  CustomArrowRightIcon,
  PhoneCallCustomIcon,
} from "@/components/icons/landing-icons"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { TextEffect } from "@/components/text-effect"

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center justify-center gap-6 px-4 pt-36 pb-16 md:px-6 md:pt-40 md:pb-20 lg:pt-44 lg:pb-24">
        <div aria-hidden="true" className="absolute inset-0 -z-1 size-full">
          {/* 2026 Hero Glow — Light: Ivory Cartridge / Dark: Nexent Void */}
          {/* Primary atmospheric glow — centered, wide, foundational */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklch, oklch(72% 0.14 65) 18%, transparent) 0%, transparent 70%)",
            }}
            className={cn(
              "absolute top-1/2 left-1/2 h-[420px] w-[900px] -translate-x-1/2 -translate-y-1/2",
              "dark:[background:radial-gradient(ellipse_at_center,color-mix(in_oklch,oklch(38%_0.14_168)_28%,transparent)_0%,transparent_70%)]",
              "blur-[90px] motion-reduce:animate-none"
            )}
          />
          {/* Secondary accent glow — offset upper-right for visual tension */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.8, delay: 0.25, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklch, oklch(64% 0.09 260) 14%, transparent) 0%, transparent 65%)",
            }}
            className={cn(
              "absolute top-[30%] left-[60%] h-72 w-[580px] -translate-x-1/2 -translate-y-1/2",
              "dark:[background:radial-gradient(ellipse_at_center,color-mix(in_oklch,oklch(82%_0.2_158)_12%,transparent)_0%,transparent_65%)]",
              "blur-[70px] mix-blend-normal dark:mix-blend-screen motion-reduce:animate-none"
            )}
          />
          {/* Tertiary micro-glow — lower-left counter-balance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2.2, delay: 0.5, ease: "easeOut" }}
            style={{
              background:
                "radial-gradient(ellipse at center, color-mix(in oklch, oklch(78% 0.11 45) 10%, transparent) 0%, transparent 60%)",
            }}
            className={cn(
              "absolute top-[65%] left-[25%] h-56 w-[380px] -translate-x-1/2 -translate-y-1/2",
              "dark:[background:radial-gradient(ellipse_at_center,color-mix(in_oklch,oklch(55%_0.1_168)_15%,transparent)_0%,transparent_60%)]",
              "blur-[60px] motion-reduce:animate-none"
            )}
          />
        </div>
        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-none border bg-card p-1 shadow outline-none",
            "transition-all delay-500 duration-500 ease-out animate-in fade-in fill-mode-backwards slide-in-from-bottom-10",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          )}
          href="#services"
        >
          <div className="rounded-xs border bg-card px-1.5 py-0.5 shadow-sm">
            <p className="font-mono text-xs">NOW</p>
          </div>

          <span className="text-xs">
            Built for the Northeast India Community
          </span>
          <span className="block h-5 border-l" />

          <div className="pr-1">
            <CustomArrowRightIcon className="size-3 -translate-x-0.5 duration-150 ease-out group-hover:translate-x-0.5" />
          </div>
        </a>

        <TextEffect
          as="h1"
          preset="fade-in-blur"
          per="word"
          className={cn(
            "max-w-3xl text-center text-3xl text-balance text-foreground md:text-5xl lg:text-6xl"
          )}
        >
          Delivering Cargo Services With Respect for the People We Serve
        </TextEffect>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.2,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className={cn(
            "max-w-2xl text-center text-sm tracking-wider text-muted-foreground sm:text-lg"
          )}
        >
          Tac-Xpress was founded to support the movement of goods between Imphal
          and New Delhi with dependable service, thoughtful handling, and a
          long-term commitment to the communities that rely on us.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.3,
            ease: [0.21, 0.47, 0.32, 0.98],
          }}
          className="flex w-fit items-center justify-center gap-3 pt-2"
        >
          <Button
            variant="outline"
            className="transition-transform hover:scale-105 active:scale-95"
            asChild
          >
            <Link href="#quote">
              <PhoneCallCustomIcon className="mr-2 size-4" /> Get a Quote
            </Link>
          </Button>
          <Button
            className="shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
            asChild
          >
            <Link href="#services">
              Explore Services <CustomArrowRightIcon className="ml-2 size-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
      <div className="relative">
        <DecorIcon className="size-5" position="top-left" />
        <DecorIcon className="size-5" position="top-right" />
        <DecorIcon className="size-5" position="bottom-left" />
        <DecorIcon className="size-5" position="bottom-right" />

        <FullWidthDivider className="-top-px" />
        <div className="flex justify-center overflow-hidden *:pointer-events-none *:aspect-video *:select-none">
          <Image
            alt="TAC-XPRESS cargo logistics dashboard"
            className="h-auto w-full max-w-6xl rounded-lg border border-border/40 object-cover shadow-lg"
            src="/hero-bg.png"
            width={1600}
            height={900}
            priority
          />
        </div>
        <FullWidthDivider className="-bottom-px" />
      </div>
    </section>
  )
}
