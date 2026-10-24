# Adding a package to a pnpm + turbo workspace

Seven files. Copy them, change the name and the description, run `pnpm
install`, then `pnpm turbo lint typecheck test build --filter=<name>`. The
example package is `@scope/dates`; replace it throughout.

## package.json

```json
{
  "name": "@scope/dates",
  "version": "0.0.0",
  "private": true,
  "description": "What it does, one line",
  "license": "MIT",
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
root carries `@angusp/prettier-config`. Zod goes in `dependencies` when the
package has a boundary.

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
`eslint-plugin-n`. Each package has its own config; ESLint stops at the
nearest one.

## vitest.config.ts

```ts
import { createBaseConfig } from '@angusp/vitest-config'

export default createBaseConfig({ test: { include: ['src/**/*.test.ts'] } })
```

The package exports factories (`createBaseConfig`, `createReactConfig`,
`createVueConfig`) that merge your overrides into the shared config. There
is no default export to spread.

## src/index.ts and src/index.test.ts

```ts
export { formatRange } from './format-range.js'
export { DateRangeSchema, type DateRange } from './date-range.js'
```

```ts
import { describe, expect, it } from 'vitest'
import { formatRange } from './index.js'

describe('formatRange', () => {
  it('prints a same-day range as one date', () => {
    expect(formatRange({ from: '2026-10-01', to: '2026-10-01' })).toBe('1 Oct 2026')
  })
})
```

The barrel re-exports by name. A placeholder package exports one named
constant and tests it, so the four scripts pass on day one.

## .changeset/<words>.md

```md
---
'@scope/dates': minor
---

feat(dates): add the package with formatRange
```

Required for a published package, including the one that creates it. The
body is a conventional commit; the changeset lint rejects a sentence.

## Workspace wiring that already exists

`pnpm-workspace.yaml` lists `packages/*`, so nothing is registered. Turbo's
`build`, `lint`, `typecheck` and `test` tasks run the package's scripts with
`dependsOn: ["^build"]`, so a package that depends on a sibling uses
`"@scope/other": "workspace:*"` and builds after it.
