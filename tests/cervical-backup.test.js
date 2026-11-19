import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../cervical-backup.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const validator = context.SymRellaCervicalBackup;

function observation(overrides = {}) {
  return {
    id: 'rps02-1794300000000-ab12cd34',
    source: 'rps02',
    observedAt: '2026-11-10T12:00:00.000Z',
    observations: {
      sensation: 'moist',
      appearance: 'creamy',
      transparency: 'opaque',
      stretch: 'little'
    },
    visualChoice: 'opaque',
    interpretation: {
      title: 'Observation intermédiaire',
      body: 'Description pédagogique.',
      detail: 'Une observation isolée ne permet pas de conclure.'
    },
    ...overrides
  };
}

test('accepts a complete cervical observation record', () => {
  assert.equal(validator.isValidCervicalObservation(observation()), true);
  assert.equal(validator.isValidCervicalObservations([observation()]), true);
});

test('rejects invalid or incomplete cervical values', () => {
  const invalid = observation({
    observations: { sensation: 'ovulation', appearance: 'creamy', transparency: 'opaque', stretch: 'little' }
  });
  assert.equal(validator.isValidCervicalObservation(invalid), false);
  assert.equal(validator.isValidCervicalObservations([invalid]), false);
});

test('does not include personal image data in backup records', () => {
  assert.equal(validator.isValidCervicalObservation(observation({ photoDataUrl: 'data:image/png;base64,abc' })), false);
  assert.equal(validator.isValidCervicalObservation(observation({ photo: 'private-image' })), false);
});

test('accepts an empty list for older backups and rejects oversized collections', () => {
  assert.equal(validator.isValidCervicalObservations([]), true);
  assert.equal(validator.isValidCervicalObservations(new Array(validator.MAX_OBSERVATIONS + 1).fill(observation())), false);
});

test('older backups preserve cervical observations already present on this device', () => {
  const current = [observation()];
  assert.equal(validator.resolveCervicalObservations({ version: 2 }, current), current);
});

test('a newer backup explicitly replaces cervical observations, including with an empty list', () => {
  const current = [observation()];
  assert.equal(validator.resolveCervicalObservations({ cervicalObservations: [] }, current).length, 0);
  assert.equal(validator.resolveCervicalObservations({ cervicalObservations: [observation()] }, []).length, 1);
});
