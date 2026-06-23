import { InfiniteSlider } from "@/components/infinite-slider"

const LOGOS = [
  { top: "Sangai", bottom: "Logistics" },
  { top: "Kangleipak", bottom: "Traders" },
  { top: "Imphal", bottom: "Handlooms" },
  { top: "Loktak", bottom: "Fisheries" },
  { top: "Manipur", bottom: "Express" },
  { top: "Northeast", bottom: "Cargo" },
]

export function LogoCloud() {
  return (
    <div className="w-full overflow-hidden py-8 opacity-50 grayscale">
      <InfiniteSlider gap={64} speed={40} speedOnHover={20}>
        {LOGOS.map((logo, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 text-center font-heading text-xl leading-tight font-bold uppercase"
          >
            {logo.top}
            <br />
            {logo.bottom}
          </div>
        ))}
      </InfiniteSlider>
    </div>
  )
}
