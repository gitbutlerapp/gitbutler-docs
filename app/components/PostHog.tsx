"use client"

import posthog from "posthog-js"
import { useEffect } from "react"

export function PostHog() {
  useEffect(() => {
    if (location.hostname !== "docs.gitbutler.com") return
    posthog.init("phc_yJx46mXv6kA5KTuM2eEQ6IwNTgl5YW3feKV5gi7mfGG", {
      api_host: "https://eu.posthog.com",
      defaults: "2026-06-25",
      cookie_persisted_properties: ["app_distinct_id"]
    })
    recordAppDistinctId()
  }, [])
  return null
}

function recordAppDistinctId() {
  const url = new URL(location.href)
  const appDistinctId = url.searchParams.get("did")
  if (!appDistinctId) return
  posthog.register({ app_distinct_id: appDistinctId })
  url.searchParams.delete("did")
  history.replaceState(history.state, "", url)
}
