"use server"

export type CarrierRate = {
  id: string
  carrier: string
  service: string
  price: number
  eta: string
}

export async function getRates(
  origin: string,
  destination: string,
  weightKg: number
): Promise<CarrierRate[]> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const baseRate = weightKg * 1.5

  return [
    {
      id: "rate-indigo",
      carrier: "IndiGo",
      service: "Flight 6E 6192",
      price: Math.max(2500, baseRate * 50),
      eta: "Direct • ~2h 45m",
    },
    {
      id: "rate-aix",
      carrier: "Air India Express",
      service: "Flight IX 234",
      price: Math.max(2200, baseRate * 45),
      eta: "Direct • ~2h 50m",
    },
    {
      id: "rate-ai",
      carrier: "Air India",
      service: "Flight AI 434",
      price: Math.max(3000, baseRate * 60),
      eta: "1 Stop • ~5h 15m",
    },
  ]
}
