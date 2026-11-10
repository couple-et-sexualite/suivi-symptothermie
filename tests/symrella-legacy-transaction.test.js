import test from "node:test";
import assert from "node:assert/strict";
import { commitLegacySnapshot } from "../src/symrella-legacy-transaction.mjs";
import { LEGACY_STORAGE_KEYS, V2_STORAGE_KEY } from "../src/symrella-storage-migration.mjs";

function storage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); },
    snapshot() { return Object.fromEntries(values); }
  };
}
function snapshot() {
  return {
    current: [{
      date: "2026-04-03", temp: 36.45, mucus: "cremeuse",
      notes: "Observation", factors: [], bleeding: "aucun", time: "06:20"
    }],
    history: [],
    profile: { language: "fr" },
    learning: { completed: { intro: true } }
  };
}

test("complete snapshot initializes v2 and writes all legacy mirrors", () => {
  const store = storage();
  const result = commitLegacySnapshot(store, snapshot(), {
    idFactory: (prefix, index) => prefix + "-" + index
  });
  const saved = store.snapshot();
  assert.ok(saved[V2_STORAGE_KEY]);
  for (const key of Object.values(LEGACY_STORAGE_KEYS)) assert.ok(saved[key]);
  assert.equal(result.currentCycle.observations.length, 1);
  assert.equal(JSON.parse(saved[LEGACY_STORAGE_KEYS.current])[0].notes, "Observation");
});

test("complete snapshot updates v2 and legacy mirrors together", () => {
  const store = storage();
  commitLegacySnapshot(store, snapshot(), {
    idFactory: (prefix, index) => "first-" + prefix + "-" + index
  });
  const next = snapshot();
  next.current[0].temp = 36.8;
  next.profile.language = "en";
  const result = commitLegacySnapshot(store, next);
  assert.equal(result.currentCycle.observations[0].temperature.valueC, 36.8);
  assert.equal(JSON.parse(store.getItem(LEGACY_STORAGE_KEYS.current))[0].temp, 36.8);
  assert.equal(JSON.parse(store.getItem(LEGACY_STORAGE_KEYS.profile)).language, "en");
});

test("failed legacy mirror write rolls back v2 and every legacy key", () => {
  const store = storage();
  commitLegacySnapshot(store, snapshot(), {
    idFactory: (prefix, index) => "before-" + prefix + "-" + index
  });
  const before = store.snapshot();
  const originalSet = store.setItem;
  store.setItem = (key, value) => {
    if (key === LEGACY_STORAGE_KEYS.profile) throw new Error("quota");
    originalSet(key, value);
  };
  const next = snapshot();
  next.current[0].temp = 37;
  assert.throws(() => commitLegacySnapshot(store, next), /quota/);
  assert.deepEqual(store.snapshot(), before);
});

test("invalid full snapshot changes no stored value", () => {
  const store = storage();
  const before = store.snapshot();
  assert.throws(() => commitLegacySnapshot(store, {
    current: [{ date: "bad" }], history: [], profile: null, learning: null
  }));
  assert.deepEqual(store.snapshot(), before);
});
