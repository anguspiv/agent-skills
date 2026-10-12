#!/usr/bin/env node
// Regenerate every derived file from skills/*/SKILL.md and package.json.
//   node scripts/catalog.mjs            write plugin.json, marketplace.json, README table, docs/index.html
//   node scripts/catalog.mjs --check    exit 1 if any generated file is out of date (CI)
//   node scripts/catalog.mjs --bump <skill> <patch|minor|major>
//   node scripts/catalog.mjs --labels   print `gh label create` commands for every skill
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSkills } from './lib/skills.mjs';
import {
  renderPluginJson,
  renderMarketplaceJson,
  renderReadmeTable,
  replaceBetweenMarkers,
  renderIndexHtml,
  bumpSkillFile,
} from './lib/catalog.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const repo = pkg.repository.replace(/^github:/, '');

if (args.includes('--help')) {
  console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 6).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
  process.exit(0);
}

if (args[0] === '--bump') {
  const [, name, kind = 'patch'] = args;
  const file = path.join(root, 'skills', name ?? '', 'SKILL.md');
  if (!name || !fs.existsSync(file)) {
    console.error(`✖ no such skill: ${name}`);
    process.exit(1);
  }
  fs.writeFileSync(file, bumpSkillFile(fs.readFileSync(file, 'utf8'), kind));
  console.log(`bumped ${name} (${kind})`);
  args.shift(); // fall through to regenerate
}

const skills = listSkills(root);
const ctx = { version: pkg.version, skills, repo };

if (args[0] === '--labels') {
  const lines = [
    'gh label create bug --color d73a4a --description "Something is wrong in a skill" --force',
    'gh label create idea --color c5def5 --description "A skill idea to discuss" --force',
    'gh label create skill-request --color 0e8a16 --description "Request for a new skill" --force',
    'gh label create "good first issue" --color 7057ff --description "Good for newcomers" --force',
    'gh label create autorelease:pending --color ededed --description "release-please" --force',
    ...skills.map((s) => `gh label create "skill:${s.name}" --color 1d76db --description "Concerns the ${s.name} skill" --force`),
  ];
  console.log(lines.join('\n'));
  process.exit(0);
}

const readmePath = path.join(root, 'README.md');
const targets = [
  ['.claude-plugin/plugin.json', renderPluginJson(ctx)],
  ['.claude-plugin/marketplace.json', renderMarketplaceJson(ctx)],
  ['README.md', replaceBetweenMarkers(fs.readFileSync(readmePath, 'utf8'), '<!-- skills:start -->', '<!-- skills:end -->', renderReadmeTable(skills))],
  ['docs/index.html', renderIndexHtml(ctx)],
];

const check = args.includes('--check');
let drift = 0;
for (const [rel, content] of targets) {
  const file = path.join(root, rel);
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current === content) continue;
  drift++;
  if (check) {
    console.error(`✖ ${rel} is out of date. Run: npm run catalog`);
  } else {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, content);
    console.log(`wrote ${rel}`);
  }
}
if (check) {
  if (drift) process.exit(1);
  console.log('ok: generated files are current');
} else if (!drift) {
  console.log('ok: nothing to regenerate');
}
