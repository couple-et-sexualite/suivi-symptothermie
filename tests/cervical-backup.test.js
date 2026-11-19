import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../cervical-backup.js', import.meta.url), 'utf8');
const context = vm.createContext({});
vm.runInContext(source, context);
const validator = context.SymRellaCervicalBackup;
const plain = value => JSON.parse(JSON.stringify(value));

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

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); }
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

test('accepts an empty list and enforces its collection limit', () => {
  assert.equal(validator.isValidCervicalObservations([]), true);
  const collection = Array.from({ length: validator.MAX_OBSERVATIONS + 1 }, (_, index) =>
    observation({ id: 'record-' + index }));
  assert.equal(validator.isValidCervicalObservations(collection), false);
});

test('rejects duplicate observation identifiers', () => {
  assert.equal(validator.isValidCervicalObservations([observation(), observation()]), false);
});

test('older backups preserve all cervical observations already on this device', () => {
  const current = [observation(), observation({ id: 'second' })];
  assert.equal(validator.resolveCervicalObservations({ version: 2 }, current), current);
});

test('restoration merges observations without deleting local records', () => {
  const local = [observation()];
  const imported = observation({ id: 'imported' });
  const result = validator.resolveCervicalObservations(
    { cervicalObservations: [observation(), imported] },
    local
  );
  assert.deepEqual(plain(result).map(item => item.id), [local[0].id, imported.id]);
});

test('an empty imported cervical list does not erase local observations', () => {
  const current = [observation()];
  assert.deepEqual(plain(validator.resolveCervicalObservations({ cervicalObservations: [] }, current)), current);
});

test('conflicting records with the same identifier abort restoration', () => {
  const current = [observation()];
  const conflict = observation({ interpretation: { title: 'Modifiée', body: '', detail: '' } });
  assert.equal(validator.resolveCervicalObservations({ cervicalObservations: [conflict] }, current), null);
});

test('invalid local cervical storage cannot be silently replaced by an older backup', () => {
  assert.equal(validator.resolveCervicalObservations({ version: 2 }, null), null);
  assert.equal(validator.resolveCervicalObservations({ version: 2 }, [{ id: 'broken' }]), null);
});

test('adding an observation at capacity never discards the oldest record', () => {
  const current = Array.from({ length: validator.MAX_OBSERVATIONS }, (_, index) =>
    observation({ id: 'record-' + index }));
  const next = validator.appendCervicalObservation(current, observation({ id: 'new-record' }));
  assert.equal(next, null);
  assert.equal(current.length, validator.MAX_OBSERVATIONS);
  assert.equal(current[0].id, 'record-0');
});

test('adding a record below capacity keeps every previous observation', () => {
  const current = [observation()];
  const next = validator.appendCervicalObservation(current, observation({ id: 'second' }));
  assert.deepEqual(plain(next).map(item => item.id), [current[0].id, 'second']);
  assert.equal(current.length, 1);
});

test('a failed storage write rolls every key back to its previous value', () => {
  const store = storage({ current: 'old-current', cervical: 'old-cervical' });
  const before = store.snapshot();
  const originalSetItem = store.setItem;
  let failed = false;
  store.setItem = (key, value) => {
    if (key === 'cervical' && !failed) {
      failed = true;
      throw new Error('quota');
    }
    originalSetItem(key, value);
  };

  assert.throws(
    () => validator.writeStorageTransaction(store, { current: 'new-current', cervical: 'new-cervical' }),
    error => error.cause?.message === 'quota' && error.rollbackFailed === false
  );
  assert.deepEqual(store.snapshot(), before);
});

test('a failed rollback is surfaced instead of being hidden', () => {
  const store = storage({ first: 'old-first', second: 'old-second' });
  const originalSetItem = store.setItem;
  store.setItem = (key, value) => {
    if (key === 'second') throw new Error('quota');
    if (key === 'first' && value === 'old-first') throw new Error('rollback denied');
    originalSetItem(key, value);
  };

  assert.throws(
    () => validator.writeStorageTransaction(store, { first: 'new-first', second: 'new-second' }),
    error => error.rollbackFailed === true && error.rollbackErrors.length > 0
  );
});
test('the recovery journal is written before any application value changes', () => {
  const store = storage({ first: 'old-first' });
  const originalSetItem = store.setItem;
  let applicationWrites = 0;
  store.setItem = (key, value) => {
    if (key === 'first') applicationWrites += 1;
    originalSetItem(key, value);
  };
  validator.writeStorageTransaction(store, { first: 'new-first' });
  assert.equal(applicationWrites, 1);
  assert.equal(store.getItem('first'), 'new-first');
  assert.equal(store.getItem('symrella_restore_recovery_v1'), null);
});

test('failure to persist the recovery journal prevents all application writes', () => {
  const store = storage({ first: 'old-first' });
  const before = store.snapshot();
  const originalSetItem = store.setItem;
  store.setItem = (key, value) => {
    if (key === 'symrella_restore_recovery_v1') throw new Error('quota');
    originalSetItem(key, value);
  };
  assert.throws(() => validator.writeStorageTransaction(store, { first: 'new-first' }));
  assert.deepEqual(store.snapshot(), before);
});

test('an interrupted pending transaction restores all old values and then removes its journal', () => {
  const old = { current: 'old-current', history: 'old-history', cervical: 'old-cervical' };
  const store = storage({ ...old, current: 'partial-current' });
  store.setItem('symrella_restore_recovery_v1', JSON.stringify({
    version: 1, state: 'pending', previous: old
  }));
  const result = validator.recoverStorageTransaction(store);
  assert.equal(result.recovered, true);
  assert.equal(result.journalRemoved, true);
  assert.deepEqual(store.snapshot(), old);
});

test('a failed recovery retains its journal and reports that data are not restored', () => {
  const old = { current: 'old-current', history: 'old-history' };
  const store = storage({ current: 'partial-current', history: 'old-history' });
  const journalKey = 'symrella_restore_recovery_v1';
  const journal = JSON.stringify({ version: 1, state: 'pending', previous: old });
  store.setItem(journalKey, journal);
  const originalSetItem = store.setItem;
  store.setItem = (key, value) => {
    if (key === 'current') throw new Error('storage unavailable');
    originalSetItem(key, value);
  };
  assert.throws(() => validator.recoverStorageTransaction(store), error => error.recoveryRequired === true);
  assert.equal(store.getItem('current'), 'partial-current');
  assert.equal(store.getItem(journalKey), journal);
});

test('a committed journal is cleanup only and never rolls back completed values', () => {
  const store = storage({ first: 'new-first' });
  store.setItem('symrella_restore_recovery_v1', JSON.stringify({
    version: 1, state: 'committed', previous: { first: 'old-first' }
  }));
  const result = validator.recoverStorageTransaction(store);
  assert.equal(result.recovered, false);
  assert.equal(result.journalRemoved, true);
  assert.equal(store.getItem('first'), 'new-first');
});
