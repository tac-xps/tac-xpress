"use client"

import React from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { BorderBeam } from "@/magicui/border-beam"
import {
  CargoPlaneIcon,
  RouteTruckIcon,
} from "@/components/icons/landing-icons"

export function RouteNetworkSection() {
  return (
    <section id="routes" className="w-full py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 sm:px-12 md:px-24">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            NETWORK COVERAGE
          </div>
          <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl">
            Fleet & Logistics
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            A robust, modern fleet of cargo planes and surface vehicles ensuring
            your goods reach their destination quickly and safely.
          </p>
        </div>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-none border border-border bg-black shadow-inner">
            <BorderBeam
              duration={8}
              size={150}
              className="from-transparent via-primary to-transparent"
            />
            <Image
              src="/images/fleet_and_logistics.jpg"
              alt="Tac-Xpress Logistics Fleet"
              width={1920}
              height={1080}
              className="size-full object-cover opacity-90 transition-opacity duration-500 hover:opacity-100"
              priority
            />
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2 rounded-none border border-border bg-background/80 p-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <CargoPlaneIcon className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-foreground uppercase">
                  Air Cargo Network
                </span>
              </div>
              <div className="mt-1 flex items-center gap-3">
                <RouteTruckIcon className="h-4 w-4 text-primary" />
                <span className="font-mono text-xs font-semibold text-foreground uppercase">
                  Surface Transport
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
