## What

<!-- One or two sentences. The PR title is a conventional commit, e.g. feat(my-skill): add retry guidance -->

## Checklist

- [ ] `npm run check` passes locally
- [ ] If a skill's behaviour changed, its `metadata.version` was bumped (`npm run catalog -- --bump <skill> <patch|minor|major>`)
- [ ] For a new or changed skill: ran the scenario without the skill first and saw the failure it fixes
