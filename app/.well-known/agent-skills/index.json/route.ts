import { getAgentSkillsIndex } from "@/app/utils/agent-ready"

export function GET(): Response {
  return Response.json(getAgentSkillsIndex(), {
    headers: {
      "cache-control": "public, max-age=3600"
    }
  })
}
