# Adding a package to a pnpm + turbo workspace

Eight files. Copy them, change the name and the description, run `pnpm
install`, then `pnpm turbo lint typecheck test build --filter=<name>`. The
example package is `@scope/dates`; replace it throughout. First check that
`pnpm-workspace.yaml` has a glob covering the new path.

## package.json

```json
{
  "name": "@scope/dates",
  "version": "0.0.0",
  "private": true,
  "description": "What it does, one line",
  "license": "<from the repo's LICENSING.md; MIT if it has none>",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "lint": "eslint ."
  },
  "dependencies": {},
  "devDependencies": {
    "@angusp/eslint-config": "^0.1.0",
    "@angusp/tsconfig": "^0.1.0",
    "@angusp/vitest-config": "^0.1.0",
    "eslint": "^9.0.0",
    "fast-check": "^4.0.0",
    "typescript": "^5.7.0",
    "vitest": "^4.0.0"
  },
  "publishConfig": { "access": "public" }
}
```

`private: true` until the first real release; drop it with the changeset
that ships the first version. Prettier is not a package dependency; the
root carries the one Prettier config, as a `prettier.config.js` that
re-exports `@angusp/prettier-config` or an older local config. Zod goes in
`dependencies` when the package has a boundary. `fast-check` goes in
`devDependencies` only when the package has pure functions to property-test;
`@types/node` whenever it imports `node:*`, because `@angusp/tsconfig/node`
sets `lib` but not `types`.

## tsconfig.json and tsconfig.build.json

```json
{
  "extends": "@angusp/tsconfig/node",
  "compilerOptions": { "outDir": "dist", "rootDir": "src" },
  "include": ["src"]
}
```

```json
{ "extends": "./tsconfig.json", "exclude": ["src/**/*.test.ts"] }
```

`typecheck` uses the first and so covers tests; `build` uses the second so
tests never ship. The exports of `@angusp/tsconfig` are `base`, `node`,
`react` and `vue`; a library or CLI for Node extends `node`.

## eslint.config.js

```js
import typescript from '@angusp/eslint-config/typescript'

export default [...typescript, { ignores: ['dist/'] }]
```

`/node` instead of `/typescript` for a CLI or a scripts folder: it adds
`eslint-plugin-n`, which reads the supported Node range from `engines`; a
repo without `engines` sets `settings: { node: { version: '>=<.nvmrc>' } }`.
A CLI also sets `'no-console': 'off'`. Each package has its own config;
ESLint stops at the nearest one.

## vitest.config.ts

```ts
import { createBaseConfig } from '@angusp/vitest-config'

export default createBaseConfig({ test: { include: ['src/**/*.test.ts'] } })
```

The package exports factories that merge your overrides into the shared
config: `createBaseConfig` from the root, `createReactConfig` from
`@angusp/vitest-config/react`, `createVueConfig` from
`@angusp/vitest-config/vue`. There is no default export to spread.

## src/index.ts and src/index.test.ts

```ts
export const PACKAGE_NAME = '@scope/dates'
```

```ts
import { describe, expect, it } from 'vitest'
import { PACKAGE_NAME } from './index.js'

describe('@scope/dates', () => {
  it('exports its name', () => {
    expect(PACKAGE_NAME).toBe('@scope/dates')
  })
})
```

A placeholder package exports one named constant and tests it, so the four
scripts pass on day one. Once real modules exist, `index.ts` becomes a barrel
that re-exports them by name: `export { formatRange } from './format-range.js'`.

## .changeset/<words>.md

```md
---
'@scope/dates': minor
---

feat(dates): add the package with formatRange
```

Required for a published package, including the one that creates it. The
first line is a conventional commit; paragraphs may follow it.

## Workspace wiring that already exists

When `pnpm-workspace.yaml` already lists a glob that covers the new path
(`packages/*` here), nothing is registered. Turbo's
`build`, `lint`, `typecheck` and `test` tasks run the package's scripts with
`dependsOn: ["^build"]`, so a package that depends on a sibling uses
`"@scope/other": "workspace:*"` and builds after it.
