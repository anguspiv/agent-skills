import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './frontmatter.mjs';

// Agent Skills spec: 1-64 chars, [a-z0-9-], no leading/trailing/double hyphen.
export function isValidName(name) {
  return typeof name === 'string' && name.length >= 1 && name.length <= 64 && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

export function isSemver(v) {
  return typeof v === 'string' && /^\d+\.\d+\.\d+$/.test(v);
}

/** @returns {{name:string, dir:string, file:string, data:object, body:string}[]} */
export function listSkills(root) {
  const base = path.join(root, 'skills');
  if (!fs.existsSync(base)) return [];
  return fs
    .readdirSync(base, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(base, d.name, 'SKILL.md')))
    .map((d) => {
      const dir = path.join(base, d.name);
      const file = path.join(dir, 'SKILL.md');
      const { data, body } = parseFrontmatter(fs.readFileSync(file, 'utf8'));
      return { name: d.name, dir, file, data, body };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** @returns {string[]} errors, empty when valid */
export function validateSkill(skill) {
  const errors = [];
  const { data, name, body } = skill;
  if (!isValidName(name)) errors.push(`name "${name}" is invalid (lowercase letters, digits, single hyphens, 1-64 chars)`);
  if (data.name !== name) errors.push(`name "${data.name}" does not match directory "${name}"`);
  if (!data.description || typeof data.description !== 'string') errors.push('description is required');
  else if (data.description.length > 1024) errors.push(`description exceeds 1024 characters (${data.description.length})`);
  const version = data.metadata?.version;
  if (!isSemver(version)) errors.push(`metadata.version "${version}" is not semver (x.y.z)`);
  if (data.compatibility && data.compatibility.length > 500) errors.push('compatibility exceeds 500 characters');
  if (!body || !body.trim()) errors.push('body is empty');
  return errors;
}
