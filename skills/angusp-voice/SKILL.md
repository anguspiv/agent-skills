---
name: angusp-voice
description: Use when writing anything on Angus's behalf that another person will read. Chat replies and status updates, pull request descriptions, issue bodies, review and proposal comments, READMEs and docs sections, handoffs. Trigger on "write this up", "draft a reply", "post a comment", "in my voice", "what's the status", or whenever the output is text a person will read rather than code. Also use before posting to GitHub from an agent crew.
license: MIT
metadata:
  version: "0.1.0"
  author: anguspiv
---

# angusp-voice

## Overview

Everything written for Angus is read by one person, often on a phone, who has
not been following along and has two minutes. Write for that reader. The
reader should be able to act after the first screen and never need to open
anything else to understand what you said.

The rules exist because agents, left alone, narrate what they did, bury the
one decision in paragraph three, and list files. This skill fixes those.

## The shape of every message

Every message has these parts, in this order. A part that is empty is left
out; the order never changes.

1. **The outcome or the ask.** One or two sentences: what happened, or what
   the reader must decide. Not what you read, not what you were asked.
2. **Decisions.** Numbered. Each one is a question, then `Default:` the
   answer you would give, then one sentence why. One question per decision.
   If there is nothing to decide, say so in the first line instead.
3. **What the reader would want to know.** Two or three lines at most:
   a risk, a deviation, a thing you noticed and did not touch.
4. **The next action.** One line, the last line, under two minutes of the
   reader's time. "Reply 1 or 2." "Merge when green." "Nothing needed."
5. **Evidence**, folded. In a chat reply, leave it out; in a document or
   GitHub post, put it under `<details><summary>…</summary>` blocks with a
   plain-sentence summary. File paths, test names, commands, section numbers
   live here and nowhere above.

## Budgets

| surface | above the fold |
| --- | --- |
| chat reply | 150 words, no headings, at most three bullets |
| GitHub comment, PR body, issue body | 300 words before the first `<details>` |
| README or doc section | 250 words per section, one heading level, no sub-sections under 100 words |

## Sentences

One idea per sentence. Active voice. Present tense for what is true now. A
reference carries its substance in the sentence; the pointer follows in
parentheses: "the spec's rule that ingredients match by permanent id, not by
position (§4.6)". A term the reader cannot see on the page gets half a
sentence of explanation or is left out. Bold the first words of a bullet in a
long list, never a whole sentence. No emoji. Keep a hedge that carries
information; drop the rest.

## Quick reference

| writing | read |
| --- | --- |
| a chat reply, status, answer, handoff | [references/chat.md](references/chat.md) |
| a PR description, comment, issue, README or doc section | [references/docs.md](references/docs.md) |

## Common mistakes

| drift | fix |
| --- | --- |
| Opening with what you read or did ("I read the spec, four ADRs and 30 files") | Open with the outcome. Sources appear only where a fact from them is used. |
| Three options and "tell me which" | One question, one default, one reason. A second question is a second number. |
| `Closes #N` or a heading as the first line of a PR | Two plain sentences first. Headings come after the reader knows what this is. |
| File list above the fold | Say "four files in core"; the list goes in `<details>`. |
| Ending on an offer ("happy to do X if you want") | End on the reader's next action. |
| A sentence in bold | Bold the first words of a bullet, or nothing. |
