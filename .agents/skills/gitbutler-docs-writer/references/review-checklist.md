# GitButler Docs Review Checklist

Use this reference when creating, reviewing, or auditing GitButler docs.

## What We Are Borrowing

- **Diataxis:** Separate reader needs. Tutorials teach, how-tos solve, reference describes, explanations clarify.
- **GitHub Docs:** Use a consistent content model, task-based structure, findability, accessible links, and clear procedural writing.
- **Django Docs:** Keep tutorials, topic guides, reference, and how-tos distinct. Treat docs like code: review, improve, and verify them.
- **Stripe Docs:** Optimize for first success. Use concrete, copyable examples and make the happy path obvious.
- **GitHub Copilot `documentation-writer`:** Classify document type, audience, goal, and scope before writing.
- **Gemini CLI `docs-writer`:** Use active voice, direct address, precise requirements, descriptive links, real examples, and final link/format checks.

Sources:

- https://diataxis.fr/
- https://github.com/github/awesome-copilot/blob/main/skills/documentation-writer/SKILL.md
- https://github.com/google-gemini/gemini-cli/blob/main/.gemini/skills/docs-writer/SKILL.md
- https://docs.djangoproject.com/en/6.0/internals/contributing/writing-documentation/
- https://docs.github.com/en/contributing/style-guide-and-content-model/about-the-content-model
- https://docs.github.com/en/contributing/writing-for-github-docs/about-githubs-documentation-philosophy
- https://docs.stripe.com/quickstarts
- https://docs.stripe.com/api

## Page Type Tests

### Tutorial

Use a tutorial when the reader is learning. A good tutorial:

- Starts from a known beginner-safe state.
- Gives one guided path with few choices.
- Produces a small visible success quickly.
- Explains concepts after the reader has done something.
- Avoids detours, edge cases, and long reference tables.

Bad smell: the page starts explaining the entire mental model before the reader has done anything.

### How-to Guide

Use a how-to when the reader has a job to do. A good how-to:

- Starts with the outcome.
- Lists prerequisites before steps.
- Uses imperative steps.
- Includes verification.
- Links to concepts instead of teaching them inline.

Bad smell: the page spends more time explaining why the feature exists than helping the reader finish the task.

### Reference

Use reference when the reader needs facts. Good reference:

- Is organized around the machinery: commands, flags, settings, file formats, states, APIs.
- Uses terse descriptions.
- Shows defaults, required values, side effects, and related commands.
- Gives examples that clarify behavior without turning into a tutorial.

Bad smell: prose like "first, let's understand..." in a command or API reference.

### Explanation

Use explanation when the reader needs a mental model. Good explanation:

- Answers why GitButler works this way.
- Compares GitButler behavior with stock Git when that helps.
- Names tradeoffs honestly.
- Uses diagrams, examples, and analogies sparingly.
- Links to how-to guides for action.

Bad smell: the page teaches a concept but leaves the reader with no path to apply it.

### Troubleshooting

Use troubleshooting when the reader is stuck or scared. Good troubleshooting:

- Names the symptom in the title or first paragraph.
- Says whether work is at risk.
- Gives the safest recovery path first.
- Separates diagnosis from fixes.
- Provides commands to inspect state and verify recovery.
- Escalates to support only after self-serve fixes.

Bad smell: "This usually works" without explaining how to verify success.

## Structure Patterns

### How-to Template

```md
---
title: Do the specific thing
description: Short reader-facing outcome.
---

Use this when...

## Before you start

- Requirement
- Risk or limitation

## Do the thing

1. Run or click...
2. Check...
3. Finish...

## Verify it worked

Run...

## Next steps

Useful next action, only if one exists.
```

### Troubleshooting Template

````md
---
title: Fix the visible problem
description: Recover from or diagnose the specific symptom.
---

If you see X, your work is/is not at risk. Start with the safest fix.

## Check the current state

```bash
command
```

## Try the safest fix

1. Step...
2. Step...

## If that does not work

Use the next option...

## Verify recovery

```bash
command
```
````

### Reference Template

````md
---
title: "`but command`"
description: Do or inspect the specific thing.
---

The `but command` command does X.

**Usage:** `but command [ARGUMENTS] [OPTIONS]`

## Examples

```bash
but command realistic-target
```

## Arguments

- `<TARGET>` - What this identifies.

## Options

- `--flag` - What changes when this is set.

## Related commands

- [`but other-command`](other-command)
````

## Language Rules

- Use "you" for the reader.
- Use active voice.
- Use contractions when natural.
- Prefer short words over fancy ones.
- Prefer concrete nouns and verbs over abstractions.
- Put conditions before actions: "If the branch is unapplied, apply it first."
- Use "for example" instead of "e.g.".
- Use "that is" instead of "i.e.".
- Use descriptive link text. Avoid "click here" and "read more".
- Avoid unnecessary apologies, cheerleading, and marketing claims.

## Words To Challenge

Usually remove or replace:

- just
- simply
- easily
- obviously
- straightforward
- seamless
- powerful
- robust
- leverage
- utilize
- unlock
- ensure, when "check" or "make sure" is clearer
- allows you to, when "lets you" or a direct verb works

## GitButler-Specific Questions

Ask these when reviewing:

- Does this explain how GitButler differs from stock Git only where the reader needs it?
- Does it distinguish virtual branches, stacked branches, target branches, and workspace branches correctly?
- Does it tell the reader whether changes are committed, staged, applied, unapplied, pushed, or recoverable?
- Does it warn before destructive actions like discard, reset, delete, or force push?
- Does it prefer `but` CLI examples for CLI pages and UI steps for desktop pages?
- Does it include recovery paths for scary workflows?
- Does it avoid assuming GitHub if any forge works?

## Verification

For docs edits:

- Run format/build checks when practical.
- At minimum, inspect changed MDX for frontmatter, imports, broken links, heading hierarchy, and code fences.
- If a heading changed, search for deep links to its anchor.
- If command behavior changed, check generated command docs, CLI output sources, or relevant code.
