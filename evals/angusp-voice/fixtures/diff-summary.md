Branch: feat/scale-by-ratio   Base: main   Issue: #42 "Scale a recipe when a unit has no conversion"

Files changed (4):
- packages/core/src/scale.ts (+38 -6): when `convert()` returns null for an ingredient's (food, unit) pair, the line is now scaled by ratio instead of throwing; the result carries `scaledBy: "ratio"` and the line is excluded from aggregate totals. Previously threw `NoConversionError`.
- packages/core/src/scale.test.ts (+61): property test: scaling by k then 1/k returns the original quantities for every line, including ratio-scaled ones; unit test: ratio-scaled lines are excluded from `aggregates()`; unit test: ids are preserved across scale.
- packages/core/src/types.ts (+3): adds optional `scaledBy?: "conversion" | "ratio"` to ScaledLine.
- .changeset/brave-owls-scale.md (+5): minor bump for @recipe-box/core.

Deviation from the plan: the plan (Task 7) said to put a warning in `lints()` for ratio-scaled lines. I put the marker on the line itself instead (`scaledBy`), because the renderer needs it per line and lints run per document. A lint can be derived from the marker later.

Not done: the CLI does not yet print the marker; that is Task 8.

Verified: pnpm test (312 passed), pnpm typecheck clean, pnpm lint clean, pnpm changeset present.
