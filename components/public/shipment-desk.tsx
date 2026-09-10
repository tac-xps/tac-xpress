// Tailark contact composition with official shadcn Field, Input and Button.
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
export function ShipmentDesk() {
  return (
    <section
      id="shipment-desk"
      className="cargo-accent scroll-mt-20"
      aria-labelledby="desk-title"
    >
      <div className="cargo-container grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-20 lg:py-20">
        <div>
          <p className="cargo-eyebrow mb-4">Already on its way?</p>
          <h2 id="desk-title" className="cargo-heading">
            A number.
            <br />A clearer picture.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed">
            Check your shipment’s recorded progress with the AWB number on your
            booking receipt. No account needed.
          </p>
        </div>
        <form action="/track" method="get" aria-label="Track your shipment">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="home-awb" className="text-base">
                AWB / shipment reference
              </FieldLabel>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  id="home-awb"
                  name="awb"
                  required
                  maxLength={40}
                  autoComplete="off"
                  placeholder="Enter your AWB number"
                  aria-describedby="home-awb-help"
                  className="cargo-desk-input h-9 min-w-0 flex-1 text-base"
                />
                <Button type="submit" size="lg" className="h-9 px-4">
                  Track shipment <ArrowUpRight data-icon="inline-end" />
                </Button>
              </div>
              <FieldDescription id="home-awb-help" className="text-foreground">
                Tracking shows recorded events, rather than a live vehicle
                location.
              </FieldDescription>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </section>
  )
}
