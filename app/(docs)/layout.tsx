import type { ReactNode } from "react"
import { docsOptions } from "@/app/layout.config"
import { AutoScrollDocsLayout } from "@/components/auto-scroll-sidebar"
import "fumadocs-twoslash/twoslash.css"

export default function Layout({ children }: { children: ReactNode }) {
  return <AutoScrollDocsLayout {...docsOptions}>{children}</AutoScrollDocsLayout>
}
