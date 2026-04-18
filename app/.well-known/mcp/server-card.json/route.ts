import { absoluteUrl } from "@/app/utils/site"

export function GET(): Response {
  const document = {
    name: "gitbutler-mcp",
    description:
      "GitButler's MCP server is exposed by the local `but mcp` command and helps coding agents checkpoint and organize repository changes.",
    websiteUrl: absoluteUrl("/features/ai-integration/mcp-server"),
    documentationUrl: absoluteUrl("/features/ai-integration/mcp-server"),
    serverInfo: {
      name: "GitButler MCP Server",
      version: "1.0.0"
    },
    transports: [
      {
        type: "stdio",
        command: "but",
        args: ["mcp"]
      }
    ],
    capabilities: {
      tools: [
        {
          name: "gitbutler_update_branches",
          description:
            "Record agent-generated file changes in GitButler so they can be grouped into branches, checkpoints, and commits."
        }
      ]
    }
  }

  return Response.json(document, {
    headers: {
      "cache-control": "public, max-age=3600"
    }
  })
}
