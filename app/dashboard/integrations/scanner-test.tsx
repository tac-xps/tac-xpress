"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { QRCodeSVG } from "qrcode.react"
import {
  Camera,
  Scan,
  QrCode,
  Flashlight,
  Smartphone,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  RefreshCw,
  Upload,
  ShieldCheck,
  Radio,
  Check,
  PackageCheck,
  FlipHorizontal,
  ChevronRight,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCameraScanner } from "./use-barcode-scanner"
import { useScannerContext, playScanBeep } from "@/components/scanner/scanner-provider"
import { toast } from "sonner"

// Code 39 Pattern Table (Narrow = 0, Wide = 1)
const CODE39_PATTERNS: Record<string, string> = {
  "0": "000110100",
  "1": "100100001",
  "2": "001100001",
  "3": "101100000",
  "4": "000110001",
  "5": "100110000",
  "6": "001110000",
  "7": "000100101",
  "8": "100100100",
  "9": "001100100",
  A: "100001001",
  B: "001001001",
  C: "101001000",
  D: "000011001",
  E: "100011000",
  F: "001011000",
  G: "000001101",
  H: "100001100",
  I: "001001100",
  J: "000011100",
  K: "100000011",
  L: "001000011",
  M: "101000010",
  N: "000010011",
  O: "100010010",
  P: "001010010",
  Q: "000000111",
  R: "100000110",
  S: "001000110",
  T: "000010110",
  U: "110000001",
  V: "011000001",
  W: "111000000",
  X: "010010001",
  Y: "110010000",
  Z: "011010000",
  "-": "010000101",
  ".": "110000100",
  " ": "011000100",
  "*": "010010100", // Start / Stop
}

/**
 * Pure SVG Code 39 Barcode Renderer
 * High-contrast, scannable off screens by phones and hardware lasers.
 */
function Code39BarcodeSvg({
  value,
  height = 55,
  className = "",
}: {
  value: string
  height?: number
  className?: string
}) {
  const sanitized = `*${value.toUpperCase().replace(/[^A-Z0-9\-\.\s]/g, "")}*`
  const narrowWidth = 1.6
  const wideWidth = 3.8
  const interCharSpace = narrowWidth

  let currentX = 8
  const rects: Array<{ x: number; width: number }> = []

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i]
    const pattern = CODE39_PATTERNS[char] || CODE39_PATTERNS["-"]

    // 9 elements: alternating bar (even) and space (odd)
    for (let j = 0; j < 9; j++) {
      const isBar = j % 2 === 0
      const isWide = pattern[j] === "1"
      const elemWidth = isWide ? wideWidth : narrowWidth

      if (isBar) {
        rects.push({ x: currentX, width: elemWidth })
      }
      currentX += elemWidth
    }
    currentX += interCharSpace
  }

  const totalWidth = currentX + 8

  return (
    <div className={`flex flex-col items-center bg-card p-2 rounded-none select-none border border-border/80 ${className}`}>
      <svg
        viewBox={`0 0 ${totalWidth} ${height}`}
        className="w-full max-w-[260px] h-12"
        aria-label={`Barcode for ${value}`}
      >
        {rects.map((r, idx) => (
          <rect key={idx} x={r.x} y={0} width={r.width} height={height} className="fill-foreground" />
        ))}
      </svg>
      <span className="font-mono text-[10px] font-bold tracking-widest text-foreground mt-1 uppercase">
        {value}
      </span>
    </div>
  )
}

const SAMPLE_SHIPMENT_CODES = [
  {
    awb: "TAC-2409-18472",
    corridor: "DEL → IMF (Air Express)",
    title: "High-Priority Medical Linehaul",
    status: "In Transit",
  },
  {
    awb: "TAC-2409-90214",
    corridor: "CCU → GAU (Surface)",
    title: "Heavy Cargo Container Consignment",
    status: "Dock Intake",
  },
  {
    awb: "AWB-05B9DC989F2D",
    corridor: "DEL Hub Gateway",
    title: "Statutory BCAS Security Bag",
    status: "Verified",
  },
]

