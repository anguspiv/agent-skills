# Reviewing a TypeScript diff

The review follows angusp-voice: verdict first, one line per finding with
file and line, evidence folded. Findings split into must fix (does not
typecheck, does not lint, breaks a consumer, or violates an invariant) and
should fix (the standards below). Everything else is a nit under `<details>`
or left out.

## Verdict line

`No findings.` or `4 findings, 3 must fix.` Nothing before it.

## Must fix

- A relative import without `.js` under NodeNext: resolves in Vitest, fails
  in the emitted ESM.
- A type-only import without `type`: `verbatimModuleSyntax` error.
- `export default` from a module that `index.ts` re-exports with
  `export *`: the default is silently dropped.
- `as X` on data from a file, request, env, CLI, or `JSON.parse`: unvalidated
  boundary. Ask for a Zod schema and `Schema.parse`, with the type derived
  by `z.infer`.
- `any` in a signature. `unknown` plus a parse, or the real type.
- `xs[i]!` or any `!` on an index: `for of`, `.at()`, or a narrow.
- `console.*` in a library.
- A test that mocks the module under test or its only dependency (`vi.mock('node:fs')` to test a loader): it tests the mock. Split pure from I/O and test the pure part.
- No changeset on a change to a published package.
- An invariant the project names (permanent ids, purity of a package, never
  asserting something the spec forbids) without the test that guards it.

## Should fix

- `enum`: string union, or `as const` object when runtime values are needed.
- `field?: T` on a data type: `field: T | null` under `exactOptionalPropertyTypes`; optional is for options objects.
- Interfaces duplicating a Zod schema: derive the type from the schema.
- Index loops and `forEach` with mutation where `filter`, `map`, `reduce` say the same thing.
- Hard-coded thresholds in two places that must agree.
- Thrown strings.

## Nits (folded, or skipped)

Naming, comment wording, ordering of imports Prettier does not fix. One line
each, only when they would confuse the next reader.

## Shape of a finding

`inventory.ts:12` then what is wrong and what to do, one line:

> `inventory.ts:12`: `JSON.parse(raw) as Stock` trusts the file. Define
> `StockSchema` in `types.ts`, derive `Stock` and `Item` from it with
> `z.infer`, return `StockSchema.parse(JSON.parse(raw))`.
