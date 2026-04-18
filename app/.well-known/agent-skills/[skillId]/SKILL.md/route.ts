import { getAgentSkill } from "@/app/utils/agent-ready"

interface Params {
  skillId: string
}

export async function GET(_: Request, context: { params: Promise<Params> }): Promise<Response> {
  const params = await context.params
  const skill = getAgentSkill(params.skillId)

  if (!skill) {
    return new Response("Not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8"
      }
    })
  }

  return new Response(`${skill.content}\n`, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600"
    }
  })
}
