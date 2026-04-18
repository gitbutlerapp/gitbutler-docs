import { absoluteUrl, getSiteOrigin } from "@/app/utils/site"

export function GET(): Response {
  const document = {
    openapi: "3.1.0",
    info: {
      title: "GitButler Docs Search API",
      version: "1.0.0",
      description:
        "Searches the GitButler documentation index and returns matching pages, headings, and text snippets."
    },
    servers: [
      {
        url: getSiteOrigin()
      }
    ],
    paths: {
      "/api/search": {
        get: {
          operationId: "searchDocs",
          summary: "Search GitButler docs",
          description: "Returns the best matching documentation entries for a query string.",
          parameters: [
            {
              name: "query",
              in: "query",
              required: true,
              schema: {
                type: "string"
              },
              description: "Free-text query used to search the docs index."
            }
          ],
          responses: {
            "200": {
              description: "Search results",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        id: { type: "string" },
                        type: {
                          type: "string",
                          enum: ["page", "heading", "text"]
                        },
                        content: { type: "string" },
                        url: {
                          type: "string",
                          examples: [absoluteUrl("/features/ai-integration/mcp-server")]
                        }
                      },
                      required: ["id", "type", "content", "url"]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  return new Response(JSON.stringify(document, null, 2), {
    headers: {
      "content-type": "application/openapi+json; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  })
}
