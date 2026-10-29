# GitButler Docs Agent Notes

## Documentation

When writing, editing, reviewing, or auditing docs in this repo, use the
`gitbutler-docs-writer` skill at:

`.agents/skills/gitbutler-docs-writer/SKILL.md`

That skill is the source of truth for GitButler docs style, page intent,
reader focus, and review checks.

## Generated command docs

Do not edit `content/docs/commands/but-*.mdx`, `content/docs/commands/meta.json`,
or `public/cli-examples/` by hand; a release workflow regenerates them. See the
"Commands" section of `CLI-DOCS.md`.
