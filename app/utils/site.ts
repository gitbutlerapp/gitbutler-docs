const DEFAULT_SITE_ORIGIN = "https://docs.gitbutler.com"

export function getSiteOrigin(): string {
  const explicitOrigin = process.env.NEXT_PUBLIC_BASE_URL ?? process.env.SITE_URL

  if (explicitOrigin) {
    return explicitOrigin.startsWith("http") ? explicitOrigin : `https://${explicitOrigin}`
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000"
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  return DEFAULT_SITE_ORIGIN
}

export function getSiteUrl(): URL {
  return new URL(getSiteOrigin())
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString()
}
