import { Database, MessageSquare, Bot, Mail, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function IntegrationsSection() {
  return (
    <section className="w-full border-y border-border">
      <div className="py-24 md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-16 flex w-full flex-col items-center gap-4 text-center">
            <div className="inline-flex items-center border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              POWERED BY MODERN TECH
            </div>
            <h2 className="font-heading text-4xl tracking-tight text-foreground uppercase sm:text-5xl md:text-6xl">
              Enterprise Operations
            </h2>
            <p className="max-w-2xl text-center text-lg text-muted-foreground">
              A dedicated logistics partner operating in Northeast India, backed
              by a world-class technology stack for maximum reliability and
              transparency.
            </p>
          </div>

          <div className="mx-auto max-w-md [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] px-6">
            <div className="rounded-none border border-border bg-background px-6 pt-3 pb-12 shadow-xl dark:bg-muted/50">
              <Integration
                icon={<MessageSquare className="size-5 text-primary" />}
                name="WhatsApp Business API"
                description="Automated delivery updates and real-time tracking for customers."
              />
              <Integration
                icon={<Database className="size-5 text-primary" />}
                name="Supabase Infrastructure"
                description="Secure, real-time cargo tracking and immutable delivery ledgers."
              />
              <Integration
                icon={<Bot className="size-5 text-primary" />}
                name="OpenRouter AI Engine"
                description="24/7 intelligent triage and automated customer support routing."
              />
              <Integration
                icon={<Mail className="size-5 text-primary" />}
                name="Resend Email Service"
                description="Instant delivery notifications and automated compliance reports."
              />
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-lg space-y-6 text-center">
            <Button
              variant="default"
              size="lg"
              className="h-12 px-8 font-mono font-bold tracking-wide"
              asChild
            >
              <Link href="#">VIEW DEVELOPER DOCS</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

const Integration = ({
  icon,
  name,
  description,
}: {
  icon: React.ReactNode
  name: string
  description: string
}) => {
  return (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-dashed border-border py-4 last:border-b-0">
      <div className="flex size-12 items-center justify-center rounded-none border border-foreground/5 bg-muted">
        {icon}
      </div>
      <div className="space-y-0.5 text-left">
        <h3 className="text-sm font-bold tracking-wide uppercase">{name}</h3>
        <p className="line-clamp-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="flex items-center justify-center pr-2">
        <CheckCircle2 className="size-4 text-primary" />
      </div>
    </div>
  )
}
