// Adapted from @tailark-oss/veil-content-2 with an ordered shipping process.
import { bookingSteps } from "./shipping-content"
import { VerticalRail, VerticalRailStep } from "./vertical-rail"
export function ShippingSteps() {
  return (
    <section
      className="cargo-container cargo-section"
      aria-labelledby="booking-title"
    >
      <div className="max-w-xl">
        <p className="cargo-eyebrow mb-5 text-muted-foreground">
          02 / From enquiry to delivery
        </p>
        <h2 id="booking-title" className="cargo-heading">
          A little preparation.
          <br />A clearer journey.
        </h2>
        <p className="mt-5 leading-relaxed text-muted-foreground">
          Here is what happens before and after your goods are handed over.
        </p>
      </div>
      <VerticalRail className="mt-12 md:ml-12 lg:ml-24">
        {bookingSteps.map((step, index) => (
          <VerticalRailStep
            key={step.title}
            number={`0${index + 1} / STEP`}
            title={step.title}
            text={step.text}
          />
        ))}
      </VerticalRail>
    </section>
  )
}
