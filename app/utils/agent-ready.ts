import { createHash } from "crypto"
import { absoluteUrl } from "@/app/utils/site"

export interface AgentSkillDefinition {
  id: string
  name: string
  description: string
  type: string
  content: string
}

function createSha256(value: string): string {
  return createHash("sha256").update(value).digest("hex")
}

export const agentSkillDefinitions: AgentSkillDefinition[] = [
  {
    id: "gitbutler-getting-started",
    name: "GitButler Getting Started",
    description: "Onboard a developer to the core GitButler desktop workflow.",
    type: "documentation",
    content: `# GitButler Getting Started

Use this skill when you need to explain the first-run GitButler workflow to a user.

## Recommended flow

1. Read /guide as markdown by requesting it with \`Accept: text/markdown\`.
2. Walk through target branch selection, authentication, creating a branch, committing work, and updating from upstream.
3. Call out GitButler's strengths: parallel branches, commit editing, and undoing risky operations.

## Key references

- Guide: ${absoluteUrl("/guide")}
- Desktop overview: ${absoluteUrl("/overview")}
- Timeline: ${absoluteUrl("/features/timeline")}
`
  },
  {
    id: "gitbutler-ai-agent-setup",
    name: "GitButler AI Agent Setup",
    description: "Configure a coding agent to use GitButler's `but` CLI and agent skill.",
    type: "documentation",
    content: `# GitButler AI Agent Setup

Use this skill when an agent needs to help a developer organize coding-agent changes with GitButler.

## Recommended flow

1. Read /ai-agents/getting-started as markdown.
2. Confirm that the \`but\` CLI is installed.
3. Install or update the GitButler agent skill with \`but skill install\`.
4. Add baseline version-control instructions so the agent uses GitButler for branching, committing, pushing, and history edits.

## Key references

- AI agents overview: ${absoluteUrl("/ai-agents/overview")}
- Getting started: ${absoluteUrl("/ai-agents/getting-started")}
- Tuning agent behavior: ${absoluteUrl("/ai-agents/tuning-agent-behavior")}
`
  },
  {
    id: "gitbutler-cli-reference",
    name: "GitButler CLI Reference",
    description: "Find the right GitButler CLI command and jump to the matching docs page.",
    type: "documentation",
    content: `# GitButler CLI Reference

Use this skill when a user needs the GitButler CLI syntax, examples, or command documentation.

## Recommended flow

1. Search the docs site for the command name or topic.
2. Prefer command-specific pages under /commands when they exist.
3. If the user is learning the CLI, start with the overview and tutorial pages before jumping into a single command page.

## Key references

- CLI overview: ${absoluteUrl("/cli-overview")}
- Commands overview: ${absoluteUrl("/commands/commands-overview")}
- CLI tutorial: ${absoluteUrl("/cli-guides/cli-tutorial/tutorial-overview")}
`
  }
]

export function getAgentSkill(id: string): AgentSkillDefinition | undefined {
  return agentSkillDefinitions.find((skill) => skill.id === id)
}

export function getAgentSkillsIndex() {
  return {
    $schema: "https://agentskills.io/schemas/agent-skills-index.v0.2.0.json",
    version: "0.2.0",
    generatedAt: new Date().toISOString(),
    skills: agentSkillDefinitions.map((skill) => ({
      name: skill.name,
      type: skill.type,
      description: skill.description,
      url: absoluteUrl(`/.well-known/agent-skills/${skill.id}/SKILL.md`),
      sha256: createSha256(skill.content)
    }))
  }
}
