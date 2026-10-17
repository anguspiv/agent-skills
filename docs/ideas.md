# Skill ideas

The backlog. One section per idea. Promote an idea to an issue with the
`skill-request` template when it has trigger phrases and expected behaviour.

Most of these are customisations layered on skills that already exist
(superpowers, Anthropic's skill library). The value is the opinion, not the
mechanism: each one should carry *my* defaults and point at the base skill
for the rest.

Status key: `idea` → `drafted` (SKILL.md exists) → `tested` (baseline run
without the skill, then with) → `released`.

## angusp-voice — status: idea · [#1](https://github.com/anguspiv/agent-skills/issues/1)

How I want agents to write, in chat replies and in documents. Seed material
exists: `docs/voice.md` in recipe-box (stand alone, ask first, under 300
words above the fold, plain, keep machine markers). Split into two reference
files: `references/chat.md` for interactive replies and `references/docs.md`
for written artefacts. Every other writing skill below depends on this one,
so it goes first.

Triggers: "write this up", "draft a reply", "post a comment", "in my voice",
any PR description, issue body, or doc an agent produces for me.

## writing-issues — status: idea · [#2](https://github.com/anguspiv/agent-skills/issues/2)

My issue shape: who needs this and why in one paragraph before any heading,
numbered decisions each with a default, acceptance criteria, risk label, link
to the plan section, under 300 words above the fold. Builds on
`angusp-voice`. Prior art: the issue templates in recipe-box and the
`plan-to-issues.mjs` seeder format.

Triggers: "open an issue", "file this", "write up a ticket", "seed issues from
the plan".

## coding-standards — status: idea · [#4](https://github.com/anguspiv/agent-skills/issues/4)

Language-agnostic defaults: small pure units, explicit boundaries, tests that
describe behaviour, conventional commits, no dead code, no speculative
abstraction. The checklist a reviewer runs, not a style guide. Builds on
superpowers `codebase-design` and `testing-best-practices`.

Triggers: "review this", "clean this up", "is this idiomatic", any
implementation task where the project has no CLAUDE.md of its own.

## typescript-standards — status: idea · [#3](https://github.com/anguspiv/agent-skills/issues/3)

The JS/TS layer under `coding-standards`: strict TS, ESM, pnpm workspaces,
Vitest with fast-check for pure packages, shared `@angusp/*` configs, Zod at
boundaries, no default exports, no `any`. Prior art: recipe-box's package
layout and `@angusp/eslint-config`, `@angusp/tsconfig`,
`@angusp/prettier-config`, `@angusp/vitest-config`.

Triggers: any `.ts`/`.tsx`/`.js` work, "set up tsconfig", "add a package",
"why is eslint complaining".

## setting-up-projects — status: idea · [#6](https://github.com/anguspiv/agent-skills/issues/6)

Scaffold a new project the way I want it on day one: pnpm + turbo monorepo or
single package, shared configs, CLAUDE.md, `docs/superpowers/` layout,
changesets, CI with lint/typecheck/test, conventional-commit PR title check,
issue templates, project board. Builds on `typescript-standards` and this
repo's own scripts.

Triggers: "new project", "init a repo", "bootstrap", "set up the monorepo".

## running-agent-teams — status: idea · [#7](https://github.com/anguspiv/agent-skills/issues/7)

How I run a crew of agents on a project: the pm/triager/researcher/
architect/implementer/reviewer roles, risk labels gating autonomy, Ready as
the only pickup state, worktrees per task, voice rules for anything posted.
Prior art: recipe-box's `.claude/agents/`, `/pm`, `scripts/pm-crew.sh`,
`docs/project-board.md`, ADR 0011. Builds on superpowers
`subagent-driven-development` and `dispatching-parallel-agents`.

Triggers: "set up the crew", "run the team on this", "what should an agent
pick up next", "dispatch", "triage the backlog".

## building-lessons — status: idea · [#10](https://github.com/anguspiv/agent-skills/issues/10)

Turn a topic into a teachable lesson: learning objective, prerequisite check,
worked example, exercise with a solution, common misconceptions, a two-minute
recap. For workshops, meetup talks, onboarding docs. Builds on Anthropic's
`learn` skill and `scaffold-exercises`.

Triggers: "make a lesson", "workshop on", "teach this to", "onboarding
material", "exercise for".

## researching — status: idea · [#8](https://github.com/anguspiv/agent-skills/issues/8)

My research shape: question first, sources with dates, claims separated from
inference, a "what I did not check" line, output that fits above the fold
with evidence in details blocks. Builds on Anthropic's `deep-research` with
`angusp-voice` applied to the report.

Triggers: "research", "compare options", "what's the state of", "find prior
art", "survey the ecosystem".

## writing-technical-docs — status: idea · [#9](https://github.com/anguspiv/agent-skills/issues/9)

READMEs, ADRs, specs, runbooks, API docs. Which doc type fits, the skeleton
for each, what goes above the fold, when a diagram earns its place. The ADR
rules from recipe-box (append-only, new ADR to supersede, only when there
was a real alternative). Builds on `angusp-voice` and superpowers
`doc-coauthoring`.

Triggers: "write the README", "document this", "ADR for", "spec out", "write
a runbook".

## project-diary — status: idea · [#5](https://github.com/anguspiv/agent-skills/issues/5)

A dated running log per project: what changed, what was decided and why,
what is blocked, what to pick up next. Written at the end of a session or on
request, in a fixed shape so a cold reader (or a fresh agent) can resume.
Feeds `running-agent-teams` and the planning hub. Builds on
`angusp-voice`.

Triggers: "diary entry", "log today", "what did we do", "write a handoff",
end of a long session.

## Suggested order

1. `angusp-voice` — everything else writes through it, and the seed doc exists.
2. `writing-issues` — small, high use, tests the voice skill immediately.
3. `typescript-standards` then `coding-standards` — the TS one is concrete; generalise after.
4. `project-diary` — small, and it makes the rest of this work resumable.
5. `setting-up-projects`, `running-agent-teams` — large, depend on the above.
6. `researching`, `writing-technical-docs`, `building-lessons` — when the first five are stable.
