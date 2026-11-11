import test from "node:test";
import assert from "node:assert/strict";
import {
  LEGACY_STORAGE_KEYS, V2_STORAGE_KEY, migrateBrowserStorage
} from "../src/symrella-storage-migration.mjs";

function memoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem(key) { return data.has(key) ? data.get(key) : null; },
    setItem(key, value) { data.set(key, String(value)); },
    removeItem(key) { data.delete(key); },
    snapshot() { return Object.fromEntries(data); }
  };
}
const validEntry = {
  date: "2026-01-02", temp: 36.45, mucus: "cremeuse",
  bleeding: "aucun", notes: "À préserver", factors: ["sommeil"], time: "06:35"
};

test("storage migration writes a verified v2 copy and leaves every legacy key intact", () => {
  const initial = {
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify([validEntry]),
    [LEGACY_STORAGE_KEYS.history]: JSON.stringify([]),
    [LEGACY_STORAGE_KEYS.profile]: JSON.stringify({ version: 2, goal: "observer" }),
    [LEGACY_STORAGE_KEYS.learning]: JSON.stringify({ version: 1, completed: {} })
  };
  const storage = memoryStorage(initial);
  const result = migrateBrowserStorage(storage, { migratedAt: "2026-01-03T00:00:00.000Z" });
  assert.equal(result.status, "migrated");
  const after = storage.snapshot();
  for (const [key, value] of Object.entries(initial)) assert.equal(after[key], value);
  assert.ok(after[V2_STORAGE_KEY]);
  assert.equal(JSON.parse(after[V2_STORAGE_KEY]).currentCycle.observations[0].generalNotes, "À préserver");
});

test("an existing valid v2 store is never overwritten", () => {
  const storage = memoryStorage({
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify([validEntry]),
    [LEGACY_STORAGE_KEYS.history]: "[]"
  });
  const first = migrateBrowserStorage(storage);
  assert.equal(first.status, "migrated");
  const original = storage.getItem(V2_STORAGE_KEY);
  const second = migrateBrowserStorage(storage);
  assert.equal(second.status, "already_migrated");
  assert.equal(storage.getItem(V2_STORAGE_KEY), original);
});

test("an invalid existing v2 store blocks migration instead of overwriting it", () => {
  const storage = memoryStorage({
    [V2_STORAGE_KEY]: "{broken",
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify([validEntry]),
    [LEGACY_STORAGE_KEYS.history]: "[]"
  });
  assert.equal(migrateBrowserStorage(storage).reason, "v2_unreadable");
  assert.equal(storage.getItem(V2_STORAGE_KEY), "{broken");
});

test("invalid legacy data blocks migration and preserves original keys", () => {
  const current = JSON.stringify([{ ...validEntry, mucus: "unknown" }]);
  const storage = memoryStorage({
    [LEGACY_STORAGE_KEYS.current]: current,
    [LEGACY_STORAGE_KEYS.history]: "[]"
  });
  assert.equal(migrateBrowserStorage(storage).status, "blocked");
  assert.equal(storage.getItem(LEGACY_STORAGE_KEYS.current), current);
  assert.equal(storage.getItem(V2_STORAGE_KEY), null);
});

test("storage write failure blocks migration without changing legacy data", () => {
  const storage = memoryStorage({
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify([validEntry]),
    [LEGACY_STORAGE_KEYS.history]: "[]"
  });
  storage.setItem = () => { throw new Error("quota"); };
  const result = migrateBrowserStorage(storage);
  assert.equal(result.status, "blocked");
  assert.match(result.reason, /quota/);
  assert.equal(storage.getItem(LEGACY_STORAGE_KEYS.current), JSON.stringify([validEntry]));
});

test("missing legacy keys do not create an empty v2 database", () => {
  const storage = memoryStorage();
  assert.equal(migrateBrowserStorage(storage).status, "legacy_missing");
  assert.equal(storage.getItem(V2_STORAGE_KEY), null);
});

test("readback access failure rolls back the newly written v2 key", () => {
  const base = memoryStorage({
    [LEGACY_STORAGE_KEYS.current]: JSON.stringify([validEntry]),
    [LEGACY_STORAGE_KEYS.history]: "[]"
  });
  const originalGet = base.getItem.bind(base);
  let v2Reads = 0;
  base.getItem = key => {
    if (key === V2_STORAGE_KEY && ++v2Reads === 2) throw new Error("readback unavailable");
    return originalGet(key);
  };
  const result = migrateBrowserStorage(base);
  assert.equal(result.status, "blocked");
  assert.match(result.reason, /vérifier l'écriture/);
  assert.equal(originalGet(V2_STORAGE_KEY), null);
  assert.equal(originalGet(LEGACY_STORAGE_KEYS.current), JSON.stringify([validEntry]));
});
