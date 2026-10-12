import { execFileSync } from 'node:child_process';
import { parseFrontmatter } from './frontmatter.mjs';
import { listSkills } from './skills.mjs';

function git(cwd, ...args) {
  try {
    return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

/** Newest `v*` tag by version sort, or null when there is none. */
export function latestTag(root) {
  const out = git(root, 'tag', '--list', 'v*', '--sort=-v:refname');
  if (!out) return null;
  return out.split('\n')[0] || null;
}

/**
 * Skills whose files changed since `tag` while `metadata.version` stayed the
 * same. Skills that did not exist at the tag are new, not stale.
 * @returns {{name:string, version:string}[]}
 */
export function staleVersions(root, tag) {
  const stale = [];
  for (const skill of listSkills(root)) {
    const changed = git(root, 'diff', '--name-only', tag, '--', `skills/${skill.name}`);
    if (!changed) continue;
    const old = git(root, 'show', `${tag}:skills/${skill.name}/SKILL.md`);
    if (old === null) continue;
    const oldVersion = parseFrontmatter(old).data.metadata?.version;
    if (oldVersion === skill.data.metadata?.version) stale.push({ name: skill.name, version: skill.data.metadata?.version });
  }
  return stale;
}
