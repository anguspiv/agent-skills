import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { latestTag, staleVersions } from './git.mjs';

function git(cwd, ...args) {
  return execFileSync('git', args, { cwd, encoding: 'utf8', env: { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@t', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@t' } }).trim();
}

function skill(root, name, version, body) {
  const dir = path.join(root, 'skills', name);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), `---\nname: ${name}\ndescription: d\nmetadata:\n  version: "${version}"\n---\n\n${body}\n`);
}

function repo() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'agent-skills-git-'));
  git(root, 'init', '-q', '-b', 'main');
  skill(root, 'alpha', '1.0.0', 'one');
  git(root, 'add', '-A');
  git(root, 'commit', '-qm', 'init');
  return root;
}

test('latestTag returns null without tags and the newest v* tag otherwise', () => {
  const root = repo();
  assert.equal(latestTag(root), null);
  git(root, 'tag', 'v0.1.0');
  git(root, 'commit', '-q', '--allow-empty', '-m', 'x');
  git(root, 'tag', 'v0.2.0');
  assert.equal(latestTag(root), 'v0.2.0');
});

test('staleVersions flags a changed skill whose version did not move', () => {
  const root = repo();
  git(root, 'tag', 'v0.1.0');
  skill(root, 'alpha', '1.0.0', 'two');
  assert.deepEqual(staleVersions(root, 'v0.1.0'), [{ name: 'alpha', version: '1.0.0' }]);
});

test('staleVersions is empty when the version was bumped or nothing changed', () => {
  const root = repo();
  git(root, 'tag', 'v0.1.0');
  assert.deepEqual(staleVersions(root, 'v0.1.0'), []);
  skill(root, 'alpha', '1.0.1', 'two');
  assert.deepEqual(staleVersions(root, 'v0.1.0'), []);
});

test('staleVersions ignores skills that did not exist at the tag', () => {
  const root = repo();
  git(root, 'tag', 'v0.1.0');
  skill(root, 'beta', '1.0.0', 'new');
  assert.deepEqual(staleVersions(root, 'v0.1.0'), []);
});
