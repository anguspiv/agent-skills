You are an agent working in a pnpm + turbo monorepo called kitchen-tools. The owner asked: "add parseQuantity to @kitchen/units".

The package `packages/units` already exists and is published to npm as `@kitchen/units` (public). Its current files:

packages/units/package.json
```json
{
  "name": "@kitchen/units",
  "version": "0.3.0",
  "type": "module",
  "exports": { ".": { "types": "./dist/index.d.ts", "default": "./dist/index.js" } },
  "files": ["dist"],
  "scripts": { "build": "tsc -p tsconfig.build.json", "typecheck": "tsc --noEmit", "test": "vitest run", "lint": "eslint ." },
  "dependencies": { "zod": "^4.0.0" },
  "devDependencies": { "@angusp/eslint-config": "^0.1.0", "@angusp/tsconfig": "^0.1.0", "@angusp/vitest-config": "^0.1.0", "eslint": "^9.0.0", "fast-check": "^4.0.0", "typescript": "^5.7.0", "vitest": "^4.0.0" }
}
```
packages/units/tsconfig.json extends `@angusp/tsconfig/node` (strict, NodeNext module resolution, verbatimModuleSyntax, noUncheckedIndexedAccess, exactOptionalPropertyTypes). eslint.config.js uses `@angusp/eslint-config/typescript`. vitest.config.ts uses `createBaseConfig` from `@angusp/vitest-config` with `include: ['src/**/*.test.ts']`.

packages/units/src/index.ts currently:
```ts
export { convert } from './convert.js';
export { UnitSchema, type Unit } from './unit.js';
```
packages/units/src/unit.ts defines `UnitSchema = z.enum(['tsp','tbsp','cup','ml','l','g','kg','oz','lb'])` and `type Unit = z.infer<typeof UnitSchema>`.

The repo uses changesets; `.changeset/` exists at the repo root and every change to a published package needs one.

Spec for the new function:
- `parseQuantity(input: string): Quantity | null`
- `Quantity` is `{ amount: number; unit: Unit | null }`
- Accepts integers ("2"), decimals ("1.5"), fractions ("1/2"), mixed numbers ("1 1/2"), optionally followed by whitespace and a unit from UnitSchema ("1 1/2 cups" and "1 1/2 cup" both give unit "cup"; plural "s" is tolerated for every unit).
- Returns null for anything else (empty string, negative numbers, unknown units, "1/0").
- The result must be validated against a Zod schema `QuantitySchema` that is exported alongside the type.
- Pure: no I/O, no globals.

Task: write every file you would add or change for this, each as a complete file. Save them under the output directory given to you, mirroring the repo paths (for example `<out>/packages/units/src/parse-quantity.ts`). Include the changeset file. Do not write files you would not actually add.
