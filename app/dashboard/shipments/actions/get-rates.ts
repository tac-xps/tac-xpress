"use server"

export type CarrierRate = {
  id: string
  carrier: string
  service: string
  price: number
  eta: string
}

// No carrier quote provider is configured. Never display invented fares or flights.
export async function getRates(origin: string, destination: string, weightKg: number): Promise<CarrierRate[]> {
  return []
}
