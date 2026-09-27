const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures/rps02-cervical-ai-g1-synthetic.json'), 'utf8'));

const allowed = {
  quality: ['sufficient','insufficient','uncertain'],
  transparency: ['transparent','translucent','opaque','unknown'],
  chromaticAspect: ['clear','white','whitish','other','unknown'],
  texture: ['creamy','thick','watery','gel_like','stretchy','sticky','mixed','other','unknown'],
  extensibility: ['absent','weak','clear','indeterminate'],
  stretchLength: ['0','lt_1cm','1_2cm','gt_2cm','not_measurable','unknown'],
  surface: ['matte','glossy','mixed','unknown'],
  split: ['train','validation','test']
};

function assertAnnotation(a) {
  assert.ok(allowed.quality.includes(a.quality));
  const f = a.features;
  assert.ok(allowed.transparency.includes(f.transparency));
  assert.ok(allowed.chromaticAspect.includes(f.chromaticAspect));
  assert.ok(Array.isArray(f.texture) && f.texture.length > 0);
  f.texture.forEach(v => assert.ok(allowed.texture.includes(v)));
  assert.ok(allowed.extensibility.includes(f.extensibility));
  assert.ok(allowed.stretchLength.includes(f.stretchLength));
  assert.ok(allowed.surface.includes(f.surface));
  assert.equal(typeof a.uncertainty, 'boolean');
  if (a.quality !== 'sufficient') assert.equal(a.uncertainty, true);
}

function signature(a) {
  return JSON.stringify(a.features);
}

test('synthetic G1 fixture is non-sensitive and structurally valid', () => {
  assert.match(fixture.purpose, /no real intimate images/i);
  assert.ok(fixture.cases.length >= 6);
  const ids = new Set();
  for (const c of fixture.cases) {
    assert.ok(/^SYN-P\d+$/.test(c.participantId));
    assert.ok(/^SYN-O\d+$/.test(c.observationId));
    assert.ok(!ids.has(c.observationId));
    ids.add(c.observationId);
    assert.ok(allowed.split.includes(c.split));
    assertAnnotation(c.annotationA);
    assertAnnotation(c.annotationB);
    assert.ok(c.adjudication.startsWith('agreement') || c.adjudication.startsWith('disagreement'));
  }
});

test('synthetic pilot detects intended agreement and disagreement', () => {
  const c1 = fixture.cases[0];
  assert.equal(signature(c1.annotationA), signature(c1.annotationB));
  const c2 = fixture.cases[1];
  assert.notEqual(signature(c2.annotationA), signature(c2.annotationB));
  const c5 = fixture.cases[4];
  assert.notEqual(signature(c5.annotationA), signature(c5.annotationB));
});

test('participant-level split has no leakage', () => {
  const byParticipant = new Map();
  for (const c of fixture.cases) {
    const previous = byParticipant.get(c.participantId);
    if (previous) assert.equal(previous, c.split);
    byParticipant.set(c.participantId, c.split);
  }
  assert.equal(new Set([...byParticipant.values()]).size, 3);
});

test('synthetic fixture contains no clinical or contraceptive outcome labels', () => {
  const serialized = JSON.stringify(fixture).toLowerCase();
  for (const forbidden of ['fertile','infertile','ovulation','peak+3','contracept','safe','unsafe','diagnos']) {
    assert.equal(serialized.includes(forbidden), false, forbidden);
  }
});
