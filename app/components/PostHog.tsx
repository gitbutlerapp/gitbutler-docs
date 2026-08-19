"use client"

import posthog from "posthog-js"
import { useEffect } from "react"

// Same PostHog project as gitbutler.com, the blog and the desktop app, so one
// visitor is tracked as one person across all of them.
export function PostHog() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    posthog.init("phc_yJx46mXv6kA5KTuM2eEQ6IwNTgl5YW3feKV5gi7mfGG", {
      api_host: "https://eu.posthog.com",
      defaults: "2026-06-25"
    })
  }, [])
  return null
}
