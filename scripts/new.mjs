#!/usr/bin/env node
// Scaffold skills/<name>/SKILL.md from scripts/templates/SKILL.md, then regenerate the catalog.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { isValidName } from './lib/skills.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const name = process.argv[2];

if (!name || name === '--help') {
  console.log('usage: node scripts/new.mjs <skill-name>\n  lowercase letters, digits, single hyphens; becomes skills/<skill-name>/SKILL.md');
  process.exit(name ? 0 : 1);
}
if (!isValidName(name)) {
  console.error(`✖ "${name}" is not a valid skill name (lowercase letters, digits, single hyphens, 1-64 chars)`);
  process.exit(1);
}
const dir = path.join(root, 'skills', name);
if (fs.existsSync(dir)) {
  console.error(`✖ ${path.relative(root, dir)} already exists`);
  process.exit(1);
}
const title = name.split('-').map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
const template = fs.readFileSync(path.join(root, 'scripts', 'templates', 'SKILL.md'), 'utf8');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'SKILL.md'), template.replaceAll('__NAME__', name).replaceAll('__TITLE__', title));
console.log(`created skills/${name}/SKILL.md`);
execFileSync(process.execPath, [path.join(root, 'scripts', 'catalog.mjs')], { stdio: 'inherit' });
