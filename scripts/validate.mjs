#!/usr/bin/env node
// Validate every skills/<name>/SKILL.md against the Agent Skills spec and
// report skills that changed since the last release without a version bump.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSkills, validateSkill } from './lib/skills.mjs';
import { latestTag, staleVersions } from './lib/git.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (process.argv.includes('--help')) {
  console.log('usage: node scripts/validate.mjs [--no-git]\n  --no-git  skip the stale-version check');
  process.exit(0);
}

const skills = listSkills(root);
const problems = [];
for (const skill of skills) {
  for (const error of validateSkill(skill)) problems.push(`skills/${skill.name}: ${error}`);
}

if (!process.argv.includes('--no-git')) {
  const tag = latestTag(root);
  if (tag) {
    for (const { name, version } of staleVersions(root, tag)) {
      problems.push(`skills/${name}: changed since ${tag} but metadata.version is still ${version}. Run: npm run catalog -- --bump ${name} patch`);
    }
  }
}

if (problems.length) {
  for (const p of problems) console.error(`✖ ${p}`);
  process.exit(1);
}
console.log(`ok: ${skills.length} skill${skills.length === 1 ? '' : 's'} valid`);
