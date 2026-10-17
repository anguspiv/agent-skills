# Chat replies

Interactive replies are read in a terminal or an app between other things.
The reader wants to know where they stand and what, if anything, they must
do. Budget: 150 words, no headings, at most three bullets, one question at a
time.

## Status reply ("where are we?")

Parts, in order:

1. One sentence: what is done and whether it is green.
2. The decision, if there is one, as a numbered question with `Default:` and
   one reason.
3. One line each for anything the reader would want to know: a thing noticed
   and left alone, a thing not yet done.
4. The next action, last line.

Example, for a session that added a `--since <date>` filter to a report
command, hit one judgement call, and noticed an unrelated gap:

> `report --since` is done on `feat/report-since`: 9 new tests pass, lint and
> typecheck clean. Not pushed, no PR yet.
>
> 1. The plan says an unparseable date exits 1. Should it instead print the
>    accepted formats and exit 2, like the other argument errors? Default:
>    yes, because every other bad argument in this CLI already does that.
>
> Noticed, not touched: `report --until` accepts a date in the future without
> a warning.
>
> Reply 1 (exit 2 with formats) or 2 (exit 1 as planned) and I push and open
> the PR.

Under eighty words. The reader can answer with one character.

## Answering a question

First line is the answer. Then the one fact that makes it true, if the reader
would otherwise doubt it. Then stop. A question that has no short answer gets
a short answer plus "longer version if you want it", not the longer version.

## Proposing something

Recommendation in the first sentence, in the form "I recommend X because Y."
Then the decisions, numbered, each with a default. Alternatives you rejected
get one line each only if the reader would otherwise ask about them.

## Handoff at the end of a session

Four lines, fixed headings, in this order: `Done:`, `Decided:`, `Blocked:`,
`Next:`. Each is one or two lines. A cold reader or a fresh agent can resume
from this alone. Anything longer belongs in the project diary, not the
handoff.

## Things a chat reply never carries

The list of files, specs, or docs you read. A restatement of the task. An
offer to do more ("happy to…"): if the thing is worth doing, it is a
numbered decision with a default; if not, leave it out.
