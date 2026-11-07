"use client"

import Image from "next/image"
import { ZoomIn } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export function CorridorCinemaSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      aria-labelledby="cinema-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 text-center lg:px-12">
        <h2
          id="cinema-heading"
          className="text-2xl font-medium tracking-tight sm:text-4xl"
        >
          New Delhi and Imphal
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Illustrations of the air and surface cargo corridor.
        </p>
        <Dialog>
          <div className="group relative mx-auto mt-12 aspect-video w-full max-w-5xl overflow-hidden border bg-muted">
            <Image
              src="/images/new-assets/cinema-network.png"
              alt="Illustration of air and surface cargo between New Delhi and Imphal"
              fill
              sizes="(max-width: 1200px) 100vw, 1100px"
              className={cn(
                "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                !shouldReduceMotion && "group-hover:scale-[1.02]"
              )}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    aria-label="View corridor illustration"
                    className="cursor-pointer"
                  >
                    <ZoomIn aria-hidden="true" />
                  </Button>
                </DialogTrigger>
              </motion.div>
            </div>
          </div>
          <DialogContent className="cargo-public">
            <DialogHeader>
              <DialogTitle>Corridor illustration</DialogTitle>
              <DialogDescription>
                Air and surface cargo between New Delhi and Imphal. Confirm
                service availability and timing before booking.
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full overflow-hidden border bg-muted">
              <Image
                src="/images/new-assets/journey-modal.png"
                alt="Illustration of the New Delhi and Imphal corridor"
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
