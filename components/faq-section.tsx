"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function FAQSection() {
  const faqItems = [
    {
      id: "item-1",
      question: "What routes does TAC-XPRESS cover?",
      answer:
        "We operate a primary logistics corridor between New Delhi and all major hubs in Northeast India, including Imphal, Guwahati, Agartala, Dimapur, Aizawl, and Shillong. We also provide last-mile delivery within these regions.",
    },
    {
      id: "item-2",
      question: "How long does surface cargo take from Delhi to Imphal?",
      answer:
        "Surface cargo typically takes 7-10 days depending on weather and road conditions along the Northeast corridor. For urgent shipments, we recommend our Air Cargo service which delivers in 24-48 hours.",
    },
    {
      id: "item-3",
      question: "Do you offer air cargo for urgent shipments?",
      answer:
        "Yes. We offer priority air freight services for time-critical, high-value, or perishable goods with dedicated space on major airlines operating to Northeast India.",
    },
    {
      id: "item-4",
      question: "What types of goods can you transport?",
      answer:
        "We handle a wide variety of cargo including pharmaceuticals, industrial machinery, FMCG, electronics, textiles, and emergency relief supplies. We also provide specialized packaging for fragile items.",
    },
    {
      id: "item-5",
      question: "How do I track my shipment?",
      answer:
        "You can track your shipment in real-time using your 8-digit tracking number (e.g. TX-123456) on our Operations Dashboard, providing visibility from origin to destination.",
    },
    {
      id: "item-6",
      question: "What packaging services do you provide?",
      answer:
        "We offer industrial crating, weather-proofing, shrink-wrapping, and customized protective packaging to ensure your cargo survives the challenging terrains of our transit routes.",
    },
  ]

  return (
    <section className="w-full border-t border-border py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 sm:px-12 md:flex-row md:px-24">
        <div className="flex w-full flex-col gap-6 md:w-1/3">
          <div className="inline-flex w-fit items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            SUPPORT & INFO
          </div>
          <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Operational details, transit times, and service capabilities.
          </p>
        </div>

        <div className="w-full md:w-2/3">
          <div className="w-full rounded-none border border-border bg-card p-4 shadow-sm md:p-8">
            <Accordion
              type="single"
              collapsible
              className="-mb-1 w-full"
              defaultValue="item-1"
            >
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="space-y-4 border-none py-3"
                >
                  <AccordionTrigger className="group flex w-full justify-end py-0 hover:no-underline [&_[data-slot=accordion-trigger-icon]]:!hidden">
                    <div className="max-w-[85%] cursor-pointer rounded-none bg-primary px-5 py-3 text-left text-sm text-primary-foreground transition hover:bg-primary/90 sm:max-w-[75%] sm:text-base">
                      {item.question}
                    </div>
                  </AccordionTrigger>

                  <AccordionContent className="flex justify-start pb-2">
                    <div className="max-w-[85%] rounded-none border border-border/50 bg-muted px-5 py-4 text-sm leading-relaxed text-foreground shadow-sm sm:max-w-[75%] sm:text-base">
                      {item.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
