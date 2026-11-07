import { z } from "zod"
import { CORRIDOR_ORIGIN, CORRIDOR_DESTINATION } from "@/lib/constants/corridor"

export function normalizeFreightCity(value: string): string | null {
  switch (value.trim().replace(/\s+/g, " ").toLowerCase()) {
    case "del":
    case "delhi":
    case "new delhi":
      return CORRIDOR_ORIGIN.name
    case "imf":
    case "imphal":
      return CORRIDOR_DESTINATION.name
    default:
      return null
  }
}

const freightCitySchema = z
  .string()
  .transform((value) => normalizeFreightCity(value) ?? value.trim())
  .refine(
    (value) => normalizeFreightCity(value) !== null,
    "Choose New Delhi or Imphal."
  )

const freightEndpointsSchema = z.object({
  origin: freightCitySchema,
  destination: freightCitySchema,
})

export const freightRouteSchema = freightEndpointsSchema.refine(
  ({ origin, destination }) => origin !== destination,
  {
    path: ["destination"],
    message:
      "Choose opposite endpoints: New Delhi to Imphal or Imphal to New Delhi.",
    when: ({ value }) => freightEndpointsSchema.safeParse(value).success,
  }
)
