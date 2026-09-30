const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const visualJs = fs.readFileSync(path.join(root, 'rps02-visual-learning.js'), 'utf8');
const corpus = JSON.parse(fs.readFileSync(path.join(root, 'data', 'rps02-visual-corpus.json'), 'utf8'));

test('RPS-02 visual workshop keeps observation descriptive and local-first', () => {
  assert.match(visualJs, /Je ne sais pas/);
  assert.match(visualJs, /Sensation/);
  assert.match(visualJs, /Apparence \/ consistance/);
  assert.match(visualJs, /Transparence apparente/);
  assert.match(visualJs, /Étirement observé/);
  assert.match(visualJs, /Ce que vos réponses peuvent évoquer/);
  assert.match(visualJs, /Votre observation ressemble à un mucus de période fertile/);
  assert.match(visualJs, /autour de l’ovulation/);
  assert.match(visualJs, /ne permettent pas de dire que vous ovulez aujourd’hui/);
  assert.match(visualJs, /n.?est pas téléversée, analysée ni sauvegardée/i);
  assert.doesNotMatch(visualJs, /photo[^\n]*(diagnostic|contraception)/i);
  assert.doesNotMatch(visualJs, /10CK.*fertil/i);
  assert.match(visualJs, /Justisse College Cervical Mucus Gallery/);\n  assert.match(visualJs, /CC BY-SA 4\.0/);\n  assert.match(visualJs, /creativecommons\.org\/licenses\/by-sa\/4\.0/);\n  assert.doesNotMatch(visualJs, /referenceLabel|sourceName/);
});

test('RPS-02 corpus remains unvalidated until expert mapping and local asset mirroring', () => {
  assert.equal(corpus.productionStatus, 'local_mirror_complete_pending_expert_validation');
  assert.ok(Array.isArray(corpus.records));
  assert.ok(corpus.records.length >= 9);
  for (const record of corpus.records) {
    assert.equal(record.rps02Mapping, 'pending_expert');
    assert.equal(record.pedagogicalStatus, 'candidate_pending_expert');
    assert.equal(record.rightsStatus, 'documented');
    assert.ok(record.license);
    assert.equal(record.attributionRequired, true);
  }
});

test('RPS-02 source codes are metadata and not used as SymRella categories', () => {
  const labels = corpus.records.map(record => record.referenceLabel).filter(Boolean);
  assert.ok(labels.includes('10CK'));
  assert.ok(labels.includes('8K'));
  assert.ok(labels.includes('6CKG'));
  assert.ok(labels.includes('8CKG'));
  assert.ok(labels.includes('10CKG'));
  assert.ok(labels.includes('6K'));
  assert.ok(labels.includes('10K'));
  assert.ok(labels.includes('10C'));
  assert.ok(labels.includes('6CK'));
  assert.match(corpus.purpose, /codes de la méthode source restent des métadonnées.*ne sont pas des catégories SymRella/i);
});