export function ScannerTest() {
  const scanner = useCameraScanner("tac-scanner-viewport")
  const { triggerScan } = useScannerContext()
  const [activeTab, setActiveTab] = useState<string>("camera")
  const [scannedAwb, setScannedAwb] = useState<string | null>(null)
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const currentOrigin = React.useSyncExternalStore(
    () => () => {},
    () => (typeof window !== "undefined" ? window.location.origin : ""),
    () => ""
  )
  const [isPhotoProcessing, setIsPhotoProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle successful scan
  const handleScanSuccess = (decodedText: string) => {
    const trimmed = decodedText.trim().toUpperCase()
    setScannedAwb(trimmed)

    // Trigger haptic feedback if available (Android Chrome)
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate([40, 20, 40])
    }

    // Audible confirmation
    playScanBeep(true)
    toast.success(`Scanned: ${trimmed}`)

    // Also trigger global modal workflow
    triggerScan(trimmed)
  }

  // Handle native photo capture from iOS/Android camera shutter
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsPhotoProcessing(true)
    try {
      const result = await scanner.scanFile(file)
      if (result) {
        handleScanSuccess(result)
      } else {
        playScanBeep(false)
        toast.error("No valid barcode detected in captured photo. Ensure good lighting and focus.")
      }
    } catch {
      playScanBeep(false)
      toast.error("Failed to decode photo")
    } finally {
      setIsPhotoProcessing(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    toast.success(`${label} copied`)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const getPermissionBadge = () => {
    switch (scanner.permissionStatus) {
      case "granted":
        return (
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-success font-mono text-xs gap-1.5"
          >
            <CheckCircle2 className="size-3 text-success" />
            Camera Access Granted
          </Badge>
        )
      case "prompt":
        return (
          <Badge
            variant="outline"
            className="border-info/30 bg-info/10 text-info font-mono text-xs gap-1.5"
          >
            <Radio className="size-3 text-info animate-pulse" />
            Permission Prompt Ready
          </Badge>
        )
      case "denied":
        return (
          <Badge variant="destructive" className="font-mono text-xs gap-1.5">
            <AlertCircle className="size-3" />
            Camera Blocked
          </Badge>
        )
      case "unsupported":
        return (
          <Badge variant="outline" className="text-muted-foreground font-mono text-xs">
            Not Supported
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-mono text-xs">
            Checking Permissions…
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Diagnostics & Permissions Summary Banner */}
      <div className="rounded-none border border-border/80 bg-muted/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex flex-wrap items-center gap-3">
          {getPermissionBadge()}
          <span className="text-muted-foreground flex items-center gap-1.5">
            <ShieldCheck className="size-3.5 text-primary" />
            <span>Secure Context (WebRTC Active)</span>
          </span>
          {scanner.cameras.length > 0 && (
            <span className="text-muted-foreground">
              • {scanner.cameras.length} video device(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs font-mono gap-1.5"
            onClick={() => scanner.checkPermissionsAndCameras()}
          >
            <RefreshCw className="size-3" /> Probe Hardware
          </Button>
        </div>
      </div>

      {/* Permission Denied Troubleshooting Alert */}
      {scanner.permissionStatus === "denied" && (
        <Alert variant="destructive" className="border-destructive/40 bg-destructive/10">
          <AlertCircle className="size-4 text-destructive" />
          <AlertTitle className="text-xs font-semibold uppercase tracking-wider">
            Camera Permission Denied by Device
          </AlertTitle>
          <AlertDescription className="text-xs mt-1 space-y-2">
            <p>
              Your browser or operating system has blocked camera access for this domain.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div className="bg-destructive/15 p-2 rounded-none">
                <span className="font-bold block">iOS Safari:</span>
                Tap <strong>aA</strong> in the search bar → <strong>Website Settings</strong> → Set <strong>Camera</strong> to <strong>Allow</strong>.
              </div>
              <div className="bg-destructive/15 p-2 rounded-none">
                <span className="font-bold block">Android Chrome:</span>
                Tap the lock icon in the URL bar → <strong>Permissions</strong> → Turn on <strong>Camera</strong>.
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Main Terminal Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 h-auto p-1 bg-muted/60">
          <TabsTrigger value="camera" className="gap-1.5 text-xs py-2 font-medium">
            <Camera className="size-3.5" />
            <span>Live Camera</span>
          </TabsTrigger>
          <TabsTrigger value="mobile-photo" className="gap-1.5 text-xs py-2 font-medium">
            <Smartphone className="size-3.5" />
            <span>Mobile Photo Shutter</span>
          </TabsTrigger>
          <TabsTrigger value="test-codes" className="gap-1.5 text-xs py-2 font-medium">
            <QrCode className="size-3.5" />
            <span>Test Codes & Simulation</span>
          </TabsTrigger>
          <TabsTrigger value="pairing" className="gap-1.5 text-xs py-2 font-medium">
            <Radio className="size-3.5" />
            <span>iOS / Android Link</span>
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Live Hardware WebRTC Viewfinder */}
        <TabsContent value="camera" className="space-y-4 pt-1">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Viewfinder Column */}
            <div className="lg:col-span-8 space-y-3">
              <div className="relative aspect-4/3 w-full max-w-xl mx-auto overflow-hidden rounded-none border border-border/80 bg-muted/80 dark:bg-black/90 flex flex-col items-center justify-center">
                {/* Hardware Video Stream Mount */}
                <div id="tac-scanner-viewport" className="w-full h-full overflow-hidden" />

                {/* Idle / Off Placeholder */}
                {!scanner.isScanning && !scanner.isStarting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-background/95 space-y-3">
                    <div className="size-12 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                      <Scan className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-semibold text-sm text-foreground">
                        Camera Viewfinder Inactive
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        Activates the rear environment camera on iOS and Android with automatic barcode decoding.
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="font-medium text-xs mt-2"
                      onClick={() => scanner.startCamera(handleScanSuccess)}
                    >
                      <Camera className="mr-1.5 size-3.5" /> Start Live Camera
                    </Button>
                  </div>
                )}

                {/* Starting Spinner */}
                {scanner.isStarting && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 text-muted-foreground gap-2 font-mono text-xs">
                    <RefreshCw className="size-6 animate-spin text-primary" />
                    <span>Initializing camera stream…</span>
                  </div>
                )}

                {/* Live Targeting HUD Overlay */}
                {scanner.isScanning && (
                  <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4">
                    {/* Corner Reticles */}
                    <div className="relative w-full h-full border border-primary/20 flex flex-col justify-between">
                      <div className="flex justify-between">
                        <span className="size-5 border-t-2 border-l-2 border-primary" />
                        <span className="size-5 border-t-2 border-r-2 border-primary" />
                      </div>

                      {/* Animated Laser Scanning Line */}
                      <motion.div
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_8px_var(--color-primary)]"
                        initial={{ y: 0 }}
                        animate={{ y: [0, 220, 0] }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />

                      <div className="flex justify-between">
                        <span className="size-5 border-b-2 border-l-2 border-primary" />
                        <span className="size-5 border-b-2 border-r-2 border-primary" />
                      </div>
                    </div>

                    {/* HUD Status Bar */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-none font-mono text-[10px] text-foreground border border-border/40 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-none bg-success animate-pulse" />
                      <span>OPTICAL DECODER ACTIVE · 15 FPS</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Viewfinder Controls Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 max-w-xl mx-auto">
                <div className="flex items-center gap-2">
                  {scanner.isScanning ? (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="h-8 text-xs font-medium"
                      onClick={() => scanner.stopCamera()}
                    >
                      Stop Camera
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 text-xs font-medium"
                      disabled={scanner.isStarting}
                      onClick={() => scanner.startCamera(handleScanSuccess)}
                    >
                      <Camera className="mr-1.5 size-3.5" /> Start Camera
                    </Button>
                  )}

                  {/* Torch Toggle (Hardware Supported) */}
                  {scanner.isScanning && scanner.hasTorch && (
                    <Button
                      variant={scanner.isTorchOn ? "default" : "outline"}
                      size="sm"
                      className="h-8 text-xs font-mono gap-1.5"
                      onClick={() => scanner.toggleTorch()}
                    >
                      <Flashlight className="size-3.5" />
                      {scanner.isTorchOn ? "Flash On" : "Flash Off"}
                    </Button>
                  )}
                </div>

                {/* Facing Mode / Multi-Lens Selector */}
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs font-mono gap-1"
                    onClick={() =>
                      scanner.setFacingMode(
                        scanner.facingMode === "environment" ? "user" : "environment",
                        handleScanSuccess
                      )
                    }
                  >
                    <FlipHorizontal className="size-3" />
                    <span>{scanner.facingMode === "environment" ? "Rear Lens" : "Front Lens"}</span>
                  </Button>
                </div>
              </div>
            </div>

            {/* Live Instructions & Quick Specs Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="rounded-none border border-border/80 bg-card p-4 space-y-3">
                <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="size-4 text-primary" />
                  Hardware Scanner Specs
                </h4>
                <ul className="space-y-2 text-xs text-muted-foreground font-mono">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Supports 1D Barcodes (Code 128, Code 39) & 2D QR Codes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Zero-latency Web Audio API scan confirmation chime.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Automatic rear lens focusing with macro exposure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>Direct linkage to Tac-Xpress global shipment dossier.</span>
                  </li>
                </ul>
              </div>

              {/* Scanned Result Card */}
              {scannedAwb && (
                <div className="rounded-none border border-success/30 bg-success/5 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-success font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="size-3.5" /> Scanned Reference
                    </span>
                    <Badge variant="delivered" className="font-mono text-[10px]">
                      Validated AWB
                    </Badge>
                  </div>
                  <p className="font-mono text-sm font-bold text-foreground break-all">
                    {scannedAwb}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button asChild size="sm" className="h-7 text-xs">
                      <Link href={`/dashboard/tracking?awb=${encodeURIComponent(scannedAwb)}`}>
                        <ExternalLink className="mr-1 size-3" /> Track Shipment
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs font-mono"
                      onClick={() => triggerScan(scannedAwb)}
                    >
                      Open Dossier
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* TAB 2: Mobile Photo Shutter (Native Camera Integration) */}
        <TabsContent value="mobile-photo" className="space-y-4 pt-1">
          <div className="rounded-none border border-border/80 bg-card p-6 space-y-5">
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
                <Smartphone className="size-4 text-primary" />
                Native iOS & Android Shutter Integration
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                On smartphones, this triggers the native operating system camera app with full optical autofocus, HDR, and flash. Staff snap a high-resolution still of the shipping label to decode barcodes without persistent WebRTC streams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Native Camera Trigger */}
              <div className="border border-dashed border-primary/40 bg-primary/[0.03] p-6 rounded-none flex flex-col items-center justify-center text-center space-y-3">
                <input
                  ref={fileInputRef}
                  id="native-camera-capture"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
                <div className="size-12 rounded-none bg-primary/10 flex items-center justify-center text-primary">
                  <Camera className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">
                    Snap with Mobile Camera
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Opens native iOS Camera or Android Camera
                  </p>
                </div>
                <Button
                  size="sm"
                  disabled={isPhotoProcessing}
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs font-medium"
                >
                  {isPhotoProcessing ? (
                    <>
                      <RefreshCw className="mr-1.5 size-3.5 animate-spin" /> Decoding…
                    </>
                  ) : (
                    <>
                      <Camera className="mr-1.5 size-3.5" /> Take Photo
                    </>
                  )}
                </Button>
              </div>

              {/* Image File Upload Alternative */}
              <div className="border border-border/60 bg-muted/20 p-6 rounded-none flex flex-col items-center justify-center text-center space-y-3">
                <div className="size-12 rounded-none bg-muted flex items-center justify-center text-muted-foreground">
                  <Upload className="size-6" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-foreground">
                    Upload Barcode / QR Image
                  </h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Select existing screenshot or digital PDF label
                  </p>
                </div>
                <label
                  htmlFor="file-upload-alternative"
                  className="inline-flex items-center justify-center h-8 px-4 text-xs font-medium border border-border/70 rounded-none bg-background hover:bg-muted cursor-pointer transition-colors"
                >
                  <Upload className="mr-1.5 size-3.5" /> Choose Image File
                </label>
                <input
                  id="file-upload-alternative"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoCapture}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: Test Shipment Codes (Visual Screen Generator & Simulator) */}
        <TabsContent value="test-codes" className="space-y-4 pt-1">
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-semibold text-sm text-foreground">
                  Operational Test Codes
                </h3>
                <p className="text-xs text-muted-foreground">
                  Test physical scanning by aiming your iPhone/Android camera at these barcodes, or click Simulate Scan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_SHIPMENT_CODES.map((item) => (
                <div
                  key={item.awb}
                  className="rounded-none border border-border/80 bg-card p-4 space-y-3.5 flex flex-col justify-between shadow-xs"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-primary">
                        {item.awb}
                      </span>
                      <Badge variant="outline" className="text-[10px] font-mono">
                        {item.status}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <p className="text-[11px] font-mono text-muted-foreground">
                      {item.corridor}
                    </p>
                  </div>

                  {/* Visual Barcode & QR Display */}
                  <div className="space-y-3 bg-muted/30 p-3 rounded-none border border-border/50">
                    <div className="flex justify-center">
                      <QRCodeSVG value={item.awb} size={110} level="M" />
                    </div>
                    <div className="border-t border-border/40 pt-2">
                      <Code39BarcodeSvg value={item.awb} height={40} />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 pt-1">
                    <Button
                      size="sm"
                      className="w-full text-xs font-medium"
                      onClick={() => handleScanSuccess(item.awb)}
                    >
                      <PackageCheck className="mr-1.5 size-3.5" /> Simulate Scan
                    </Button>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.awb, "AWB")}
                        className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                      >
                        {copiedText === "AWB" ? (
                          <Check className="size-3 text-success" />
                        ) : (
                          <Copy className="size-3" />
                        )}
                        <span>Copy AWB</span>
                      </button>
                      <Link
                        href={`/dashboard/tracking?awb=${encodeURIComponent(item.awb)}`}
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Tracker</span>
                        <ExternalLink className="size-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: Mobile Pairing & Device Linking */}
        <TabsContent value="pairing" className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Pairing QR Card */}
            <div className="md:col-span-5 rounded-none border border-border/80 bg-card p-5 space-y-4 text-center flex flex-col items-center">
              <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider">
                Instant Mobile Pairing
              </h4>
              <p className="text-xs text-muted-foreground max-w-xs">
                Scan with your iPhone Camera or Android Lens to open this terminal directly on your mobile device.
              </p>

              <div className="bg-card p-3 rounded-none shadow-sm border border-border/80">
                <QRCodeSVG
                  value={currentOrigin ? `${currentOrigin}/dashboard/integrations` : "https://tac-xpress.com/dashboard/integrations"}
                  size={160}
                  level="M"
                  className="[&_path]:fill-foreground"
                />
              </div>

              <div className="space-y-1 font-mono text-[11px] text-muted-foreground w-full">
                <span className="block truncate select-all font-semibold text-foreground">
                  {currentOrigin ? `${currentOrigin}/dashboard/integrations` : "/dashboard/integrations"}
                </span>
                <span className="text-[10px] text-muted-foreground">
                  Same Wi-Fi network or HTTPS tunnel required
                </span>
              </div>
            </div>

            {/* Platform Setup Guides */}
            <div className="md:col-span-7 space-y-4 text-xs">
              {/* iOS Guide */}
              <div className="rounded-none border border-border/80 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Smartphone className="size-4 text-primary" />
                    Apple iOS (iPhone / iPad Safari)
                  </h4>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    iOS 14.3+ WebKit
                  </Badge>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground leading-relaxed">
                  <li>Open the pairing link in <strong>Safari</strong>.</li>
                  <li>When prompted, tap <strong>Allow</strong> for camera access.</li>
                  <li>
                    <strong>If blocked:</strong> Tap the <strong>aA</strong> icon in the address bar → <strong>Website Settings</strong> → Camera: <strong>Allow</strong>.
                  </li>
                  <li>
                    <strong>Full-screen PWA:</strong> Tap the Share button → <strong>Add to Home Screen</strong>. Launches as a standalone scanner app with zero address bar distractions.
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className="rounded-none border border-border/80 bg-card p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Smartphone className="size-4 text-primary" />
                    Google Android (Chrome / Samsung Internet)
                  </h4>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    Chromium Engine
                  </Badge>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-muted-foreground leading-relaxed">
                  <li>Open in <strong>Chrome</strong>. Camera prompt will appear automatically.</li>
                  <li>Tap <strong>Allow</strong>. Tac-Xpress selects the high-resolution rear lens.</li>
                  <li>
                    <strong>Flashlight / Torch:</strong> Click &quot;Flash On&quot; in the live viewfinder for dark warehouse aisles.
                  </li>
                  <li>
                    <strong>Hardware Vibration:</strong> Android automatically vibrates upon successful barcode registration.
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
