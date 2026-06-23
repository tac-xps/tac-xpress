"use client"

import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import {
  MapMarkerIcon,
  ActivityPulseIcon,
  ShieldSecurityIcon,
  ZapLightningIcon,
} from "@/components/icons/landing-icons"

export function BentoSection() {
  return (
    <section id="about" className="w-full py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 sm:px-12 md:px-24">
        <div className="flex w-full flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            TACTICAL ADVANTAGE
          </div>
          <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl">
            Why TAC-XPRESS
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            We don't just move cargo. We see logistics as more than a service—it
            is a responsibility.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
          {/* Card 1: Northeast Specialists (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 md:row-span-1"
          >
            <Card className="flex h-full flex-col justify-between overflow-hidden rounded-none border border-border/50 bg-card/50 p-8 shadow-inner backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between">
                <MapMarkerIcon className="h-8 w-8 text-primary" />
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  01 / REGION
                </span>
              </div>
              <div>
                <h3 className="mb-4 font-heading text-3xl text-foreground uppercase">
                  Reliability Rooted in Experience
                </h3>
                <p className="text-muted-foreground">
                  With more than 15 years of operational experience, Tac-Xpress
                  has developed a deep understanding of the logistics landscape
                  between the Northeast and mainland India.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 2: Dual Network */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-1 md:row-span-1"
          >
            <Card className="flex h-full flex-col justify-between overflow-hidden rounded-none border border-border/50 bg-card/50 p-8 shadow-inner backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between">
                <ZapLightningIcon className="h-8 w-8 text-warning" />
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  02 / SPEED
                </span>
              </div>
              <div>
                <h3 className="mb-4 font-heading text-2xl text-foreground uppercase">
                  Customer-Centered Approach
                </h3>
                <p className="text-sm text-muted-foreground">
                  Every shipment matters. We treat each package with the same
                  level of attention and responsibility.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 3: Tracking Tech */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-1 md:row-span-1"
          >
            <Card className="flex h-full flex-col justify-between overflow-hidden rounded-none border border-border/50 bg-card/50 p-8 shadow-inner backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between">
                <ActivityPulseIcon className="h-8 w-8 text-success" />
                <span className="font-mono text-xs font-bold text-muted-foreground">
                  03 / TECH
                </span>
              </div>
              <div>
                <h3 className="mb-4 font-heading text-2xl text-foreground uppercase">
                  Continuous Improvement
                </h3>
                <p className="text-sm text-muted-foreground">
                  By learning from our experiences, we continuously refine our
                  operations and enhance our services.
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Card 4: Reliability (Large) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-2 md:row-span-1"
          >
            <Card className="group relative flex h-full flex-col justify-between overflow-hidden rounded-none border border-border/50 bg-primary/90 p-8 shadow-inner backdrop-blur-sm">
              <div className="relative z-10 mb-8 flex items-center justify-between">
                <ShieldSecurityIcon className="h-8 w-8 text-primary-foreground" />
                <span className="font-mono text-xs font-bold text-primary-foreground/80">
                  04 / TRUST
                </span>
              </div>
              <div className="relative z-10">
                <h3 className="mb-4 font-heading text-4xl text-primary-foreground uppercase">
                  Resilience in Operations
                </h3>
                <p className="text-primary-foreground/90">
                  Operating in the Northeast requires adaptability and
                  determination. Over the years, we have built systems and
                  processes that allow us to navigate complexities while
                  maintaining service continuity.
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
