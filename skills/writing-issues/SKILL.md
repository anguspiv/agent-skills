---
name: writing-issues
description: Use when opening or rewriting a GitHub issue on Angus's behalf. A task from a plan, a bug someone described in chat, a proposal that needs decisions, a follow-up noticed in passing. Trigger on "open an issue", "file this", "write up a ticket", "seed issues from the plan", "turn this into an issue", or whenever work needs to be handed to a person or agent who was not in the conversation. Pairs with angusp-voice for the sentences; this skill owns the shape of the issue.
license: MIT
metadata:
  version: "0.1.0"
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
short). This skill sets the shape.

## The shape

The opening is always prose. Headings come after the reader knows what this
is. A project with its own template keeps that template's headings, in its
order, exactly; the opening paragraph still comes first.

```
# <title>

<one paragraph, 60 words or fewer: who needs this, what changes for them,
why now. Not what you read, not the request that produced it.>

## Outcome
<one sentence a person can check without reading code>

## Acceptance criteria             (work only; a proposal has none until decided)
- [ ] <checkable statement> — proof: <test file, command, or thing to look at>

## Decisions                      (only when something is open)
1. <question>? Default: <answer>, because <one reason>.

## Risk
<low|medium|high> — <reason in the reader's words: what breaks for whom>

## Constraints                    (only what a cold reader would get wrong)
- <one line each>

## Links                          (plan section, spec section, related issues)
Blocked by: #N                    (its own line, when something must land first)

<details><summary>…</summary> everything else: steps, trade-offs, evidence </details>

<last line, for an issue that asks for a decision: the reader's next action>
```

## Budgets

| part | limit |
| --- | --- |
| opening paragraph | 60 words |
| above the first `<details>` | 250 words; for a proposal, 200 |
| acceptance criteria | 3 to 7, each with a proof |
| decisions | one question each, each with a default |

## Titles

The title says what changes or what is wrong, in the reader's words:
"`sync --since` re-uploads every note" not "Bug in sync". An issue seeded
from a plan task starts with `Task N:` and keeps the plan's task title. No
labels in the title; labels are labels.

## What never goes in

The chat that produced it ("the owner said", "I'm filing this because").
A list of what you read. A proposed implementation above the fold; it goes
under `<details>` as a hypothesis, labelled as one. Placeholders: a part you
cannot fill reads "Not stated; a person writes this before Ready", which is
a sentence someone can act on.

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
| 500 words of steps and trade-offs | Steps go under `### Progress` or `<details>`; trade-offs under `<details>`. |
| Opening paragraph citing spec sections and invariants | One sentence of why; the pointer goes in Links. |
