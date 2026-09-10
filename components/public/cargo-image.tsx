import Image from "next/image"
import { cn } from "@/lib/utils"

export type CargoAsset = "hero" | "air" | "surface" | "packing" | "warehouse"
const descriptions: Record<CargoAsset, string> = {
  hero: "Conceptual 3D render of air and road cargo meeting at a terminal at dusk.",
  air: "Conceptual 3D render of a cargo aircraft and a pallet loader in warm evening light.",
  surface:
    "Conceptual 3D render of a cargo truck following a road through green foothills.",
  packing:
    "Conceptual 3D still life of cartons, protective packing and a carefully cushioned ceramic bowl.",
  warehouse:
    "Conceptual 3D render of an organized cargo loading bay in late afternoon light.",
}
interface CargoImageProps {
  asset: CargoAsset
  className?: string
  sizes?: string
  preload?: boolean
  loading?: "eager" | "lazy"
}
export function CargoImage({
  asset,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  preload = false,
  loading,
}: CargoImageProps) {
  return (
    <div className={cn("cargo-media", className)}>
      <Image
        src={`/images/cargo-2026/${asset}.webp`}
        alt={descriptions[asset]}
        fill
        sizes={sizes}
        preload={preload}
        loading={loading}
        className="object-cover"
      />
    </div>
  )
}
