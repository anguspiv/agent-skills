# Issue types

Three recipes. Each is the shape from SKILL.md with the parts that type
needs. Examples use situations unrelated to any eval so they show the shape,
not the answer.

## Task from a plan

The plan already holds the steps. The issue's job is the why, the outcome,
the criteria, and the pointers, so an implementer opens the plan for the how.

- Title: `Task N: <the plan's task title>`.
- Opening paragraph: who needs the behaviour and what changes for them. One
  sentence of why now. No spec citations here; they go in Links.
- `Outcome`: one sentence a person can check without reading code.
- `Acceptance criteria`: one checkbox per `Expected:` line in the plan's
  steps, plus one for the tests the plan names, each with `proof:`.
- `Plan section`: `<plan file> — Task N`, on its own line, exactly.
- `Risk`: the plan's risk level, then the reason in the reader's words.
- `Constraints`: only what a cold reader would get wrong. Project invariants
  are already in the project's instructions; cite one only if this task
  touches it.
- `Blocked by: #N` on its own line when the plan says the task depends on
  another that is still open.
- `Progress`: the plan's steps as checkboxes, one line each, so the implementer
  ticks them off. Long steps are shortened to their verb and object.
- When the project has its own task template or markers (heading names, a
  `plan-sync` comment, a `Task N:` prefix), keep every one of them exactly.
  Markers are parsed; everything around them may change.

Example opening and criteria, for a task that adds a `--json` flag:

> # Task 12: `recipe show` prints JSON with `--json`
>
> Scripts that wrap the CLI parse its table output today and break on every
> column change. With `--json` they get a stable shape. Task 11 landed the
> shared printer, so this is now a one-file change.
>
> ### Outcome
>
> `recipe show <id> --json` prints the recipe document as JSON and nothing else.
>
> ### Acceptance criteria
>
> - [ ] `--json` prints valid JSON with no table output — proof: `packages/cli/src/show.test.ts`
> - [ ] Exit code and errors are unchanged with the flag — proof: same file
> - [ ] Ids are preserved in the output — proof: id-preservation case in the same file

## Bug from a chat message

The reader is the person who will fix it, next week, with no memory of the
chat. The chat's tone and asides never make it in; its facts all do.

- Title: the behaviour, with the command or flag: "`report --until` accepts a
  date in the future without a warning".
- Opening paragraph: who hits this and what happens to them. Version and
  frequency ("twice on 0.8.2") belong in this paragraph.
- `Expected` and `Actual`: one line each, labelled. If the project's spec
  says what is expected, cite the section; if the spec is silent, say so.
- `Reproduction`: the exact command, then what you see.
- `Acceptance criteria`: the first one is always the test that fails today
  and passes after the fix, named by file. The second is the behaviour the
  user sees.
- `Risk`: usually low; say who else the fix could affect.
- Above the fold, in this order and nothing more: the paragraph, Expected
  and Actual, Reproduction, two or three Acceptance criteria, Risk. Under
  200 words. `Constraints` and `Links` appear only when they carry a fact
  the fixer needs; "no template or spec covers this" is not one.
- `<details><summary>Suspected cause</summary>`: the file and line, and the
  reasoning, labelled as a hypothesis. A proposed fix goes here too, in one
  or two lines, never as alternatives to choose between.

Example opening, for a date-validation bug:

> # `report --until` accepts a future date and prints an empty report
>
> Anyone who typos a year gets a blank report and no hint why. Seen twice on
> 0.8.2; every time.
>
> **Expected:** a date after today is rejected with the accepted formats, exit 2, like every other bad argument.
> **Actual:** the report runs with no rows and exits 0.

## Proposal that needs decisions

The reader has two minutes and must come away able to answer. The
recommendation is the default on each question; the reasoning that led to
it is folded.

- Title: what would change, as a statement: "Move the docs site to a wiki".
- Opening paragraph: what changes for whom, and why decide now rather than
  later.
- `Decisions`: one numbered item per open question. Each is a question, then
  `Default:` the answer you would give, then one reason. Nothing else: no
  option lists, no "my leaning" paragraph. If the reader answers "as
  proposed", the defaults are the plan.
- No `Outcome` and no `Acceptance criteria`: nothing is decided yet, so
  there is nothing to accept. The task issues that follow the decisions
  carry those.
- `Risk`: level and the reason in the reader's words.
- One or two lines for what the reader would want to know that is not a
  decision: a migration, a thing that breaks, a cost.
- Above the `<details>` block: the paragraph, the decisions, the risk, those
  two lines. Under 200 words. Everything that explains the defaults is folded.
- `<details><summary>Trade-offs</summary>`: the pros and cons, the current
  state, the proposed shape. Folded, because the decisions already carry
  their conclusions.
- Last line: the reader's next action. "Reply with answers to 1 to 3, or
  'as proposed'."

Example decisions block, for moving docs:

> ## Decisions
>
> 1. Keep the Markdown docs in the repo as the source and mirror them, or
>    make the wiki the source? Default: repo is the source, because reviews
>    and history stay with the code.
> 2. Mirror on every push or on release? Default: on release, because the
>    wiki should match what people can install.
>
> ## Risk
>
> low — the mirror is one-way and can be turned off without touching the docs.
>
> Reply with answers to 1 and 2, or "as proposed".
