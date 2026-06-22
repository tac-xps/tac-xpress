import { Button } from "@/components/ui/button"
import { DecorIcon } from "@/components/decor-icon"
import {
  PhoneCallCustomIcon,
  CustomArrowRightIcon,
} from "@/components/icons/landing-icons"
import { TextEffect } from "@/components/text-effect"
import { ProgressiveBlur } from "@/components/progressive-blur"

export default function CTASection() {
  return (
    <section
      id="quote"
      className="relative flex w-full items-center justify-center overflow-hidden py-24 sm:py-32"
    >
      <ProgressiveBlur
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-full w-full"
        direction="top"
        blurIntensity={0.5}
      />
      <div className="relative mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-y-6 border-y border-border px-8 py-20 shadow-2xl z-20">
        <DecorIcon className="size-5" position="top-left" />
        <DecorIcon className="size-5" position="top-right" />
        <DecorIcon className="size-5" position="bottom-left" />
        <DecorIcon className="size-5" position="bottom-right" />

        <div className="pointer-events-none absolute -inset-y-12 -left-px w-px border-l border-border/50" />
        <div className="pointer-events-none absolute -inset-y-12 -right-px w-px border-r border-border/50" />

        <div className="absolute top-0 left-1/2 -z-10 h-full border-l border-dashed border-border/40" />

        <TextEffect
          as="h2"
          preset="blur"
          per="word"
          className="text-center font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl"
        >
          Let Us Move Forward Together
        </TextEffect>
        <p className="max-w-md text-center text-base text-balance text-muted-foreground md:text-lg">
          Whether you are an individual sending a package or a business managing
          logistics operations, Tac-Xpress is here to support you.
        </p>

        <div className="mt-6 flex w-full max-w-sm flex-col items-stretch justify-center gap-4 sm:w-auto sm:max-w-none sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            className="border-primary/20 px-6 font-mono hover:bg-primary/5"
          >
            <PhoneCallCustomIcon className="mr-2 size-4 text-primary" />
            <span className="mr-2 text-xs opacity-80">DISPATCH:</span>
            +91 98765 43210
          </Button>
          <Button size="lg" className="font-bold tracking-wide">
            REQUEST A QUOTE
            <CustomArrowRightIcon className="ml-2 size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
