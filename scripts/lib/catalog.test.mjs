import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { listSkills } from './skills.mjs';
import {
  PLUGIN_NAME,
  renderPluginJson,
  renderMarketplaceJson,
  renderReadmeTable,
  replaceBetweenMarkers,
  renderIndexHtml,
  bumpVersion,
  bumpSkillFile,
} from './catalog.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const skills = listSkills(path.join(here, 'fixtures', 'good'));
const ctx = { version: '0.1.0', skills, repo: 'anguspiv/agent-skills' };

test('plugin.json is deterministic, 2-space, newline-terminated, names the plugin', () => {
  const out = renderPluginJson(ctx);
  assert.equal(out, renderPluginJson(ctx));
  assert.ok(out.endsWith('}\n'));
  const json = JSON.parse(out);
  assert.equal(json.name, PLUGIN_NAME);
  assert.equal(json.version, '0.1.0');
  assert.deepEqual(json.keywords.slice(0, 2), ['agent-skills', 'claude-code']);
  assert.equal(json.repository, 'https://github.com/anguspiv/agent-skills');
});

test('marketplace.json entry name equals plugin name and source is the root', () => {
  const json = JSON.parse(renderMarketplaceJson(ctx));
  assert.equal(json.name, PLUGIN_NAME);
  assert.equal(json.plugins.length, 1);
  assert.equal(json.plugins[0].name, PLUGIN_NAME);
  assert.equal(json.plugins[0].source, './');
  assert.equal(json.plugins[0].version, undefined, 'version lives in plugin.json only');
  assert.match(json.plugins[0].description, /alpha, beta/);
});

test('README table lists each skill with version and link', () => {
  const table = renderReadmeTable(skills);
  assert.match(table, /\| \[alpha\]\(skills\/alpha\) \| 1\.0\.0 \| Use when testing/);
  assert.match(table, /\| \[beta\]\(skills\/beta\) \| 0\.2\.1 \|/);
});

test('README table says so when there are no skills', () => {
  assert.match(renderReadmeTable([]), /No skills yet/);
});

test('replaceBetweenMarkers is idempotent and keeps the markers', () => {
  const src = 'a\n<!-- skills:start -->\nold\n<!-- skills:end -->\nb\n';
  const once = replaceBetweenMarkers(src, '<!-- skills:start -->', '<!-- skills:end -->', 'new');
  assert.equal(once, 'a\n<!-- skills:start -->\nnew\n<!-- skills:end -->\nb\n');
  assert.equal(replaceBetweenMarkers(once, '<!-- skills:start -->', '<!-- skills:end -->', 'new'), once);
  assert.throws(() => replaceBetweenMarkers('no markers', '<!-- s -->', '<!-- e -->', 'x'), /markers/);
});

test('index.html names each skill, both install commands, and escapes html', () => {
  const html = renderIndexHtml(ctx);
  assert.match(html, /<title>agent-skills<\/title>/);
  assert.match(html, /npx skills add anguspiv\/agent-skills/);
  assert.match(html, /claude plugin marketplace add anguspiv\/agent-skills/);
  assert.match(html, /claude plugin install anguspiv-skills@anguspiv-skills/);
  assert.match(html, /id="alpha"/);
  assert.match(html, /&lt;first&gt;/);
  assert.doesNotMatch(html, /<first>/);
  assert.match(html, /v0\.1\.0/);
});

test('bumpVersion handles patch, minor, major', () => {
  assert.equal(bumpVersion('1.2.3', 'patch'), '1.2.4');
  assert.equal(bumpVersion('1.2.3', 'minor'), '1.3.0');
  assert.equal(bumpVersion('1.2.3', 'major'), '2.0.0');
  assert.throws(() => bumpVersion('1.2.3', 'huge'), /patch|minor|major/);
});

test('bumpSkillFile rewrites only the version line', () => {
  const src = '---\nname: a\nmetadata:\n  version: "1.0.0"\n  author: x\n---\n\nbody\n';
  assert.equal(bumpSkillFile(src, 'minor'), '---\nname: a\nmetadata:\n  version: "1.1.0"\n  author: x\n---\n\nbody\n');
});
