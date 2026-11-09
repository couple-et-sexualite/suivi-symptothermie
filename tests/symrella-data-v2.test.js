import test from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyData, validateV2Data } from "../src/symrella-data-v2.mjs";

const ids = (() => { let n = 0; return (kind) => `${kind}-${++n}`; })();
const entry = (date, extra = {}) => ({
  date, temp: 36.45, mucus: "cremeuse", notes: "Note conservée",
  time: "06:35", factors: ["sommeil"], bleeding: "aucun", ...extra
});

test("migration preserves legacy observations without inventing mucus details", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-02")] }, { idFactory: ids });
  const observation = migrated.currentCycle.observations[0];
  assert.equal(observation.temperature.valueC, 36.45);
  assert.equal(observation.temperature.measuredAt, "06:35");
  assert.equal(observation.temperature.measurementRoute, "unknown");
  assert.equal(observation.temperature.quality, "unknown");
  assert.equal(observation.cervicalMucus.legacyCategory, "cremeuse");
  assert.equal(observation.cervicalMucus.sensation, null);
  assert.deepEqual(observation.cervicalMucus.appearance, []);
  assert.equal(observation.generalNotes, "Note conservée");
});

test("migration never assumes the first recorded observation is cycle day one", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-07")] }, { idFactory: ids });
  assert.equal(migrated.currentCycle.startDate, null);
  assert.equal(migrated.currentCycle.observations[0].cycleDay, null);
});

test("migration keeps historical cycle boundaries and maps disturbances without excluding temperature", () => {
  const migrated = migrateLegacyData({
    current: [],
    history: [{ start: "2025-12-01", end: "2025-12-28", entries: [entry("2025-12-03")] }]
  }, { idFactory: ids });
  const cycle = migrated.history[0];
  assert.equal(cycle.startDate, "2025-12-01");
  assert.equal(cycle.endDate, "2025-12-28");
  assert.equal(cycle.observations[0].temperature.quality, "unknown");
  assert.equal(cycle.observations[0].disturbances[0].type, "sleep");
  assert.equal(cycle.observations[0].temperature.disturbanceIds.length, 1);
});

test("migrated data validates and contains no inferred fertility result", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-01")] }, { idFactory: ids });
  assert.equal(validateV2Data(migrated), true);
  assert.equal(migrated.currentCycle.derived.status, "not_evaluated");
  assert.equal(migrated.migration.fertilityClassification, "not_created");
});

test("invalid legacy records are rejected without partial migration", () => {
  assert.throws(() => migrateLegacyData({
    current: [entry("2026-01-01", { mucus: "peak" })]
  }, { idFactory: ids }), /invalides/);
});

test("duplicate dates are collapsed deterministically to the first sorted occurrence", () => {
  const migrated = migrateLegacyData({
    current: [entry("2026-01-01"), entry("2026-01-01", { notes: "doublon" })]
  }, { idFactory: ids });
  assert.equal(migrated.currentCycle.observations.length, 1);
  assert.equal(migrated.currentCycle.observations[0].generalNotes, "Note conservée");
});
