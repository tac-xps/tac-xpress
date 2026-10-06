"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { MapPin, ArrowRight, ArrowLeftRight, Waypoints } from "lucide-react"
import { useWatch, type UseFormReturn } from "react-hook-form"
import type { CreateManifestValues } from "./validations"
import type { ManifestHubOption } from "./manifest-telemetry-card"

interface ManifestCorridorCardProps {
  form: UseFormReturn<CreateManifestValues>
  hubs: ManifestHubOption[]
}

export function ManifestCorridorCard({ form, hubs }: ManifestCorridorCardProps) {
  const originHubId = useWatch({ control: form.control, name: "originHubId" })
  const destinationHubId = useWatch({ control: form.control, name: "destinationHubId" })

  const selectedOrigin = hubs.find((h) => h.id === originHubId)
  const selectedDest = hubs.find((h) => h.id === destinationHubId)

  // Derive common active corridor presets from available hubs
  const activeCorridorPresets = useMemo(() => {
    if (hubs.length < 2) return []
    const presets: Array<{
      originId: string
      destinationId: string
      originLabel: string
      destinationLabel: string
      originShort: string
      destShort: string
    }> = []

    const getShortCode = (label: string, location?: string | null) => {
      const loc = (location || label).toLowerCase()
      if (loc.includes("central delhi")) return "DEL-CENTRAL"
      if (loc.includes("airport") || loc.includes("gateway")) return "DEL-AIRPORT"
      if (loc.includes("south delhi")) return "DEL-SOUTH"
      if (loc.includes("delhi")) return "DEL"
      if (loc.includes("imphal west")) return "IMF-WEST"
      if (loc.includes("imphal")) return "IMF"
      if (loc.includes("guwahati")) return "GAU"
      if (loc.includes("kolkata")) return "CCU"
      return loc.slice(0, 4).toUpperCase()
    }

    for (let i = 0; i < hubs.length; i++) {
      for (let j = 0; j < hubs.length; j++) {
        if (i !== j) {
          presets.push({
            originId: hubs[i].id,
            destinationId: hubs[j].id,
            originLabel: hubs[i].label,
            destinationLabel: hubs[j].label,
            originShort: getShortCode(hubs[i].label, hubs[i].location),
            destShort: getShortCode(hubs[j].label, hubs[j].location),
          })
        }
      }
    }
    return presets.slice(0, 10)
  }, [hubs])

  const handleSwapCorridor = () => {
    if (!originHubId || !destinationHubId) return
    form.setValue("originHubId", destinationHubId, {
      shouldValidate: true,
      shouldDirty: true,
    })
    form.setValue("destinationHubId", originHubId, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }

  return (
    <Card className="shrink-0 border-border bg-card shadow-xs rounded-none">
      <CardHeader className="border-b bg-muted/40 py-2.5 px-3.5 sm:px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-xs font-bold tracking-widest text-foreground uppercase">
            <MapPin className="size-4 text-primary shrink-0" />
            Transit Corridor
          </CardTitle>
          {selectedOrigin && selectedDest && (
            <span className="font-mono text-[10px] font-bold text-status-delivered bg-status-delivered-wash border border-status-delivered/20 px-2 py-0.5 rounded-none uppercase flex items-center gap-1">
              <span className="size-1.5 rounded-none bg-status-delivered animate-pulse" />
              Active Corridor
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-3.5 space-y-2.5">
        {/* Scrollable Active Corridors Preset Strip */}
        {activeCorridorPresets.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-muted-foreground uppercase flex items-center gap-1">
                <Waypoints className="size-3 text-primary shrink-0" />
                Active Corridors
              </span>
              <span className="font-mono text-[9px] text-muted-foreground">
                Scroll to view ({activeCorridorPresets.length})
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 manifest-scrollbar">
              {activeCorridorPresets.map((preset) => {
                const isSelected =
                  originHubId === preset.originId &&
                  destinationHubId === preset.destinationId

                return (
                  <button
                    key={`${preset.originId}-${preset.destinationId}`}
                    type="button"
                    onClick={() => {
                      form.setValue("originHubId", preset.originId, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                      form.setValue("destinationHubId", preset.destinationId, {
                        shouldValidate: true,
                        shouldDirty: true,
                      })
                    }}
                    className={`shrink-0 flex items-center gap-1 px-2 py-1 text-[11px] font-mono border rounded-none transition-colors select-none ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary font-bold shadow-xs"
                        : "bg-background hover:bg-muted/80 text-foreground border-border hover:border-primary/50"
                    }`}
                    title={`${preset.originLabel} → ${preset.destinationLabel}`}
                  >
                    <span>{preset.originShort}</span>
                    <ArrowRight className="size-2.5 opacity-60" />
                    <span>{preset.destShort}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Origin Hub */}
          <FormField
            control={form.control}
            name="originHubId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-semibold text-foreground">
                  Origin Hub (Departure)
                </FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={hubs.length === 0}
                >
                  <SelectTrigger className="w-full bg-background rounded-none h-9 text-xs">
                    <SelectValue placeholder={hubs.length === 0 ? "No hubs available" : "Select origin hub"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {hubs.length === 0 ? (
                      <SelectItem value="empty-origin" disabled className="text-xs text-muted-foreground">
                        No registered hubs found
                      </SelectItem>
                    ) : (
                      hubs.map((hub) => (
                        <SelectItem
                          key={hub.id}
                          value={hub.id}
                          disabled={hub.id === destinationHubId}
                          className="rounded-none text-xs font-mono"
                        >
                          {hub.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />

          {/* Destination Hub */}
          <FormField
            control={form.control}
            name="destinationHubId"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs font-semibold text-foreground">
                  Destination Hub (Arrival)
                </FormLabel>
                <Select
                  value={field.value || undefined}
                  onValueChange={field.onChange}
                  disabled={hubs.length === 0}
                >
                  <SelectTrigger className="w-full bg-background rounded-none h-9 text-xs">
                    <SelectValue placeholder={hubs.length === 0 ? "No hubs available" : "Select destination hub"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {hubs.length === 0 ? (
                      <SelectItem value="empty-destination" disabled className="text-xs text-muted-foreground">
                        No registered hubs found
                      </SelectItem>
                    ) : (
                      hubs.map((hub) => (
                        <SelectItem
                          key={hub.id}
                          value={hub.id}
                          disabled={hub.id === originHubId}
                          className="rounded-none text-xs font-mono"
                        >
                          {hub.label}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage className="text-[10px]" />
              </FormItem>
            )}
          />
        </div>

        {/* Visual Corridor Direction Indicator */}
        <div className="border border-border/80 bg-muted/20 p-2 flex items-center justify-between text-xs">
          <div className="space-y-0.5 min-w-0 flex-1">
            <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase">
              Origin Facility
            </span>
            <p className="font-mono text-xs font-bold text-foreground truncate">
              {selectedOrigin ? selectedOrigin.label : "Unselected Origin"}
            </p>
          </div>

          <div className="flex items-center gap-1 mx-2 shrink-0">
            <ArrowRight className="size-4 text-primary" />
            {selectedOrigin && selectedDest && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleSwapCorridor}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                title="Reverse Corridor Direction"
              >
                <ArrowLeftRight className="size-3" />
              </Button>
            )}
          </div>

          <div className="space-y-0.5 min-w-0 flex-1 text-right">
            <span className="font-mono text-[9px] font-bold text-muted-foreground uppercase">
              Receiving Hub
            </span>
            <p className="font-mono text-xs font-bold text-foreground truncate">
              {selectedDest ? selectedDest.label : "Unselected Destination"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
