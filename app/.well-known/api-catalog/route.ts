import { absoluteUrl } from "@/app/utils/site"

export function GET(): Response {
  const document = {
    linkset: [
      {
        anchor: absoluteUrl("/"),
        item: [
          {
            href: absoluteUrl("/guide"),
            rel: "service-doc",
            type: "text/html",
            title: "Getting Started Guide"
          },
          {
            href: absoluteUrl("/features/ai-integration/mcp-server"),
            rel: "service-doc",
            type: "text/html",
            title: "GitButler MCP Server"
          },
          {
            href: absoluteUrl("/api/search/openapi"),
            rel: "service-desc",
            type: "application/openapi+json",
            title: "Docs Search API"
          },
          {
            href: absoluteUrl("/api/status"),
            rel: "status",
            type: "application/json",
            title: "Docs Status"
          }
        ]
      },
      {
        anchor: absoluteUrl("/api/search"),
        item: [
          {
            href: absoluteUrl("/api/search/openapi"),
            rel: "service-desc",
            type: "application/openapi+json",
            title: "Docs Search API"
          },
          {
            href: absoluteUrl("/"),
            rel: "service-doc",
            type: "text/html",
            title: "GitButler Docs"
          },
          {
            href: absoluteUrl("/api/status"),
            rel: "status",
            type: "application/json",
            title: "Docs Status"
          }
        ]
      }
    ]
  }

  return new Response(JSON.stringify(document, null, 2), {
    headers: {
      "content-type": "application/linkset+json; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  })
}
