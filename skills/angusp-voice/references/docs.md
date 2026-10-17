# Documents and GitHub posts

Anything posted to GitHub or written into a repository is read later, by
someone with no context, often on a phone. Under 300 words before the first
`<details>` block. The ask first. Evidence folded. Headings only after the
reader knows what the document is.

## Pull request description

```
<two sentences: what changed and why, for a reader who has not seen the issue>

Closes #N

## You decide

<each deviation from the plan or spec as a question with a default; or
"Nothing. Merge when green.">

## Verified

<what was run and what it showed, one line each>

<details><summary>Files and details</summary>
<the file list, the not-done list with its task number, anything else>
</details>
```

The first two sentences are prose, not a heading and not `Closes`. The file
list never appears above `<details>`.

Example opening, for a branch that added JSON output to a CLI:

> Every `recipe` subcommand can now print JSON with `--json`, so scripts can
> consume the output without parsing tables. Human output is unchanged.
>
> Closes #17
>
> ## You decide
>
> 1. The plan added `--json` to each subcommand. I put it on the root command
>    instead, because every subcommand shares one printer. Keep it on the
>    root? Default: yes; it is one flag to document instead of nine.

## Comment on an issue or PR

First line: the verdict or the ask, in one sentence. Then the decisions,
numbered with defaults. Then one line per thing the reader would want to
know. Then `<details>` for everything else. Last line: the reader's next
action. If the project defines a first-line marker for the comment type
(`## Proposal`, `## Code review`, `## Triage`), it goes first and stays
exactly as defined.

A review verdict reads "No findings." or "One bug, must fix." or "Two
findings, neither blocks." before any list.

## Issue body

One paragraph before any heading: who needs this, what changes for them, why
now. Then the sections the project's issue template defines, in its order,
with no placeholders. A body you cannot fill says so in one line rather than
guessing. The `writing-issues` skill carries the full shape; this file only
fixes the opening.

## README and doc sections

A section is one idea, 250 words or fewer, one heading. Open with the
sentence that gives the reader the model ("There are two versions here, and
they move independently"), or with the action they came for. Sub-headings
only when a sub-part exceeds 100 words on its own. Commands in code blocks;
the sentence before a code block says when to run it. A warning is a plain
sentence, not a bold one.

Example section opening:

> ## Installing
>
> Two ways in, same files. Claude Code users add the marketplace and install
> the plugin; everyone else runs one `npx` command. Both commands are below;
> pick the one for your agent.

## Before and after

Before: "Issue #24 is risk:high. This is a proposal only; nothing is
implemented. I read CLAUDE.md, the issue and its triage comment, plan Task 11,
spec §3.3 and §4.6, ADRs 0001, 0002, 0005 and 0006, and `packages/core` and
`packages/schema`."

After: "`diff` tells a cook what changed between two versions of a recipe.
The rule it must keep is that an ingredient is the same ingredient because
its id is the same, not because it sits in the same slot. I recommend
building it as the plan says, with three changes below. Decide: 1. …"

Before: "Every check is stamped with the PR's current `headRefOid`, so a check
run against an older commit is indistinguishable from a current one."

After: "A review could be marked as covering a commit nobody read: the status
is written against whatever the head is at post time, and a push can land
during the review. Fix: pass the commit you read, and refuse if it moved."

## Machine markers

Some projects parse strings in posts: a first-line heading, `Closes #N`,
`Blocked by: #N`, a trailing HTML comment. When the project's instructions
name such markers, keep them exactly and in position. Everything around a
marker may change; the marker may not.
