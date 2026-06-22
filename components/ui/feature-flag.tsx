"use client"
import { useFeatureFlagEnabled } from "posthog-js/react"
import { ReactNode } from "react"

interface FeatureFlagProps {
  flagKey: string
  match?: boolean
  children: ReactNode
  fallback?: ReactNode
}

export function FeatureFlag({ flagKey, match = true, children, fallback = null }: FeatureFlagProps) {
  const isEnabled = useFeatureFlagEnabled(flagKey)
  
  // If undefined (loading but not bootstrapped), we can optionally show fallback.
  // For now, if it exactly matches the expected state, we render children.
  if (isEnabled === match) {
    return <>{children}</>
  }
  
  return <>{fallback}</>
}
