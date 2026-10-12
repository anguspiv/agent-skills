#!/usr/bin/env node
// Build release assets into dist/:
//   anguspiv-skills-<version>.zip   the whole plugin (claude --plugin-url …)
//   <skill>-<skillVersion>.skill    one zip per skill (Claude app "Save skill")
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { listSkills } from './lib/skills.mjs';
import { PLUGIN_NAME } from './lib/catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
if (process.argv.includes('--help')) {
  console.log('usage: node scripts/package.mjs\n  writes dist/<plugin>-<version>.zip and dist/<skill>-<version>.skill');
  process.exit(0);
}
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const dist = path.join(root, 'dist');
fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(dist);

const zip = (out, cwd, items, excludes = []) =>
  execFileSync('zip', ['-qr', out, ...items, ...excludes.flatMap((e) => ['-x', e])], { cwd, stdio: 'inherit' });

const pluginZip = path.join(dist, `${PLUGIN_NAME}-${pkg.version}.zip`);
zip(pluginZip, root, ['.'], ['.git/*', 'dist/*', 'node_modules/*', 'scripts/lib/fixtures/*', '*.DS_Store']);
console.log(`wrote ${path.relative(root, pluginZip)}`);

for (const skill of listSkills(root)) {
  const out = path.join(dist, `${skill.name}-${skill.data.metadata.version}.skill`);
  zip(out, path.join(root, 'skills'), [skill.name]);
  console.log(`wrote ${path.relative(root, out)}`);
}
