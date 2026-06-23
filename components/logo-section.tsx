"use client"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

// Simple counter component using requestAnimationFrame for smooth counting
const AnimatedCounter = ({
  value,
  duration = 2,
}: {
  value: number
  duration?: number
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const endValue = value

    const updateCounter = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / (duration * 1000), 1)

      // Easing function (easeOutExpo)
      const easeProgress =
        percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage)

      setCount(Math.floor(endValue * easeProgress))

      if (percentage < 1) {
        requestAnimationFrame(updateCounter)
      }
    }

    requestAnimationFrame(updateCounter)
  }, [value, duration])

  return <span>{count.toLocaleString()}</span>
}

export function LogoSection() {
  const stats = [
    { label: "YEARS OF OPERATIONS", value: 15, suffix: "+" },
    { label: "MONTHLY SHIPMENTS", value: 1000, suffix: "+" },
    { label: "SERVICE REGIONS", value: 8, suffix: "" },
    { label: "ON-TIME DELIVERY", value: 99, suffix: "%" },
  ]

  return (
    <section className="w-full border-y border-border py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-12 px-6 sm:px-12 md:px-24">
        <div className="flex w-full items-center justify-between border-b border-border/50 pb-4">
          <h2 className="font-mono text-sm font-bold tracking-widest text-muted-foreground uppercase">
            Operational Record
          </h2>
          <div className="ml-4 h-px flex-1 bg-border/50" />
        </div>

        <div className="grid w-full grid-cols-2 gap-8 md:grid-cols-4 md:gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-start gap-2 border-l-2 border-primary/50 pl-4"
            >
              <div className="flex items-baseline font-heading text-5xl text-foreground sm:text-6xl">
                <AnimatedCounter value={stat.value} duration={2} />
                <span className="text-primary">{stat.suffix}</span>
              </div>
              <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground uppercase">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
