import { migrateLegacyData, validateV2Data } from "./symrella-data-v2.mjs";
import { V2_STORAGE_KEY } from "./symrella-storage-migration.mjs";

const clone = value => JSON.parse(JSON.stringify(value));
const LEGACY_TO_DISTURBANCE = Object.freeze({
  maladie: "illness", sommeil: "sleep", horaire: "unusual_time",
  voyage: "travel", alcool: "alcohol", medicament: "medication"
});
const DISTURBANCE_TO_LEGACY = Object.freeze(Object.fromEntries(
  Object.entries(LEGACY_TO_DISTURBANCE).map(([legacy, type]) => [type, legacy])
));

function mergeObservation(previous, incoming) {
  if (!previous) return clone(incoming);
  const next = clone(previous);
  next.bleeding.level = incoming.bleeding.level;
  next.generalNotes = incoming.generalNotes;
  next.temperature.valueC = incoming.temperature.valueC;
  next.temperature.measuredAt = incoming.temperature.measuredAt;

  const requestedFactors = new Set(
    incoming.disturbances.map(item => DISTURBANCE_TO_LEGACY[item.type]).filter(Boolean)
  );
  const kept = next.disturbances.filter(item => {
    const legacyFactor = DISTURBANCE_TO_LEGACY[item.type];
    return !legacyFactor || requestedFactors.has(legacyFactor);
  });
  const keptLegacy = new Set(kept.map(item => DISTURBANCE_TO_LEGACY[item.type]).filter(Boolean));
  for (const item of incoming.disturbances) {
    const factor = DISTURBANCE_TO_LEGACY[item.type];
    if (factor && !keptLegacy.has(factor)) {
      kept.push({ ...clone(item), id: `${previous.id}-legacy-${factor}` });
      keptLegacy.add(factor);
    }
  }
  next.disturbances = kept;
  next.temperature.disturbanceIds = kept.map(item => item.id);

  if (next.cervicalMucus.legacyCategory !== incoming.cervicalMucus.legacyCategory) {
    next.cervicalMucus.legacyCategory = incoming.cervicalMucus.legacyCategory;
    next.cervicalMucus.peakQualityCandidate = null;
  }
  return next;
}

function mergeCycle(previous, incoming, { current = false } = {}) {
  if (!previous) return clone(incoming);
  const previousByDate = new Map(previous.observations.map(item => [item.date, item]));
  const observations = incoming.observations.map(item =>
    mergeObservation(previousByDate.get(item.date), item)
  );
  const dates = observations.map(item => item.date).sort();
  return {
    ...clone(previous),
    startDate: current ? previous.startDate : incoming.startDate,
    endDate: current ? previous.endDate : incoming.endDate,
    observations,
    derived: {
      engineVersion: null, rulesetId: null, calculatedAt: null,
      status: "not_evaluated", days: []
    },
    updatedAt: new Date().toISOString()
  };
}

function cycleKey(cycle) {
  return `${cycle.startDate || ""}|${cycle.endDate || ""}`;
}

/**
 * Reconcile a complete legacy UI snapshot into the v2 store.
 * Existing detailed observations are retained by date; unsupported destructive
 * projections are rejected rather than silently flattening newer data.
 */
export function syncLegacySnapshotToV2(storage, snapshot, options = {}) {
  if (!snapshot || typeof snapshot !== "object" || Array.isArray(snapshot) ||
      !Array.isArray(snapshot.current) || !Array.isArray(snapshot.history)) {
    throw new TypeError("La sauvegarde complète de l’ancienne interface est invalide.");
  }
  const { current = [], history = [], profile = null, learning = null } = snapshot;
  const incoming = migrateLegacyData(
    { current, history, profile, learning },
    { idFactory: options.idFactory, migratedAt: null }
  );
  const raw = storage.getItem(V2_STORAGE_KEY);
  if (raw === null) throw new Error("La base SymRella v2 n’est pas initialisée.");
  let previous;
  try { previous = JSON.parse(raw); } catch {
    throw new Error("La base SymRella v2 est illisible ; aucune modification effectuée.");
  }
  if (!validateV2Data(previous)) {
    throw new Error("La base SymRella v2 est invalide ; aucune modification effectuée.");
  }

  const previousHistory = new Map(previous.history.map(cycle => [cycleKey(cycle), cycle]));
  const nextHistory = incoming.history.map(cycle => {
    const match = previousHistory.get(cycleKey(cycle));
    if (match) previousHistory.delete(cycleKey(cycle));
    return mergeCycle(match, cycle);
  });
  // If an archived cycle disappears from the legacy snapshot, deletion is
  // intentional (the old UI exposes an explicit delete action).
  const next = {
    ...clone(previous),
    currentCycle: mergeCycle(previous.currentCycle, incoming.currentCycle, { current: true }),
    history: nextHistory,
    profile: incoming.profile,
    learning: incoming.learning
  };
  if (!validateV2Data(next)) {
    throw new Error("La synchronisation produirait une base incohérente ; aucune donnée n’a été modifiée.");
  }

  const serialized = JSON.stringify(next);
  try {
    storage.setItem(V2_STORAGE_KEY, serialized);
    const check = storage.getItem(V2_STORAGE_KEY);
    if (check !== serialized || !validateV2Data(JSON.parse(check))) {
      throw new Error("La vérification après synchronisation a échoué.");
    }
    return JSON.parse(check);
  } catch (error) {
    try { storage.setItem(V2_STORAGE_KEY, raw); } catch {}
    throw error;
  }
}
