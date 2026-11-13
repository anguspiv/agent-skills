---
name: writing-issues
description: Use when opening or rewriting a GitHub issue on Angus's behalf. A task from a plan, a bug someone described in chat, a proposal that needs decisions, a follow-up noticed in passing. Trigger on "open an issue", "file this", "write up a ticket", "seed issues from the plan", "turn this into an issue", or whenever work needs to be handed to a person or agent who was not in the conversation. Pairs with angusp-voice for the sentences; this skill owns the shape of the issue.
license: MIT
metadata:
  version: "0.1.1"
  author: anguspiv
---

# writing-issues

## Overview

An issue is the work queue. Whoever picks it up, a person or an agent, was
not in the conversation that produced it and must act from the body alone.
So the body says who needs this and why before anything else, states one
outcome a person can check without reading code, and lists criteria each
with the proof that it holds. Everything an implementer could decide for
themselves stays out.

**REQUIRED BACKGROUND:** angusp-voice sets the sentences (ask first, plain,
short). This skill sets the shape, and its budgets for an issue body replace
the general ones in angusp-voice.

## The shape

The title is the issue's title field, not a line of the body. The body opens
with prose. Headings come after the reader knows what this is. When the
project has an issue template or a voice document, that project's heading
names, heading level, and order win, and the opening paragraph still comes
first; when the two disagree, the issue form wins, because forms are what
people fill in. Without a project template, the default level is `##`.

```
<one paragraph, 60 words or fewer: who needs this, what changes for them,
why now. Not what you read, not the request that produced it.>

## Outcome                        (work only; a proposal has none until decided)
<one sentence a person can check without reading code>

## Acceptance criteria            (work only; 2 to 7, a bug usually 2 or 3)
- [ ] <checkable statement> — proof: <the test file it lives in or will be added to, a command, or a thing to look at>

## Decisions                      (only when something is open)
1. <question>? Default: <answer>, because <one reason>.

## Risk
<low|medium|high> — <reason in the reader's words: what breaks for whom>

## Constraints                    (only what a cold reader would get wrong)
- <one line each>

## Plan section                   (task from a plan only)
<plan file> — Task N

## Links                          (only when there is one: spec section, related issue)
Blocked by: #N                    (its own line, when something must land first)

## Progress                       (task from a plan only: the plan's steps as checkboxes)
- [ ] Step 1: …

<details><summary>…</summary> everything else: trade-offs, evidence, the suspected cause </details>

<for an issue that asks for a decision: the reader's next action, one line>
<a trailing marker the project parses, when there is one, stays the very last line>
```

A part with nothing in it is left out. A part the project's template requires
that you cannot fill reads, as prose, "Not stated; a person writes this before
Ready." It is never written as a checkbox, because a checkbox counts as a
criterion to the scripts that read issues.

## Budgets

Words are counted outside `<details>` blocks, wherever they fall.

| part | limit |
| --- | --- |
| opening paragraph | 60 words |
| task from a plan, outside `<details>` | 250 words |
| bug, outside `<details>` | 200 words |
| proposal, outside `<details>` | 200 words |
| acceptance criteria | 2 to 7, each with a proof; a bug usually 2 or 3 |
| decisions | one question each, each with a default; list every open one |

## Titles

The title says what changes or what is wrong, in the reader's words:
"`report --until` accepts a future date" not "Bug in report". An issue
seeded from a plan task starts with `Task N:` and keeps the plan's task
title. No labels in the title. The body states the risk level; the `risk:*`
label is a person's call unless the project's instructions say the agent
applies it.

## Rewriting an existing issue

Keep every heading, every checked box, every form field, and every marker
the project parses. Change prose only. If you remove a line, say so in a
comment on the issue. A human's edits are not yours to overwrite.

## What never goes in

The chat that produced it ("the owner said", "I'm filing this because").
A list of what you read. A proposed implementation outside `<details>`; it
goes under `<details>` as a hypothesis, labelled as one. A spec or plan
citation in the opening paragraph; a pointer in parentheses may follow the
sentence that uses it, and the file goes under Plan section or Links.

## Quick reference

| issue | read |
| --- | --- |
| task from a plan, bug from a chat message, proposal with decisions | [references/types.md](references/types.md) |

## Common drift

| drift | fix |
| --- | --- |
| `## Summary` as the first line | Prose paragraph first; the summary is the paragraph. |
| Impact or "who cares" at the bottom | It is the first sentence. |
| Options listed, then "my leaning" at the end | Each option is a numbered question with `Default:` and one reason. The leaning is the default. |
| Tests described in prose ("the fix should add coverage for…") | Each is a checkbox with `proof:` naming the test. |
| 500 words of steps and trade-offs | Steps go under `## Progress` on a task issue; trade-offs under `<details>`. |
| Opening paragraph citing spec sections and invariants | One sentence of why; the pointer goes in Plan section or Links. |
| A one-line `<details>` opened early so the rest "doesn't count" | Budgets count every word outside `<details>`, wherever it sits. |
| The next action written after a trailing marker | The marker stays last; the next action goes above it. |
