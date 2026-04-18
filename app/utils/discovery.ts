import { absoluteUrl } from "@/app/utils/site"

export interface DiscoveryLink {
  href: string
  rel: string
  title?: string
  type?: string
}

export function getDiscoveryLinks(): DiscoveryLink[] {
  return [
    {
      href: absoluteUrl("/sitemap.xml"),
      rel: "sitemap",
      type: "application/xml"
    },
    {
      href: absoluteUrl("/llms.txt"),
      rel: "alternate",
      title: "LLMs.txt",
      type: "text/plain"
    },
    {
      href: absoluteUrl("/.well-known/api-catalog"),
      rel: "api-catalog",
      title: "API Catalog",
      type: "application/linkset+json"
    },
    {
      href: absoluteUrl("/api/search/openapi"),
      rel: "service-desc",
      title: "Docs Search API",
      type: "application/openapi+json"
    },
    {
      href: absoluteUrl("/features/ai-integration/mcp-server"),
      rel: "service-doc",
      title: "GitButler MCP Server Docs",
      type: "text/html"
    },
    {
      href: absoluteUrl("/.well-known/agent-skills/index.json"),
      rel: "describedby",
      title: "Agent Skills Index",
      type: "application/json"
    }
  ]
}

export function getDiscoveryLinkHeader(): string {
  return getDiscoveryLinks()
    .map((link) => {
      const params = [`<${link.href}>`, `rel="${link.rel}"`]

      if (link.type) {
        params.push(`type="${link.type}"`)
      }

      if (link.title) {
        params.push(`title="${link.title}"`)
      }

      return params.join("; ")
    })
    .join(", ")
}
