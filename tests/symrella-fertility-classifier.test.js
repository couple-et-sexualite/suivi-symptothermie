import test from "node:test";
import assert from "node:assert/strict";
import { classifyFertilityDays, FERTILITY_DAY_STATUS as S } from "../src/symrella-fertility-classifier.mjs";

const observations = [
  { id: "o1", date: "2026-01-01", temperature: { valueC: 36.3 }, cervicalMucus: {} },
  { id: "o2", date: "2026-01-02", temperature: { valueC: 36.4 }, cervicalMucus: {} },
  { id: "o3", date: "2026-01-03", temperature: { valueC: 36.5 }, cervicalMucus: {} }
];

test("without a completed double check, no day is classified postovulatory infertile", () => {
  const result = classifyFertilityDays({
    observations,
    engineResult: {
      state: "OBSERVING",
      thermal: { status: "SHIFT_CONFIRMED", confirmationDate: "2026-01-03" },
      cervical: { status: "PENDING_EXPERT_REVIEW", interpretationBlocked: true },
      doubleCheck: { status: "DOUBLE_CHECK_PENDING" }
    }
  });
  assert.ok(result.days.every(day => day.status !== S.POSTOVULATORY_INFERTILE));
  assert.ok(result.days.every(day => day.status === S.END_PENDING));
});

test("a complete double check only classifies days after completion as postovulatory infertile", () => {
  const result = classifyFertilityDays({
    observations,
    engineResult: {
      state: "DOUBLE_CHECK_COMPLETE",
      thermal: { status: "SHIFT_CONFIRMED" },
      cervical: { status: "PEAK_PLUS_3_COMPLETED" },
      doubleCheck: { status: "DOUBLE_CHECK_COMPLETE", completionDate: "2026-01-02" }
    }
  });
  assert.deepEqual(result.days.map(day => day.status), [
    S.POTENTIALLY_FERTILE, S.END_PENDING, S.POSTOVULATORY_INFERTILE
  ]);
});

test("goal changes guidance context only, not physiological day statuses", () => {
  const engineResult = {
    state: "OBSERVING",
    thermal: { status: "NO_SHIFT" },
    cervical: { status: "PENDING_EXPERT_REVIEW", interpretationBlocked: true },
    doubleCheck: { status: "DOUBLE_CHECK_PENDING" }
  };
  const conception = classifyFertilityDays({ observations, engineResult, goal: "conception" });
  const avoidance = classifyFertilityDays({ observations, engineResult, goal: "evitement" });
  assert.deepEqual(conception.days.map(x => x.status), avoidance.days.map(x => x.status));
  assert.equal(conception.goal, "conception");
  assert.equal(avoidance.goal, "evitement");
});

test("explicit fertile dates are represented and traceable", () => {
  const result = classifyFertilityDays({
    observations,
    engineResult: {
      state: "OBSERVING",
      thermal: { status: "NO_SHIFT" },
      cervical: { status: "PEAK_IDENTIFIED", fertileDates: ["2026-01-02"] },
      doubleCheck: { status: "DOUBLE_CHECK_PENDING" }
    }
  });
  assert.equal(result.days[1].status, S.FERTILE);
  assert.equal(result.days[1].reasonId, "EXPLICIT_FERTILE_SIGNAL");
  assert.ok(result.days[1].trace.classifierVersion);
});

test("all four languages have an explanation for each day status", () => {
  for (const language of ["fr", "en", "es", "ar"]) {
    const result = classifyFertilityDays({ observations, language });
    assert.ok(result.days.every(day => typeof day.explanation === "string" && day.explanation.length > 0));
  }
});

test("invalid or duplicate dates are rejected", () => {
  assert.throws(() => classifyFertilityDays({ observations: [{ date: "2026-02-30" }] }), TypeError);
  assert.throws(() => classifyFertilityDays({ observations: [observations[0], observations[0]] }), TypeError);
});

test("unknown goals are rejected", () => {
  assert.throws(() => classifyFertilityDays({ observations, goal: "calendar" }), TypeError);
});
