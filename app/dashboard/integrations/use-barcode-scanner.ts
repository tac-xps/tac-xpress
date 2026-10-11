"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { Html5Qrcode } from "html5-qrcode"
import * as Sentry from "@sentry/nextjs"

export interface CameraDeviceInfo {
  id: string
  label: string
}

export type CameraPermissionStatus =
  | "checking"
  | "granted"
  | "prompt"
  | "denied"
  | "unsupported"

export interface ScannerEngineState {
  isScanning: boolean
  isStarting: boolean
  hasTorch: boolean
  isTorchOn: boolean
  cameras: CameraDeviceInfo[]
  selectedCameraId: string | null
  facingMode: "environment" | "user"
  permissionStatus: CameraPermissionStatus
  errorMessage: string | null
  lastScanResult: string | null
}

/**
 * Universal Camera & Barcode Scanner Engine
 * Supports WebRTC streaming, iOS Safari / Android Chrome environment cameras,
 * torch toggling, and image file decode fallback.
 */
export function useCameraScanner(elementId: string = "tac-scanner-viewport") {
  const [state, setState] = useState<ScannerEngineState>({
    isScanning: false,
    isStarting: false,
    hasTorch: false,
    isTorchOn: false,
    cameras: [],
    selectedCameraId: null,
    facingMode: "environment",
    permissionStatus: "checking",
    errorMessage: null,
    lastScanResult: null,
  })

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const isStoppingRef = useRef(false)

  // Probe camera permissions and list video devices
  const checkPermissionsAndCameras = useCallback(async () => {
    if (typeof window === "undefined" || !navigator?.mediaDevices) {
      setState((prev) => ({
        ...prev,
        permissionStatus: "unsupported",
        errorMessage: "MediaDevices API not supported on this browser context.",
      }))
      return "unsupported" as CameraPermissionStatus
    }

    try {
      let permState: CameraPermissionStatus = "prompt"

      // Check standard Permissions API if supported (Chrome, Android, modern Safari)
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const result = await navigator.permissions.query({
            name: "camera" as PermissionName,
          })
          if (result.state === "granted") permState = "granted"
          else if (result.state === "denied") permState = "denied"
          else permState = "prompt"

          result.onchange = () => {
            setState((prev) => ({
              ...prev,
              permissionStatus:
                result.state === "granted"
                  ? "granted"
                  : result.state === "denied"
                    ? "denied"
                    : "prompt",
            }))
          }
        } catch {
          // Some browsers throw on querying camera permission
          permState = "prompt"
        }
      }

      // Query connected camera devices
      const { Html5Qrcode } = await import("html5-qrcode")
      let cameraDevices: CameraDeviceInfo[] = []

      try {
        const devices = await Html5Qrcode.getCameras()
        cameraDevices = (devices || []).map((dev) => ({
          id: dev.id,
          label: dev.label || `Camera ${dev.id.slice(0, 5)}`,
        }))
        if (cameraDevices.length > 0 && permState !== "denied") {
          permState = "granted"
        }
      } catch {
        // Cameras cannot be enumerated until user grants permission
      }

      setState((prev) => ({
        ...prev,
        permissionStatus: permState,
        cameras: cameraDevices,
        selectedCameraId: prev.selectedCameraId || (cameraDevices[0]?.id ?? null),
      }))

      return permState
    } catch (err) {
      Sentry.captureException(err)
      setState((prev) => ({
        ...prev,
        permissionStatus: "prompt",
      }))
      return "prompt" as CameraPermissionStatus
    }
  }, [])

  // Start active camera stream
  const startCamera = useCallback(
    async (
      onScanSuccess?: (text: string) => void,
      preferredCameraId?: string,
      preferredFacingMode?: "environment" | "user"
    ) => {
      if (typeof window === "undefined") return
      if (html5QrCodeRef.current?.isScanning) return

      setState((prev) => ({ ...prev, isStarting: true, errorMessage: null }))

      try {
        const { Html5Qrcode, Html5QrcodeSupportedFormats } = await import(
          "html5-qrcode"
        )

        // Ensure container element exists in DOM
        const targetElement = document.getElementById(elementId)
        if (!targetElement) {
          throw new Error(`Scanner target element #${elementId} not found in DOM.`)
        }

        // Initialize instance if not already created
        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(elementId, {
            verbose: false,
            formatsToSupport: [
              Html5QrcodeSupportedFormats.CODE_128,
              Html5QrcodeSupportedFormats.CODE_39,
              Html5QrcodeSupportedFormats.EAN_13,
              Html5QrcodeSupportedFormats.QR_CODE,
              Html5QrcodeSupportedFormats.DATA_MATRIX,
              Html5QrcodeSupportedFormats.UPC_A,
            ],
          })
        }

        const activeFacingMode = preferredFacingMode || state.facingMode
        const cameraIdToUse = preferredCameraId || state.selectedCameraId

        // Target constraints: environment (rear) camera on mobile by default
        const cameraConfig = cameraIdToUse
          ? cameraIdToUse
          : { facingMode: activeFacingMode }

        await html5QrCodeRef.current.start(
          cameraConfig,
          {
            fps: 15,
            qrbox: (viewfinderWidth, viewfinderHeight) => {
              const minDim = Math.min(viewfinderWidth, viewfinderHeight)
              return {
                width: Math.floor(minDim * 0.8),
                height: Math.floor(minDim * 0.6),
              }
            },
            aspectRatio: 1.333333,
          },
          (decodedText) => {
            setState((prev) => ({ ...prev, lastScanResult: decodedText }))
            if (onScanSuccess) {
              onScanSuccess(decodedText)
            }
          },
          () => {
            // Per-frame decode misses are expected during continuous video
          }
        )

        // Query capabilities for torch / flashlight
        let torchAvailable = false
        try {
          const capabilities = html5QrCodeRef.current.getRunningTrackCapabilities() as any
          torchAvailable = Boolean(capabilities?.torch)
        } catch {
          torchAvailable = false
        }

        // Refresh camera list now that permission is granted
        let updatedCameras = state.cameras
        try {
          const devs = await Html5Qrcode.getCameras()
          if (devs && devs.length > 0) {
            updatedCameras = devs.map((d) => ({
              id: d.id,
              label: d.label || `Camera ${d.id.slice(0, 5)}`,
            }))
          }
        } catch {
          // ignore
        }

        setState((prev) => ({
          ...prev,
          isScanning: true,
          isStarting: false,
          hasTorch: torchAvailable,
          isTorchOn: false,
          cameras: updatedCameras,
          permissionStatus: "granted",
          errorMessage: null,
        }))
      } catch (err: any) {
        const isExpectedMediaError =
          err?.name === "NotFoundError" ||
          err?.name === "NotAllowedError" ||
          err?.name === "OverconstrainedError" ||
          err?.name === "NotReadableError" ||
          err?.message?.includes("Requested device not found") ||
          err?.message?.includes("Permission denied")

        if (!isExpectedMediaError) {
          Sentry.captureException(err)
        }

        const errMsg =
          err?.name === "NotAllowedError" || err?.message?.includes("Permission")
            ? "Camera permission denied. Please allow camera access in your browser or device settings."
            : err?.name === "NotFoundError" || err?.message?.includes("Requested device not found")
              ? "No camera hardware detected on this device."
              : err?.name === "NotReadableError"
                ? "Camera hardware is currently in use by another application."
                : err?.message || "Failed to initialize camera scanner."

        setState((prev) => ({
          ...prev,
          isScanning: false,
          isStarting: false,
          permissionStatus:
            err?.name === "NotAllowedError" ? "denied" : prev.permissionStatus,
          errorMessage: errMsg,
        }))
      }
    },
    [elementId, state.facingMode, state.selectedCameraId, state.cameras]
  )

  // Stop active camera stream
  const stopCamera = useCallback(async () => {
    if (!html5QrCodeRef.current || isStoppingRef.current) return
    isStoppingRef.current = true

    try {
      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop()
      }
      html5QrCodeRef.current.clear()
    } catch (err) {
      // Ignore cleanup error
    } finally {
      isStoppingRef.current = false
      setState((prev) => ({
        ...prev,
        isScanning: false,
        isStarting: false,
        isTorchOn: false,
      }))
    }
  }, [])

  // Toggle hardware torch
  const toggleTorch = useCallback(async () => {
    if (!html5QrCodeRef.current || !state.hasTorch) return
    const nextTorch = !state.isTorchOn

    try {
      await (html5QrCodeRef.current as any).applyVideoConstraints({
        advanced: [{ torch: nextTorch }],
      })
      setState((prev) => ({ ...prev, isTorchOn: nextTorch }))
    } catch (err) {
      Sentry.captureException(err)
    }
  }, [state.hasTorch, state.isTorchOn])

  // Switch camera facing mode (user vs environment)
  const setFacingMode = useCallback(
    async (mode: "environment" | "user", onScanSuccess?: (text: string) => void) => {
      setState((prev) => ({ ...prev, facingMode: mode, selectedCameraId: null }))
      if (state.isScanning) {
        await stopCamera()
        await startCamera(onScanSuccess, undefined, mode)
      }
    },
    [state.isScanning, stopCamera, startCamera]
  )

  // Switch specific camera device by ID
  const selectCamera = useCallback(
    async (cameraId: string, onScanSuccess?: (text: string) => void) => {
      setState((prev) => ({ ...prev, selectedCameraId: cameraId }))
      if (state.isScanning) {
        await stopCamera()
        await startCamera(onScanSuccess, cameraId)
      }
    },
    [state.isScanning, stopCamera, startCamera]
  )

  // Decode from still image file (native iOS / Android camera photo capture)
  const scanFile = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const { Html5Qrcode } = await import("html5-qrcode")
        const scannerInstance = new Html5Qrcode(`temp-file-scanner-${Date.now()}`, {
          verbose: false,
        })
        const result = await scannerInstance.scanFile(file, false)
        scannerInstance.clear()
        setState((prev) => ({ ...prev, lastScanResult: result, errorMessage: null }))
        return result
      } catch (err: any) {
        const msg = "Could not detect a valid barcode or QR code in the uploaded image."
        setState((prev) => ({ ...prev, errorMessage: msg }))
        return null
      }
    },
    []
  )

  // Lifecycle probe
  useEffect(() => {
    checkPermissionsAndCameras()

    return () => {
      if (html5QrCodeRef.current) {
        if (html5QrCodeRef.current.isScanning) {
          html5QrCodeRef.current.stop().catch(() => {})
        }
        html5QrCodeRef.current.clear()
        html5QrCodeRef.current = null
      }
    }
  }, [checkPermissionsAndCameras])

  return {
    ...state,
    startCamera,
    stopCamera,
    toggleTorch,
    setFacingMode,
    selectCamera,
    scanFile,
    checkPermissionsAndCameras,
    // Backwards compatibility aliases
    scanResult: state.lastScanResult,
    scannerError: state.errorMessage,
  }
}

export const useBarcodeScanner = useCameraScanner
