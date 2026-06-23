"use client"

import { cn } from "@/lib/utils"
import type React from "react"
import Image from "next/image"
import {
  CargoPlaneIcon,
  RouteTruckIcon,
  MapMarkerIcon,
  TrackingBoxIcon,
} from "@/components/icons/landing-icons"
import { motion } from "framer-motion"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
}

const features = [
  {
    id: "air-cargo",
    children: <AirCargoVisual />,
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    id: "surface-cargo",
    children: <SurfaceCargoVisual />,
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    id: "pick-drop",
    children: <PickDropVisual />,
    className: "md:col-span-1 lg:col-span-1",
  },
  {
    id: "packaging",
    children: <PackagingVisual />,
    className: "md:col-span-1 lg:col-span-1",
  },
]

export function FeatureSection() {
  return (
    <section id="services" className="w-full py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 sm:px-12 md:px-24">
        {/* Section Header */}
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-primary" />
            OUR DEDICATED SERVICES
          </div>
          <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl">
            What We Offer
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Built for reliability. Whether it's urgent air freight or heavy
            surface cargo, our dedicated team delivers your goods safely.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mx-auto grid w-full grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => (
            <motion.div
              variants={itemVariants}
              key={feature.id}
              className={feature.className}
            >
              <FeatureCard>{feature.children}</FeatureCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function FeatureCard({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "group relative flex h-full flex-col items-center justify-start overflow-hidden rounded-none border border-border/40 bg-background/50 px-8 pt-12 pb-10 text-center shadow-inner backdrop-blur-sm",
        className
      )}
    >
      {children}
    </div>
  )
}

function FeatureTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      className={cn("text-xl font-medium text-foreground", className)}
      {...props}
    />
  )
}

function FeatureDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
}

function AirCargoVisual() {
  return (
    <>
      <div className="relative mx-auto flex size-32 items-center justify-center overflow-hidden border bg-background shadow-xs outline outline-offset-4 outline-border">
        <Image
          src="/images/Air_Cargo.jpg"
          alt="Air Cargo"
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="relative mt-8 space-y-2">
        <FeatureTitle>Air Cargo</FeatureTitle>
        <FeatureDescription>
          Fast, priority transit for urgent deliveries between New Delhi and
          Imphal.
        </FeatureDescription>
      </div>
    </>
  )
}

function SurfaceCargoVisual() {
  return (
    <>
      <div className="relative mx-auto flex size-32 items-center justify-center overflow-hidden border bg-background shadow-xs outline outline-offset-4 outline-border">
        <Image
          src="/images/Surface_Cargo.jpg"
          alt="Surface Cargo"
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="relative mt-8 space-y-2">
        <FeatureTitle>Surface Cargo</FeatureTitle>
        <FeatureDescription>
          Cost-effective and secure surface transportation for heavy shipments.
        </FeatureDescription>
      </div>
    </>
  )
}

function PickDropVisual() {
  return (
    <>
      <div className="relative mx-auto flex size-32 items-center justify-center overflow-hidden border bg-background shadow-xs outline outline-offset-4 outline-border">
        <Image
          src="/images/Pick_and_Drop.jpg"
          alt="Pick & Drop"
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="relative mt-8 space-y-2">
        <FeatureTitle>Pick & Drop</FeatureTitle>
        <FeatureDescription>
          Convenient door-to-door pick and drop services tailored for our
          community.
        </FeatureDescription>
      </div>
    </>
  )
}

function PackagingVisual() {
  return (
    <>
      <div className="relative mx-auto flex size-32 items-center justify-center overflow-hidden border bg-background shadow-xs outline outline-offset-4 outline-border">
        <Image
          src="/images/Packaging.jpg"
          alt="Packaging"
          fill
          sizes="128px"
          className="object-cover"
          unoptimized
        />
      </div>

      <div className="relative mt-8 space-y-2">
        <FeatureTitle>Packaging</FeatureTitle>
        <FeatureDescription>
          Professional packaging solutions to ensure your goods survive the
          journey safely.
        </FeatureDescription>
      </div>
    </>
  )
}
