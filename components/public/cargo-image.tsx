import Image from "next/image"
import { cn } from "@/lib/utils"

export type CargoAsset = "hero" | "air" | "surface" | "packing" | "warehouse" | "about"
const descriptions: Record<CargoAsset, string> = {
  hero:
    "3D Blender Cycles render of a modern TAC-XPRESS electric freight truck navigating a scenic Himalayan mountain highway pass at golden hour sunrise.",
  air: "3D Blender architectural render of a regional cargo aircraft and pallet loader at sunset.",
  surface:
    "3D Blender landscape render of a cargo container truck following a mountain highway through green foothills.",
  packing:
    "3D Blender still life render of corrugated cartons, protective packing and a cushioned ceramic bowl.",
  warehouse:
    "3D Blender architectural render of an organized cargo warehouse loading bay in warm late afternoon light.",
  about:
    "3D Blender architectural render of a cargo collection and handover hub in Northeast India with scenic hills.",
}

const assetPaths: Record<CargoAsset, string> = {
  hero: "/images/cargo-2026/hero-3d-mountain-pass.webp",
  air: "/images/cargo-2026/air-3d.webp",
  surface: "/images/cargo-2026/surface-3d.webp",
  packing: "/images/cargo-2026/packing-3d.webp",
  warehouse: "/images/cargo-2026/warehouse-3d.webp",
  about: "/images/cargo-2026/about-3d.webp",
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
        src={assetPaths[asset]}
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
