import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseFrontmatter } from './frontmatter.mjs';

test('parses flat string keys and keeps the body', () => {
  const { data, body } = parseFrontmatter('---\nname: alpha\ndescription: Use when x.\n---\n# Alpha\n\nbody\n');
  assert.deepEqual(data, { name: 'alpha', description: 'Use when x.' });
  assert.equal(body, '# Alpha\n\nbody\n');
});

test('parses one level of nested map', () => {
  const { data } = parseFrontmatter('---\nname: a\nmetadata:\n  version: "1.2.0"\n  author: anguspiv\n---\n');
  assert.deepEqual(data.metadata, { version: '1.2.0', author: 'anguspiv' });
});

test('strips matching single or double quotes', () => {
  const { data } = parseFrontmatter("---\na: \"x: y\"\nb: 'z'\n---\n");
  assert.deepEqual(data, { a: 'x: y', b: 'z' });
});

test('keeps a colon inside an unquoted value', () => {
  const { data } = parseFrontmatter('---\ndescription: Use when foo: bar.\n---\n');
  assert.equal(data.description, 'Use when foo: bar.');
});

test('ignores comments and blank lines', () => {
  const { data } = parseFrontmatter('---\n# c\n\nname: a\n---\n');
  assert.deepEqual(data, { name: 'a' });
});

test('throws when the file does not start with frontmatter', () => {
  assert.throws(() => parseFrontmatter('# no\n'), /missing frontmatter/);
  assert.throws(() => parseFrontmatter('---\nname: a\n'), /unterminated frontmatter/);
});
