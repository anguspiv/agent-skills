# Contributing

## Add a skill

```bash
npm run new -- my-skill-name      # scaffolds skills/my-skill-name/SKILL.md
# edit the SKILL.md
npm run check                     # tests, validation, catalog drift
```

Skill names are lowercase letters, digits, and single hyphens, and must match
the directory name. The `description` says _when_ to use the skill, in third
person, under 1024 characters.

Write the skill the way the `writing-skills` superpower describes: run the
scenario without the skill first, note where the agent goes wrong, then write
the smallest skill that fixes it.

## Commits and pull requests

Conventional commits, scoped to the skill: `feat(my-skill-name): add retry
guidance`. PR titles are validated. Squash merge only, so the PR title becomes
the commit.

## Versions

- `metadata.version` in each `SKILL.md` is that skill's version. Bump it when
  the skill's behaviour changes: `npm run catalog -- --bump my-skill-name minor`.
  CI fails if a skill changed since the last release without a bump.
- The plugin version in `package.json` and `.claude-plugin/plugin.json` is
  owned by release-please. Do not edit it by hand.

## Release

Merge the release-please PR. It tags `vX.Y.Z`, writes `CHANGELOG.md`, and the
release workflow attaches `anguspiv-skills-X.Y.Z.zip` and one `.skill` per
skill to the GitHub Release.

The release PR is opened with the `RELEASE_PLEASE_TOKEN` secret when it is
set: a fine-grained personal access token for this repository with
`contents: write` and `pull-requests: write`. Without it the PR comes from
`github-actions[bot]`, which GitHub treats as a first-time contributor, so
every CI run on it waits for a manual approval under Actions.

## Local checks

```bash
npm test                 # unit tests for the scripts
npm run validate         # frontmatter and layout rules
npm run catalog:check    # generated files are current
claude plugin validate --strict .
```
