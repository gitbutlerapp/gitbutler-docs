import { getPageMarkdown } from "@/app/utils/agent-markdown"

export function GET(request: Request): Response {
  const { searchParams } = new URL(request.url)
  const pathname = searchParams.get("path") ?? "/"
  const document = getPageMarkdown(pathname)

  if (!document) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    })
  }

  return new Response(`${document.markdown}\n`, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept",
      "cache-control": "public, max-age=0, must-revalidate"
    }
  })
}
