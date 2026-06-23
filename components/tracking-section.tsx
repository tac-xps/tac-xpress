"use client"

import {
  MapMarkerIcon,
  CustomArrowRightIcon,
  CustomGlobeIcon,
  TeamUsersIcon,
  MountainResilienceIcon,
  HandshakeTrustIcon,
} from "@/components/icons/landing-icons"
import Image from "next/image"
import { BorderBeam } from "@/magicui/border-beam"
import { Button } from "@/components/ui/button"
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

export function TrackingSection() {
  return (
    <section id="track" className="w-full py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-12 md:px-24 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col gap-3"
        >
          {/* Top Row: Hero & Metrics */}
          <div className="grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[190px] md:grid-cols-6 lg:auto-rows-[200px]">
            {/* Card 1: Hero */}
            <motion.div
              variants={itemVariants}
              className="relative col-span-2 row-span-2 flex flex-col justify-between overflow-hidden border border-border/50 bg-background/50 p-8 shadow-inner backdrop-blur-sm md:col-span-4"
            >
              <div className="flex items-start justify-between">
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
                  <CustomGlobeIcon className="h-3.5 w-3.5 text-primary" />
                  <span className="text-[10px] tracking-widest text-foreground uppercase">
                    Serving the Community
                  </span>
                </div>
              </div>

              <div>
                <h2 className="font-heading text-4xl text-foreground uppercase sm:text-5xl md:text-6xl">
                  Track Your
                  <br />
                  <span className="text-primary">Cargo</span>
                </h2>
                <div className="mt-8 flex w-full max-w-md flex-col gap-3">
                  <form
                    action="/track"
                    method="get"
                    className="flex w-full items-center"
                  >
                    <input
                      id="landing-awb"
                      type="text"
                      name="awb"
                      aria-label="AWB number"
                      placeholder="Enter AWB Number (e.g. AWB-12345)"
                      className="flex h-12 w-full border border-border bg-background px-4 py-2 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary"
                      required
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="h-12 rounded-none px-6 font-mono font-bold tracking-wider"
                    >
                      TRACK <CustomArrowRightIcon className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                  <span className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    Stay connected to your shipment every step of the way
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Card 2: Metrics */}
            <motion.div
              variants={itemVariants}
              className="col-span-2 row-span-2 flex flex-col items-center justify-center gap-8 border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm md:col-span-2 md:flex-row md:justify-around lg:flex-col lg:justify-center"
            >
              {[
                { num: "15+", label: "Years Experience" },
                { num: "1", label: "Dedicated Team" },
                { num: "100%", label: "Commitment" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="text-4xl font-light text-primary lg:text-5xl">
                    {s.num}
                  </p>
                  <p className="mt-2 text-[10px] tracking-widest text-muted-foreground uppercase">
                    {s.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Card 3: Dashboard Image (Strict 16:9) */}
          <motion.div
            variants={itemVariants}
            className="relative aspect-video w-full overflow-hidden border border-border/50 bg-black shadow-inner"
          >
            <BorderBeam
              duration={6}
              size={200}
              className="from-transparent via-primary to-transparent"
            />
            <Image
              src="/images/track_your_cargo_new.jpg"
              className="size-full object-cover object-center"
              alt="Tac-Xpress Operations Resilience"
              width={1920}
              height={1080}
              priority
            />
          </motion.div>

          {/* Features Row */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {/* Card 4: Route */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-between border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm"
            >
              <MapMarkerIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="mt-4 mb-2 text-lg font-medium tracking-widest text-foreground uppercase">
                  New Delhi ↔ Imphal
                </p>
                <p className="text-sm leading-snug font-light text-muted-foreground italic">
                  Deeply rooted in serving the Northeast community in New Delhi
                  for over 15 years.
                </p>
              </div>
            </motion.div>

            {/* Card 5: Challenges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-between border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm"
            >
              <MountainResilienceIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="mt-4 mb-1 text-[10px] tracking-widest text-primary uppercase">
                  Resilience
                </p>
                <p className="mb-1 text-lg font-medium tracking-widest text-foreground uppercase">
                  Overcoming Challenges
                </p>
                <p className="text-sm font-light text-muted-foreground">
                  Manipur faces various issues from time to time, but our team
                  always pulls through to ensure delivery.
                </p>
              </div>
            </motion.div>

            {/* Card 6: Team */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col justify-between border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm"
            >
              <TeamUsersIcon className="h-6 w-6 text-primary" />
              <div>
                <p className="mt-4 mb-1 text-[10px] tracking-widest text-primary uppercase">
                  Experience
                </p>
                <p className="mb-1 text-lg font-medium tracking-widest text-foreground uppercase">
                  Dedicated Team
                </p>
                <p className="text-sm font-light text-muted-foreground">
                  With vast operational experience, we work tirelessly to
                  service our customers better every day.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Card 7: Analytics replacement -> Community connection */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-between border border-border/50 bg-background/50 p-6 shadow-inner backdrop-blur-sm md:flex-row md:p-8"
          >
            <div className="flex max-w-2xl flex-col justify-between">
              <div>
                <HandshakeTrustIcon className="mb-4 h-6 w-6 text-primary" />
                <p className="mb-2 text-2xl font-medium tracking-widest text-foreground uppercase">
                  Unwavering Dedication
                </p>
                <p className="text-sm leading-relaxed font-light text-muted-foreground italic md:text-base">
                  We don't just move boxes; we connect families, businesses, and
                  communities. Our commitment to the Northeast community in New
                  Delhi is built on trust and 15 years of hard work.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-start md:mt-0 md:justify-end">
              <div className="flex gap-4 border border-primary/20 bg-primary/5 p-5">
                <div className="px-4 text-center">
                  <p className="text-xl font-light text-primary md:text-2xl">
                    15+
                  </p>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    Years
                  </p>
                </div>
                <div className="w-px bg-primary/20"></div>
                <div className="px-4 text-center">
                  <p className="text-xl font-light text-primary md:text-2xl">
                    100%
                  </p>
                  <p className="text-[10px] tracking-widest text-muted-foreground uppercase">
                    Effort
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
