You are an agent working in the recipe-box monorepo. The owner asked: "open the issue for plan task 7".

The project's conventions for issue bodies (from docs/voice.md, section 6):

```
<one paragraph: who needs this, what changes for them, why now>

### Outcome

<one sentence a person can check without reading code>

### Acceptance criteria

- [ ] <a checkable statement> — proof: <test file or command>
- [ ] …

### Plan section

docs/superpowers/plans/<file>.md — Task <n>

### Risk

<low|medium|high> — <reason in the reader's words>

### Constraints

<only what a cold reader would get wrong; one line each>

### Progress

- [ ] Step 1: …
```
Titles of plan-seeded issues start with `Task N:`. Markers parsed by scripts: the headings `### Acceptance criteria` and `### Plan section`, and a line `Blocked by: #N` when applicable. The issue carries labels type:task and risk:<level>, and links the plan section.

Plan file: docs/superpowers/plans/2026-09-01-slice-1-foundation.md

Task 7 from the plan, verbatim:

### Task 7: scale() falls back to ratio when no conversion exists

**Risk:** medium — touches the public ScaledLine type and the aggregate totals every client renders.

Files: Modify packages/core/src/scale.ts, packages/core/src/types.ts; Test packages/core/src/scale.test.ts.

Today scale() throws NoConversionError when an ingredient's (food, unit) pair has no equivalence, so a single unknown unit stops a whole recipe from scaling. Per spec §4.6 and invariant 6 (never guess a unit conversion), the line must instead scale by ratio, be marked, and be left out of aggregate totals.

Steps:
1. Write the failing property test: scaling by k then 1/k returns the original quantities for every line, including lines with no conversion. Run: pnpm --filter @recipe-box/core test scale. Expected: FAIL with NoConversionError.
2. Add `scaledBy?: "conversion" | "ratio"` to ScaledLine in types.ts.
3. In scale.ts, when convert() returns null, multiply the quantity by the ratio and set scaledBy: "ratio".
4. Exclude lines with scaledBy === "ratio" from aggregates(). Test: aggregates() ignores ratio-scaled lines.
5. Test: every ing_* id survives scale() (invariant 1).
6. Add a changeset: minor for @recipe-box/core.
7. Run pnpm test, typecheck, lint. Expected: all pass. Commit `feat(core): scale by ratio when no conversion exists`.

Depends on Task 5 (convert() returns null instead of throwing), which is issue #38 and is still open.
