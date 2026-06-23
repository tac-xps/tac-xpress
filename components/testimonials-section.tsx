"use client"

import { Marquee } from "@/magicui/marquee"
import { Separator } from "@/components/ui/separator"
import { QuoteCustomIcon } from "@/components/icons/landing-icons"

const testimonials = [
  {
    name: "Thoiba Singh",
    profession: "Supply Chain Director",
    description:
      "TAC-XPRESS has completely transformed our supply chain visibility. The real-time tracking in the Northeast region is unmatched.",
  },
  {
    name: "Sanatombi Devi",
    profession: "Operations Manager",
    description:
      "We rely on them for all our high-value tech shipments. They have never missed a delivery window, even during monsoon season.",
  },
  {
    name: "Yaiphaba Meitei",
    profession: "Head of E-Commerce",
    description:
      "The D2C fulfillment integration was seamless. Our delivery times have dropped by 40% across all tier-3 cities.",
  },
  {
    name: "Chaoba Sharma",
    profession: "Logistics Coordinator",
    description:
      "Their dedicated fleet and priority routing means our pharmaceutical supplies always arrive on time and intact.",
  },
  {
    name: "Bembem Chanu",
    profession: "Regional Distributor",
    description:
      "The best enterprise logistics partner we've ever worked with. The live operations dashboard gives us total peace of mind.",
  },
]

export default function TestimonialsSection() {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden border-y border-border py-24">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-16 flex flex-col items-center text-center">
          <div className="mb-4 inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            SERVING COMMUNITIES
          </div>
          <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl">
            A Bridge Between Regions
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Every successful delivery represents a story—of opportunity, of
            progress, and of trust fulfilled.
          </p>
        </div>

        <div
          className="relative flex w-full shrink-0 justify-around gap-5 overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <Marquee pauseOnHover gap={6} className="w-full">
            {testimonials.map((testimonial, indx) => {
              return (
                <div
                  key={indx}
                  className="flex h-full w-112 flex-col space-x-4 rounded-none border border-border bg-background p-2 shadow-sm transition-colors last:mr-2 hover:border-primary/50"
                >
                  <p className="px-5 py-6 text-xl leading-relaxed font-light tracking-tight text-pretty text-foreground sm:text-xl md:text-2xl">
                    &quot;{testimonial.description}&quot;
                  </p>
                  <div className="mt-auto flex w-full gap-1 overflow-hidden border-t border-border">
                    <div className="flex w-3/4 items-center gap-4 px-5 py-4">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex flex-1 flex-col items-start justify-start gap-1">
                        <h5 className="text-base font-semibold">
                          {testimonial.name}
                        </h5>
                        <p className="text-sm text-muted-foreground">
                          {testimonial.profession}
                        </p>
                      </div>
                    </div>
                    <Separator orientation="vertical" className="h-auto" />
                    <div className="flex flex-1 items-center justify-center">
                      <QuoteCustomIcon className="size-6 fill-muted-foreground/10 text-muted-foreground/30" />
                    </div>
                  </div>
                </div>
              )
            })}
          </Marquee>
        </div>
      </div>
    </div>
  )
}
