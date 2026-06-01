---
name: gitbutler-docs-writer
description: Write, edit, review, and audit GitButler documentation with reader-first structure, Diataxis page intent, GitHub-style task focus, Django-style doc taxonomy, and Stripe-style concrete examples. Use when working on `content/docs`, docs MDX/Markdown, command docs, troubleshooting docs, tutorials, explanations, or docs IA for the GitButler docs repo.
---

# GitButler Docs Writer

Use this skill for GitButler documentation work. The job is not to make docs sound polished. The job is to help readers succeed faster.

## Start Here

Before writing or editing, identify:

- **Reader:** new user, confused user, recovering user, CLI user, power user, contributor, or evaluator.
- **Need:** learn, do, look up, understand, troubleshoot, or decide.
- **Page type:** tutorial, how-to, reference, explanation, troubleshooting, release note, or landing page.
- **Success:** the concrete thing the reader can do or understand after reading.
- **Scope:** what belongs here, what should link elsewhere, and what must not be mixed into the page.

Make a reasonable call and proceed unless the missing answer would make the docs misleading.

## Page Types

- **Tutorial:** learning-oriented. Take the reader by the hand to a small real success. Minimize choices. Explain after action.
- **How-to:** task-oriented. Give steps to solve a specific problem. Assume basic familiarity. Stay focused on the outcome.
- **Reference:** lookup-oriented. Describe commands, options, APIs, files, states, limits, and behavior. Keep it complete, tight, and scannable.
- **Explanation:** understanding-oriented. Explain concepts, tradeoffs, mental models, and why GitButler behaves differently from stock Git.
- **Troubleshooting:** recovery-oriented. Start with symptoms, then likely causes, fixes, verification, and escalation path.
- **Landing page:** routing-oriented. Help readers pick the right next page. Avoid turning it into a marketing page.

One page may contain small supporting notes, but it must have one dominant type.

## GitButler Standards

- Lead with the answer or result.
- Prefer task titles: "Recover a deleted branch", not "Branch recovery".
- Use `you` for the reader and `GitButler` for the product.
- Be direct, practical, and human. Avoid corporate gloss.
- Avoid hype: "powerful", "seamless", "effortless", "robust", "leverage", "unlock".
- Avoid difficulty-minimizers: "just", "simply", "easy", "obviously", "straightforward".
- Use active voice and present tense.
- Be precise about requirements: use "must" for required steps and "can" for optional choices. Avoid vague "should".
- Use concrete workflow examples from GitButler, `but`, Git refs, branches, commits, worktrees, PRs, conflicts, and recovery.
- If the docs mention behavior, inspect the relevant docs or code when available. Do not make up product behavior.

## Writing Workflow

1. Read the current page, nearby pages, and relevant `meta.json` or navigation files.
2. Check links before adding or changing them. Use root-relative docs links only when that is the local convention.
3. Choose the page type and keep the page loyal to it.
4. Put prerequisites and risk warnings before steps that need them.
5. Give the reader an early win: a command, UI action, visible result, or clear decision.
6. Use examples that can plausibly work. Replace fake names like `foo` and `bar` with realistic names.
7. Put command output in separate code blocks or comments so commands stay copyable.
8. End with next steps only when there is a useful next action.

## MDX Conventions

- Keep frontmatter `title` and `description` accurate and reader-facing.
- Use sentence case headings.
- Use numbered lists for ordered procedures and bullets for unordered lists.
- Use fenced code blocks with language info where possible.
- Use existing components such as `Callout`, `ImageSection`, and command blocks only when they help the reader.
- Every image needs useful alt text unless the existing component pattern clearly handles it.
- Do not add a table of contents inside a page.

## Review Checklist

Before finishing, check:

- The page has one clear reader need.
- The title says what the reader gets.
- The first paragraph tells the reader why they are here.
- Steps are complete, ordered, and verifiable.
- Examples use realistic GitButler situations.
- Warnings appear before risky/destructive actions.
- Reference sections are scannable and do not teach unrelated concepts.
- Concept sections explain why, not only what to click.
- Links resolve or match an existing local pattern.
- The page contains no filler, hype, or "this is easy" language.

For deeper guidance, use [review-checklist.md](references/review-checklist.md).
