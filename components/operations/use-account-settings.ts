"use client"
import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  getUserProfile,
  updateProfile,
  uploadAvatarFile,
  resetTour,
} from "@/app/actions/user"
import { toast } from "sonner"
type Profile = Awaited<ReturnType<typeof getUserProfile>>
export function useAccountSettings(onClose: () => void) {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [error, setError] = useState("")
  const [pending, startTransition] = useTransition()
  useEffect(() => {
    let active = true
    getUserProfile()
      .then((value) => {
        if (active) setProfile(value)
      })
      .catch(() => {
        if (active)
          setError(
            "Unable to load your profile. Close this panel and try again."
          )
      })
    return () => {
      active = false
    }
  }, [])
  function save() {
    if (!profile) return
    setError("")
    startTransition(async () => {
      try {
        await updateProfile({ fullName: profile.fullName })
        toast.success("Profile saved")
        router.refresh()
      } catch {
        setError("Your changes could not be saved. Try again.")
      }
    })
  }
  function upload(file: File) {
    setError("")
    startTransition(async () => {
      try {
        const data = new FormData()
        data.set("file", file)
        await uploadAvatarFile(data)
        toast.success("Photo saved")
        router.refresh()
      } catch {
        setError(
          "Photo upload failed. Use a JPEG, PNG or WebP under 2 MB, or try again later."
        )
      }
    })
  }
  function restart() {
    startTransition(async () => {
      try {
        const result = await resetTour()
        if (!result.success) throw new Error()
        onClose()
        router.refresh()
      } catch {
        setError("Unable to restart the tour. Try again.")
      }
    })
  }
  return { profile, setProfile, error, pending, save, upload, restart }
}
