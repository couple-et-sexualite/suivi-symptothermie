import test from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyData } from "../src/symrella-data-v2.mjs";
import { projectV2ToLegacy } from "../src/symrella-legacy-compat.mjs";

function fixture() {
  return migrateLegacyData({
    current: [
      { date: "2026-02-02", temp: 36.4, mucus: "cremeuse", notes: "Observation", factors: ["sommeil", "alcool"], bleeding: "aucun", time: "06:30" }
    ],
    history: [
      { start: "2026-01-01", end: "2026-01-28", entries: [
        { date: "2026-01-03", temp: 36.5, mucus: "blanc-oeuf", notes: "", factors: ["maladie"], bleeding: "regles", time: "07:00" }
      ] }
    ],
    profile: { goal: "observer", language: "fr" },
    learning: { completed: { m1: true } }
  });
}

test("legacy projection exposes current and archived observations without mutating v2", () => {
  const data = fixture();
  const before = structuredClone(data);
  const result = projectV2ToLegacy(data);
  assert.deepEqual(result.current, [{
    date: "2026-02-02", temp: 36.4, mucus: "cremeuse", notes: "Observation",
    factors: ["sommeil", "alcool"], bleeding: "aucun", time: "06:30"
  }]);
  assert.equal(result.history[0].start, "2026-01-01");
  assert.equal(result.history[0].end, "2026-01-28");
  assert.equal(result.history[0].entries[0].factors[0], "maladie");
  assert.deepEqual(result.profile, { goal: "observer", language: "fr" });
  assert.deepEqual(result.learning, { completed: { m1: true } });
  assert.deepEqual(data, before);
});

test("legacy projection refuses richer mucus data rather than inventing a category", () => {
  const data = fixture();
  data.currentCycle.observations[0].cervicalMucus.legacyCategory = null;
  assert.throws(() => projectV2ToLegacy(data), /sans perte/);
});

test("legacy projection rejects structurally invalid v2 data", () => {
  const data = fixture();
  data.currentCycle.observations[0].temperature.valueC = 100;
  assert.throws(() => projectV2ToLegacy(data), /base SymRella v2 invalide/);
});
