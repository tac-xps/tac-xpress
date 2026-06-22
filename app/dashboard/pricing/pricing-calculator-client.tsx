"use client"

import React from "react"
import * as Sentry from "@sentry/nextjs"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calculator, Scale, MapPin, Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getEstimatedRateAction } from "./actions"
import { toast } from "sonner"

export function PricingCalculatorClient() {
  const [weight, setWeight] = React.useState<number | "">("")
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  type ServiceType = "express_air" | "standard_ocean" | "road_freight"
  const [service, setService] = React.useState<ServiceType>("road_freight")
  const [total, setTotal] = React.useState<number | null>(null)
  const [isPending, setIsPending] = React.useState(false)

  const calculateRate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!weight) return

    setIsPending(true)
    try {
      const result = await getEstimatedRateAction({
        weightKg: Number(weight),
        serviceType: service,
        origin: origin || undefined,
        destination: destination || undefined,
      })

      if (result?.data?.rate !== undefined) {
        setTotal(result.data.rate)
      } else {
        toast.error("Failed to calculate rate")
        setTotal(null)
      }
    } catch (error) {
      Sentry.captureException(error)
      toast.error("An error occurred while calculating the rate")
      setTotal(null)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Card className="border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm delay-0 lg:col-span-8">
        <CardHeader className="border-b border-border/50 p-6">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Calculator className="size-5 text-primary" />
            Rate Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            onSubmit={calculateRate}
            className="-m-4 grid grid-cols-1 gap-6 p-4 transition-all duration-500 has-[:focus-visible]:bg-primary/[0.02] has-[:focus-visible]:ring-1 has-[:focus-visible]:ring-primary/30 md:grid-cols-2"
          >
            <div className="space-y-2">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Origin Hub
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. DEL"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="h-11 border-border/50 bg-background pl-9 focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Destination Hub
              </Label>
              <div className="relative">
                <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="e.g. BOM"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="h-11 border-border/50 bg-background pl-9 focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Service Type
              </Label>
              <Select
                value={service}
                onValueChange={(val) => setService(val as ServiceType)}
              >
                <SelectTrigger className="h-11 border-border/50 bg-background focus:ring-1 focus:ring-ring/50">
                  <SelectValue placeholder="Select service level" />
                </SelectTrigger>
                <SelectContent className="border-border/50 bg-background">
                  <SelectItem value="express_air">Express Air</SelectItem>
                  <SelectItem value="road_freight">Standard Surface</SelectItem>
                  <SelectItem value="standard_ocean">Sea Freight</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs tracking-wider text-muted-foreground uppercase">
                Total Weight (kg)
              </Label>
              <div className="relative">
                <Scale className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={weight}
                  onChange={(e) =>
                    setWeight(e.target.value ? Number(e.target.value) : "")
                  }
                  className="h-11 border-border/50 bg-background pl-9 tabular-nums focus-visible:ring-1 focus-visible:ring-ring/50"
                />
              </div>
            </div>

            <div className="pt-4 md:col-span-2">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 w-full bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/95"
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                {isPending ? "Calculating..." : "Calculate Estimated Rate"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="flex flex-col border border-border/60 bg-card/60 shadow-sm backdrop-blur-sm delay-200 lg:col-span-4">
        <CardHeader className="border-b border-border/50 bg-gradient-to-br from-primary/10 via-background/50 to-secondary/10 p-6">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Estimated Quote
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            Total Projected Cost
          </p>
          <h2 className="text-5xl font-bold tracking-tight text-foreground tabular-nums">
            {total !== null ? `₹${total.toFixed(2)}` : "--"}
          </h2>
          <p className="mt-4 max-w-[240px] text-xs text-muted-foreground">
            Fill out the calculator details to generate a real-time quote based
            on current network capacity.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
