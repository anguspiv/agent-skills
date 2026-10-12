import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { listSkills, validateSkill, isValidName, isSemver } from './skills.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const good = path.join(here, 'fixtures', 'good');
const bad = path.join(here, 'fixtures', 'bad');

test('isValidName follows the agentskills spec', () => {
  for (const ok of ['a', 'pdf-processing', 'a1-b2', 'x'.repeat(64)]) assert.ok(isValidName(ok), ok);
  for (const no of ['', '-a', 'a-', 'a--b', 'PDF', 'a_b', 'a b', 'x'.repeat(65)]) assert.ok(!isValidName(no), no);
});

test('isSemver accepts x.y.z only', () => {
  assert.ok(isSemver('1.0.0'));
  assert.ok(isSemver('0.12.3'));
  assert.ok(!isSemver('1.0'));
  assert.ok(!isSemver('v1.0.0'));
  assert.ok(!isSemver('one'));
});

test('listSkills returns skills sorted by name with parsed data', () => {
  const skills = listSkills(good);
  assert.deepEqual(skills.map((s) => s.name), ['alpha', 'beta']);
  assert.equal(skills[0].dir, path.join(good, 'skills', 'alpha'));
  assert.equal(skills[0].data.metadata.version, '1.0.0');
  assert.match(skills[0].body, /Body of alpha/);
});

test('listSkills returns [] when skills/ is missing', () => {
  assert.deepEqual(listSkills(path.join(here, 'fixtures', 'nope')), []);
});

test('validateSkill passes the good fixtures', () => {
  for (const s of listSkills(good)) assert.deepEqual(validateSkill(s), []);
});

test('validateSkill reports every rule the bad fixtures break', () => {
  const byName = Object.fromEntries(listSkills(bad).map((s) => [s.name, validateSkill(s)]));
  assert.ok(byName['Bad_Name'].some((e) => /name "Bad_Name" is invalid/.test(e)));
  assert.ok(byName['mismatch'].some((e) => /name "other-name" does not match directory "mismatch"/.test(e)));
  assert.ok(byName['mismatch'].some((e) => /description is required/.test(e)));
  assert.ok(byName['mismatch'].some((e) => /metadata.version "one" is not semver/.test(e)));
  assert.ok(byName['empty'].some((e) => /body is empty/.test(e)));
});

test('validateSkill rejects an over-long description', () => {
  const s = { name: 'a', dir: '/x/a', data: { name: 'a', description: 'd'.repeat(1025), metadata: { version: '1.0.0' } }, body: 'b' };
  assert.ok(validateSkill(s).some((e) => /description exceeds 1024/.test(e)));
});
