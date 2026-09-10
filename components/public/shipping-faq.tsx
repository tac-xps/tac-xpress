// Adapted from @tailark-oss/veil-faqs-2. Accordion behavior is official shadcn/Radix.
import Link from "next/link"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { shippingFaqs } from "./shipping-content"
export function ShippingFaq() {
  return (
    <section className="border-t bg-background" aria-labelledby="faq-title">
      <div className="cargo-container cargo-section flex flex-col gap-8 md:flex-row md:items-start md:gap-20">
        <div className="shrink-0 md:sticky md:top-28 md:w-72">
          <p className="cargo-eyebrow mb-5 text-muted-foreground">
            Before you send
          </p>
          <h2 id="faq-title" className="cargo-heading">
            Questions,
            <br />
            answered.
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            Useful details about booking, tracking and preparing your goods.
          </p>
          <p className="mt-6 text-sm text-muted-foreground">
            Need something specific?{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Talk to our team
            </Link>
            .
          </p>
        </div>
        <Accordion type="single" collapsible className="min-w-0 flex-1">
          {shippingFaqs.map((item, index) => (
            <AccordionItem key={item.question} value={`question-${index}`}>
              <AccordionTrigger className="py-5 text-base font-medium hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="max-w-2xl pb-6 text-base leading-relaxed text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
