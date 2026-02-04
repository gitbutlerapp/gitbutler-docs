'use client'

import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { DocsLayoutProps } from "fumadocs-ui/layouts/docs"
import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function AutoScrollDocsLayout(props: DocsLayoutProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Wait for the DOM to update and the sidebar to render
    const timer = setTimeout(() => {
      // Find the active sidebar item
      const activeItem = document.querySelector('#nd-sidebar [data-active="true"]')

      if (activeItem) {
        // Scroll the active item into view with some offset for better visibility
        activeItem.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    }, 100) // Small delay to ensure the sidebar has rendered

    return () => clearTimeout(timer)
  }, [pathname]) // Re-run when pathname changes

  return <DocsLayout {...props} />
}
