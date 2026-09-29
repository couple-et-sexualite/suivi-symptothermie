const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('RPS-02 blind manifest exposes only neutral image identifiers and assets', () => {
  const manifest = JSON.parse(fs.readFileSync('data/rps02-blind-annotation-view.json', 'utf8'));
  assert.equal(manifest.records.length, 9);
  const ids = manifest.records.map(r => r.blindImageId);
  assert.deepEqual(ids, Array.from({length: 9}, (_, i) => 'RPS02-A0' + (i + 1)));
  for (const record of manifest.records) {
    assert.deepEqual(Object.keys(record).sort(), ['assetPath', 'blindImageId']);
    assert.match(record.assetPath, /^\.\/rps02-blind-assets\/RPS02-A0\d\.jpg$/);
  }
});

test('RPS-02 annotator UI does not use HTML injection primitives', () => {
  const html = fs.readFileSync('tools/rps02-blind-annotation/index.html', 'utf8');
  assert.doesNotMatch(html, /\.innerHTML\s*=/);
  assert.doesNotMatch(html, /document\.write\s*\(/);
  assert.match(html, /\.\.\/\.\.\/data\/rps02-blind-annotation-view\.json/);
});
