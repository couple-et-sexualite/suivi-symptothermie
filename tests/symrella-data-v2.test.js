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

test("duplicate dates are rejected instead of silently losing an observation", () => {
  assert.throws(() => migrateLegacyData({
    current: [entry("2026-01-01"), entry("2026-01-01", { notes: "doublon" })]
  }, { idFactory: ids }), /même date/);
});

test("legacy records matching the current app format remain migratable", () => {
  const migrated = migrateLegacyData({
    current: [entry("2026-01-01", { temp: null, time: null, factors: [], bleeding: "aucun" })],
    history: [{
      start: "2025-12-01",
      end: "2025-12-28",
      entries: [entry("2025-12-03", { temp: null, time: null, factors: [] })]
    }],
    profile: { version: 1, goal: "observer", language: "fr", unit: "c" },
    learning: { version: 1, completed: {}, lastModule: null }
  }, { idFactory: ids });
  assert.equal(migrated.currentCycle.observations[0].temperature.valueC, null);
  assert.equal(migrated.currentCycle.observations[0].temperature.measuredAt, null);
  assert.equal(migrated.history[0].observations[0].temperature.valueC, null);
  assert.equal(migrated.profile.goal, "observer");
  assert.equal(migrated.learning.version, 1);
});

test("duplicate dates in an archived cycle are rejected", () => {
  assert.throws(() => migrateLegacyData({
    current: [],
    history: [{
      start: "2025-12-01",
      end: "2025-12-28",
      entries: [entry("2025-12-03"), entry("2025-12-03", { notes: "doublon" })]
    }]
  }, { idFactory: ids }), /même date/);
});

test("schema validation rejects duplicate observation dates and IDs", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-01"), entry("2026-01-02")] }, { idFactory: (() => { let n = 0; return kind => `${kind}-${++n}`; })() });
  const duplicateDate = structuredClone(migrated);
  duplicateDate.currentCycle.observations[1].date = duplicateDate.currentCycle.observations[0].date;
  assert.equal(validateV2Data(duplicateDate), false);
  const duplicateId = structuredClone(migrated);
  duplicateId.currentCycle.observations[1].id = duplicateId.currentCycle.observations[0].id;
  assert.equal(validateV2Data(duplicateId), false);
});

test("schema validation rejects out-of-range temperature, invalid route and broken disturbance links", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-01")] }, { idFactory: (() => { let n = 0; return kind => `${kind}-${++n}`; })() });
  const badTemperature = structuredClone(migrated);
  badTemperature.currentCycle.observations[0].temperature.valueC = 99;
  assert.equal(validateV2Data(badTemperature), false);
  const badRoute = structuredClone(migrated);
  badRoute.currentCycle.observations[0].temperature.measurementRoute = "forehead";
  assert.equal(validateV2Data(badRoute), false);
  const badLink = structuredClone(migrated);
  badLink.currentCycle.observations[0].temperature.disturbanceIds = ["missing"];
  assert.equal(validateV2Data(badLink), false);
});

test("optional legacy notes are preserved as empty text rather than blocking migration", () => {
  const legacy = entry("2026-01-01");
  delete legacy.notes;
  const migrated = migrateLegacyData({ current: [legacy] }, { idFactory: (() => { let n = 0; return kind => `${kind}-${++n}`; })() });
  assert.equal(migrated.currentCycle.observations[0].generalNotes, "");
  assert.equal(validateV2Data(migrated), true);
});


test("schema accepts the planned daily classification states and rejects unknown states", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-01-01")] }, {
    idFactory: (() => { let n = 0; return kind => `${kind}-${++n}`; })()
  });
  for (const status of [
    "not_evaluated",
    "potentially_fertile",
    "fertile",
    "end_pending",
    "postovulatory_infertile",
    "indeterminate"
  ]) {
    const candidate = structuredClone(migrated);
    candidate.currentCycle.derived.status = status;
    assert.equal(validateV2Data(candidate), true, status);
  }
  const invalid = structuredClone(migrated);
  invalid.currentCycle.derived.status = "safe";
  assert.equal(validateV2Data(invalid), false);
});


test("default migration IDs stay unique across current and archived cycles", () => {
  const migrated = migrateLegacyData({
    current: [entry("2026-01-02")],
    history: [{ start: "2025-12-01", end: "2025-12-28", entries: [entry("2025-12-03")] }]
  });
  const ids = [
    migrated.currentCycle.id,
    ...migrated.currentCycle.observations.map(o => o.id),
    ...migrated.history.flatMap(c => [c.id, ...c.observations.map(o => o.id)])
  ];
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(validateV2Data(migrated), true);
});


test("v2 accepts separate rich cervical sensation and appearance fields", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-02-01")] }, { idFactory: ids });
  const observation = migrated.currentCycle.observations[0];
  observation.cervicalMucus.sensation = "slippery";
  observation.cervicalMucus.appearance = ["clear", "stretchy"];
  observation.cervicalMucus.peakQualityCandidate = true;
  assert.equal(validateV2Data(migrated), true);
});

test("v2 rejects malformed enriched cervical observations", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-02-02")] }, { idFactory: ids });
  migrated.currentCycle.observations[0].cervicalMucus.sensation = { value: "slippery" };
  assert.equal(validateV2Data(migrated), false);

  const second = migrateLegacyData({ current: [entry("2026-02-03")] }, { idFactory: ids });
  second.currentCycle.observations[0].cervicalMucus.appearance = ["clear", ""];
  assert.equal(validateV2Data(second), false);
});

test("v2 validates cervical observation fields without inventing values during migration", () => {
  const migrated = migrateLegacyData({ current: [entry("2026-02-04")] }, { idFactory: ids });
  const observation = migrated.currentCycle.observations[0];
  assert.equal(observation.cervicalMucus.sensation, null);
  assert.deepEqual(observation.cervicalMucus.appearance, []);
  assert.equal(observation.cervicalMucus.peakQualityCandidate, null);
  assert.equal(validateV2Data(migrated), true);
});
