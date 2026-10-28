import Image from "next/image"
import { cn } from "@/lib/utils"

export type CargoAsset = "hero" | "air" | "surface" | "packing" | "warehouse" | "about"
const descriptions: Record<CargoAsset, string> = {
  hero:
    "Ink wash brushwork illustration of multi-modal corridor freight transit between New Delhi and Imphal.",
  air: "Ink wash brushwork illustration of widebody air cargo loading with ULD pallets on the apron.",
  surface:
    "Ink wash brushwork illustration of heavy container linehaul truck navigating the Himalayan mountain pass.",
  packing:
    "Ink wash brushwork illustration of reinforced industrial palletized freight with DEL to IMP cargo labels.",
  warehouse:
    "Ink wash brushwork illustration of modern cross-dock warehouse sortation bay.",
  about:
    "Ink wash brushwork illustration of Imphal regional cargo hub and distribution terminal.",
}

const assetPaths: Record<CargoAsset, string> = {
  hero: "/images/corridor-ink/hero-console.png",
  air: "/images/corridor-ink/fleet-air.png",
  surface: "/images/corridor-ink/fleet-surface.png",
  packing: "/images/corridor-ink/fleet-packaging.png",
  warehouse: "/images/corridor-ink/auth-warehouse.png",
  about: "/images/corridor-ink/fleet-imphal-hub.png",
}

interface CargoImageProps {
  asset: CargoAsset
  className?: string
  sizes?: string
  priority?: boolean
  loading?: "eager" | "lazy"
}
export function CargoImage({
  asset,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  loading,
}: CargoImageProps) {
  return (
    <div className={cn("cargo-media", className)}>
      <Image
        src={assetPaths[asset]}
        alt={descriptions[asset]}
        fill
        sizes={sizes}
        priority={priority}
        loading={loading}
        className="object-cover"
      />
    </div>
  )
}
