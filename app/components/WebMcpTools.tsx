"use client"

import { useEffect } from "react"

interface RegisteredTool {
  name: string
  description: string
  inputSchema: Record<string, unknown>
  execute: (input: Record<string, unknown>) => Promise<unknown>
}

interface ModelContextNavigator extends Navigator {
  modelContext?: {
    provideContext?: (context: { tools: RegisteredTool[] }) => void
    registerTool?: (tool: RegisteredTool) => void
  }
}

function normalizeDocsPath(path: string): string {
  if (!path || path === "/") {
    return "/"
  }

  return path.startsWith("/") ? path : `/${path}`
}

export default function WebMcpTools(): null {
  useEffect(() => {
    const modelContext = (navigator as ModelContextNavigator).modelContext

    if (!modelContext) {
      return
    }

    const tools: RegisteredTool[] = [
      {
        name: "search_docs",
        description: "Search the GitButler docs site and return matching pages and snippets.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Free-text query to search the documentation."
            }
          },
          required: ["query"]
        },
        execute: async (input) => {
          const query = typeof input.query === "string" ? input.query.trim() : ""

          if (!query) {
            return { error: "Missing required parameter: query" }
          }

          const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`)

          if (!response.ok) {
            return { error: `Search request failed with ${response.status}` }
          }

          const results = (await response.json()) as Array<Record<string, unknown>>

          return {
            query,
            results: results.slice(0, 8)
          }
        }
      },
      {
        name: "get_page_markdown",
        description: "Fetch a GitButler docs page as markdown for agent-friendly reading.",
        inputSchema: {
          type: "object",
          properties: {
            path: {
              type: "string",
              description: "Docs path like /guide or /features/ai-integration/mcp-server."
            }
          },
          required: ["path"]
        },
        execute: async (input) => {
          const path = typeof input.path === "string" ? normalizeDocsPath(input.path.trim()) : "/"

          const response = await fetch(`/api/markdown?path=${encodeURIComponent(path)}`, {
            headers: {
              Accept: "text/markdown"
            }
          })

          if (!response.ok) {
            return { error: `Page request failed with ${response.status}`, path }
          }

          return {
            path,
            content: await response.text()
          }
        }
      }
    ]

    if (typeof modelContext.provideContext === "function") {
      modelContext.provideContext({ tools })
    }

    if (typeof modelContext.registerTool === "function") {
      tools.forEach((tool) => {
        modelContext.registerTool?.(tool)
      })
    }
  }, [])

  return null
}
