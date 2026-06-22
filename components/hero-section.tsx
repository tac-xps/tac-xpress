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
import { TextEffect } from "@/components/text-effect"

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[90vh] w-full flex-col items-center justify-center"
    >
      <div className="relative flex flex-col items-center justify-center gap-5 px-4 py-12 md:px-4 md:py-24 lg:py-28">
        <div aria-hidden="true" className="absolute inset-0 -z-1 size-full">
          {/* Primary Brand Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className={cn(
              "absolute top-1/2 left-1/2 h-[400px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-[100%]",
              "bg-blue-400/15 dark:bg-primary/20",
              "blur-[80px]"
            )}
          />
          {/* Accent Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
            className={cn(
              "absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/4 -translate-y-1/3 rounded-[100%]",
              "bg-sky-300/15 dark:bg-indigo-500/20",
              "blur-[80px] dark:mix-blend-screen"
            )}
          />
        </div>
        <a
          className={cn(
            "group mx-auto flex w-fit items-center gap-3 rounded-none border bg-card p-1 shadow",
            "animate-in transition-all delay-500 duration-500 ease-out fill-mode-backwards slide-in-from-bottom-10 fade-in"
          )}
          href="#link"
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
          >
            <PhoneCallCustomIcon className="mr-2 size-4" /> Get a Quote
          </Button>
          <Button className="shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95">
            Explore Services <CustomArrowRightIcon className="ml-2 size-4" />
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
