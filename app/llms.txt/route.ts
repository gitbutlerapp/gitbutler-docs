import { readFileSync } from "fs"

export function GET(): Response {
  const content = readFileSync("public/llms-full.txt", "utf-8")

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  })
}
