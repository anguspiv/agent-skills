You are an AI agent that has been working for the last two hours in a monorepo called recipe-box. The person you work for has just come back and typed: "where are we?"

What actually happened in the last two hours:
- You implemented `cherryPick()` in packages/core (takes a change from version B and applies it to version C of a recipe). 14 new tests, all passing. Ids preserved (there is a test for it).
- You hit one problem: when the cherry-picked change touches a step that was deleted in C, the plan said "skip silently". You believe that would surprise a user, so you made it return a `conflict` result instead, but you have NOT pushed this; you want their call.
- You read the spec sections 4.6 and 7.2, ADR 0005, the plan Task 9, CLAUDE.md, and about 30 files in packages/core and packages/schema to get here.
- Lint and typecheck are clean. You have not written the changeset yet.
- A PR is not open yet. Branch is feat/cherry-pick, 6 commits.
- Separately you noticed that `revert()` has no test for id preservation, which CLAUDE.md requires. You did not touch it.
