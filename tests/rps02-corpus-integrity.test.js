const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const root = path.join(__dirname, '..');
const corpus = JSON.parse(fs.readFileSync(path.join(root, 'data/rps02-visual-corpus.json'), 'utf8'));

test('RPS-02 corpus has nine unique references and keeps source labels separate from SymRella mappings', () => {
  assert.equal(corpus.records.length, 9);
  assert.equal(new Set(corpus.records.map(record => record.internalId)).size, 9);
  assert.equal(new Set(corpus.records.map(record => record.imageId)).size, 9);

  for (const record of corpus.records) {
    assert.ok(record.sourceUrl.startsWith('https://'));
    assert.ok(record.expectedLocalAssetPath.startsWith('./rps02-blind-assets/'));
    assert.match(record.sha256, /^[a-f0-9]{64}$/);
    assert.equal(record.rps02Mapping, 'pending_expert');
    assert.equal(record.pedagogicalStatus, 'candidate_pending_expert');
    assert.ok(Object.values(record.mappedFeatures).every(value => value === 'unknown'));
  }
});

test('RPS-02 local asset claims match the files actually present and their SHA-256 digests', () => {
  const checks = corpus.records.map(record => {
    const absolutePath = path.join(root, record.expectedLocalAssetPath);
    const exists = fs.existsSync(absolutePath);

    if (!exists) {
      assert.equal(record.assetStatus, 'missing_from_repository', record.internalId);
      assert.equal(record.integrityStatus, 'unverified_local_asset_missing', record.internalId);
      return false;
    }

    assert.equal(record.assetStatus, 'present_locally', record.internalId);
    const bytes = fs.readFileSync(absolutePath);
    const digest = crypto.createHash('sha256').update(bytes).digest('hex');
    assert.equal(digest, record.sha256, `SHA-256 mismatch for ${record.internalId}`);
    assert.equal(record.integrityStatus, 'sha256_verified', record.internalId);
    return true;
  });

  const allVerified = checks.every(Boolean);
  if (allVerified) {
    assert.equal(corpus.productionStatus, 'local_mirror_complete_pending_expert_validation');
  } else {
    assert.notEqual(corpus.productionStatus, 'local_mirror_complete_pending_expert_validation');
    assert.equal(corpus.productionStatus, 'local_assets_missing_pending_expert_validation');
  }
});
