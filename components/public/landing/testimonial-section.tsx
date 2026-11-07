"use client"

import Image from "next/image"
import { motion, useReducedMotion } from "motion/react"
import { cn } from "@/lib/utils"

export function TestimonialSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section
      id="customers"
      aria-labelledby="customers-heading"
      className="w-full border-b border-border bg-background py-20 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1320px] px-6 lg:px-12">
        <div className="mx-auto mb-16 max-w-xl text-center">
          <h2
            id="customers-heading"
            className="text-2xl font-medium tracking-tight sm:text-4xl"
          >
            Prepare your consignment
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Share the practical details before requesting a booking.
          </p>
        </div>
        <motion.div
          whileHover={shouldReduceMotion ? undefined : { y: -2 }}
          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="group mx-auto grid max-w-4xl items-center gap-8 border bg-card p-6 sm:p-10 md:grid-cols-2 shadow-xs transition-colors hover:border-foreground/40"
        >
          <div className="relative aspect-square overflow-hidden border bg-muted">
            <Image
              src="/images/new-assets/testimonial-director.png"
              alt="Illustration of corridor logistics operations and director oversight"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className={cn(
                "object-cover transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                !shouldReduceMotion && "group-hover:scale-[1.03]"
              )}
            />
          </div>
          <div className="flex flex-col gap-4 text-sm">
            <h3 className="text-lg font-medium">Details for your quote</h3>
            <p className="text-muted-foreground">
              Tell our team what you plan to send between New Delhi and Imphal.
            </p>
            <ul className="flex list-disc flex-col gap-2 pl-5">
              <li>Contents, piece count, weight, and external dimensions</li>
              <li>Collection and delivery details in either direction</li>
              <li>Required delivery window and special handling needs</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
