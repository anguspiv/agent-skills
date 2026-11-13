Write the "Versioning and releases" section of the README for a GitHub repository called agent-skills (owner: anguspiv). It holds skills for AI coding agents.

Facts the section must convey:
- Each skill lives at skills/<name>/SKILL.md and has its own semver in metadata.version in the frontmatter. Bump it with `npm run catalog -- --bump <skill> <patch|minor|major>` when the skill's behaviour changes. CI fails if a skill's files changed since the last release tag and the version did not.
- The repo as a whole is published as one Claude Code plugin named anguspiv-skills. Its version lives in package.json and .claude-plugin/plugin.json and is owned by release-please: conventional commits on main open a release PR; merging it tags vX.Y.Z, writes CHANGELOG.md, and creates a GitHub Release.
- Each release attaches anguspiv-skills-X.Y.Z.zip (the whole plugin, loadable with `claude --plugin-url <url>`) and one <skill>-<version>.skill zip per skill.
- Claude Code users only receive an update when the plugin version changes. skills.sh users always get the latest commit.
- Commit scopes are skill names, e.g. `feat(angusp-voice): add chat reference`, so the changelog groups by skill.
- Do not edit the plugin version by hand.
