import test from "node:test";
import assert from "node:assert/strict";
import { commitLegacySnapshot } from "../src/symrella-legacy-transaction.mjs";
import { LEGACY_STORAGE_KEYS, V2_STORAGE_KEY } from "../src/symrella-storage-migration.mjs";

const ALL_KEYS = [V2_STORAGE_KEY, ...Object.values(LEGACY_STORAGE_KEYS)];
const snapshot = {
  current: [],
  history: [],
  profile: {},
  learning: {}
};

function createStorage({ failRollback = false } = {}) {
  const values = new Map();
  let writeFailureTriggered = false;
  return {
    values,
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      if (key === LEGACY_STORAGE_KEYS.current && !writeFailureTriggered) {
        writeFailureTriggered = true;
        throw new Error("Échec d’écriture simulé.");
      }
      values.set(key, String(value));
    },
    removeItem(key) {
      if (failRollback && writeFailureTriggered && key === V2_STORAGE_KEY) {
        throw new Error("Échec de rollback simulé.");
      }
      values.delete(key);
    }
  };
}

test("rollback restores and verifies every previous storage value after a write failure", () => {
  const storage = createStorage();
  assert.throws(
    () => commitLegacySnapshot(storage, snapshot),
    error => error.message === "Échec d’écriture simulé." && error.rollbackFailed !== true
  );
  for (const key of ALL_KEYS) assert.equal(storage.getItem(key), null, key);
});

test("rollback failure is exposed and the inconsistent key is identified", () => {
  const storage = createStorage({ failRollback: true });
  assert.throws(
    () => commitLegacySnapshot(storage, snapshot),
    error => {
      assert.equal(error.message, "Échec d’écriture simulé.");
      assert.equal(error.rollbackFailed, true);
      assert.ok(error.rollbackFailures.some(item =>
        item.key === V2_STORAGE_KEY && (item.phase === "restore" || item.phase === "verify")
      ));
      return true;
    }
  );
  assert.notEqual(storage.getItem(V2_STORAGE_KEY), null);
});
