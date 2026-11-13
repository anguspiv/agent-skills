---
name: typescript-standards
description: Use when writing, reviewing, or setting up TypeScript or JavaScript in one of Angus's repositories. Any .ts, .tsx, .js or .mjs change, "add a package", "set up tsconfig", "why is eslint complaining", "review this PR", a new function in a pnpm workspace, a Zod schema, a Vitest test. Also use when a project pulls in @angusp/eslint-config, @angusp/tsconfig, @angusp/prettier-config or @angusp/vitest-config, since this skill says how they are wired and what they assume.
license: MIT
metadata:
  version: "0.1.0"
  author: anguspiv
---

# typescript-standards

## Overview

The stack is pnpm workspaces, turbo, ESM everywhere, Node from `.nvmrc`,
strict TypeScript from `@angusp/tsconfig`, flat ESLint from
`@angusp/eslint-config`, Prettier from `@angusp/prettier-config`, Vitest from
`@angusp/vitest-config`, fast-check for pure code, Zod at every boundary,
changesets for every published package. The shared configs carry the
settings; this skill carries what those settings mean for the code you write
and the conventions the configs cannot enforce.

## What the compiler flags mean for your code

`@angusp/tsconfig/node` turns these on. The first four fail `tsc`; the last
is a convention the lint only warns about. Write to all of them from the
first line.

| flag | so |
| --- | --- |
| `noUncheckedIndexedAccess` | `xs[i]` and `xs.at(i)` are `T \| undefined`. Use `for (const x of xs)` or narrow. Never `xs[i]!`. |
| `exactOptionalPropertyTypes` | Data fields are `name: T \| null`, never `name?: T`; in Zod, `.nullable()`, never `.optional()`, on a data schema. Optional is for call options only. This is the repo's convention, not a compiler requirement. |
| `verbatimModuleSyntax` | Type-only imports are `import type { T }` or `import { type T }`. The lint rule errors otherwise. |
| `module: NodeNext` | Relative imports end in `.js` even when the file is `.ts`: `from './unit.js'`. |
| `strict` | No `any`. `unknown` at boundaries, then a Zod parse. |

## Shape of the code

- **Named exports.** `export default` appears only in config files
  (`eslint.config.js`, `vitest.config.ts`, `prettier.config.js`).
- **Unions, not enums.** `type Level = 'low' | 'ok' | 'high'`, or a
  `const` object with `as const` when values are needed at runtime.
- **Zod owns the types.** Define `XSchema`, derive `type X = z.infer<typeof
  XSchema>`, and parse at every boundary: file, network, env, CLI argument,
  `JSON.parse`. Data from a boundary is never `as X`. An internal structural
  cast (`as unknown as Record<string, unknown>` over a value you built) is
  allowed with a one-line comment saying why the type system cannot see it.
- **Pure in the middle, I/O at the edges.** `parseInventory(text): Stock`
  is pure and tested directly; `loadInventory(path)` reads the file and calls
  it. A library package exports the pure one and keeps `node:fs` out of it
  where it can.
- **No `console` in libraries.** Return or throw; the caller decides what to
  print. A CLI prints, and its own `eslint.config.js` turns `no-console` off,
  because every preset warns on it.
- **Errors carry a type.** Throw an `Error` subclass or return a tagged
  result; never throw strings.

## Tests

Vitest, with `describe`, `it`, `expect` imported from `vitest` even though
globals are on. One test file next to its source: `foo.ts`, `foo.test.ts`.
Pure functions get a fast-check property for their invariant (round trip,
idempotence, order independence) beside the example tests. Test the real
code path: a test that mocks `node:fs` to exercise a loader tests the mock,
so split the parser out and test that. Every mutation of an entity in a
project with permanent ids gets an id-preservation test.

## Packages and releases

- Every change to a published package needs a changeset. Its first line is
  a conventional commit, `feat(units): add parseQuantity`; explanatory
  paragraphs may follow. Removing or renaming a public export is a `major`.
  (The configs repo lints the first line; recipe-box does not, and follows
  the same shape.)
- Commit scope is the package or skill name. PR titles are conventional
  commits and are validated in CI.
- A package exposes `exports` with `types` and `default` under `dist/`,
  `files: ["dist"]`, `publishConfig.access: public`, and `private: true`
  until its first release. The license comes from the repo's LICENSING.md
  when there is one: in recipe-box, MIT for anything a client consumes and
  AGPL-3.0-only for the server packages. Never assume MIT.
- Scripts are the same in every package: `build`, `typecheck`, `test`,
  `lint`. Turbo runs them; nothing else is wired by hand.

## Formatting

Format with the repo's config as it stands, by running `pnpm format`; never
hand-format. One Prettier config lives at the repo root; packages do not add
their own. The shared `@angusp/prettier-config` is no semicolons, single
quotes, trailing commas, width 100, but a repo may still carry an older
local config (recipe-box does: semicolons, width 80). Changing the formatter
config, or reformatting files outside your diff, is its own PR, because
`pnpm format` rewrites every file.

## Fixing drift you did not cause

Apply these standards to the files your change touches. Do not sweep the
repo. Renaming or removing a public export of a published package is a
`major` changeset and its own PR, whatever the standards say about default
exports.

## Quick reference

| doing | read |
| --- | --- |
| adding a package to a workspace | [references/package-setup.md](references/package-setup.md) |
| reviewing a TypeScript diff | [references/review-checklist.md](references/review-checklist.md) |

## Common drift

| drift | fix |
| --- | --- |
| `extends: "@angusp/tsconfig/base.json"` in a Node package | `extends: "@angusp/tsconfig/node"`; the exports are `base`, `node`, `react`, `vue`, no `.json`. |
| `import shared from '@angusp/vitest-config'` and `mergeConfig(shared, …)` | The package exports factories: `createBaseConfig({ test: { include: [...] } })`. |
| `import config from '@angusp/eslint-config'` | Pick the preset: `@angusp/eslint-config/typescript` for libraries, `/node` for CLIs and scripts. |
| `"import": "./dist/index.js"` in `exports` | `"default": "./dist/index.js"`, after `"types"`. |
| Changeset body "Add the thing" | `feat(scope): add the thing`. |
| `unit?: string` on a data type | `unit: string \| null`. |
