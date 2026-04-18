import { getDiscoveryLinkHeader } from "@/app/utils/discovery"
import { NextRequest, NextResponse } from "next/server"

const STATIC_PREFIXES = [
  "/_next",
  "/api",
  "/fav",
  "/img",
  "/cache",
  "/cli-examples",
  "/oss",
  "/.well-known"
]

const STATIC_FILES = new Set([
  "/cover.png",
  "/manifest.webmanifest",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt",
  "/llms-full.txt",
  "/gitbutler-cheat-sheet-all.pdf",
  "/gitbutler-cheat-sheet-basic.pdf"
])

function appendHeaderValue(existing: string | null, value: string): string {
  if (!existing) {
    return value
  }

  const parts = existing.split(",").map((part) => part.trim())

  if (parts.includes(value)) {
    return existing
  }

  return `${existing}, ${value}`
}

function isPageRequest(pathname: string): boolean {
  if (pathname === "/") {
    return true
  }

  if (STATIC_FILES.has(pathname)) {
    return false
  }

  if (STATIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return false
  }

  return !/\.[a-z0-9]+$/iu.test(pathname)
}

export function middleware(request: NextRequest): NextResponse {
  const pathname = request.nextUrl.pathname

  if (!isPageRequest(pathname)) {
    return NextResponse.next()
  }

  const acceptsMarkdown = request.headers.get("accept")?.includes("text/markdown") ?? false
  const response = acceptsMarkdown
    ? NextResponse.rewrite(
        new URL(`/api/markdown?path=${encodeURIComponent(pathname)}`, request.url)
      )
    : NextResponse.next()

  response.headers.set("Link", getDiscoveryLinkHeader())
  response.headers.set("Vary", appendHeaderValue(response.headers.get("Vary"), "Accept"))

  return response
}

export const config = {
  matcher: "/:path*"
}
