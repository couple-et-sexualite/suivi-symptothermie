import { evaluateCycle, RPS02_VERSION } from "./rps02-engine.mjs";
import { classifyFertilityDays } from "./symrella-fertility-classifier.mjs";

/**
 * Re-evaluate a stored v2 cycle from its observations.
 * The adapter passes only actual measurements and explicit disturbance quality.
 * Legacy mucus labels remain raw-only and are not interpreted as a Sensiplan Peak.
 */
export function classifyV2Cycle(cycle, language = "fr") {
  if (!cycle || !Array.isArray(cycle.observations)) {
    throw new TypeError("Cycle SymRella v2 invalide.");
  }
  const engineObservations = cycle.observations.map(item => ({
    id: item.id,
    date: item.date,
    temperature: {
      valueC: item.temperature?.valueC ?? null,
      quality: item.temperature?.quality ?? "unknown"
    },
    cervical: {
      rawValue: item.cervicalMucus?.legacyCategory ?? null,
      sensation: item.cervicalMucus?.sensation ?? null,
      appearance: item.cervicalMucus?.appearance ?? [],
      peakQualityCandidate: item.cervicalMucus?.peakQualityCandidate ?? null,
      notes: item.cervicalMucus?.notes ?? ""
    }
  }));
  const engineResult = evaluateCycle(engineObservations);
  const classification = classifyFertilityDays({
    observations: cycle.observations,
    engineResult,
    goal: cycle.goal,
    language
  });
  return {
    engineVersion: RPS02_VERSION,
    rulesetId: "rps02-conservative-0.1",
    calculatedAt: new Date().toISOString(),
    status: classification.status === "NO_DATA" ? "not_evaluated" : "indeterminate",
    days: classification.days,
    engineState: engineResult.state
  };
}
