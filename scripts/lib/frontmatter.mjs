// Minimal YAML-subset frontmatter parser. Supports `key: value`, quoted
// strings, comments, and one level of nested maps (`metadata:`). That is all
// the Agent Skills spec needs, and it keeps the repo dependency-free.

function unquote(raw) {
  const v = raw.trim();
  if (v.length >= 2 && ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'")))) {
    return v.slice(1, -1);
  }
  return v;
}

function splitKey(line) {
  const i = line.indexOf(':');
  if (i === -1) throw new Error(`frontmatter line is not "key: value": ${line}`);
  return [line.slice(0, i).trim(), line.slice(i + 1)];
}

export function parseFrontmatter(text) {
  if (!text.startsWith('---\n')) throw new Error('missing frontmatter');
  const end = text.indexOf('\n---', 4);
  if (end === -1) throw new Error('unterminated frontmatter');
  const block = text.slice(4, end);
  const after = text.slice(end + 4);
  const body = after.startsWith('\n') ? after.slice(1) : after;

  const data = {};
  let current = null; // key of the nested map being filled
  for (const line of block.split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue;
    if (/^\s+/.test(line)) {
      if (!current) throw new Error(`unexpected indentation: ${line}`);
      const [k, v] = splitKey(line);
      data[current][k] = unquote(v);
      continue;
    }
    const [k, v] = splitKey(line);
    if (v.trim() === '') {
      data[k] = {};
      current = k;
    } else {
      data[k] = unquote(v);
      current = null;
    }
  }
  return { data, body };
}
