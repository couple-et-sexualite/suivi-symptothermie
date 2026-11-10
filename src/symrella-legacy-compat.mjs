import { validateV2Data } from "./symrella-data-v2.mjs";

const FACTOR_BY_DISTURBANCE = Object.freeze({
  illness: "maladie",
  sleep: "sommeil",
  unusual_time: "horaire",
  travel: "voyage",
  alcohol: "alcool",
  medication: "medicament"
});

function legacyEntry(observation) {
  if (!observation.cervicalMucus.legacyCategory) {
    throw new Error(`La glaire du ${observation.date} utilise le nouveau format ; l’ancienne interface ne peut pas la représenter sans perte.`);
  }
  const factorSet = new Set(
    observation.disturbances.map(item => FACTOR_BY_DISTURBANCE[item.type]).filter(Boolean)
  );
  return {
    date: observation.date,
    temp: observation.temperature.valueC,
    mucus: observation.cervicalMucus.legacyCategory,
    notes: observation.generalNotes,
    factors: [...factorSet],
    bleeding: observation.bleeding.level,
    time: observation.temperature.measuredAt
  };
}

function cycleProjection(cycle) {
  const entries = cycle.observations
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(legacyEntry);
  return {
    start: cycle.startDate || (entries[0]?.date ?? null),
    end: cycle.endDate || (entries.at(-1)?.date ?? null),
    entries
  };
}

/**
 * Read-only compatibility projection for the existing classic-script UI.
 * It intentionally exposes only fields that the old UI understands; the
 * original v2 records remain untouched and retain their richer observations.
 */
export function projectV2ToLegacy(value) {
  if (!validateV2Data(value)) {
    throw new TypeError("Impossible de lire une base SymRella v2 invalide.");
  }
  const current = value.currentCycle.observations
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date))
    .map(legacyEntry);
  const history = value.history.map(cycleProjection);
  const profile = value.profile && typeof value.profile === "object"
    ? { ...value.profile }
    : null;
  const learning = value.learning && typeof value.learning === "object"
    ? { ...value.learning }
    : null;
  return { current, history, profile, learning };
}
