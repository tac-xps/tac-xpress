"use client"

import { Carousel } from "@/components/carousel"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function DocumentationSection() {
  const slides = [
    <div
      key={"1"}
      className="relative h-full w-full overflow-hidden rounded-none border bg-card text-card-foreground"
    >
      <div className="h-full w-full overflow-hidden">
        <Image
          src="/templates/ai-hero-black.jpg"
          alt="TAC-XPRESS interface concept"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>,
    <div
      key={"2"}
      className="relative h-full w-full overflow-hidden rounded-none border bg-card text-card-foreground"
    >
      <div className="h-full w-full overflow-hidden">
        <Image
          src="/templates/ai-icons.jpg"
          alt="TAC-XPRESS icon system"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>,
    <div
      key={"3"}
      className="relative h-full w-full overflow-hidden rounded-none border bg-card text-card-foreground"
    >
      <div className="h-full w-full overflow-hidden">
        <Image
          src="/templates/ai-icons-1.jpg"
          alt="TAC-XPRESS logistics icon studies"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>,
    <div
      key={"4"}
      className="relative h-full w-full overflow-hidden rounded-none border bg-card text-card-foreground"
    >
      <div className="h-full w-full">
        <Image
          src="/templates/ai-logos.jpg"
          alt="TAC-XPRESS brand marks"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>,
    <div
      key={"5"}
      className="relative h-full w-full overflow-hidden rounded-none border bg-card text-card-foreground"
    >
      <div className="h-full w-full overflow-hidden">
        <Image
          src="/templates/ai-logos-1.jpg"
          alt="TAC-XPRESS alternate brand marks"
          className="h-full w-full object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 896px"
        />
      </div>
    </div>,
  ]

  return (
    <div className="relative flex w-full flex-col items-center justify-center">
      <div className="documentation-atmosphere absolute inset-0 -z-10">
        <div className="documentation-grid pointer-events-none absolute inset-0 opacity-25" />
      </div>
      <div className="flex items-center justify-center gap-6 self-stretch px-4 py-8 sm:px-6 md:px-24 md:py-16">
        <div className="flex w-full max-w-4xl flex-col items-center justify-start gap-3 overflow-hidden">
          <Badge variant={"secondary"}>Selected Work</Badge>
          <div className="flex w-full max-w-xl flex-col justify-center text-center text-xl leading-tight font-semibold tracking-tight sm:text-2xl md:text-3xl lg:text-5xl">
            A closer look at our design craft
          </div>
          <div className="self-stretch text-center text-sm leading-6 text-muted-foreground">
            Explore interfaces, branding systems, and product experiences
            <br className="hidden sm:block" />
            thoughtfully designed to balance beauty and performance.
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-full w-full items-center justify-center border-b pb-20">
        <Carousel slides={slides} />
      </div>
    </div>
  )
}
