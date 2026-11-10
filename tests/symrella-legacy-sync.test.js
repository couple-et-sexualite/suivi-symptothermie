import test from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyData } from "../src/symrella-data-v2.mjs";
import { V2_STORAGE_KEY } from "../src/symrella-storage-migration.mjs";
import { syncLegacySnapshotToV2 } from "../src/symrella-legacy-sync.mjs";

function memoryStorage(value) {
  let raw = JSON.stringify(value);
  return {
    getItem(key) { return key === V2_STORAGE_KEY ? raw : null; },
    setItem(key, next) { if (key === V2_STORAGE_KEY) raw = String(next); },
    snapshot() { return raw; }
  };
}
function base() {
  const data = migrateLegacyData({
    current: [{
      date: "2026-03-02", temp: 36.4, mucus: "cremeuse",
      notes: "Avant", factors: ["sommeil"], bleeding: "aucun", time: "06:30"
    }],
    history: [{
      start: "2026-02-01", end: "2026-02-28", entries: [{
        date: "2026-02-03", temp: 36.5, mucus: "blanc-oeuf",
        notes: "", factors: [], bleeding: "regles", time: "07:00"
      }]
    }],
    profile: { goal: "observer" }, learning: { completed: { a: true } }
  }, { idFactory: (prefix, index) => prefix + "-" + index });
  return data;
}
function snapshot() {
  return {
    current: [{
      date: "2026-03-02", temp: 36.6, mucus: "blanc-oeuf",
      notes: "Après", factors: ["alcool"], bleeding: "aucun", time: "06:45"
    }, {
      date: "2026-03-03", temp: 36.5, mucus: "sec",
      notes: "Nouvelle", factors: [], bleeding: "aucun", time: "06:40"
    }],
    history: [{
      start: "2026-02-01", end: "2026-02-28", entries: [{
        date: "2026-02-03", temp: 36.5, mucus: "blanc-oeuf",
        notes: "", factors: [], bleeding: "regles", time: "07:00"
      }]
    }],
    profile: { goal: "suivi", language: "fr" },
    learning: { completed: { a: true, b: true } }
  };
}

test("sync updates legacy fields while preserving richer v2 observation details", () => {
  const data = base();
  const observation = data.currentCycle.observations[0];
  observation.temperature.measurementRoute = "vaginal";
  observation.temperature.originalValue = 97.5;
  observation.cervicalMucus.sensation = "wet";
  observation.cervicalMucus.appearance = ["stretchy"];
  observation.cervicalMucus.peakQualityCandidate = "peak-candidate";
  observation.disturbances[0].note = "Détail conservé";
  const store = memoryStorage(data);
  const result = syncLegacySnapshotToV2(store, snapshot(), {
    idFactory: (prefix, index) => "new-" + prefix + "-" + index
  });
  const updated = result.currentCycle.observations.find(item => item.date === "2026-03-02");
  assert.equal(updated.id, observation.id);
  assert.equal(updated.temperature.valueC, 36.6);
  assert.equal(updated.temperature.measuredAt, "06:45");
  assert.equal(updated.temperature.measurementRoute, "vaginal");
  assert.equal(updated.temperature.originalValue, 97.5);
  assert.equal(updated.cervicalMucus.sensation, "wet");
  assert.deepEqual(updated.cervicalMucus.appearance, ["stretchy"]);
  assert.equal(updated.cervicalMucus.peakQualityCandidate, null);
  assert.equal(updated.disturbances[0].type, "alcohol");
  assert.equal(updated.disturbances[0].note, "");
  assert.equal(result.currentCycle.observations.length, 2);
  assert.equal(result.history[0].id, data.history[0].id);
  assert.deepEqual(result.profile, snapshot().profile);
  assert.deepEqual(result.learning, snapshot().learning);
});

test("sync removes deleted observations and archived cycles from the complete snapshot", () => {
  const store = memoryStorage(base());
  const result = syncLegacySnapshotToV2(store, {
    current: [], history: [], profile: null, learning: null
  }, { idFactory: (prefix, index) => "empty-" + prefix + "-" + index });
  assert.deepEqual(result.currentCycle.observations, []);
  assert.deepEqual(result.history, []);
});

test("invalid legacy snapshot never overwrites v2 storage", () => {
  const store = memoryStorage(base());
  const before = store.snapshot();
  assert.throws(() => syncLegacySnapshotToV2(store, {
    current: [{ date: "not-a-date", temp: 36.4, mucus: "sec" }],
    history: [], profile: null, learning: null
  }), /invalides/);
  assert.equal(store.snapshot(), before);
});

test("sync rolls back when storage write fails", () => {
  const store = memoryStorage(base());
  const before = store.snapshot();
  store.setItem = () => { throw new Error("quota"); };
  assert.throws(() => syncLegacySnapshotToV2(store, snapshot()), /quota/);
  assert.equal(store.snapshot(), before);
});

test("history keeps its v2 identity when its date bounds are adjusted", () => {
  const data = base();
  const originalCycleId = data.history[0].id;
  const originalObservationId = data.history[0].observations[0].id;
  const store = memoryStorage(data);
  const adjusted = snapshot();
  adjusted.history[0].start = "2026-01-31";
  adjusted.history[0].end = "2026-03-01";
  const result = syncLegacySnapshotToV2(store, adjusted, {
    idFactory: (prefix, index) => "adjusted-" + prefix + "-" + index
  });
  assert.equal(result.history.length, 1);
  assert.equal(result.history[0].id, originalCycleId);
  assert.equal(result.history[0].observations[0].id, originalObservationId);
  assert.equal(result.history[0].startDate, "2026-01-31");
  assert.equal(result.history[0].endDate, "2026-03-01");
});


test("sync generates a unique id when a legacy disturbance id collides with a richer record", () => {
  const data = base();
  const observation = data.currentCycle.observations[0];
  const collisionId = observation.id + "-legacy-alcohol";
  observation.disturbances.push({
    id: collisionId, type: "illness", note: "Détail riche conservé"
  });
  observation.temperature.disturbanceIds.push(collisionId);
  const store = memoryStorage(data);
  const result = syncLegacySnapshotToV2(store, snapshot(), {
    idFactory: (prefix, index) => "collision-" + prefix + "-" + index
  });
  const updated = result.currentCycle.observations.find(item => item.date === "2026-03-02");
  const ids = updated.disturbances.map(item => item.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(ids.includes(collisionId));
  assert.ok(ids.includes(collisionId + "-2"));
  assert.equal(updated.disturbances.find(item => item.id === collisionId).note, "Détail riche conservé");
});
