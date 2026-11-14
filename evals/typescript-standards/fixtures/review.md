You are reviewing a pull request in a pnpm + turbo TypeScript monorepo whose packages extend `@angusp/tsconfig/node` (strict, NodeNext, verbatimModuleSyntax) and lint with `@angusp/eslint-config/typescript`. The package under review, `@kitchen/pantry`, is a published library with no UI. Zod is a dependency. The repo uses changesets for every change to a published package. Tests are Vitest.

The PR description says: "adds inventory loading and a helper to find low stock". The diff is in review-diff/pantry.diff next to this file.

Task: write the code review as it would be posted on the PR. The first line is the verdict ("No findings." or "N findings, M must fix."), then one line per finding with the file and line and what to change, then anything else folded under <details>. The author reads it on a phone.
