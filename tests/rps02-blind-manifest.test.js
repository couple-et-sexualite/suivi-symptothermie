const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');

test('RPS-02 blind manifest exposes only neutral image identifiers and assets', () => {
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data/rps02-blind-annotation-view.json'), 'utf8'));
  assert.equal(manifest.records.length, 9);
  const ids = manifest.records.map(r => r.blindImageId);
  assert.deepEqual(ids, Array.from({length: 9}, (_, i) => 'RPS02-A0' + (i + 1)));
  for (const record of manifest.records) {
    assert.deepEqual(Object.keys(record).sort(), ['assetPath', 'blindImageId']);
    assert.match(record.assetPath, /^\.\/rps02-blind-assets\/RPS02-A0\d\.jpg$/);
  }
});

test('RPS-02 blind assets match the non-blind provenance manifest', () => {
  const blind = JSON.parse(fs.readFileSync(path.join(root, 'data/rps02-blind-annotation-view.json'), 'utf8'));
  const provenance = JSON.parse(fs.readFileSync(path.join(root, 'data/rps02-local-asset-manifest.json'), 'utf8'));
  const byId = new Map(provenance.records.map(r => [r.blindImageId, r]));
  for (const record of blind.records) {
    const expected = byId.get(record.blindImageId);
    assert.ok(expected);
    assert.equal(expected.assetPath, record.assetPath);
    const file = path.join(root, 'data', record.assetPath.replace(/^\.\//, ''));
    const bytes = fs.readFileSync(file);
    assert.equal(bytes.length, expected.bytes);
    assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'), expected.sha256);
  }
});

test('RPS-02 blind annotation UI does not expose source metadata or HTML injection primitives', () => {
  const html = fs.readFileSync(path.join(root, 'tools/rps02-blind-annotation/index.html'), 'utf8');
  assert.doesNotMatch(html, /sourceUrl|sourceRecordId|justisse|10CK|8K|6CKG|8CKG|10CKG|6K|10K|10C|6CK/i);
  assert.doesNotMatch(html, /\.innerHTML\s*=/);
  assert.doesNotMatch(html, /document\.write\s*\(/);
  assert.match(html, /\.\.\/\.\.\/data\/rps02-blind-annotation-view\.json/);
});
